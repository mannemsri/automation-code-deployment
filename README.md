# CI/CD Demo: Node.js + Docker + GitHub Actions

A tiny Node.js web app with a pipeline that tests, builds a Docker image, and deploys it on every push to `main`.

## Pipeline (`.github/workflows/ci-cd.yml`)

| Job | Runs on | What it does |
|---|---|---|
| `test` | every push and PR | `npm ci` and `npm test` |
| `build-and-push` | push to `main` | builds the image, pushes to GHCR (`:<sha>` and `:latest`) |
| `deploy` | after build, if `DEPLOY_HOST` is set | SSHes into your server, pulls the image, restarts the container, smoke-tests `/health` |

## Run locally

```bash
npm test
npm start                 # http://localhost:3000
docker build -t demo . && docker run -p 3000:3000 demo
```

## Enable deployment

Target: any Linux server with Docker installed and SSH access.

1. Repo → Settings → Secrets and variables → Actions
   - Variables: `DEPLOY_HOST` (server IP/hostname), `DEPLOY_USER` (SSH user)
   - Secret: `DEPLOY_SSH_KEY` (private key whose public half is in the server's `~/.ssh/authorized_keys`)
2. Optional: Settings → Environments → `production` → add required reviewers for manual approval.
3. Push to `main`; the app is served on port 80.
