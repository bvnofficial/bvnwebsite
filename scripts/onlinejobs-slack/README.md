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

- `slack.defaultChannel` — where uncategorized/unmapped jobs go (default `#job-feed`).
- `slack.channelByCategory` — route categories to channels, e.g.:

  ```json
  "channelByCategory": {
    "Web Development": "#dev-jobs",
    "Software & AI Development": "#dev-jobs",
    "Digital Marketing": "#marketing-jobs",
    "Virtual Assistant & Admin": "#va-jobs"
  }
  ```

- `categories` — the category list and the keywords used by the fallback
  classifier. Claude uses the same category names.
- `search.keyword` — optionally limit scraping to a search term (empty = all
  latest jobs). `search.pages` — pages of 30 jobs to scan per run.
- `maxAgeHours` / `maxPostsPerRun` — freshness window and per-run flood cap.

## Testing

Run manually from the **Actions** tab (“OnlineJobs.ph Slack Job Feed” →
*Run workflow*), or locally:

```bash
DRY_RUN=1 node scripts/onlinejobs-slack/scrape-and-post.mjs
```
