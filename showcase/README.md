# Excelerate-Jinder on GCP — Visualizer, Executive Presentation & GCP UI Walkthrough

This directory contains three modular suites tailored for **learning Google Cloud from scratch**, **presenting the Excelerate-Jinder Data Platform**, and **navigating the Google Cloud Console (Web UI) step by step**:

```text
showcase/
├── README.md                                         # Quick launch guide
├── 01-pipeline-visualizer/                           # 1. INTERACTIVE PIPELINE VISUALIZER & OFFICIAL GCP DIAGRAM
│   ├── gcp-architecture-diagram.html                 # Official Google Cloud Reference Architecture Diagram (SVG + Export)
│   ├── index.html                                    # Beginner-friendly interactive simulator & hourly cost calculator
│   ├── assets/gcp-pipeline-diagram.svg               # Standalone vector diagram for PowerPoint / Google Slides
│   ├── styles/                                       # Modular CSS (base.css, pipeline-animations.css, gcp-diagram.css)
│   └── scripts/                                      # Modular JS (nodes-data.js, simulator-engine.js, app.js, gcp-diagram.js)
│
├── 02-executive-presentation/                        # 2. ANIMATED HTML SLIDE DECK FOR EXECUTIVE PRESENTATIONS
│   ├── index.html                                    # Fullscreen slide deck with Speaker Notes & VI/EN toggle
│   ├── styles/                                       # Modular CSS (deck.css, transitions.css)
│   └── scripts/                                      # Modular JS (slides-content.js, deck-controller.js)
│
└── 03-gcp-ui-walkthrough/                            # 3. STEP-BY-STEP GCP CONSOLE (WEB UI) INSPECTION GUIDES
    ├── 00-console-basics-and-billing.md
    ├── 01-iam-kms-and-security-ui.md
    ├── 02-cloud-storage-lakehouse-ui.md
    ├── 03-pubsub-streaming-ui.md
    ├── 04-bigquery-and-governance-ui.md
    ├── 05-workflows-and-scheduler-ui.md
    └── 06-hourly-labs-verification-ui.md
```

## Quick Open Commands (macOS)

```bash
open showcase/01-pipeline-visualizer/gcp-architecture-diagram.html
open showcase/01-pipeline-visualizer/index.html
open showcase/02-executive-presentation/index.html
```
