#!/usr/bin/env python3
"""Synthetic E-Commerce & Logistics Event Simulator (Spec 02 & Spec 05).

Generates deterministic ratios of:
- 90% valid real-time events
- 5% late-arriving events (backdated by 120s to test Apache Beam watermarks)
- 5% malformed events (negative order_amount or invalid event_type to test DLQ routing)
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import random
import uuid
from typing import Any

VALID_EVENT_TYPES = ("PAGE_VIEW", "ADD_TO_CART", "CHECKOUT", "GPS_PING")
DEVICES = ("iOS", "Android", "Web")


def build_synthetic_event(
    index: int,
    base_time: dt.datetime | None = None,
    late_ratio: float = 0.05,
    malformed_ratio: float = 0.05,
) -> str:
    """Creates a single JSON string representing a valid, late, or malformed event."""
    now = base_time or dt.datetime.now(dt.timezone.utc)
    bucket = (index % 100) / 100.0

    # 1. Inject malformed records (5% by default)
    if bucket < malformed_ratio:
        if index % 2 == 0:
            return "{corrupted_json_payload_missing_closing_brace"
        bad_record = {
            "event_id": str(uuid.uuid4()),
            "event_timestamp": now.isoformat().replace("+00:00", "Z"),
            "user_id": f"USR-{index % 500:06d}",
            "session_id": f"SES-{index % 100:05d}",
            "event_type": "CHECKOUT",
            "order_amount": -99.95,  # Violates Spec 02 Contract (>= 0.0)
            "customer_email": f"user{index % 500}@example.com",
            "device_os": "iOS",
        }
        return json.dumps(bad_record)

    # 2. Inject late-arriving records (next 5% by default)
    if bucket < (malformed_ratio + late_ratio):
        event_time = now - dt.timedelta(seconds=120)
    else:
        event_time = now

    event_type = VALID_EVENT_TYPES[index % len(VALID_EVENT_TYPES)]
    order_amount = round(random.uniform(15.0, 250.0), 2) if event_type == "CHECKOUT" else 0.0

    record: dict[str, Any] = {
        "event_id": str(uuid.uuid4()),
        "event_timestamp": event_time.isoformat().replace("+00:00", "Z"),
        "user_id": f"USR-{index % 500:06d}",
        "session_id": f"SES-{index % 100:05d}",
        "event_type": event_type,
        "order_amount": order_amount,
        "customer_email": f"user{index % 500}@example.com",
        "device_os": DEVICES[index % len(DEVICES)],
        "geo_lat": 10.762622,
        "geo_lon": 106.660172,
    }
    return json.dumps(record)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate synthetic PDE pipeline events.")
    parser.add_argument("--mode", choices=["stdout", "file", "pubsub"], default="stdout")
    parser.add_argument("--count", type=int, default=20)
    parser.add_argument("--output-file", type=str, default="/tmp/synthetic_events.ndjson")
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
        print(f"Wrote {len(messages)} events to {args.output_file}")
    elif args.mode == "pubsub":
        from google.cloud import pubsub_v1

        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(args.project_id, args.topic_id)
        for msg in messages:
            publisher.publish(topic_path, msg.encode("utf-8")).result()
        print(f"Published {len(messages)} events to {topic_path}")


if __name__ == "__main__":
    main()
