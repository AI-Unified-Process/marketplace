# Testing & Forking Guide for `aiup-blazor-dotnet`

This reference guide documents how to install, test, and troubleshoot `aiup-blazor-dotnet` when working from a **forked repository** or **local development clone**.

---

## 1. Registering Marketplace & Installing Plugins from a Fork

When testing from a fork, avoid installing from the upstream repository (`ai-unified-process/marketplace`). Instead, register your fork or local path in Claude Code:

### Option A: Installing from a GitHub Fork
```bash
# Add your GitHub fork as a marketplace source
/plugin marketplace add <your-github-username>/marketplace

# Install core and blazor plugins
/plugin install aiup-core
/plugin install aiup-blazor-dotnet
```

### Option B: Installing from Local Filesystem (Local Clone)
```bash
# Add local directory path as marketplace source
/plugin marketplace add ~/dev/moscait/marketplace

# Install core and blazor plugins
/plugin install aiup-core
/plugin install aiup-blazor-dotnet
### Option C: Tessl CLI — Installing from Local Filesystem
Tessl can install plugins directly from local directories without publishing to the central registry:
```bash
# In your target project directory:
tessl init --agent claude-code   # or cursor, gemini, codex, copilot

# Install plugins using relative or absolute filesystem paths
tessl install /path/to/marketplace/aiup-core
tessl install /path/to/marketplace/aiup-blazor-dotnet
```

### Option D: Tessl CLI — Publishing to Your Forked Tessl Workspace
If you have a Tessl account/workspace (e.g. `carljmosca`), publish to your personal workspace:
```bash
# 1. Update the name in tessl.json and .tessl-plugin/plugin.json:
#    "name": "carljmosca/aiup-blazor-dotnet"

# 2. Publish from your fork
tessl plugin publish ./aiup-core
tessl plugin publish ./aiup-blazor-dotnet

# 3. Install on any machine/agent from your registry workspace
tessl install carljmosca/aiup-core
tessl install carljmosca/aiup-blazor-dotnet
```

---

## 2. Environment Setup & Tooling Requirements

Before invoking `/ef-migration` or `/playwright-test`, ensure local .NET 10 tools and browser drivers are installed:

### A. EF Core CLI Tool (`dotnet-ef`)
Required by `/ef-migration` to run `dotnet ef migrations add`:
```bash
# Install or update global EF Core tool
dotnet tool install --global dotnet-ef
# or
dotnet tool update --global dotnet-ef
```

### B. Playwright Browser Binaries
Required by native C# Playwright tests (`Microsoft.Playwright.Xunit`) to avoid missing executable errors:
```bash
# Inside your target C# test project directory:
dotnet build
npx playwright install

# Or using pwsh from build output:
pwsh bin/Debug/net10.0/playwright.ps1 install
```

---

## 3. Tessl Registry & CI/CD Adjustments

If pushing changes to your own GitHub fork:

* **Repository Secret (`TESSL_TOKEN`):** If GitHub Actions publish workflow is enabled, `.github/workflows/publish-tessl.yml` requires `TESSL_TOKEN` in **Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions**.
* **Registry Scope:** If publishing to a custom Tessl workspace, update the registry namespace from `aiup/aiup-blazor-dotnet` to `<your-workspace>/aiup-blazor-dotnet` in `tessl.json` and `.tessl-plugin/plugin.json`.

---

## 4. Manual / Multi-Agent Adoption (Cursor, Codex, Gemini)

To test the skills in other AI tools (Cursor, OpenAI Codex CLI, Gemini CLI):

1. **Copy/Symlink Skill Folders:**
   - Link `aiup-core/skills/*` into your tool's skill directory (e.g. `.cursor/skills/` or `~/.codex/skills/`).
   - Link `aiup-blazor-dotnet/skills/*` into `.cursor/skills/`.

2. **Configure MCP Servers:**
   Copy server entries from `aiup-blazor-dotnet/.mcp.json` to your agent's MCP configuration file (`.cursor/mcp.json` or `~/.claude.json`):

   ```json
   {
     "mcpServers": {
       "MicrosoftLearn": {
         "type": "http",
         "url": "https://mcp.context7.com/mcp"
       },
       "bUnitDocs": {
         "type": "http",
         "url": "https://mcp.context7.com/mcp"
       },
       "playwright": {
         "type": "stdio",
         "command": "npx",
         "args": [
           "@playwright/mcp@latest"
         ]
       }
     }
   }
   ```

---

## 5. Step-by-Step Test Workflow

To verify the end-to-end workflow on a new .NET 10 Blazor project:

1. Create a `docs/vision.md` file describing your application concept.
2. Run `/requirements` to generate `docs/requirements.md`.
3. Run `/entity-model` to generate `docs/entity_model.md`.
4. Run `/use-case-diagram` and `/use-case-spec` to produce `docs/use_cases/UC-*.md`.
5. Run `/ef-migration` to generate EF Core migrations.
6. Run `/implement` to construct C# Vertical Slices (`Features/UCXXX_Name/`).
7. Run `/bunit-test` and `/dotnet-test` to generate component & handler tests.
8. Run `/playwright-test` to generate C# E2E tests.
9. Execute `dotnet test` to run all generated test suites.

---

## 6. Unattended / Autonomous Execution with `/goal`

You can run the entire AIUP workflow to generate, implement, compile, and test a C# / Blazor .NET 10 application **100% unattended** using the `/goal` command.

### Why `/goal` is the Idiomatic Approach
* **Leverages Published Marketplace Skills:** Uses existing `/requirements`, `/entity-model`, `/use-case-spec`, `/ef-migration`, `/implement`, `/bunit-test`, `/dotnet-test`, and `/playwright-test` skills without duplicating prompt logic.
* **Self-Healing Compilation & Test Loop:** Automatically runs `dotnet build` and `dotnet test` after implementing each use case. If compilation or tests fail, the goal engine inspects errors and fixes C# code before proceeding.
* **Artifact Traceability:** Produces standard committed Markdown specs in `docs/` (`requirements.md`, `entity_model.md`, `UC-*.md`), maintaining full auditability.

### Idiomatic Unattended Command
To trigger an autonomous, spec-driven Blazor build from scratch:

```bash
/goal Build a fully implemented .NET 10 Blazor app starting from docs/vision.md using the AIUP workflow skills (/requirements -> /entity-model -> /use-case-diagram -> /use-case-spec -> /ef-migration -> /implement per UC -> /bunit-test -> /dotnet-test -> /playwright-test). Compile and run tests after each use case.
```
