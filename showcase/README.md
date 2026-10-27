# GCP Pipeline Visualizer, Executive Presentation & GCP UI Walkthrough

This directory contains three modular suites designed for **visual learning**, **non-technical executive presentations**, and **step-by-step Google Cloud Console (UI) inspection**:

```text
showcase/
├── 01-pipeline-visualizer/          # Interactive HTML/CSS/JS Pipeline Simulator for learning GCP from scratch
│   ├── index.html                   # Open directly in any browser (works via file:// or local server)
│   ├── styles/
│   │   ├── base.css                 # Modern dark/glassmorphic layout & responsive grid
│   │   └── pipeline-animations.css  # Animated data packets, pulsing nodes & cost meter transitions
│   └── scripts/
│       ├── nodes-data.js            # Plain-language analogies, GCP concepts, PDE exam tips & Terraform links
│       ├── simulator-engine.js      # Interactive packet flow simulator (Valid, Late, Malformed DLQ, Batch)
│       └── app.js                   # Interactive controller, Guided Tour & Live Hourly Cost Switchboard
│
├── 02-executive-presentation/       # Animated HTML Slide Deck (High-level business overview, zero heavy jargon)
│   ├── index.html                   # Fullscreen-ready animated presentation deck (EN / VI bilingual toggle)
│   ├── styles/
│   │   ├── deck.css                 # Slide typography, cards, and executive visual layouts
│   │   └── transitions.css          # Smooth View Transitions & staggered keyframe animations
│   └── scripts/
│       ├── slides-content.js        # 8 executive slides + speaker notes (Bilingual EN / VI)
│       └── deck-controller.js       # Keyboard/Click navigation, Overview Grid, Speaker Notes & Fullscreen
│
└── 03-gcp-ui-walkthrough/           # Step-by-Step GCP Console (Web UI) Inspection Guides
    ├── 00-console-basics-and-billing.md
    ├── 01-iam-kms-and-security-ui.md
    ├── 02-cloud-storage-lakehouse-ui.md
    ├── 03-pubsub-streaming-ui.md
    ├── 04-bigquery-and-governance-ui.md
    ├── 05-workflows-and-scheduler-ui.md
    └── 06-hourly-labs-verification-ui.md
```

---

## How to Open the Interactive Apps

You can open both apps directly in Chrome/Safari without installing anything:

```bash
# 1. Open the Interactive Pipeline Learning Visualizer
open showcase/01-pipeline-visualizer/index.html

# 2. Open the Animated Executive Slide Deck
open showcase/02-executive-presentation/index.html
```
