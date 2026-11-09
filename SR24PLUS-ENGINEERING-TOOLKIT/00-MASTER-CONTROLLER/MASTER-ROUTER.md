# SR24PLUS MASTER SKILL ROUTER

## Purpose & Architecture

The **SR24Plus Master Skill Router** is the single entry point and autonomous routing engine for all 443+ skills installed in Google Antigravity.
Instead of manually invoking one narrow skill or forgetting which complementary tools exist, the Master Router interprets natural-language intents and orchestrates complete multi-agent engineering squads.

---

## Natural Language Triggers & Activation Matrix

Whenever a user utters one of the following activation phrases (or synonymous prompts), the Master Router activates the corresponding category squad:

| Natural Language Trigger Command | Target Category | Squad Directory | Primary Skills Activated |
|---|---|---|---|
| `"Activate UI Design Toolkit"` | UI/UX DESIGN | [`01-UI-UX-DESIGN`](../01-UI-UX-DESIGN/README.md) | `antislop`, `antislop-ui`, `impeccable`, `ui-ux-pro-max`, `design-taste-frontend`, `agency-design-ui-designer`, `agency-design-ui-finish-gate-reviewer` |
| `"Activate Game Development Toolkit"` | GAME DEVELOPMENT | [`02-GAME-DEVELOPMENT`](../02-GAME-DEVELOPMENT/README.md) | `agency-game-development-game-designer`, `agency-game-development-level-designer`, `agency-game-development-technical-artist`, `agency-game-development-godot-*`, `agency-game-development-unity-*`, `agency-game-development-unreal-*` |
| `"Activate Frontend Development Toolkit"` | FRONTEND DEVELOPMENT | [`03-FRONTEND-DEVELOPMENT`](../03-FRONTEND-DEVELOPMENT/README.md) | `agency-engineering-frontend-developer`, `agency-engineering-desktop-app-engineer`, `generative_ui`, `performance-optimization`, `browser-testing-with-devtools` |
| `"Activate Backend Development Toolkit"` | BACKEND DEVELOPMENT | [`04-BACKEND-DEVELOPMENT`](../04-BACKEND-DEVELOPMENT/README.md) | `agency-engineering-backend-architect`, `agency-engineering-database-optimizer`, `agency-engineering-identity-access-engineer`, `api-and-interface-design`, `agency-specialized-mcp-builder` |
| `"Activate AI/ML Engineering Toolkit"` | AI/ML ENGINEERING | [`05-AIML-ENGINEERING`](../05-AIML-ENGINEERING/README.md) | `agency-engineering-ai-engineer`, `agency-engineering-prompt-engineer`, `agency-engineering-llm-post-training-engineer`, `agency-engineering-rag-pipeline-engineer` |
| `"Activate Mobile App Toolkit"` | MOBILE APP DEVELOPMENT | [`06-MOBILE-APP-DEVELOPMENT`](../06-MOBILE-APP-DEVELOPMENT/README.md) | `agency-engineering-mobile-app-builder`, `agency-engineering-mobile-release-engineer`, `android-cli`, `agency-marketing-app-store-optimizer` |
| `"Activate DevOps & Cloud Toolkit"` | DEVOPS AND CLOUD | [`07-DEVOPS-AND-CLOUD`](../07-DEVOPS-AND-CLOUD/README.md) | `agency-engineering-devops-automator`, `agency-engineering-sre`, `agency-security-cloud-security-architect`, `ci-cd-and-automation`, `shipping-and-launch` |
| `"Activate Quality Engineering Toolkit"` | QUALITY ENGINEERING | [`08-QUALITY-ENGINEERING`](../08-QUALITY-ENGINEERING/README.md) | `agency-engineering-code-reviewer`, `code-review-and-quality`, `agency-testing-test-automation-engineer`, `debugging-and-error-recovery`, `agency-security-appsec-engineer` |
| `"Activate Research & Analytics Toolkit"` | RESEARCH AND ANALYTICS | [`09-RESEARCH-AND-ANALYTICS`](../09-RESEARCH-AND-ANALYTICS/README.md) | `agency-research-synthesist`, `agency-support-analytics-reporter`, `agency-academic-statistician`, `agency-gis-spatial-data-scientist` |
| `"Activate Branding & Creative Toolkit"` | BRANDING AND CREATIVE | [`10-BRANDING-AND-CREATIVE`](../10-BRANDING-AND-CREATIVE/README.md) | `agency-design-brand-guardian`, `agency-marketing-content-creator`, `agency-game-development-narrative-designer`, `agency-design-visual-storyteller` |
| `"Activate Product Engineering Toolkit"` | PRODUCT ENGINEERING | [`11-PRODUCT-ENGINEERING`](../11-PRODUCT-ENGINEERING/README.md) | `agency-product-manager`, `agency-project-management-project-manager-senior`, `agency-product-sprint-prioritizer`, `planning-and-task-breakdown` |
| `"Activate Science & Bioinformatics Toolkit"` | SCIENCE & BIOINFORMATICS | [`12-SCIENCE-AND-BIOINFORMATICS`](../12-SCIENCE-AND-BIOINFORMATICS/README.md) | `alphafold-database-fetch-and-analyze`, `chembl-database`, `clinvar-database`, `gtex-database`, `pubmed-database`, `uniprot-database` |
| `"Activate Antigravity Automation Toolkit"` | ANTIGRAVITY & AUTOMATION | [`13-ANTIGRAVITY-AND-AUTOMATION`](../13-ANTIGRAVITY-AND-AUTOMATION/README.md) | `agy-customizations`, `automation`, `migrate-workflows`, `native_swarm`, `permissioned-github`, `run-workflow` |
| `"Activate Full Stack Development Toolkit"` | MULTI-CATEGORY SQUAD | Compound: 01 + 03 + 04 + 07 + 08 | Frontend + Backend + UI + DevOps + QA Pipeline |
| `"Activate Production Engineering Toolkit"` | MULTI-CATEGORY SQUAD | Compound: 04 + 07 + 08 + 14 | Architecture + Security + SRE + CI/CD + Hardening |
| `"Activate Complete Project Team"` | FULL LIFECYCLE TEAM | All 14 Categories Orchestrated | End-to-end autonomous discovery, architecture, execution, and launch |

---

## Autonomous Execution Protocol

When a category toolkit is triggered, follow this strict step-by-step procedure:

1. **Intent Recognition**: Identify the target category or multi-category compound request.
2. **Category Directory Inspection**: Open `SR24PLUS-ENGINEERING-TOOLKIT/<category>/README.md` and read the workflow pipeline.
3. **Skill Instruction Loading**: Read the actual `SKILL.md` files for the primary and secondary roles in that pipeline.
4. **Role Assignment & Sequential Execution**: Execute tasks in order of dependency (e.g. Research -> Architecture -> Implementation -> Verification -> Audit).
5. **Finish-Gate Validation**: Enforce quality standards (Anti-Slop rules, accessibility guidelines, build verifications).
6. **User Transparency**: Clearly notify the user which skills were active, which decisions were taken, and the results achieved.