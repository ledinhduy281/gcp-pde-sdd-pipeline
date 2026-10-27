#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GCP_PROJECT_ID:-}" ]]; then
  echo "ERROR: Please export GCP_PROJECT_ID before running bootstrap."
  echo "Example: export GCP_PROJECT_ID=my-pde-project-123"
  exit 1
fi

GCP_REGION="${GCP_REGION:-us-central1}"
TF_STATE_BUCKET="${GCP_PROJECT_ID}-tfstate"

echo "==> [1/4] Setting active GCP Project to ${GCP_PROJECT_ID}..."
gcloud config set project "${GCP_PROJECT_ID}"

echo "==> [2/4] Verifying Billing is enabled on ${GCP_PROJECT_ID}..."
BILLING_ENABLED=$(gcloud billing projects describe "${GCP_PROJECT_ID}" --format="value(billingEnabled)" || echo "False")
if [[ "${BILLING_ENABLED}" != "True" ]]; then
  echo "WARNING: Billing does not appear to be enabled on ${GCP_PROJECT_ID}."
  echo "Link your $300 Free Trial billing account using:"
  echo "  gcloud billing accounts list"
  echo "  gcloud billing projects link ${GCP_PROJECT_ID} --billing-account=<BILLING_ACCOUNT_ID>"
fi

echo "==> [3/4] Enabling required Google Cloud APIs..."
gcloud services enable \
  cloudresourcemanager.googleapis.com \
  serviceusage.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  cloudkms.googleapis.com \
  storage.googleapis.com \
  bigquery.googleapis.com \
  bigqueryconnection.googleapis.com \
  bigquerystorage.googleapis.com \
  pubsub.googleapis.com \
  dataflow.googleapis.com \
  dataproc.googleapis.com \
  bigtableadmin.googleapis.com \
  sqladmin.googleapis.com \
  datastream.googleapis.com \
  workflows.googleapis.com \
  cloudscheduler.googleapis.com \
  dlp.googleapis.com \
  datacatalog.googleapis.com \
  artifactregistry.googleapis.com

echo "==> [4/4] Ensuring GCS Terraform Remote State Bucket gs://${TF_STATE_BUCKET} exists..."
if ! gcloud storage buckets describe "gs://${TF_STATE_BUCKET}" >/dev/null 2>&1; then
  gcloud storage buckets create "gs://${TF_STATE_BUCKET}" \
    --project="${GCP_PROJECT_ID}" \
    --location="${GCP_REGION}" \
    --uniform-bucket-level-access \
    --public-access-prevention
fi
gcloud storage buckets update "gs://${TF_STATE_BUCKET}" --versioning

echo "==> Bootstrap complete! Next run: make init && make apply-core"
