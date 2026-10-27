# SPEC 01: Local Jinder Execution & GCP Connection Bootstrap Specification

## 1. Objective
Provide a deterministic protocol for:
1. Running the full **Excelerate-Jinder Web Application** locally on any machine (`http://localhost:8095/`) with zero external dependencies.
2. Establishing a keyless connection between **Antigravity IDE (macOS)**, your **Google Cloud Platform (GCP) $300 Free Trial Account**, **Terraform Remote State**, and your public repository on **GitHub (`https://github.com/ledinhduy281/gcp-pde-sdd-pipeline`)**.

---

## 2. Mode A: Running Excelerate-Jinder Locally (For Any User Cloning the Repo)

No GCP account or third-party `pip` package is required to run the Jinder web application locally:
```bash
# 1. Start the Jinder Web App with seeded Demo Talent & Employer accounts
make run-jinder-local
# (Equivalent to: python3 jinder_platform/start.py --demo)

# 2. Open http://localhost:8095/ in your browser
# Demo Employer: recruiter@demo.jinder.app
# Demo Talent  : candidate@demo.jinder.app

# 3. Run the 729 autonomous Jinder platform tests & GCP Data Contract tests
make test-jinder-local
make test
```

---

## 3. Mode B: Connecting GCP & Deploying the Terraform Lakehouse (Project Owner Only)

### Step 3.1: Authenticate Google Cloud CLI & Application Default Credentials (ADC)
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

### Step 3.2: Bootstrap GCP APIs & Terraform State Bucket
Execute `make bootstrap` (runs `scripts/bootstrap_gcp.sh`):
- Enables required Google Cloud APIs (`storage`, `bigquery`, `pubsub`, `dataflow`, `dataproc`, `bigtableadmin`, `sqladmin`, `datastream`, `workflows`, `cloudkms`, `datacatalog`, `iam`, `sts`, `iamcredentials`).
- Creates a regional GCS bucket `gs://${GCP_PROJECT_ID}-tfstate` with `uniform-bucket-level-access`, `public-access-prevention`, and **Object Versioning** enabled.

### Step 3.3: Authenticate GitHub CLI & Push to `github.com/ledinhduy281`
```bash
gh auth login -h github.com -p https -w

git init -b main
git add .
git commit -m "feat(jinder-gcp): unify Excelerate-Jinder app with Spec-Driven GCP PDE pipeline"
gh repo create ledinhduy281/gcp-pde-sdd-pipeline \
  --public \
  --description "Excelerate-Jinder Capability Alignment App & Spec-Driven GCP Data Engineering Pipeline (Terraform IaC)" \
  --source=. \
  --remote=origin \
  --push
```

### Step 3.4: Initialize & Deploy Core Serverless Terraform Stack ($0/hr)
```bash
make init
make validate-infra
make apply-core
```

---

## 4. Acceptance Criteria
- `AC-01.1`: `make test` passes all Data Contract and Jinder `FRS*` behavioral formula checks.
- `AC-01.2`: `gcloud auth application-default print-access-token` succeeds with exit code `0`.
- `AC-01.3`: `gcloud storage buckets describe gs://${GCP_PROJECT_ID}-tfstate --format="value(versioning.enabled)"` outputs `True`.
