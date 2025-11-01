# Test Specification - Definition of Done

This document defines the acceptance criteria and test cases for all e-commerce scrapers in this monorepo. An actor is considered **production-ready** when all tests pass.

## Testing Philosophy

- **Automated where possible** - Use Apify's testing framework
- **Real-world scenarios** - Test with actual URLs and data
- **Edge cases covered** - Handle failures gracefully
- **Performance validated** - Meet cost and speed targets
- **Quality assured** - Data accuracy verified

---

## StockX Scraper - Definition of Done

### 1. Functional Tests

#### 1.1 Basic Scraping (REQUIRED ✅)
- [ ] **Test**: Run with single product URL
- [ ] **Expected**: Extract product data successfully
- [ ] **Criteria**:
  - Product title extracted
  - Price present
  - SKU/styleId present
  - Brand identified
  - Image URL valid
  - All required fields populated

#### 1.2 Search Results Scraping (REQUIRED ✅)
- [ ] **Test**: Run with search URL (e.g., `?s=jordan`)
- [ ] **Expected**: Extract multiple products
- [ ] **Criteria**:
  - Minimum 10 products extracted
  - All products have unique URLs
  - No duplicate products in dataset
  - Products match search query

#### 1.3 Pagination Handling (REQUIRED ✅)
- [ ] **Test**: Set `maxResults: 100` on multi-page search
- [ ] **Expected**: Follow pagination automatically
- [ ] **Criteria**:
  - Scrapes across multiple pages
  - Stops at maxResults limit
  - Detects last page (< 36 results)
  - Page parameter increments correctly

#### 1.4 Hidden JSON Extraction (REQUIRED ✅)
- [ ] **Test**: Verify `__NEXT_DATA__` parsing
- [ ] **Expected**: Extract data from embedded JSON
- [ ] **Criteria**:
  - Finds `<script id="__NEXT_DATA__">` tag
  - Parses JSON successfully
  - Falls back to alternative selector if needed
  - Recursive search finds product array

#### 1.5 Real-time Pricing (OPTIONAL ⚙️)
- [ ] **Test**: Enable `extractPricing: true`
- [ ] **Expected**: Extract bid/ask prices
- [ ] **Criteria**:
  - `lowestAsk` field present and numeric
  - `highestBid` field present and numeric
  - Prices are reasonable (> 0, < 10000)
  - Runtime increases 3-5x (acceptable)

### 2. Input Validation Tests

#### 2.1 Required Fields
- [ ] **Test**: Run with empty `startUrls`
- [ ] **Expected**: Error with clear message
- [ ] **Message**: "At least one start URL is required"

#### 2.2 Invalid URLs
- [ ] **Test**: Provide malformed URL
- [ ] **Expected**: Graceful handling
- [ ] **Criteria**:
  - Logs warning
  - Continues with valid URLs
  - Doesn't crash actor

#### 2.3 Max Results Limits
- [ ] **Test**: Set `maxResults: 0`
- [ ] **Expected**: Validation error or immediate exit
- [ ] **Test**: Set `maxResults: 50000`
- [ ] **Expected**: Accepts but warns about cost/time

#### 2.4 Proxy Configuration
- [ ] **Test**: Run without proxies
- [ ] **Expected**: Works locally (may fail on platform)
- [ ] **Test**: Run with residential proxies
- [ ] **Expected**: 85-95% success rate

### 3. Error Handling Tests

#### 3.1 Network Failures
- [ ] **Test**: Simulate network timeout
- [ ] **Expected**: Retry 3 times, then fail gracefully
- [ ] **Criteria**:
  - Logs retries (count: 1, 2, 3)
  - Doesn't crash actor
  - Continues with next URL

#### 3.2 Cloudflare Challenges
- [ ] **Test**: Encounter Cloudflare challenge
- [ ] **Expected**: Detect and wait
- [ ] **Criteria**:
  - Detects `iframe[src*="cloudflare"]`
  - Waits 10 seconds
  - Logs warning message
  - Attempts to continue

#### 3.3 Missing Data
- [ ] **Test**: Product page with incomplete data
- [ ] **Expected**: Extract available fields, null for missing
- [ ] **Criteria**:
  - No crashes on missing selectors
  - Logs debug info if debugMode enabled
  - Pushes partial data to dataset

#### 3.4 Invalid JSON
- [ ] **Test**: Page with malformed `__NEXT_DATA__`
- [ ] **Expected**: Log error, skip product
- [ ] **Criteria**:
  - Catches JSON parse error
  - Logs: "Failed to parse hidden data"
  - Continues with next request

### 4. Performance Tests

#### 4.1 Speed Benchmarks (WITHOUT pricing)
- [ ] **10 products**: < 2 minutes
- [ ] **100 products**: < 10 minutes
- [ ] **1000 products**: < 90 minutes

#### 4.2 Speed Benchmarks (WITH pricing)
- [ ] **10 products**: < 5 minutes
- [ ] **100 products**: < 30 minutes

