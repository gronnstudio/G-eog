# NotebookLM MCP — local setup

The [NotebookLM MCP](https://mcpservers.org/servers/roomi-fields/notebooklm-mcp)
(`@roomi-fields/notebooklm-mcp`) lets Claude Code query your NotebookLM
notebooks as a tool. It drives a browser against your Google/NotebookLM
account, so it **must run locally** on your own machine — it cannot be
installed or authorized from a remote Claude Code on the web session
(no live browser, no OAuth flow there).

## Prerequisites

- Node.js (so `npx` is available)
- A Google account with access to your NotebookLM notebooks
- Claude Code CLI running on your own computer

## 1. Register the server

Run in your local terminal:

```bash
claude mcp add notebooklm -- npx -y @roomi-fields/notebooklm-mcp
```

This writes the server into your personal MCP config. Scope it to a single
project instead with `--scope project` if you only want it there.

## 2. Authorize it

Start an **interactive** Claude Code session on your machine:

```bash
claude
```

Then run the MCP panel:

```
/mcp
```

Find `notebooklm` in the list and complete the reconnect / login flow. A
browser window opens for the Google/NotebookLM sign-in; once it succeeds
the server shows as **connected**.

## 3. Use it

With the server connected, its tools appear in that local session and you
can ask Claude to pull from your notebooks.

## Notes

- **Remote (web) sessions can't use it.** The auth and the browser live on
  your machine. A Claude Code on the web session — like the one used to
  build this repo — is non-interactive and cannot run the login, so the
  tools won't appear there even after local setup.
- If `/mcp` shows the server as "not connected," re-run the login from the
  interactive terminal; a `/mcp reconnect notebooklm` retries it.
- To remove it: `claude mcp remove notebooklm`.
