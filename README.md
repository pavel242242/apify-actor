# E-commerce Scrapers Monorepo

A collection of production-ready Apify actors for scraping major e-commerce/resale platforms.

## Actors

### 🟢 StockX Scraper
High-performance scraper for StockX product data with optimized hidden JSON extraction.

**Status:** MVP Complete
**Location:** `./stockx-scraper/`
**Features:**
- Hidden JSON extraction (fast)
- Optional real-time pricing with Playwright
- Cloudflare evasion
- Pagination handling

### 🔵 Grailed Scraper (Coming Soon)
Scraper for Grailed streetwear marketplace with infinite scroll support.

**Status:** Planned
**Location:** `./grailed-scraper/`

### 🟣 Poshmark Scraper (Coming Soon)
Advanced scraper for Poshmark with maximum stealth capabilities.

**Status:** Planned
**Location:** `./poshmark-scraper/`

## Project Structure

```
/
├── package.json              # Root workspace config
├── stockx-scraper/           # StockX actor
│   ├── .actor/               # Actor configuration
│   │   ├── actor.json
│   │   ├── INPUT_SCHEMA.json
│   │   └── Dockerfile
│   ├── src/
│   │   └── main.js
│   ├── package.json
│   └── README.md
├── grailed-scraper/          # Grailed actor (future)
└── poshmark-scraper/         # Poshmark actor (future)
```

## Getting Started

### Prerequisites
- Node.js 18+
- Apify CLI: `npm install -g apify-cli`
- Apify account with residential proxy access

### Installation

```bash
# Clone repository
git clone <repo-url>
cd apify-actor

# Install dependencies
npm install

# Login to Apify
apify login
```

### Running Locally

```bash
# Run StockX scraper
npm run stockx

# Or use Apify CLI directly
cd stockx-scraper
apify run
```

### Testing with Custom Input

Create `.actor/INPUT.json` in the actor directory:

```json
{
  "startUrls": [
    { "url": "https://stockx.com/search?s=jordan" }
  ],
  "maxResults": 10
}
```

## Development

### Adding a New Actor

1. Create directory structure
2. Add to workspace in root `package.json`
3. Configure `.actor/actor.json`
4. Implement scraping logic in `src/main.js`
5. Test locally with `apify run`

### Deployment

Each actor can be deployed independently:

```bash
cd stockx-scraper
apify push
```

## Architecture

All actors follow the 2024-2025 Apify best practices:
- **Crawlee v3.15+** for scraping logic
- **Apify SDK v3.5+** for platform features
- **Playwright** for JavaScript-rendered sites
- **Residential proxies** for anti-bot evasion
- **Session management** for behavioral consistency

## Resources

- [Apify Documentation](https://docs.apify.com)
- [Crawlee Documentation](https://crawlee.dev)
- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md) (see spec)

## License

Apache-2.0
