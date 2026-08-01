# Changelog

All notable changes to the "Build Your First AI Companion" tutorial.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) style.
This project follows a practical, single-file static site; releases are tracked
informally.

---

## [Unreleased]

### Added
- New **“Build This With Microsoft Copilot”** guide section in `index.html`,
  linked from the Microsoft Copilot block in the platform comparison.
  - Maps all seven stages plus the safety checkpoint to Copilot Chat and
    Microsoft 365 Copilot (Custom Instructions, Copilot Memory, file upload,
    Copilot Notebooks).
  - Includes a “Last verified: August 1, 2026” date and a list of official
    Microsoft documentation sources (support.microsoft.com and
    learn.microsoft.com).
- Compact “Microsoft Copilot” tip boxes at the end of each stage and the safety
  checkpoint, cross-referencing the full guide.
- `<noscript>` notice so users know which features need JavaScript and that the
  starter kit is available as files.
- On-page status message under “Download Starter Kit” for the sequential-download
  fallback path.
- `CHANGELOG.md` to track project changes.

### Changed
- Platform comparison table: Microsoft Copilot row now mentions Custom
  Instructions alongside Copilot Memory and refers to Copilot Notebooks.
- Section 4 image alt text corrected to match the actual artwork (folders for
  projects, travel, plans, résumés, spreadsheets, PDFs — previously described
  recipes and a garden plan that are not in the image).
- Safety illustration converted from a 1.8 MB PNG (1254×1254) to an optimized
  ~190 KB JPEG (800×800); HTML reference and dimensions updated.
- “Download Starter Kit” fallback now explains in the page (not only a toast)
  what happened and how to recover if the browser blocks any download.
- README restructured: new “Microsoft Copilot guide” section, updated filenames
  and download instructions, JavaScript-off notes, and an expanded quality
  checklist.

### Fixed
- Microsoft Copilot claims verified against official Microsoft documentation and
  hedged as platform/plan dependent; removed unverified specifics.

### Unchanged (by design)
- Seven-stage structure, safety checkpoint, all lesson content, and the pastel
  workshop design are preserved.
- No coding-agent, Copilot Studio, or GitHub Copilot content.
- No medical-information examples; Maya’s example stays on a small apartment
  balcony (never a backyard).
- Static, offline, file://-friendly site: no server, no CDNs, no API calls.
