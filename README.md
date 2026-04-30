# Wajiha Theme Tools

Monorepo for the Wajiha theme development toolkit.

## Packages

- **[@getwajiha/theme-sdk](packages/theme-sdk/)** — React hooks, components, types, and (new in 1.1.0) optional Wajiha DS CSS tokens
- **[@getwajiha/cli](packages/cli/)** — CLI tool for theme development (`wajiha init`, `wajiha build`, `wajiha push`)

## Examples

- **[default-theme](examples/default-theme/)** — Reference theme implementation (Wajiha Default, rebuilt on the DS tokens in 1.1.0)

## Releases

See [CHANGELOG.md](CHANGELOG.md) for the full history.

| Package | Latest |
|---|---|
| `@getwajiha/theme-sdk` | 1.1.0 (additive — adds `tokens.css` + `ThemeTokens`) |
| `@getwajiha/cli` | 1.2.0 (starter scaffold ports to DS tokens) |
| `examples/default-theme` (private) | 1.1.0 (rebuilt on Wajiha DS) |

## Getting Started

```bash
npm install
npm run build
```

## License

MIT
