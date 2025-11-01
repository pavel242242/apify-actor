# 📊 Expected Test Results

This document shows exactly what you should see when testing the StockX scraper on Apify platform.

## Test Configuration

```json
{
  "startUrls": [
    { "url": "https://stockx.com/search?s=jordan" }
  ],
  "maxResults": 10,
  "extractPricing": false,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

---

## Expected Console Logs

### ✅ Good Logs (Success)

```
INFO  System info {"apifyVersion":"3.5.1","crawleeVersion":"3.15.2"}
INFO  StockX Scraper starting... {"startUrls":1,"maxResults":10,"extractPricing":false}
INFO  PlaywrightCrawler: Starting the crawler.
INFO  Processing: https://stockx.com/search?s=jordan
INFO  Found 36 products on page
INFO  Progress: 10/10 products scraped
INFO  PlaywrightCrawler: All requests processed, shutting down
INFO  Final stats: requestsTotal:1, requestsFinished:1, requestsFailed:0
INFO  StockX scraping completed {"totalScraped":10,"maxResults":10}
```

### ⚠️ Acceptable Warnings

```
WARN  Cloudflare challenge detected, waiting...
```
**Meaning**: Cloudflare security detected, but we handle it. Run should continue.

```
WARN  Reclaiming failed request (retryCount:1)
```
**Meaning**: First request failed, retrying. Normal with proxies.

### 🔴 Bad Logs (Failure)

```
ERROR Request failed and reached maximum retries
ERROR All requests failed: net::ERR_EMPTY_RESPONSE
```
**Fix**: Check proxy configuration, ensure residential proxies enabled

```
ERROR Failed to parse hidden data: Unexpected token
```
**Fix**: StockX may have changed page structure. Check if URL is valid.

---

## Expected Dataset Output

### Sample Product (Good)

```json
{
  "id": "air-jordan-1-retro-high-og-university-blue",
  "url": "https://stockx.com/air-jordan-1-retro-high-og-university-blue",
  "title": "Air Jordan 1 Retro High OG 'University Blue'",
  "brand": "Jordan",
  "sku": "555088-134",
  "price": 180,
  "description": "The Air Jordan 1 Retro High OG 'University Blue' ...",
  "category": "sneakers",
  "image": "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-University-Blue.jpg",
  "scrapedAt": "2025-11-01T15:30:00.000Z"
}
```

### With Pricing Enabled

```json
{
  "id": "air-jordan-1-retro-high-og-university-blue",
  "url": "https://stockx.com/air-jordan-1-retro-high-og-university-blue",
  "title": "Air Jordan 1 Retro High OG 'University Blue'",
  "brand": "Jordan",
  "sku": "555088-134",
  "price": 180,
  "lowestAsk": 245,
  "highestBid": 220,
  "image": "https://images.stockx.com/...",
  "scrapedAt": "2025-11-01T15:30:00.000Z"
}
```

### Missing Optional Fields (OK)

```json
{
  "id": "product-id",
  "url": "https://stockx.com/...",
  "title": "Product Title",
  "brand": null,
  "sku": null,
  "price": null,
  "image": "https://images.stockx.com/...",
  "scrapedAt": "2025-11-01T15:30:00.000Z"
}
```
**OK**: Optional fields can be null if not found

---

## Expected Performance

### Test 1: 10 Products (Basic)

| Metric | Expected | Acceptable Range |
|--------|----------|------------------|
| **Runtime** | 2-5 min | 1-7 min |
| **Cost** | $0.15 | $0.10-0.25 |
| **Success Rate** | 90-95% | 85%+ |
| **Products Found** | 10 | 8-10 |
| **Memory Used** | 1024 MB | 512-2048 MB |

### Test 2: 50 Products (Pagination)

| Metric | Expected | Acceptable Range |
|--------|----------|------------------|
| **Runtime** | 5-10 min | 4-12 min |
| **Cost** | $0.50-0.75 | $0.40-1.00 |
| **Success Rate** | 90-95% | 85%+ |
| **Products Found** | 50 | 45-50 |
| **Pages Scraped** | 2 | 2 |

### Test 3: 100 Products

| Metric | Expected | Acceptable Range |
|--------|----------|------------------|
| **Runtime** | 10-15 min | 8-20 min |
| **Cost** | $1.00-1.50 | $0.80-2.00 |
| **Success Rate** | 90-95% | 85%+ |
| **Products Found** | 100 | 95-100 |
| **Pages Scraped** | 3 | 3 |

---

## Expected Statistics Tab

### Request Statistics

```
Total requests: 1-3 (depending on pages)
Requests finished: 1-3
Requests failed: 0-1
Retry histogram: [null, null, 0-1, null]
Avg duration: 4000-8000ms per request
```

### Compute Units

```
10 products: ~0.15-0.25 CU
50 products: ~0.50-0.80 CU
100 products: ~1.00-1.50 CU
```

### Proxy Usage

```
Requests via proxy: 100%
Proxy type: RESIDENTIAL
Data transferred: ~5-50 MB (depending on products)
```

---

## Expected Dataset Structure

### Count
- **10 products**: Dataset should have 10 items
- **No duplicates**: All URLs should be unique
- **All valid**: No null/undefined products

### Fields Present

**Required (always)**:
- ✅ `id` (string, non-empty)
- ✅ `url` (valid StockX URL)
- ✅ `title` (string, non-empty)
- ✅ `scrapedAt` (ISO date string)

**Optional (may be null)**:
- `brand` (string or null)
- `sku` (string or null)
- `price` (number or null)
- `description` (string or null)
- `category` (string or null)
- `image` (URL string or null)

**Pricing (if enabled)**:
- `lowestAsk` (number or null)
- `highestBid` (number or null)

---

## Validation Checks

### ✅ Pass Criteria

1. **Run Status**: SUCCEEDED
2. **Products Count**: Matches maxResults (±2 acceptable)
3. **All URLs**: Start with `https://stockx.com/`
4. **All Titles**: Non-empty strings
5. **All Timestamps**: Valid ISO dates
6. **No Duplicates**: All URLs unique
7. **Success Rate**: > 85%
8. **Cost**: Within expected range
9. **Logs**: No critical errors

