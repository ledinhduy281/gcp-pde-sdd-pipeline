#!/usr/bin/env python3
"""Excelerate-Jinder Real Corpus & Synthetic Event Simulator (Spec 02 & Spec 05).

Reads real Jobs and Talent profiles from `jinder_backend_engine/data/synthetic/`
(when available) and generates streaming Jinder engagement & application events:
- 90% valid real-time events (with Jinder F-01 SMF, F-02 GSI, F-05 FRS, F-06 TSS scores)
- 5% late-arriving events (backdated by 120s to test Apache Beam watermarks)
- 5% malformed events (negative salary/amount or corrupted JSON to test DLQ routing)
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
import random
import uuid
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
JOBS_JSON = REPO_ROOT / "jinder_backend_engine" / "data" / "synthetic" / "jobs.json"
TALENTS_JSON = REPO_ROOT / "jinder_backend_engine" / "data" / "synthetic" / "talents.json"

VALID_EVENT_TYPES = (
    "PAGE_VIEW",
    "ADD_TO_CART",
    "CHECKOUT",
    "GPS_PING",
    "JOB_VIEW",
    "JOB_SAVE",
    "JOB_IGNORE",
    "JOB_APPLY",
)
WORK_MODES = ("Hybrid", "Remote", "Onsite")


def _load_jinder_samples() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    jobs: list[dict[str, Any]] = []
    talents: list[dict[str, Any]] = []
    try:
        if JOBS_JSON.is_file():
            data = json.loads(JOBS_JSON.read_text(encoding="utf-8"))
            jobs = data if isinstance(data, list) else data.get("jobs", [])
        if TALENTS_JSON.is_file():
            data = json.loads(TALENTS_JSON.read_text(encoding="utf-8"))
            talents = data if isinstance(data, list) else data.get("talents", [])
    except Exception:
        pass
    return jobs, talents


JINDER_JOBS, JINDER_TALENTS = _load_jinder_samples()


def build_synthetic_event(
    index: int,
    base_time: dt.datetime | None = None,
    late_ratio: float = 0.05,
    malformed_ratio: float = 0.05,
) -> str:
    """Creates a single JSON string representing a valid, late, or malformed Jinder event."""
    now = base_time or dt.datetime.now(dt.timezone.utc)
    bucket = (index % 100) / 100.0

    job = JINDER_JOBS[index % len(JINDER_JOBS)] if JINDER_JOBS else {}
    talent = JINDER_TALENTS[index % len(JINDER_TALENTS)] if JINDER_TALENTS else {}

    user_id = str(talent.get("id") or talent.get("alias") or f"USR-{index % 500:06d}")
    job_id = str(job.get("id") or f"JOB-AU-{index % 100:04d}")
    anzsco_code = str(job.get("anzsco_code") or "261313")

    # 1. Inject malformed records (5% by default) to test Dead-Letter Queue (DLQ)
    if bucket < malformed_ratio:
        if index % 2 == 0:
            return "{corrupted_json_payload_missing_closing_brace"
        bad_record = {
            "event_id": str(uuid.uuid4()),
            "event_timestamp": now.isoformat().replace("+00:00", "Z"),
            "user_id": user_id,
            "session_id": f"SES-{index % 100:05d}",
            "job_id": job_id,
            "anzsco_code": anzsco_code,
            "event_type": "CHECKOUT",
            "order_amount": -99.95,  # Violates Spec 02 Contract (>= 0.0)
            "customer_email": f"seeker{index % 500}@jinder.app",
            "device_os": "Hybrid",
        }
        return json.dumps(bad_record)

    # 2. Inject late-arriving records (next 5% by default)
    if bucket < (malformed_ratio + late_ratio):
        event_time = now - dt.timedelta(seconds=120)
    else:
        event_time = now

    event_type = VALID_EVENT_TYPES[index % len(VALID_EVENT_TYPES)]
    salary_max = float(job.get("salary_max") or random.uniform(95000.0, 165000.0))

    # Jinder Canonical Formula Scores (F-01 SMF, F-02 GSI, F-05 FRS, F-06 TSS)
    smf_score = round(random.uniform(62.0, 96.0), 1)
    gsi_score = round(random.uniform(5.0, 28.0), 1)
    frs_score = round(0.55 * smf_score + 0.45 * (100.0 - gsi_score), 1)
    tss_score = round(0.60 * smf_score + 0.40 * frs_score, 1)

    record: dict[str, Any] = {
        "event_id": str(uuid.uuid4()),
        "event_timestamp": event_time.isoformat().replace("+00:00", "Z"),
        "user_id": user_id,
        "session_id": f"SES-{index % 100:05d}",
        "job_id": job_id,
        "anzsco_code": anzsco_code,
        "event_type": event_type,
        "order_amount": round(salary_max, 2) if event_type in ("CHECKOUT", "JOB_APPLY") else 0.0,
        "frs_score": frs_score,
        "smf_score": smf_score,
        "gsi_score": gsi_score,
        "tss_score": tss_score,
        "customer_email": f"seeker{index % 500}@jinder.app",
        "device_os": str(job.get("work_mode") or WORK_MODES[index % len(WORK_MODES)]),
        "geo_lat": -33.8688,
        "geo_lon": 151.2093,
    }
    return json.dumps(record)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Jinder GCP pipeline events.")
    parser.add_argument("--mode", choices=["stdout", "file", "pubsub"], default="stdout")
    parser.add_argument("--count", type=int, default=20)
    parser.add_argument("--output-file", type=str, default="/tmp/jinder_events.ndjson")
    parser.add_argument("--project-id", type=str, default="")
    parser.add_argument("--topic-id", type=str, default="pde-dev-events-topic")
    args = parser.parse_args()

    messages = [build_synthetic_event(i) for i in range(args.count)]

    if args.mode == "stdout":
        for msg in messages:
            print(msg)
    elif args.mode == "file":
        with open(args.output_file, "w", encoding="utf-8") as f:
            for msg in messages:
                f.write(msg + "\n")
        print(f"Wrote {len(messages)} Jinder events to {args.output_file}")
    elif args.mode == "pubsub":
        from google.cloud import pubsub_v1

        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(args.project_id, args.topic_id)
        for msg in messages:
            publisher.publish(topic_path, msg.encode("utf-8")).result()
        print(f"Published {len(messages)} Jinder events to {topic_path}")


if __name__ == "__main__":
    main()
