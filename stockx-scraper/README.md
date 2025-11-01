# StockX Product Scraper

Extract comprehensive product data from StockX including titles, prices, SKUs, images, and optional real-time pricing. Optimized with hidden JSON extraction for maximum speed and reliability.

## Features

- **Fast hidden JSON extraction** - Extracts product data from embedded Next.js data (3-5x faster than traditional scraping)
- **Optional real-time pricing** - Get current bid/ask prices and last sale data
- **Cloudflare bypass** - Built-in stealth techniques for reliable scraping
- **Automatic pagination** - Handles multi-page search results automatically
- **Residential proxy support** - Optimized for Apify residential proxies (85-95% success rate)
- **Session management** - Maintains consistent behavior to avoid detection

## Input Configuration

### Required Fields

- **startUrls** (array) - Product URLs, category pages, or search result URLs to scrape

### Optional Fields

- **maxResults** (integer, default: 100) - Maximum number of products to scrape. Start with 10-100 for testing.
- **extractPricing** (boolean, default: false) - Enable to extract real-time bid/ask prices. ⚠️ Increases runtime by 3-5x.
- **proxyConfiguration** (object) - Proxy settings. Residential proxies strongly recommended.
- **debugMode** (boolean, default: false) - Enable verbose logging for troubleshooting.

### Example Input

```json
{
  "startUrls": [
    { "url": "https://stockx.com/search?s=jordan" },
    { "url": "https://stockx.com/air-jordan-1-retro-high-og-university-blue" }
  ],
  "maxResults": 100,
  "extractPricing": false,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

## Output Format

Each product returns the following data:

```json
{
  "id": "product-id",
  "url": "https://stockx.com/product-url",
  "title": "Air Jordan 1 Retro High OG 'University Blue'",
  "brand": "Jordan",
  "sku": "555088-134",
  "price": 180,
  "description": "Product description...",
  "category": "sneakers",
  "image": "https://images.stockx.com/...",
  "scrapedAt": "2025-11-01T12:00:00.000Z"
}
```

### With Pricing Enabled

When `extractPricing: true`, additional fields are included:

```json
{
  "lowestAsk": 245.00,
  "highestBid": 220.00
}
```

## Usage

### Running Locally

1. Install dependencies:
```bash
cd stockx-scraper
npm install
```

2. Run with Apify CLI:
```bash
apify run
```

3. Or run directly:
```bash
npm start
```

### Running on Apify Platform

1. Push to Apify:
```bash
apify push
```

2. Run via API:
```bash
curl -X POST https://api.apify.com/v2/acts/YOUR_USERNAME~stockx-scraper/runs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startUrls": [{"url": "https://stockx.com/search?s=jordan"}],
    "maxResults": 100
  }'
```

## Performance & Cost

### Typical Metrics

| Products | Time | Estimated Cost* |
|----------|------|-----------------|
| 100      | 2-3 min | $0.10-0.15 |
| 1,000    | 15-20 min | $1.00-1.50 |
| 10,000   | 2-3 hours | $8.00-12.00 |

*Costs include platform usage with residential proxies. Actual costs may vary based on configuration.

### Performance Tips

- **Start small** - Test with `maxResults: 10` first
- **Disable pricing** - Set `extractPricing: false` for 3-5x faster scraping
- **Use residential proxies** - Datacenter proxies have 60%+ failure rate against Cloudflare
- **Monitor concurrency** - Default is 3, reduce if encountering blocks

## How It Works

### Hidden JSON Extraction

StockX (built with Next.js) embeds product data in `<script id="__NEXT_DATA__">` tags. This actor:

1. Loads the page with Playwright
2. Extracts the hidden JSON with Cheerio (very fast)
3. Parses product data from nested structure
4. Optionally visits individual product pages for real-time pricing

This approach is **3-5x faster** than waiting for JavaScript to render and querying DOM elements.

### Anti-Bot Evasion

The actor implements multiple stealth techniques:

- Removes `navigator.webdriver` property
- Patches Chrome object and plugins
- Uses realistic HTTP headers
- Implements random delays (2-5 seconds)
- Maintains sessions for behavioral consistency
- Rotates residential proxies

Success rate: **85-95%** with residential proxies, **20-40%** with datacenter proxies.

### Pagination

Automatically detects and follows pagination:

- Monitors results per page (typically 36 products)
- Increments page number in URL
- Stops when fewer than 36 results (last page)
- Respects `maxResults` limit across all pages

## Limitations

- **Public data only** - Cannot access login-protected content without credentials
- **Rate limits** - Recommended max: 50-100 requests/hour per IP
- **Residential proxies required** - Datacenter proxies have high failure rates
- **Real-time pricing is slower** - Requires visiting individual product pages

## Troubleshooting

### "No products found on page"

- Verify the URL is correct and accessible
- Check if Cloudflare challenge appeared (check logs)
- Try enabling `debugMode: true` for detailed logs

### "Cloudflare challenge detected"

- Ensure residential proxies are enabled
- Reduce `maxConcurrency` in code (currently 3)
- Increase random delays

### High failure rate

- Switch to residential proxies
- Enable session management (already enabled)
- Reduce scraping speed

## Legal & Ethical Use

This scraper extracts only publicly available data. You are responsible for:

- Complying with StockX Terms of Service
- Respecting robots.txt
- Following GDPR and data protection laws
- Using scraped data ethically and legally

**Consult legal counsel if unsure about your use case.**

## Support

Need help or found a bug?

- Open an issue in the repository
- Check Apify Discord community
- Review Apify documentation: https://docs.apify.com

## Technical Details

- **Apify SDK**: v3.5.1+
- **Crawlee**: v3.15.1+
- **Playwright**: v1.40+
- **Node.js**: 18+

## License

Apache-2.0

---

**Note**: This is an MVP version. Advanced features (price filters, size filters, category filters) can be added based on requirements.