### ❌ Fail Criteria

1. **Run Status**: FAILED
2. **Products Count**: 0 or < 50% of maxResults
3. **Success Rate**: < 80%
4. **Errors**: "Maximum retries reached" for all requests
5. **Cost**: > 2x expected
6. **Memory**: OOM (Out of Memory) errors
7. **Timeout**: Run exceeds 30 minutes

---

## Comparison: Without vs With Pricing

### Without Pricing (`extractPricing: false`)

**Advantages**:
- ✅ Faster (2-3 min for 10 products)
- ✅ Cheaper ($0.15 for 10 products)
- ✅ More reliable (fewer requests)

**Output**:
```json
{
  "title": "...",
  "price": 180,
  "image": "..."
}
```

### With Pricing (`extractPricing: true`)

**Advantages**:
- ✅ Real-time market data
- ✅ Bid/ask prices included

**Trade-offs**:
- ⚠️ 3-5x slower (6-15 min for 10 products)
- ⚠️ 3-5x more expensive ($0.50+ for 10 products)
- ⚠️ More likely to hit rate limits

**Output**:
```json
{
  "title": "...",
  "price": 180,
  "lowestAsk": 245,
  "highestBid": 220,
  "image": "..."
}
```

---

## Troubleshooting Guide

### Issue: 0 Products Scraped

**Check**:
1. Logs show "No products found on page"
2. URL is accessible (try in browser)
3. StockX structure may have changed

**Fix**:
- Test with different URL
- Enable debug mode: `"debugMode": true`
- Check if `__NEXT_DATA__` still exists on page

### Issue: Only 5-7 Products (Expected 10)

**Possible causes**:
- Some requests failed (check logs)
- StockX rate limiting
- Proxy quality issue

**Fix**:
- Check logs for failed requests
- Lower maxConcurrency in code (currently 3)
- Try again (proxies rotate)

### Issue: High Cost

**Check**:
- Pricing extraction enabled? (3-5x more expensive)
- Large maxResults?
- Memory usage too high?

**Fix**:
- Disable pricing for testing
- Use smaller maxResults
- Check memory doesn't exceed 2048 MB

### Issue: "Cloudflare challenge" in Every Log

**Meaning**: Getting challenged repeatedly

**Fix**:
- Check residential proxies enabled
- Increase delays in code
- Lower concurrency

---

## Next Steps

### ✅ If Test Passes
1. Run larger test (50-100 products)
2. Test pagination behavior
3. Test with pricing enabled
4. Validate data accuracy manually
5. Mark as production-ready

### ⚠️ If Test Has Issues
1. Check logs for specific errors
2. Verify proxy configuration
3. Test with simpler input (1 product URL)
4. Enable debug mode
5. Adjust code if needed

### 🚀 Production Deployment
1. Complete all tests from `TEST_SPECIFICATION.md`
2. Update README
3. Configure pricing (if publishing to Store)
4. Set up monitoring
5. Deploy!

---

**Last Updated**: 2025-11-01
**Test Environment**: Apify Platform
**Expected Success Rate**: 85-95%