#### 4.3 Cost Benchmarks (with residential proxies)
- [ ] **10 products**: < $0.05
- [ ] **100 products**: < $0.20
- [ ] **1000 products**: < $2.00

#### 4.4 Memory Usage
- [ ] **Test**: Monitor memory during run
- [ ] **Expected**: Stays under 2048 MB
- [ ] **Criteria**: No memory leaks, stable usage

#### 4.5 Concurrency
- [ ] **Test**: Run with `maxConcurrency: 3`
- [ ] **Expected**: 3 parallel requests max
- [ ] **Criteria**: No rate limiting errors

### 5. Data Quality Tests

#### 5.1 Required Fields Present
- [ ] **Test**: Verify all scraped products have:
  - `id` (string)
  - `url` (valid URL)
  - `title` (non-empty string)
  - `scrapedAt` (valid ISO date)

#### 5.2 Optional Fields Format
- [ ] **Test**: Verify field types when present:
  - `price` (number or null)
  - `sku` (string or null)
  - `brand` (string or null)
  - `image` (valid URL or null)
  - `lowestAsk` (number or null)
  - `highestBid` (number or null)

#### 5.3 Data Accuracy
- [ ] **Test**: Manual verification of 5 random products
- [ ] **Expected**: Data matches StockX website
- [ ] **Criteria**:
  - Title matches exactly
  - Price within $1 (due to timing)
  - SKU matches
  - Brand correct

#### 5.4 No Duplicates
- [ ] **Test**: Check dataset for duplicate URLs
- [ ] **Expected**: All URLs unique
- [ ] **Implementation**: Track with `Set()`

### 6. Integration Tests

#### 6.1 Apify Platform Integration
- [ ] **Test**: Deploy to Apify and run
- [ ] **Expected**: Runs successfully
- [ ] **Criteria**:
  - Actor builds without errors
  - Starts and completes run
  - Dataset populated
  - No platform-specific errors

#### 6.2 Proxy Integration
- [ ] **Test**: Use Apify residential proxies
- [ ] **Expected**: High success rate
- [ ] **Criteria**:
  - 85-95% requests succeed
  - Proxy rotation works
  - Sessions maintained

#### 6.3 Input Schema Validation
- [ ] **Test**: Use Apify Console UI to input data
- [ ] **Expected**: Fields render correctly
- [ ] **Criteria**:
  - Emoji icons display
  - Sections organized
  - Defaults populate
  - Validation works

#### 6.4 Storage Integration
- [ ] **Test**: Verify `Actor.pushData()` works
- [ ] **Expected**: Data appears in dataset
- [ ] **Criteria**:
  - All products saved
  - JSON format valid
  - Can export as CSV/Excel

### 7. Stealth & Anti-Bot Tests

#### 7.1 Webdriver Detection Removal
- [ ] **Test**: Check `navigator.webdriver` in browser
- [ ] **Expected**: Returns `false`
- [ ] **Implementation**: Verify in `preNavigationHooks`

#### 7.2 Chrome Object Present
- [ ] **Test**: Verify `window.chrome` exists
- [ ] **Expected**: Object with `runtime` property
- [ ] **Implementation**: Check in init script

#### 7.3 Headers Configuration
- [ ] **Test**: Inspect request headers
- [ ] **Expected**: Realistic headers set
- [ ] **Criteria**:
  - `Accept-Language: en-US,en;q=0.9`
  - `Accept-Encoding: gzip, deflate, br`
  - User-Agent present

#### 7.4 Random Delays
- [ ] **Test**: Monitor timing between requests
- [ ] **Expected**: 2-5 second delays with variation
- [ ] **Criteria**: Not predictable pattern

### 8. Logging & Monitoring Tests

#### 8.1 Info Logs
- [ ] **Test**: Check logs during run
- [ ] **Expected**: Key events logged
- [ ] **Required logs**:
  - "StockX Scraper starting..."
  - "Processing: [URL]"
  - "Progress: X/Y products scraped"
  - "StockX scraping completed"

#### 8.2 Warning Logs
- [ ] **Test**: Trigger warnings
- [ ] **Expected**: Warnings logged clearly
- [ ] **Examples**:
  - "Cloudflare challenge detected"
  - "No products found on page"

#### 8.3 Error Logs
- [ ] **Test**: Trigger errors
- [ ] **Expected**: Errors logged with context
- [ ] **Examples**:
  - "Request failed: [error message]"
  - "Failed to parse hidden data"

#### 8.4 Debug Mode
- [ ] **Test**: Enable `debugMode: true`
- [ ] **Expected**: Additional debug logs
- [ ] **Examples**:
  - "Applied stealth patches"
  - "Parsed __NEXT_DATA__"
  - "Extracted pricing for [product]"

### 9. Edge Cases

#### 9.1 Empty Search Results
- [ ] **Test**: Search for non-existent product
- [ ] **Expected**: No crash, zero results
- [ ] **Criteria**: Logs "No products found"

#### 9.2 Sold Out Products
- [ ] **Test**: Scrape sold-out item
- [ ] **Expected**: Extract available data
- [ ] **Criteria**: Handles missing pricing gracefully

