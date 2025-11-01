# StockX Scraper - Testing Checklist

Quick reference for validating the actor before deployment or release.

## Pre-Deployment Checklist

### Code Quality
- [ ] No syntax errors
- [ ] All imports working
- [ ] Functions documented
- [ ] No TODO items remaining

### Local Testing
- [ ] Single product URL works
- [ ] Search results work (10+ products)
- [ ] Pagination tested (50+ products)
- [ ] Error handling verified (invalid URL)
- [ ] All data fields populated

### Configuration
- [ ] INPUT_SCHEMA.json validates
- [ ] actor.json has correct metadata
- [ ] Dockerfile builds successfully
- [ ] package.json dependencies correct

### Data Quality
- [ ] Products have unique URLs
- [ ] Required fields present (id, url, title, scrapedAt)
- [ ] Prices are numeric (when present)
- [ ] No duplicates in output

### Platform Testing (Required before production)
- [ ] Deploys to Apify successfully
- [ ] Runs with default input
- [ ] Works with residential proxies
- [ ] Dataset exports correctly (JSON/CSV)
- [ ] Costs within expected range

## Quick Test Commands

```bash
# Minimal test (1 product)
apify run --input '{"startUrls":[{"url":"https://stockx.com/air-jordan-1-retro-high-og-university-blue"}],"maxResults":1}'

# Standard test (10 products)
apify run --input '{"startUrls":[{"url":"https://stockx.com/search?s=jordan"}],"maxResults":10}'

# Pagination test (50 products)
apify run --input '{"startUrls":[{"url":"https://stockx.com/search?s=jordan"}],"maxResults":50}'
```

## Expected Results

### Success Criteria
- ✅ Run completes without crashes
- ✅ Dataset has expected number of products
- ✅ Success rate > 80%
- ✅ Runtime reasonable (10 products < 2 min)
- ✅ No critical errors in logs

### Acceptable Warnings
- ⚠️ Cloudflare challenges (if resolved)
- ⚠️ Individual request failures (if retried)
- ⚠️ "No products found" on empty results

### Blocking Errors
- ❌ Syntax errors
- ❌ Import failures
- ❌ Actor initialization errors
- ❌ 100% request failure rate
- ❌ Invalid output data

## Performance Targets

| Products | Time Target | Cost Target |
|----------|-------------|-------------|
| 10       | < 2 min     | < $0.05     |
| 100      | < 10 min    | < $0.20     |
| 1000     | < 90 min    | < $2.00     |

## Sign-Off

**Version**: _______
**Tested Date**: _______
**Environment**: Local / Platform
**Result**: PASS / FAIL
**Notes**: _______________________
