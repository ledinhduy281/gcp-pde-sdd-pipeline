#!/usr/bin/env python3
"""Streaming Dataflow / Apache Beam Pipeline Logic (Spec 02 & Spec 05).

Implements:
1. JSON Parsing & Schema Contract Validation with Dead-Letter Queue (DLQ) routing.
2. Anti-Hotspotting Salted Row Key calculation for Cloud Bigtable.
3. Windowed aggregation helpers for PDE exam readiness.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
from typing import Any, Tuple

ALLOWED_EVENT_TYPES = {"PAGE_VIEW", "ADD_TO_CART", "CHECKOUT", "GPS_PING"}
REQUIRED_FIELDS = ("event_id", "event_timestamp", "user_id", "event_type")
MAX_EPOCH_MS = 9_999_999_999_999


def validate_and_parse_event(
    raw_payload: str,
    ingestion_time: dt.datetime | None = None,
) -> Tuple[bool, dict[str, Any]]:
    """Validates a raw JSON event string against SPEC-02 Contract 1.

    Returns:
        (True, normalized_event_dict) if valid.
        (False, dlq_error_dict) if malformed or violating business constraints.
    """
    now_iso = (ingestion_time or dt.datetime.now(dt.timezone.utc)).isoformat().replace("+00:00", "Z")

    try:
        payload = json.loads(raw_payload)
        if not isinstance(payload, dict):
            raise ValueError("JSON root must be an object")
    except Exception as exc:
        return False, {
            "raw_payload": raw_payload,
            "error_reason": f"INVALID_JSON: {exc}",
            "pipeline_step": "ParseAndValidateEvent",
            "failed_at": now_iso,
        }

    for field in REQUIRED_FIELDS:
        if not payload.get(field):
            return False, {
                "raw_payload": raw_payload,
                "error_reason": f"MISSING_REQUIRED_FIELD: {field}",
                "pipeline_step": "ParseAndValidateEvent",
                "failed_at": now_iso,
            }

    event_type = payload.get("event_type")
    if event_type not in ALLOWED_EVENT_TYPES:
        return False, {
            "raw_payload": raw_payload,
            "error_reason": f"UNSUPPORTED_EVENT_TYPE: {event_type}",
            "pipeline_step": "ParseAndValidateEvent",
            "failed_at": now_iso,
        }

    order_amount = payload.get("order_amount")
    if order_amount is not None:
        try:
            amount_val = float(order_amount)
        except (TypeError, ValueError):
            return False, {
                "raw_payload": raw_payload,
                "error_reason": f"NON_NUMERIC_ORDER_AMOUNT: {order_amount}",
                "pipeline_step": "ParseAndValidateEvent",
                "failed_at": now_iso,
            }
        if amount_val < 0.0:
            return False, {
                "raw_payload": raw_payload,
                "error_reason": f"NEGATIVE_ORDER_AMOUNT: {amount_val}",
                "pipeline_step": "ParseAndValidateEvent",
                "failed_at": now_iso,
            }
    else:
        amount_val = 0.0

    # Validate ISO-8601 timestamp
    ts_str = str(payload["event_timestamp"])
    try:
        dt.datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
    except ValueError as exc:
        return False, {
            "raw_payload": raw_payload,
            "error_reason": f"INVALID_EVENT_TIMESTAMP: {exc}",
            "pipeline_step": "ParseAndValidateEvent",
            "failed_at": now_iso,
        }

    normalized = {
        "event_id": str(payload["event_id"]),
        "event_timestamp": ts_str,
        "ingestion_timestamp": now_iso,
        "user_id": str(payload["user_id"]),
        "session_id": payload.get("session_id"),
        "event_type": event_type,
        "order_amount": amount_val,
        "customer_email": payload.get("customer_email"),
        "device_os": payload.get("device_os"),
        "geo_lat": payload.get("geo_lat"),
        "geo_lon": payload.get("geo_lon"),
    }
    return True, normalized


def compute_bigtable_row_key(user_id: str, event_timestamp_iso: str, num_salts: int = 4) -> str:
    """Computes an anti-hotspotting Cloud Bigtable row key per SPEC-02 Contract 3.

    Format: <salt_digit>#<user_id>#<reverse_epoch_millis>
    """
    digest = hashlib.md5(user_id.encode("utf-8")).hexdigest()
    salt = int(digest[:8], 16) % num_salts

    parsed_ts = dt.datetime.fromisoformat(event_timestamp_iso.replace("Z", "+00:00"))
    epoch_ms = int(parsed_ts.timestamp() * 1000)
    reverse_epoch_ms = MAX_EPOCH_MS - epoch_ms

    return f"{salt}#{user_id}#{reverse_epoch_ms:013d}"
