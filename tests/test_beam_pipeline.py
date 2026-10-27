"""Unit tests verifying Data Contracts (SPEC-02) & Pipeline Behavior (SPEC-05)."""

import json
import re
from pipelines.simulator.generate_events import build_synthetic_event
from pipelines.streaming_beam.main import (
    compute_bigtable_row_key,
    validate_and_parse_event,
)


def test_valid_event_passes_contract() -> None:
    valid_json = json.dumps({
        "event_id": "550e8400-e29b-41d4-a716-446655440000",
        "event_timestamp": "2026-10-27T02:30:00Z",
        "user_id": "USR-001042",
        "session_id": "SES-99812",
        "event_type": "CHECKOUT",
        "order_amount": 149.99,
        "customer_email": "alice@example.com",
        "device_os": "iOS",
    })
    is_valid, result = validate_and_parse_event(valid_json)
    assert is_valid is True
    assert result["user_id"] == "USR-001042"
    assert result["order_amount"] == 149.99
    assert "ingestion_timestamp" in result


def test_corrupted_json_routes_to_dlq() -> None:
    is_valid, dlq_record = validate_and_parse_event("{corrupted_json")
    assert is_valid is False
    assert "INVALID_JSON" in dlq_record["error_reason"]
    assert dlq_record["pipeline_step"] == "ParseAndValidateEvent"


def test_negative_order_amount_routes_to_dlq() -> None:
    bad_amount_json = json.dumps({
        "event_id": "550e8400-e29b-41d4-a716-446655440000",
        "event_timestamp": "2026-10-27T02:30:00Z",
        "user_id": "USR-001042",
        "event_type": "CHECKOUT",
        "order_amount": -25.00,
    })
    is_valid, dlq_record = validate_and_parse_event(bad_amount_json)
    assert is_valid is False
    assert "NEGATIVE_ORDER_AMOUNT" in dlq_record["error_reason"]


def test_bigtable_row_key_anti_hotspotting_and_reverse_timestamp() -> None:
    rk_older = compute_bigtable_row_key("USR-001042", "2026-10-27T02:00:00Z", num_salts=4)
    rk_newer = compute_bigtable_row_key("USR-001042", "2026-10-27T02:05:00Z", num_salts=4)

    pattern = re.compile(r"^[0-3]#USR-001042#[0-9]{13}$")
    assert pattern.match(rk_older)
    assert pattern.match(rk_newer)
    # Newer events must sort lexicographically BEFORE older events
    assert rk_newer < rk_older


def test_simulator_injects_expected_valid_and_dlq_ratios() -> None:
    events = [build_synthetic_event(i) for i in range(100)]
    outcomes = [validate_and_parse_event(e)[0] for e in events]
    valid_count = sum(1 for ok in outcomes if ok)
    dlq_count = sum(1 for ok in outcomes if not ok)
    assert valid_count == 95
    assert dlq_count == 5


import unittest

class TestBeamPipelineContracts(unittest.TestCase):
    def test_all_contracts(self) -> None:
        test_valid_event_passes_contract()
        test_corrupted_json_routes_to_dlq()
        test_negative_order_amount_routes_to_dlq()
        test_bigtable_row_key_anti_hotspotting_and_reverse_timestamp()
        test_simulator_injects_expected_valid_and_dlq_ratios()

if __name__ == "__main__":
    unittest.main()
