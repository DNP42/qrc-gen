<!-- BEGIN:nextjs-agent-rules -->
# Agent roles (Grok bot, Cursor, Claude)

Goal: autonomous work, few tokens. qrc-gen is free; success = subscribers, not sales.

1. **Queue = GitHub issues.** Work only on an open issue with label `ready`. No issue, no work.
2. **Grok bot builds.** One issue → one branch `grok/<issue>-<slug>` → one PR that says `Closes #<issue>`. Small diffs (≤3 files).
3. **Cursor builds too** (branch `cursor/<issue>-<slug>`) and its Security Agent checks every PR.
4. **Elon (Grok bot) reviews.** Runs on this Mac via `grok` CLI + `gh`. Checks open PRs, comments `LGTM`, or `@claude fix: <problem>` (that mention starts the Claude GitHub App). Comments post as `hrco`, so start each with `[Elon]`.
5. **Claude reviews and merges.** Merge when the gate (`npm run lint && npm run build`) is green and no owner question is open. Never review your own PR.
5. **Sync:** before starting, pull `main` and check the issue has no open PR. Comment `taking it` on the issue to lock it.
6. **Stop and ask Vale** (label `owner`) for: prices, legal, spend, QR generation logic (see CLAUDE.md rule 1).
7. **Tokens:** read only the files the issue names; no repo-wide scans; one PR per day per agent.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
