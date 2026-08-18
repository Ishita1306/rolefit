# ROLEFIT

### Know the fit before you apply.

A decision aid for students and early-career applicants that turns long job descriptions into clear role requirements, skill alignment, gaps, and qualitative application signals.

---

![Frontend Product Experience](https://img.shields.io/badge/Frontend_Product-RoleFit-141416?style=flat-square&logo=react&logoColor=CCFF00)
![Challenge](https://img.shields.io/badge/Acdyon_Technologies-Part_2_Challenge-CCFF00?style=flat-square&labelColor=141416)
![Stack](https://img.shields.io/badge/React_19-TypeScript_5.7-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite)

[ GitHub Repository ](https://github.com/Ishita1306/rolefit) &nbsp;•&nbsp; > Live Demo: Add deployment URL before submission.

---

## The Problem

Job descriptions are often long, inconsistent, and difficult to compare with a candidate's actual skills.

Campus placement postings can be even more complicated because a single company post may contain several distinct job roles, shared stipend and PPO information, mixed location criteria, and long blocks of generic responsibilities.

Students often have to manually figure out:
- **What does this role actually require?** (Core vs Preferred requirements)
- **Which requirements do I already meet?** (Matched skills)
- **What critical skills am I missing?** (Skill gaps)
- **Are the workplace location and stipend conditions right for me?** (Stipend, PPO, relocation)
- **Is this role worth spending hours tailoring a resume and applying to?** (Application signal)

---

## The Product

RoleFit answers one fundamental question:

> **"Should I spend my time applying to this role?"**

### Core Product Workflow

```text
  JOB DESCRIPTION TEXT
          │
          ▼
   SELECT ACTIVE ROLE  ──────► Multi-Role Parsing Engine
          │
          ▼
 EXTRACT REQUIREMENTS  ──────► Core vs Preferred Isolation
          │
          ▼
 COMPARE WITH CANDIDATE ─────► Canonical Skill Normalization
          │
          ▼
  ROLE SIGNAL OCEAN    ──────► 9-Zone Spatial Field & Interactive Drag/Tap
          │
          ▼
 QUALITATIVE VERDICT   ──────► STRONG FIT · MODERATE FIT · LOW FIT
```

---

## Key Features & User Experience

### 1. Branded Game-Inspired Boot Loader
- **Cinematic Opening Sequence:** A game-inspired boot loader introducing `ROLEFIT OS` with a dark surface (`#0F141C`), ASCII progress indicator (`[██████████████░░░░] 85%`), Acid Lime sweep line, and SVG wave transition.
- **Session Memory & Control:** Plays once per browser session using `sessionStorage` (`rolefit_boot_seen`), with a `SKIP →` control button and `< 350ms` reduced motion fallback.

### 2. Multi-Role Job Description Parser (`01 · PASTE THE ROLE`)
- **Multi-Role Extraction:** Automatically detects multiple roles within combined campus postings (e.g. *Data & BI Analyst Intern* vs *Hardware & Embedded Systems Intern*).
- **Strict Section Isolation:** Prevents requirement bleed between roles by parsing isolated text boundaries.
- **Role Requirement Classification:** Distinguishes **Core Required Skills** from **Preferred / Nice-to-Have Skills**.
- **Conditions Extraction:** Isolates stipend values (e.g. `₹45,000 / month`), PPO eligibility (`₹14–18 LPA`), workplace mode (*Hybrid / Onsite*), and location.

### 3. Role Signal Ocean (`02 & 03 · ROLE SIGNAL OCEAN`)
- **Signature Spatial Interaction:** Replaces traditional static checklists with an interactive 9-zone spatial signal field.
- **Light Pencil Blue Watercolor Wash Aesthetics:** Styled after a translucent watercolor wash on warm editorial paper (`rgba(184, 220, 232, 0.55)` over `#F8F7F2`).
- **Protected Center Exclusion Zone:** Enforces a protected NO-BUBBLE EXCLUSION ZONE around `YOUR FIT DESTINATION` (42px desktop / 24px mobile buffer) so text and counts remain readable.
- **Dedicated Matched Skills Ring:** Matched skills settle on an outer orbit ring (`radius 30–36%`) encircled around the protected center.
- **Interactive Gap Bubbles & Drag/Tap:** Unowned skills appear as warm amber bubbles (`GAP ⚠`). Dragging or tapping any gap bubble opens a confirmation modal:
  ```text
  DO YOU HAVE THIS SKILL?
  [ SQL ]
  [ ADD TO MY PROFILE & MATCH ]   [ CANCEL (KEEP AS GAP ⚠) ]
  ```
  Selecting **ADD TO MY PROFILE** updates the candidate profile, transforms the bubble to Acid Lime (`MATCH ✓`), and syncs all match counts in real time.
- **Single Source of Truth Inventory Parity:** Every extracted requirement appears in the Ocean, Requirement Inventory Chips, and Match Details modal without truncation.
- **Collision QA Debug Overlay:** Toggle `?oceanDebug=true` or click `QA OVERLAY` in the legend to display bounding box coordinates and verify zero overlap.

### 4. Reality Check & Supporting Decoder (`04 · SUPPORTING DECODER`)
- **Condition Inspections:** Evaluates financial and logistical realities including stipend, PPO terms, domestic relocation allowances, and location sources.
- **Workplace Mode Clarity:** Highlights whether the role is Onsite, Hybrid, or Remote, along with work style expectations.

### 5. Application Signal & Verdict Engine (`05 · APPLICATION SIGNAL`)
- **Qualitative Fit Signal:** Generates an application recommendation based on skill match ratio:
  - **`STRONG FIT`** (≥ 80% Core Requirement Match)
  - **`MODERATE FIT`** (50% – 79% Core Requirement Match)
  - **`HIGH GAP / LOW FIT`** (< 50% Core Requirement Match)
- **Detailed Rationale Breakdown:** Outlines specific match strengths, critical gaps, and actionable recommendations.

### 6. Candidate Profile Management & Authentication Prototype
- **Preset & Custom Profiles:** Switch between candidate profiles (*Data Analyst*, *Hardware Engineer*, *General Computer Science*) or customize individual skill sets.
- **Product Authentication UI:** Fully interactive frontend authentication modal for `LOGIN` and `SIGN UP` with form validation and password visibility toggles (built strictly as a frontend prototype).

---

## Technical Stack & Architecture

- **Frontend Core:** React 19, TypeScript 5.7, Vite 6.1
- **Styling & Design System:** Tailwind CSS v4, Vanilla CSS Design Tokens
- **Icons & Motion:** Lucide React, Framer Motion
- **State Architecture:** Local React state, single source of truth data flow via `jdParser.ts`
- **Design Tokens:**
  - `Editorial Warm Paper`: `#F8F7F2`
  - `Ink Black`: `#141416`
  - `Sepia Border`: `#E2DEC9`
  - `Acid Lime (Match)`: `#CCFF00`
  - `Restrained Amber (Gap)`: `#B45309`
  - `Soft Pencil Blue Wash`: `rgba(184, 220, 232, 0.55)`

---

## Repository Structure

```text
rolefit/
├── public/                  # Static assets and favicon
├── src/
│   ├── components/
│   │   ├── about/           # About modal documentation
│   │   ├── auth/            # Login & Sign Up modal UI
│   │   ├── deconstruction/  # Role parser & requirement matrix
│   │   ├── hero/            # Editorial Hero header CTA
│   │   ├── layout/          # Header, Footer, and Editorial Scroll wrappers
│   │   ├── loader/          # Game-inspired branded boot loader
│   │   ├── ocean/           # Role Signal Ocean spatial canvas
│   │   ├── profile/         # Candidate profile manager
│   │   ├── reality/         # Stipend, PPO, & location decoder
│   │   └── verdict/         # Application Signal & Verdict engine
│   ├── data/                # Sample job descriptions & candidate presets
│   ├── types/               # TypeScript interfaces for RoleFit data models
│   ├── utils/               # Job description parser & skill normalizer (`jdParser.ts`)
│   ├── App.tsx              # Main application root
│   ├── index.css            # Custom CSS tokens & animation keyframes
│   └── main.tsx             # Vite entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started & Local Development

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ishita1306/rolefit.git
   cd rolefit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready output will be generated in the `dist/` directory.

---

## Project Scope & Implementation Clarifications

This project was built for the **Acdyon Technologies Frontend Challenge (Part 2 — The Premium Home Page)**.

- **Frontend Focus:** All job description parsing, requirement extraction, skill normalization, spatial layout calculations, and profile matching execute entirely client-side in the browser.
- **Authentication Prototype:** The `LOGIN` and `SIGN UP` interfaces demonstrate modern product authentication UX but do not connect to a production backend, OAuth provider, or database.
- **Deterministic Logic:** Job parsing and layout distribution rely on deterministic rule-based mapping (`jdParser.ts`), ensuring stable renders across viewport resizes.

> See [DECISIONS.md](./DECISIONS.md) for the design and implementation decisions made for the challenge.

