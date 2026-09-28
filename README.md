# Excalidraw for OpenCloud

An [Excalidraw](https://excalidraw.com/) drawing application integrated as a native [OpenCloud](https://opencloud.eu/) web extension. Create, edit and collaborate on `.excalidraw` drawings directly within OpenCloud.

## Features

- Create new Excalidraw drawings from the "New" menu
- Open and edit existing `.excalidraw` files
- Auto-save support via OpenCloud's AppWrapperRoute
- Read-only mode for shared files
- Export drawings to various formats

## Installation

1. Download the latest release archive from the [Releases](https://github.com/opencloud-eu/web-app-excalidraw/releases) page.
2. Extract the archive into your OpenCloud web assets directory:
   ```bash
   unzip web-app-excalidraw.zip -d /var/lib/opencloud/web/assets/apps/excalidraw/
   ```
3. Restart OpenCloud to pick up the new extension.

### Content Security Policy

Excalidraw loads fonts from `esm.sh` at runtime. You need to add `https://esm.sh/` to the `font-src` CSP directive in your OpenCloud configuration:

```yaml
# csp.yaml
directives:
  font-src:
    - "'self'"
    - 'https://esm.sh/'
```

Without this, fonts will be blocked and Excalidraw will fall back to system fonts.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/installation) (see `packageManager` field in `package.json` for the exact version)
- Docker and Docker Compose (for local dev server)

### Setup

```bash
pnpm install
pnpm build:w
```

### Local Development Server

```bash
docker compose up
```

Then open `https://host.docker.internal:9200` (default credentials: `admin`/`admin`).

### Build for Production

```bash
pnpm build
```

The production build is output to the `dist/` directory.

### Testing

```bash
pnpm test:unit
```

## License

[Apache-2.0](LICENSE)
