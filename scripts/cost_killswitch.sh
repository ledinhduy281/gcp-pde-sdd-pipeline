#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GCP_PROJECT_ID:-}" ]]; then
  echo "ERROR: Please export GCP_PROJECT_ID before running cost_killswitch.sh"
  exit 1
fi

GCP_REGION="${GCP_REGION:-us-central1}"
TF_DIR="infra/environments/dev"

echo "======================================================================"
echo " EMERGENCY / POST-LAB COST KILLSWITCH"
echo " Forcing all hourly-billed GCP resources to FALSE ($0.00/hr)..."
echo "======================================================================"

terraform -chdir="${TF_DIR}" apply -auto-approve \
  -var="project_id=${GCP_PROJECT_ID}" \
  -var="region=${GCP_REGION}" \
  -var="enable_cloudsql_cdc=false" \
  -var="enable_bigtable_serving=false" \
  -var="enable_dataproc_serverless=false" \
  -var="enable_streaming_dataflow=false" \
  -var="enable_composer=false"

echo "==> All hourly lab resources destroyed. Only $0/month Core Serverless tier remains."
