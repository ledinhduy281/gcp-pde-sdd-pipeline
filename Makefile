.PHONY: help bootstrap init fmt validate-infra plan apply-core lab-cdc-on lab-bigtable-on lab-composer-on lab-off destroy-all test simulate-local

TF_DIR := infra/environments/dev
GCP_REGION ?= us-central1

help:
	@echo "======================================================================"
	@echo " GCP PDE Spec-Driven Pipeline — Cost-Safe Command Switchboard"
	@echo "======================================================================"
	@echo " make bootstrap        : Enable GCP APIs & create GCS Terraform state bucket"
	@echo " make init             : Initialize Terraform with remote GCS backend"
	@echo " make validate-infra   : Run terraform fmt -check and terraform validate"
	@echo " make plan             : Run terraform plan"
	@echo " make apply-core       : Deploy ONLY Always-On Serverless Tier (~$$0/month)"
	@echo " make lab-cdc-on       : Enable Cloud SQL + Datastream CDC lab (~$$0.03/hr)"
	@echo " make lab-bigtable-on  : Enable 1-node Cloud Bigtable lab (~$$0.65/hr)"
	@echo " make lab-composer-on  : Enable Cloud Composer Airflow lab (~$$0.45/hr)"
	@echo " make lab-off          : TURN OFF ALL HOURLY RESOURCES IMMEDIATELY ($$0/hr)"
	@echo " make destroy-all      : Destroy entire infrastructure"
	@echo " make test             : Run pytest unit tests against Data Contracts"
	@echo "======================================================================"

bootstrap:
	@bash scripts/bootstrap_gcp.sh

init:
	@if [ -z "$$GCP_PROJECT_ID" ]; then echo "ERROR: Export GCP_PROJECT_ID first"; exit 1; fi
	terraform -chdir=$(TF_DIR) init \
		-backend-config="bucket=$${GCP_PROJECT_ID}-tfstate" \
		-backend-config="prefix=pde-lakehouse/dev"

fmt:
	terraform -chdir=infra fmt -recursive

validate-infra:
	terraform -chdir=infra fmt -check -recursive
	terraform -chdir=$(TF_DIR) validate

plan:
	terraform -chdir=$(TF_DIR) plan -var="project_id=$${GCP_PROJECT_ID}" -var="region=$(GCP_REGION)"

apply-core:
	terraform -chdir=$(TF_DIR) apply -auto-approve \
		-var="project_id=$${GCP_PROJECT_ID}" \
		-var="region=$(GCP_REGION)" \
		-var="enable_cloudsql_cdc=false" \
		-var="enable_bigtable_serving=false" \
		-var="enable_dataproc_serverless=false" \
		-var="enable_streaming_dataflow=false" \
		-var="enable_composer=false"

lab-cdc-on:
	terraform -chdir=$(TF_DIR) apply -auto-approve \
		-var="project_id=$${GCP_PROJECT_ID}" \
		-var="region=$(GCP_REGION)" \
		-var="enable_cloudsql_cdc=true"

lab-bigtable-on:
	terraform -chdir=$(TF_DIR) apply -auto-approve \
		-var="project_id=$${GCP_PROJECT_ID}" \
		-var="region=$(GCP_REGION)" \
		-var="enable_bigtable_serving=true"

lab-composer-on:
	terraform -chdir=$(TF_DIR) apply -auto-approve \
		-var="project_id=$${GCP_PROJECT_ID}" \
		-var="region=$(GCP_REGION)" \
		-var="enable_composer=true"

lab-off:
	@bash scripts/cost_killswitch.sh

destroy-all:
	terraform -chdir=$(TF_DIR) destroy -var="project_id=$${GCP_PROJECT_ID}" -var="region=$(GCP_REGION)"

test:
	PYTHONPATH=. pytest tests/ -v
