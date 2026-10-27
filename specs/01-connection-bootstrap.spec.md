# SPEC 01: Connection & Bootstrap Specification

## 1. Objective
Establish a reproducible, keyless connection between **Antigravity IDE (macOS)**, your **Google Cloud Platform (GCP) \$300 Free Trial Account**, **Terraform Remote State**, and a brand-new repository on **GitHub (`https://github.com/ledinhduy281/gcp-pde-sdd-pipeline`)**.

---

## 2. Step-by-Step Connection Protocol

### Step 2.1: Authenticate Google Cloud CLI & Application Default Credentials (ADC)
Run the following commands in the Antigravity IDE terminal:
```bash
# 1. Authenticate gcloud CLI with your Google account
gcloud auth login

# 2. Export your GCP Project ID (linked to the $300 Free Trial billing account)
export GCP_PROJECT_ID="<YOUR_GCP_PROJECT_ID>"
export GCP_REGION="us-central1"
gcloud config set project "${GCP_PROJECT_ID}"

# 3. Verify billing is enabled on the project
gcloud billing projects describe "${GCP_PROJECT_ID}" --format="value(billingEnabled)"

# 4. Configure Application Default Credentials (ADC) for Terraform & Python SDKs
gcloud auth application-default login
gcloud auth application-default set-quota-project "${GCP_PROJECT_ID}"
```

### Step 2.2: Bootstrap GCP APIs & Terraform State Bucket
Execute `make bootstrap` (which runs `scripts/bootstrap_gcp.sh`):
- Enables required Google Cloud APIs (`storage`, `bigquery`, `pubsub`, `dataflow`, `dataproc`, `bigtableadmin`, `sqladmin`, `datastream`, `workflows`, `cloudkms`, `datacatalog`, `iam`, `sts`, `iamcredentials`).
- Creates a regional GCS bucket `gs://${GCP_PROJECT_ID}-tfstate` with `uniform-bucket-level-access`, `public-access-prevention`, and **Object Versioning** enabled.

### Step 2.3: Authenticate GitHub CLI & Create Repository on `github.com/ledinhduy281`
```bash
# 1. Authenticate GitHub CLI
gh auth login -h github.com -p https -w

# 2. Initialize Git repository and push to a brand-new GitHub repo
git init -b main
git add .
git commit -m "chore(sdd): initialize Spec-Driven GCP PDE pipeline and Terraform IaC"
gh repo create ledinhduy281/gcp-pde-sdd-pipeline \
  --public \
  --description "Spec-Driven GCP Data Engineering Pipeline (Terraform IaC) for Professional Data Engineer Certification" \
  --source=. \
  --remote=origin \
  --push
```

### Step 2.4: Initialize & Deploy Core Serverless Terraform Stack
```bash
make init
make validate-infra
make apply-core
```

---

## 3. Acceptance Criteria
- `AC-01.1`: `gcloud auth application-default print-access-token` succeeds with exit code `0`.
- `AC-01.2`: `gcloud storage buckets describe gs://${GCP_PROJECT_ID}-tfstate --format="value(versioning.enabled)"` outputs `True`.
- `AC-01.3`: `gh repo view ledinhduy281/gcp-pde-sdd-pipeline` returns the active GitHub repository metadata.
