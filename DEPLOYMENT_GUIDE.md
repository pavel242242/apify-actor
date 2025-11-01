# 🚀 Apify Platform Deployment Guide

Complete step-by-step guide to deploy and test the StockX scraper on Apify platform.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ Apify account (free tier works)
- ✅ Git installed
- ✅ Terminal/command line access

---

## Step 1: Get Your Apify API Token

### Option A: From Apify Console (Recommended)

1. Go to https://console.apify.com/
2. Click your profile icon (top right)
3. Select **Settings**
4. Navigate to **Integrations** tab
5. Find **Personal API tokens** section
6. Copy your token (starts with `apify_api_...`)

### Option B: Create New Token

1. Go to https://console.apify.com/settings/integrations
2. Click **Create new token**
3. Name it: `CLI Access`
4. Copy the generated token
5. **Save it securely** (you won't see it again)

---

## Step 2: Clone the Repository

```bash
# Clone your repository
git clone <your-repo-url>
cd apify-actor/stockx-scraper

# Verify files are present
ls -la .actor/
# Should see: actor.json, INPUT_SCHEMA.json, Dockerfile

ls -la src/
# Should see: main.js
```

---

## Step 3: Install Dependencies

```bash
# Install Apify CLI globally (if not already installed)
npm install -g apify-cli

# Verify installation
apify --version
# Should show: 0.x.x or higher

# Install actor dependencies
npm install
# Should install: apify, crawlee, playwright, cheerio
```

---

## Step 4: Login to Apify

### Interactive Login (Easiest)

```bash
apify login
```

When prompted, paste your API token from Step 1.

**Success message**: "You are logged in to Apify as [your-username]"

### Alternative: Environment Variable

```bash
export APIFY_TOKEN="apify_api_xxxxxxxxxxxxx"
```

---

## Step 5: Deploy to Apify Platform

```bash
# Make sure you're in the stockx-scraper directory
pwd
# Should show: .../apify-actor/stockx-scraper

# Deploy the actor (this pushes code to Apify)
apify push

# What happens:
# 1. Uploads code to Apify
# 2. Builds Docker image
# 3. Runs validation
# 4. Makes actor available in your account
```

**Expected output**:
```
Uploading actor code...
Building Docker image...
Build successful!
Actor "stockx-scraper" was deployed.
View it at: https://console.apify.com/actors/[your-username]~stockx-scraper
```

**⏱️ Time**: 2-5 minutes (first time, due to Docker build)

---

## Step 6: Run First Test (Console UI - Easiest)

### Via Apify Console

1. **Open the link** from Step 5 output
   - Or go to: https://console.apify.com/actors
   - Click on **stockx-scraper**

2. **Start a test run**:
   - Click green **"Start"** button
   - Input configuration will appear

3. **Use this test input**:
```json
{
  "startUrls": [
    { "url": "https://stockx.com/search?s=jordan" }
  ],
  "maxResults": 10,
  "extractPricing": false,
  "debugMode": false,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

4. **Click "Start"**

5. **Monitor the run**:
   - Watch **Log** tab for progress
   - Check **Dataset** tab for scraped data
   - View **Statistics** for performance metrics

**⏱️ Expected runtime**: 2-5 minutes for 10 products

---

## Step 7: Run Test via CLI (Alternative)

```bash
# Run the deployed actor
apify call [your-username]/stockx-scraper --input '{"startUrls":[{"url":"https://stockx.com/search?s=jordan"}],"maxResults":10,"proxyConfiguration":{"useApifyProxy":true,"apifyProxyGroups":["RESIDENTIAL"]}}'

# Or use the test input file
apify call [your-username]/stockx-scraper --input-file .actor/INPUT.test.json
```

---

## Step 8: Verify Results

### What to Check

1. **Run Status**:
   - Go to: https://console.apify.com/actors/runs
   - Status should be: **SUCCEEDED** ✅
   - If **FAILED** ❌: Check logs

2. **Dataset**:
   - Click on the run
   - Go to **Dataset** tab
   - Should see 10 products
   - **Preview** button shows formatted data

3. **Data Quality**:
   Check that each product has:
   - ✅ `id` (string)
   - ✅ `url` (valid StockX URL)
   - ✅ `title` (product name)
   - ✅ `brand` (e.g., "Jordan")
   - ✅ `price` (number or null)
   - ✅ `sku` (style ID)
   - ✅ `image` (image URL)
   - ✅ `scrapedAt` (timestamp)

4. **Performance**:
   - **Runtime**: Should be 2-5 minutes for 10 products
   - **Cost**: Should be $0.10-0.20 (check Usage tab)
   - **Success rate**: Should be 85-95% with residential proxies

5. **Logs**:
   Look for these key messages:
   ```
   INFO  StockX Scraper starting...
   INFO  Processing: https://stockx.com/...
   INFO  Found X products on page
   INFO  Progress: 10/10 products scraped
   INFO  StockX scraping completed
   ```

---

## Step 9: Export Data (Optional)

### From Console UI

1. Go to run → **Dataset** tab
2. Click **Export** button
3. Choose format:
   - JSON (for APIs)
   - CSV (for Excel)
   - Excel (XLSX)
   - HTML (for viewing)

### Via CLI

```bash
# Get latest run ID
apify runs ls

# Download dataset
apify download dataset <run-id>

# Will create: apify_storage/datasets/default/
```

---

## Step 10: Run Larger Tests

Once the initial test succeeds, try larger runs:

### Test 2: 50 Products (Pagination Test)
```json
{
  "startUrls": [
    { "url": "https://stockx.com/search?s=jordan" }
  ],
  "maxResults": 50,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```
**Expected**: 5-10 minutes, $0.50-1.00

### Test 3: With Pricing (Slower)
```json
{
  "startUrls": [
    { "url": "https://stockx.com/air-jordan-1-retro-high-og-university-blue" }
  ],
  "maxResults": 5,
  "extractPricing": true,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```
**Expected**: Fields `lowestAsk` and `highestBid` populated

---

## Troubleshooting

### Issue: "Actor build failed"

**Check**:
- All dependencies in `package.json`
- Dockerfile syntax correct
- No syntax errors in `main.js`

**Fix**: Run `npm install` locally first to catch errors

### Issue: "All requests failed"

**Possible causes**:
- ❌ No proxies configured
- ❌ Datacenter proxies (need residential)
- ❌ Rate limiting

**Fix**:
```json
"proxyConfiguration": {
  "useApifyProxy": true,
  "apifyProxyGroups": ["RESIDENTIAL"]
}
```

### Issue: "Cloudflare challenge detected"

**This is normal!** The scraper logs it and waits.

**Check logs for**:
```
WARN  Cloudflare challenge detected, waiting...
```

If it fails after waiting, increase wait time in code.

### Issue: "No products found"

**Check**:
- URL is correct and accessible
- StockX hasn't changed their page structure
- Debug mode: Set `"debugMode": true` for detailed logs

### Issue: "Cost too high"

**Optimize**:
- Reduce `maxResults`
- Disable `extractPricing` (3-5x faster)
- Use datacenter proxies for testing (cheaper, less reliable)
- Lower `maxConcurrency` in code

---

## Cost Estimates

Based on residential proxies + platform usage:

| Products | Estimated Cost | Runtime |
|----------|---------------|---------|
| 10       | $0.10-0.20    | 2-5 min |
| 50       | $0.50-1.00    | 5-10 min |
| 100      | $1.00-1.50    | 10-15 min |
| 500      | $3-5          | 45-60 min |
| 1000     | $5-8          | 90-120 min |

**Free tier**: Apify provides $5 free monthly credit (covers ~50-100 products)

---

## Success Checklist

Before considering the actor "production-ready":

- [ ] Deploys without errors (`apify push` succeeds)
- [ ] Test run completes successfully
- [ ] Dataset contains expected number of products
- [ ] All required fields populated
- [ ] No duplicate URLs in output
- [ ] Success rate > 80%
- [ ] Costs within expected range
- [ ] Logs show no critical errors
- [ ] Works with residential proxies

**If all checked**: ✅ Actor is production-ready!

---

## Next Steps After Successful Test

### Option 1: Keep Private (Your Use Only)
- Use as-is for your scraping needs
- Run via Console or API calls
- You pay for all usage

### Option 2: Share with Team (Unlisted)
1. Go to Actor → **Settings** → **Access Rights**
2. Change to **Unlisted**
3. Share the actor URL with team members

### Option 3: Publish to Store (Monetization)
1. Complete all tests from `TEST_SPECIFICATION.md`
2. Update README with comprehensive documentation
3. Set pricing model (Pay Per Result recommended)
4. Submit for Store review
5. Earn 80% of revenue

---

## Quick Commands Reference

```bash
# Login
apify login

# Deploy
apify push

# Run latest version
apify call [username]/stockx-scraper

# View runs
apify runs ls

# View logs
apify log <run-id>

# Download results
apify download dataset <run-id>

# Update code
# 1. Make changes
# 2. apify push
# 3. Test again
```

---

## Support

### Apify Resources
- Documentation: https://docs.apify.com
- Discord: https://discord.com/invite/jyEM2PRvMU
- Support: support@apify.com

### Actor-Specific
- Check `TEST_SPECIFICATION.md` for detailed test cases
- Check `TESTING_CHECKLIST.md` for quick validation
- Review logs for specific error messages

---

## Video Tutorial (Recommended)

Apify provides video tutorials:
- Creating Actors: https://docs.apify.com/academy/getting-started
- CLI Usage: https://docs.apify.com/cli
- Testing Guide: https://docs.apify.com/platform/actors/running

---

**Last Updated**: 2025-11-01
**Actor Version**: 1.0
**Tested**: Local ✅ | Platform ⏳
