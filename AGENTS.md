<!-- BEGIN:nextjs-agent-rules -->
# Agent roles (Grok bot, Cursor, Claude)

Goal: autonomous work, few tokens. qrc-gen is free; success = subscribers, not sales.

1. **Queue = GitHub issues.** Work only on an open issue with label `ready`. No issue, no work.
2. **Grok bot builds.** One issue → one branch `grok/<issue>-<slug>` → one PR that says `Closes #<issue>`. Small diffs (≤3 files).
3. **Cursor builds too** (branch `cursor/<issue>-<slug>`) and its Security Agent checks every PR.
4. **Elon (Grok bot on X) reviews.** Vale pastes a PR link to Elon; Vale posts Elon's answer on the PR as `[Elon] LGTM` or `[Elon] @claude fix: <problem, file:line>` (the mention starts `claude.yml`).
   - LGTM only if the PR fits the plan: free, no pricing pages, affiliate-link space allowed. Workflow/config-only PRs need no EN/SL.
   - Loop brake: after 2 fix comments on one PR, post `[Elon] needs Valentin` and stop.
5. **Claude reviews and merges.**
   - Merge **only** when a PR comment is exactly `[Elon] LGTM, merge OK` **and** CI is green (`npm run lint && npm run build`).
   - Never merge on `[Elon] needs Valentin` or any comment that says `needs Valentin to merge`.
   - Never review your own PR.
5a. **Elon review schedule.** Weekdays at 10:00 Europe/Ljubljana, starting 2026-11-10.
6. **Sync:** before starting, pull `main` and check the issue has no open PR. Comment `taking it` on the issue to lock it.
7. **Stop and ask Vale** (label `owner`) for: prices, legal, spend, QR generation logic (see CLAUDE.md rule 1).
8. **Tokens:** read only the files the issue names; no repo-wide scans; one PR per day per agent.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
