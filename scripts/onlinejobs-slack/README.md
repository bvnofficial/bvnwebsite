# OnlineJobs.ph → Slack Job Feed

Every hour, `.github/workflows/onlinejobs-slack.yml` scrapes the newest job
posts on [onlinejobs.ph](https://www.onlinejobs.ph/jobseekers/jobsearch?sort=latest),
classifies each one into a category, and posts new jobs to Slack.

```
onlinejobs.ph latest jobs
        │  scrape (title, type, salary, posted time, skills, snippet)
        ▼
  classification ──► Claude API (if ANTHROPIC_API_KEY secret is set)
        │            or keyword matching from config.json (free fallback)
        ▼
  Slack message ──► channel per category (bot token)
                    or one channel (incoming webhook)
```

Jobs already posted are remembered between runs (GitHub Actions cache), and
only jobs posted within the last `maxAgeHours` (default 2h) are considered,
so nothing is double-posted and the first run doesn't flood your channel.

## Setup — GitHub repo secrets

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Required | What it does |
|---|---|---|
| `SLACK_BOT_TOKEN` | one of the two | `xoxb-…` token from a Slack app with the `chat:write` scope. Enables routing different categories to different channels. Invite the bot to each channel (`/invite @YourBot`). |
| `SLACK_WEBHOOK_URL` | one of the two | Simpler alternative: a Slack incoming-webhook URL. All jobs go to the webhook's single channel. Ignored if `SLACK_BOT_TOKEN` is set. |
| `ANTHROPIC_API_KEY` | optional | Classifies jobs with Claude (`claude-opus-4-8` by default; override with a `CLAUDE_MODEL` env var in the workflow). Without it, keyword classification from `config.json` is used — free and still decent. |

If neither Slack secret is set, the run is a **dry run**: it logs what it
would have posted (visible in the Actions logs) and posts nothing.

### Creating the Slack bot token

1. https://api.slack.com/apps → **Create New App** → From scratch.
2. **OAuth & Permissions** → Bot Token Scopes → add `chat:write`.
3. **Install to Workspace** → copy the `xoxb-…` token into the `SLACK_BOT_TOKEN` secret.
4. In Slack, `/invite @YourBot` in every channel listed in `config.json`.

## Configuration — `config.json`

- `slack.defaultChannel` — where uncategorized jobs go, and the fallback when a
  category's channel is missing/inaccessible (default `#job-uncategorized`).
- `slack.channelByCategory` — routes each category to its own channel. The 14
  categories map to the `#job-…` channels (e.g. `Development` → `#job-development`,
  `Paid Ads & Marketing` → `#job-paid-ads`). Each job posts to exactly one
  channel; there is no cross-posting to a master feed. **Per-category routing
  requires the `SLACK_BOT_TOKEN` (bot) path** — a single incoming webhook can
  only post to one channel. The bot must be able to post to each channel: add
  the `chat:write.public` scope (posts to any public channel without an invite),
  or `/invite` the bot into each channel. If a channel doesn't exist yet, that
  job falls back to `defaultChannel` rather than being dropped.
- `categories` — the category list and the keywords used by the fallback
  classifier. Claude uses the same category names.
- `search.keyword` — optionally limit scraping to a search term (empty = all
  latest jobs). `search.pages` — pages of 30 jobs to scan per run.
- `maxAgeHours` — freshness window (only jobs posted within this many hours are
  considered). `maxPostsPerRun` — per-run cap; set to `null` for no cap.

## Testing

Run manually from the **Actions** tab (“OnlineJobs.ph Slack Job Feed” →
*Run workflow*), or locally:

```bash
DRY_RUN=1 node scripts/onlinejobs-slack/scrape-and-post.mjs
```

## Reliable scheduling (external cron → GitHub)

GitHub's built-in `schedule:` trigger is best-effort and frequently skips runs
(observed: zero runs over a 2-hour span at `*/15`). For dependable timing, keep
the workflow but trigger it from an external cron service that calls GitHub's
`workflow_dispatch` API. The in-repo `schedule:` is left as a harmless backup —
dedup prevents any double-posting if both fire.

**1. Create a fine-grained GitHub token**
- https://github.com/settings/personal-access-tokens/new
- Resource owner: `bvnofficial`; Repository access: **Only** `bvnwebsite`
- Repository permissions → **Actions: Read and write**
- Generate and copy the `github_pat_…` value.

**2. Create a job on a cron service** (e.g. free https://cron-job.org)
- URL: `https://api.github.com/repos/bvnofficial/bvnwebsite/actions/workflows/onlinejobs-slack.yml/dispatches`
- Method: **POST**; Schedule: **every 15 minutes**
- Headers:
  - `Accept: application/vnd.github+json`
  - `Authorization: Bearer github_pat_…`
  - `X-GitHub-Api-Version: 2022-11-28`
- Body: `{"ref":"main"}`
- Success response is HTTP **204**.

To pass overrides (backfill) from the cron body, e.g.:
`{"ref":"main","inputs":{"max_age_hours":"6","max_posts":"100"}}`
