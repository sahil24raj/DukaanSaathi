# SCIENCE AND BIOINFORMATICS TOOLKIT

> **Domain Identifier**: `12-SCIENCE-AND-BIOINFORMATICS` • **Registered Skills**: `39` • **Trigger Command**: `"Activate Science & Bioinformatics Toolkit"` (/sr24 science)

Comprehensive bioinformatics database querying, structural biology (AlphaFold, PDB), genomics, cheminformatics (ChEMBL, PubChem), and literature search.

---

## Autonomous Multi-Agent Workflow Pipeline

When this toolkit is activated, Antigravity coordinates the following specialized roles sequentially:

### Phase 1: Scientific Literature Retrieval
- **Primary Autonomous Role**: `literature-search-arxiv` + `literature-search-europepmc`
- **Responsibilities & Output**: Search PubMed, arXiv, and Europe PMC for target genes, clinical trials, and bioactivity papers.

### Phase 2: Target & Variant Analysis
- **Primary Autonomous Role**: `clinvar-database` + `opentargets-database` + `gtex-database`
- **Responsibilities & Output**: Retrieve clinical pathogenicity, disease associations, and tissue expression profiles.

### Phase 3: Protein Structure & Homology
- **Primary Autonomous Role**: `alphafold-database-fetch-and-analyze` + `pdb-database` + `pymol`
- **Responsibilities & Output**: Fetch predicted 3D structures, analyze binding pockets, and render molecular visual models.

### Phase 4: Small Molecule Cheminformatics
- **Primary Autonomous Role**: `chembl-database` + `pubchem-database`
- **Responsibilities & Output**: Query IC50, Ki, bioactivity values, SMILES chemical structures, and known approved drug targets.

### Phase 5: Sequence Comparison & Alignment
- **Primary Autonomous Role**: `protein-sequence-similarity-search` + `ncbi-sequence-fetch`
- **Responsibilities & Output**: Run BLAST/FASTA comparisons, MSA alignments, and identify conserved functional domains.

---

## Included Registered Skills Catalog

This domain contains **39 verified, installed skills**. Click any skill below to view its direct source `SKILL.md`:

| # | Skill Name | Path (Clickable Source) | Purpose / Highlights |
|---|---|---|---|
| 1 | **`agency-specialized-automation-governance-architect`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/agency-agents/skills/agency-specialized-automation-governance-architect/SKILL.md) | Governance-first architect for business automations (n8n-first) who audits |
| 2 | **`alphafold-database-fetch-and-analyze`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/alphafold_database_fetch_and_analyze/SKILL.md) | > |
| 3 | **`alphagenome-single-variant-analysis`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/alphagenome_single_variant_analysis/SKILL.md) | > |
| 4 | **`chembl-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/chembl_database/SKILL.md) | > |
| 5 | **`clinical-trials-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/clinical_trials_database/SKILL.md) | > |
| 6 | **`clinvar-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/clinvar_database/SKILL.md) | > |
| 7 | **`dbsnp-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/dbsnp_database/SKILL.md) | > |
| 8 | **`embl-ebi-ols`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/embl_ebi_ols/SKILL.md) | > |
| 9 | **`encode-ccres-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/encode_ccres_database/SKILL.md) | > |
| 10 | **`ensembl-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/ensembl_database/SKILL.md) | > |
| 11 | **`foldseek-structural-search`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/foldseek_structural_search/SKILL.md) | > |
| 12 | **`gnomad-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/gnomad_database/SKILL.md) | > |
| 13 | **`gtex-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/gtex_database/SKILL.md) | > |
| 14 | **`human-protein-atlas-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/human_protein_atlas_database/SKILL.md) | > |
| 15 | **`interpro-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/interpro_database/SKILL.md) | > |
| 16 | **`jaspar-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/jaspar_database/SKILL.md) | > |
| 17 | **`literature-search-arxiv`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/literature_search_arxiv/SKILL.md) | > |
| 18 | **`literature-search-biorxiv`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/literature_search_biorxiv/SKILL.md) | > |
| 19 | **`literature-search-europepmc`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/literature_search_europepmc/SKILL.md) | > |
| 20 | **`literature-search-openalex`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/literature_search_openalex/SKILL.md) | > |
| 21 | **`ncbi-sequence-fetch`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/ncbi_sequence_fetch/SKILL.md) | > |
| 22 | **`openfda-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/openfda_database/SKILL.md) | > |
| 23 | **`opentargets-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/opentargets_database/SKILL.md) | > |
| 24 | **`pdb-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/pdb_database/SKILL.md) | > |
| 25 | **`protein-sequence-msa`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/protein_sequence_msa/SKILL.md) | > |
| 26 | **`protein-sequence-similarity-search`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/protein_sequence_similarity_search/SKILL.md) | > |
| 27 | **`pubchem-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/pubchem_database/SKILL.md) | > |
| 28 | **`pubmed-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/pubmed_database/SKILL.md) | >- |
| 29 | **`pymol`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/pymol/SKILL.md) | > |
| 30 | **`quickgo-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/quickgo_database/SKILL.md) | > |
| 31 | **`reactome-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/reactome_database/SKILL.md) | > |
| 32 | **`science-skills-common`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/science_skills_common/SKILL.md) | >- |
| 33 | **`scienceskillscommon`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/scienceskillscommon/SKILL.md) | >- |
| 34 | **`string-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/string_database/SKILL.md) | > |
| 35 | **`ucsc-conservation-and-tfbs`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/ucsc_conservation_and_tfbs/SKILL.md) | > |
| 36 | **`unibind-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/unibind_database/SKILL.md) | >- |
| 37 | **`uniprot-database`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/uniprot_database/SKILL.md) | >- |
| 38 | **`uv`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/uv/SKILL.md) | >- |
| 39 | **`workflow-skill-creator`** | [`SKILL.md`](file:///C:/Users/sr24s/.gemini/config/plugins/science/skills/workflow_skill_creator/SKILL.md) | > |