#### 9.3 New/Modified Page Structure
- [ ] **Test**: Simulate StockX layout change
- [ ] **Expected**: Fallback selectors work
- [ ] **Criteria**: Tries alternative JSON locations

#### 9.4 Rate Limiting
- [ ] **Test**: Rapid requests (stress test)
- [ ] **Expected**: Handles rate limits
- [ ] **Criteria**: Retries with backoff

### 10. Documentation Tests

#### 10.1 README Completeness
- [ ] README includes:
  - Feature list
  - Input schema explanation
  - Output format examples
  - Usage instructions
  - Cost estimates
  - Limitations
  - Legal disclaimer

#### 10.2 Code Documentation
- [ ] All functions have JSDoc comments
- [ ] Complex logic has inline comments
- [ ] TODO items addressed or removed

#### 10.3 Examples Provided
- [ ] Input example in README
- [ ] Output example in README
- [ ] API call example in README

---

## Grailed Scraper - Definition of Done (Future)

### Critical Tests
- [ ] Infinite scroll implementation works
- [ ] Modal/popup detection and closure
- [ ] Handles inconsistent DOM selectors
- [ ] Extracts all product metadata
- [ ] Designer and category filters work
- [ ] No duplicates during scroll
- [ ] Stops when no new content loads

---

## Poshmark Scraper - Definition of Done (Future)

### Critical Tests
- [ ] CAPTCHA detection works
- [ ] Rate limiting enforced (5000 actions/day)
- [ ] Single concurrency (maxConcurrency: 1)
- [ ] Advanced stealth patches applied
- [ ] Human-like scrolling behavior
- [ ] Extended delays between actions
- [ ] Graceful exit on CAPTCHA

---

## Acceptance Criteria Summary

An actor is **production-ready** when:

### Must Have (BLOCKING) ✅
- [ ] All functional tests pass (1.1-1.4)
- [ ] Input validation works (2.1-2.2)
- [ ] Error handling graceful (3.1-3.4)
- [ ] Data quality validated (5.1-5.3)
- [ ] Apify platform integration works (6.1, 6.4)
- [ ] README complete (10.1)
- [ ] No syntax errors, clean execution
- [ ] Success rate > 80% with proxies

### Should Have (IMPORTANT) ⚙️
- [ ] Performance benchmarks met (4.1-4.3)
- [ ] All stealth measures implemented (7.1-7.4)
- [ ] Logging comprehensive (8.1-8.3)
- [ ] Code documented (10.2)

### Nice to Have (OPTIONAL) 🎁
- [ ] Real-time pricing works (1.5)
- [ ] Debug mode functional (8.4)
- [ ] Edge cases handled (9.1-9.4)
- [ ] Examples provided (10.3)

---

## Testing Workflow

### Local Testing
```bash
cd stockx-scraper

# Test 1: Basic functionality
apify run --input '{"startUrls":[{"url":"https://stockx.com/air-jordan-1"}],"maxResults":1}'

# Test 2: Multiple products
apify run --input '{"startUrls":[{"url":"https://stockx.com/search?s=jordan"}],"maxResults":10}'

# Test 3: Pagination
apify run --input '{"startUrls":[{"url":"https://stockx.com/search?s=jordan"}],"maxResults":50}'

# Test 4: With pricing
apify run --input '{"startUrls":[{"url":"https://stockx.com/air-jordan-1"}],"maxResults":5,"extractPricing":true}'

# Test 5: Error handling
apify run --input '{"startUrls":[{"url":"https://invalid-url.com"}],"maxResults":1}'
```

### Platform Testing
1. Deploy: `apify push`
2. Run with default input
3. Run with residential proxies
4. Run with max memory settings
5. Monitor logs and results
6. Verify dataset export (JSON, CSV, Excel)

### Validation Checklist
- [ ] All local tests pass
- [ ] Platform deployment successful
- [ ] Run completes without crashes
- [ ] Dataset contains valid data
- [ ] Cost within expected range
- [ ] No security vulnerabilities
- [ ] Legal disclaimer present

---

## Sign-Off

**StockX Scraper MVP**:
- [ ] Developer tested ✅
- [ ] Code reviewed ✅
- [ ] Platform tested ⏳
- [ ] Production approved ⏳

**Date**: _________
**Tested by**: _________
**Approved by**: _________

---

## Test Results Template

```markdown
# Test Run: YYYY-MM-DD

## Configuration
- Actor: StockX Scraper
- Version: 1.0
- Environment: Local / Platform
- Proxies: Yes / No
- Input: [paste input JSON]

## Results
- Total Products: XX
- Success Rate: XX%
- Runtime: XX minutes
- Cost: $XX
- Errors: XX

## Pass/Fail
- Functional: ✅ / ❌
- Performance: ✅ / ❌
- Data Quality: ✅ / ❌
- Integration: ✅ / ❌

## Notes
[Any observations, issues, or recommendations]

## Status
PASS / FAIL / NEEDS WORK
```

---

**Last Updated**: 2025-11-01
**Version**: 1.0
**Maintainer**: Development Team
