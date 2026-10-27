# Excelerate-Jinder — Autonomous Capability Alignment App & GCP Data Engineering Platform

This repository unifies two complete, self-contained systems:
1. **The Full Excelerate-Jinder Web Application (`jinder_platform/`, `jinder_backend_engine/`, `jinder_frontend/`)**:
   - Runs **100% locally** on any computer with **Python 3.9+** and **zero third-party dependencies** (`make run-jinder-local` -> `http://localhost:8095/`).
   - Includes the 6 canonical mathematical alignment formulas (**F-01 SMF**, **F-02 GSI**, **F-03 JPI**, **F-04 RMS**, **F-05 FRS**, **F-06 TSS**), the Australian & International Candidate/Job datasets, and the SQLite WAL backend.
2. **The Spec-Driven Google Cloud Data Engineering Pipeline (`specs/`, `infra/`, `pipelines/`, `showcase/`)**:
   - Scales Jinder's data modeling, real-time behavioral feedback loop ($FRS^*$), Zero-PII governance (`REQ-A07`), and AI shortlist prediction onto **Google Cloud Platform (GCP)** using **Terraform (IaC)**.
   - Engineered specifically for the **Google Cloud Professional Data Engineer (PDE)** certification on a **$0.00/month Core Serverless baseline** (protecting your $300 Free Trial).

---

## 1. Run the Jinder Web App Locally (Zero Setup, 100% Free)

Anyone who clones this repository can run the full Jinder web application on their local machine without a GCP account:

```bash
# Start Jinder with demo Talent & Employer accounts on http://localhost:8095/
make run-jinder-local
# (or: python3 jinder_platform/start.py --demo)
```
- Open **`http://localhost:8095/`** in your browser.
- Demo accounts printed in the terminal:
  - **Employer (HR):** `recruiter@demo.jinder.app`
  - **Talent (Seeker):** `candidate@demo.jinder.app`

---

## 2. Explore Interactive Visualizers & Executive Presentation Deck

```bash
# 1. Official Google Cloud Reference Architecture Diagram (Interactive SVG)
open showcase/01-pipeline-visualizer/gcp-architecture-diagram.html

# 2. Beginner-Friendly GCP Pipeline Learning Simulator
open showcase/01-pipeline-visualizer/index.html

# 3. Animated Executive Presentation Slide Deck (VI / EN Bilingual)
open showcase/02-executive-presentation/index.html
```

---

## 3. Deploy the Jinder GCP Data Pipeline (Terraform IaC)

See [`specs/01-connection-bootstrap.spec.md`](specs/01-connection-bootstrap.spec.md) and [`showcase/03-gcp-ui-walkthrough/`](showcase/03-gcp-ui-walkthrough/) for step-by-step instructions.

```bash
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"

# 1. Enable GCP APIs & create versioned Terraform state bucket
make bootstrap

# 2. Initialize, validate, and deploy the $0/month Serverless Core Tier
make init
make validate-infra
make apply-core

# 3. Run unit & Data Contract tests
make test
```

> **Security Note for Public GitHub Repos**: This repository follows **Zero Static Credentials (`INV-03`)**. No API keys, passwords, or GCP Service Account JSON keys are stored in the repo. Cloning this repository never grants external users access to your GCP project or billing account.
