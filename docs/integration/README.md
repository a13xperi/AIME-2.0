# AIME 2.0 Integration Artifacts Bundle

This bundle contains **all artifacts generated in the ChatGPT integration thread** (Markdown docs, CSV task seeds, and ZIP deliverables), organized for clean inclusion in the `AIME-2.0` GitHub repo.

## Folder layout

### `docs/integration/`
Notion-ready documentation:
- Roadmap checklists
- Decision records (ADRs)
- Interview agendas/templates
- Step-by-step runbooks
- Executed smoke test reports

### `artifacts/`
Binary deliverables and large files:
- `inputs/` raw uploaded archives (original source zips)
- `contracts/` contract pack zips by version
- `packages/` service packages and dataset packs
- `repo-snapshots/` AIME repo zips for each step

## GitHub push notes (important)
At least one artifact is large (e.g., `Ovation source file.zip` ~320MB).  
To store this in GitHub cleanly, use **Git LFS** for ZIPs under `artifacts/`.

This bundle includes `artifacts/.gitattributes` to track:
- `artifacts/**/*.zip`
- `artifacts/**/*.jpg`

### Quick push commands

```bash
git clone https://github.com/a13xperi/AIME-2.0.git
cd AIME-2.0

git lfs install

# unzip this bundle at the repo root
unzip -o AIME2.0_thread_artifacts_structured.zip -d .

git add docs/integration artifacts
git commit -m "Add integration docs + artifacts bundle (Steps 0–12)"
git push
```

## Integrity
`docs/integration/ARTIFACT_MANIFEST.json` lists SHA-256 and sizes for every file in this bundle.


> NOTE: This LITE bundle excludes `Ovation source file.zip` due to size.
