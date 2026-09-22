---
name: GitHub connection write access
description: How this project gets pushed to GitHub, and why Replit's GitHub connections can read repos but not write them.
---

## Rule: the owner pushes from the Replit Git pane; agents do not push

The public repo is Sarvesh5273/LUMENKAI and mirrors the whole workspace (branch `main`). The app reads
`artifacts/still-eligible/data/dataset.json` from raw.githubusercontent.com at launch, so a dataset change only
reaches installed apps after the owner pushes.

**Why:** The owner first chose to push from the Git pane himself rather than install the GitHub App that would let
agents push; he later said he would prefer agents to push but has not enabled it. Until he installs the app, no
agent can push, so do not mirror or push the repo from a task environment.

**How to apply:** After merging a change that matters for the app (dataset, config, README), tell the owner to push
and give him the curl check for the raw dataset URL. Do not spend time trying to push. If he asks for agent pushes,
the enabling step is installing the app on LUMENKAI; explain first that an API-created commit is not in his local
Git-pane history (he must Pull before his next Push), and that the first full-repo push should still come from the
Git pane so both histories start identical. Recreating local commits byte-for-byte through the git data API to avoid
that divergence is fragile (dates, offsets, committer fields) and not worth attempting.

## Lesson: Replit GitHub connectors are read-only until the GitHub App is installed on the repo

Both the `github` and `github-app` connectors are user-to-server tokens of the GitHub App "Replit Nexus"
(slug `replit-nexus`, public app page https://github.com/apps/replit-nexus). They read anything the user can read,
but every write (git data API, contents, issues) returns 403 "Resource not accessible by integration" until the user
installs the app on their account with access to the repo: https://github.com/apps/replit-nexus/installations/new.
Tell-tale signs: `x-oauth-scopes` empty, `GET /user/installations` returns 0, `x-accepted-github-permissions:
contents=write` on the failed write. Reauthorizing the connection does not help. The Git pane uses a different app
("Replit", slug `replit`), so a Git-pane connection does not unlock the connectors either.

## Environment quirks seen in the isolated task environment

- `replit-git-askpass` returns username `token` but times out on the password, so `git push` fails with
  "Invalid username or token"; `gh` is not logged in.
- `listConnections('github-app')` returns `[]` in the CodeExecution sandbox even when the connection is attached.
  A node script in the workspace using `@replit/connectors-sdk` (`new ReplitConnectors().proxy('github-app', path)`)
  does reach the API with the connection's credentials injected server-side.
- `listConnections('github')` does work in the sandbox (`proxyFetch`). Write-access check: `GET /user/installations`;
  `total_count: 0` means writes 403 even though the repo endpoint reports `permissions.push: true` for the user.
