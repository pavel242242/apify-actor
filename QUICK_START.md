# ⚡ Quick Start - Deploy in 5 Minutes

Fastest path to get your StockX scraper running on Apify platform.

## 🎯 Prerequisites
- Apify account (sign up free: https://console.apify.com/sign-up)
- Node.js installed
- This repository cloned locally

## 📋 5-Step Deployment

### 1️⃣ Get API Token (1 min)
```
1. Go to: https://console.apify.com/settings/integrations
2. Copy your Personal API token
3. Save it somewhere safe
```

### 2️⃣ Install CLI (30 sec)
```bash
npm install -g apify-cli
```

### 3️⃣ Login (30 sec)
```bash
apify login
# Paste your token when prompted
```

### 4️⃣ Deploy (2-3 min)
```bash
cd stockx-scraper
npm install
apify push
```

### 5️⃣ Run Test (2-3 min)
```bash
# Click the URL from previous step output
# Or go to: https://console.apify.com/actors

# Click "Start" and paste this input:
```
```json
{
  "startUrls": [{"url": "https://stockx.com/search?s=jordan"}],
  "maxResults": 10,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

## ✅ What Success Looks Like

**After Step 4 (Deploy)**:
```
✔ Uploading code
✔ Building Docker image
✔ Actor deployed successfully

View at: https://console.apify.com/actors/[you]~stockx-scraper
```

**After Step 5 (Run)**:
- Status: **SUCCEEDED** ✅
- Dataset: **10 products**
- Runtime: **2-5 minutes**
- Cost: **~$0.15**

**Dataset Preview**:
```json
{
  "id": "air-jordan-1-retro-high-og-university-blue",
  "url": "https://stockx.com/air-jordan-1-retro-high-og-university-blue",
  "title": "Air Jordan 1 Retro High OG 'University Blue'",
  "brand": "Jordan",
  "sku": "555088-134",
  "price": 180,
  "image": "https://images.stockx.com/...",
  "scrapedAt": "2025-11-01T..."
}
```

## 🔴 Common Issues

**"Not logged in"**
```bash
apify login
```

**"Build failed"**
```bash
# Check you're in stockx-scraper directory
pwd
# Should show: .../stockx-scraper

# Check package.json exists
ls package.json
```

**"All requests failed"**
- Make sure residential proxies enabled:
```json
"proxyConfiguration": {
  "useApifyProxy": true,
  "apifyProxyGroups": ["RESIDENTIAL"]
}
```

## 📚 Need More Help?

- **Full guide**: See `DEPLOYMENT_GUIDE.md`
- **Testing**: See `TESTING_CHECKLIST.md`
- **Validation**: See `TEST_SPECIFICATION.md`
- **Apify docs**: https://docs.apify.com

## 🎉 That's It!

Your actor is:
- ✅ Deployed privately to your account
- ✅ Ready to test with real data
- ✅ Accessible only by you
- ✅ Using residential proxies for best results

**Next**: Run larger tests (50-100 products) to validate pagination!
