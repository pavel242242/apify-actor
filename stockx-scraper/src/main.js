import { Actor } from 'apify';
import { PlaywrightCrawler, log } from 'crawlee';
import playwright from 'playwright';
import * as cheerio from 'cheerio';

// Initialize the Apify Actor
await Actor.init();

// Get input from Actor
const input = await Actor.getInput() || {};
const {
    startUrls = [],
    maxResults = 100,
    extractPricing = false,
    proxyConfiguration,
    debugMode = false
} = input;

// Input validation
if (!startUrls || startUrls.length === 0) {
    throw new Error('At least one start URL is required in the input');
}

if (debugMode) {
    // Set debug level via environment variable before Actor.init()
    // For runtime, use: process.env.APIFY_LOG_LEVEL = 'DEBUG'
}

log.info('StockX Scraper starting...', {
    startUrls: startUrls.length,
    maxResults,
    extractPricing
});

// Create proxy configuration
const proxyConfig = await Actor.createProxyConfiguration(proxyConfiguration);

// Track scraped products
let scrapedCount = 0;

// Create Playwright crawler
const crawler = new PlaywrightCrawler({
    proxyConfiguration: proxyConfig,
    maxConcurrency: 3, // Conservative for StockX
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 180,

    // Session management for behavioral consistency
    useSessionPool: true,
    sessionPoolOptions: {
        maxPoolSize: 100,
        sessionOptions: {
            maxAgeSecs: 3600,
            maxUsageCount: 50
        }
    },

    launchContext: {
        launcher: playwright.chromium,
        launchOptions: {
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }
    },

    // Stealth configuration - critical for Cloudflare bypass
    preNavigationHooks: [async ({ page, log }) => {
        // Remove webdriver detection
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false
            });

            // Fix Chrome object
            window.chrome = {
                runtime: {}
            };

            // Randomize plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
        });

        // Set realistic headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        if (debugMode) {
            log.debug('Applied stealth patches and headers');
        }
    }],

    async requestHandler({ request, page, log, enqueueLinks }) {
        // Check if we've reached max results
        if (scrapedCount >= maxResults) {
            log.info('Reached maxResults limit, stopping');
            return;
        }

        log.info(`Processing: ${request.url}`);

        // Random delay to mimic human behavior
        await page.waitForTimeout(randomInt(2000, 5000));

        // Check for Cloudflare challenge
        try {
            const isChallenged = await page.$('iframe[src*="cloudflare"]');
            if (isChallenged) {
                log.warning('Cloudflare challenge detected, waiting...');
                await page.waitForTimeout(10000);
            }
        } catch (e) {
            if (debugMode) {
                log.debug('No Cloudflare challenge detected');
            }
        }

        // Get page HTML for Cheerio extraction
        const html = await page.content();

        // Extract products from hidden JSON (fast method)
        const products = parseStockXHiddenData(html, log, debugMode);

        if (!products || products.length === 0) {
            log.warning('No products found on page');
            return;
        }

        log.info(`Found ${products.length} products on page`);

        // Process each product
        for (const product of products) {
            if (scrapedCount >= maxResults) {
                break;
            }

            const productData = {
                id: product.id,
                url: product.url || `https://stockx.com/${product.urlKey}`,
                title: product.title,
                brand: product.brand,
                sku: product.styleId,
                price: product.retailPrice,
                description: product.description,
                category: product.productCategory,
                image: product.media?.imageUrl || product.image,
                scrapedAt: new Date().toISOString()
            };

            // Extract real-time pricing if enabled (slower)
            if (extractPricing && product.urlKey) {
                try {
                    await page.goto(`https://stockx.com/${product.urlKey}`);
                    await page.waitForTimeout(randomInt(2000, 4000));

                    // Wait for pricing elements
                    await page.waitForSelector('[data-testid="trade-box-buy-amount"]', {
                        timeout: 10000
                    }).catch(() => null);

                    // Extract lowest ask
                    const lowestAsk = await page.$eval(
                        '[data-testid="trade-box-buy-amount"]',
                        el => el.textContent
                    ).catch(() => null);

                    // Extract highest bid
                    const highestBid = await page.$eval(
                        '[data-testid="trade-box-sell-amount"]',
                        el => el.textContent
                    ).catch(() => null);

                    if (lowestAsk) {
                        productData.lowestAsk = parseFloat(lowestAsk.replace(/[^0-9.]/g, ''));
                    }

                    if (highestBid) {
                        productData.highestBid = parseFloat(highestBid.replace(/[^0-9.]/g, ''));
                    }

                    if (debugMode) {
                        log.debug(`Extracted pricing for ${product.title}`, {
                            lowestAsk: productData.lowestAsk,
                            highestBid: productData.highestBid
                        });
                    }
                } catch (error) {
                    log.warning(`Failed to extract pricing for ${product.title}: ${error.message}`);
                }
            }

            // Push data to dataset
            await Actor.pushData(productData);
            scrapedCount++;

            if (scrapedCount % 10 === 0) {
                log.info(`Progress: ${scrapedCount}/${maxResults} products scraped`);
            }
        }

        // Handle pagination if we haven't reached max results
        if (scrapedCount < maxResults && products.length >= 36) {
            const currentUrl = new URL(request.url);
            const currentPage = parseInt(currentUrl.searchParams.get('page') || '1');
            currentUrl.searchParams.set('page', currentPage + 1);

            log.info(`Enqueueing next page: ${currentPage + 1}`);

            await crawler.addRequests([{
                url: currentUrl.toString(),
                userData: { pageNumber: currentPage + 1 }
            }]);

            // Delay between pages
            await page.waitForTimeout(randomInt(3000, 6000));
        }
    },

    async failedRequestHandler({ request, log }, error) {
        log.error(`Request ${request.url} failed: ${error.message}`);
    }
});

// Run the crawler
await crawler.run(startUrls);

// Log final stats
log.info('StockX scraping completed', {
    totalScraped: scrapedCount,
    maxResults
});

await Actor.exit('StockX scraping completed successfully');

/**
 * Parse hidden Next.js data from StockX HTML
 * @param {string} html - Page HTML
 * @param {object} log - Logger instance
 * @param {boolean} debug - Debug mode
 * @returns {Array} - Array of product objects
 */
function parseStockXHiddenData(html, log, debug) {
    try {
        const $ = cheerio.load(html);

        // Try primary selector
        let scriptData = $('#__NEXT_DATA__').html();

        // Fallback to alternative selector
        if (!scriptData) {
            const scriptTag = $('script[data-name="query"]').html();
            if (scriptTag) {
                scriptData = scriptTag.split('=', 2)[1].trim().replace(/;$/, '');
            }
        }

        if (!scriptData) {
            log.warning('No __NEXT_DATA__ found on page');
            return [];
        }

        const data = JSON.parse(scriptData);

        if (debug) {
            log.debug('Parsed __NEXT_DATA__ successfully');
        }

        // Navigate nested structure to find products
        const products = findNestedProducts(data);

        return products;
    } catch (error) {
        log.error(`Failed to parse hidden data: ${error.message}`);
        return [];
    }
}

/**
 * Recursively search for product arrays in nested JSON
 * @param {object} obj - Object to search
 * @param {number} depth - Current depth
 * @param {number} maxDepth - Maximum depth to search
 * @returns {Array} - Array of products
 */
function findNestedProducts(obj, depth = 0, maxDepth = 10) {
    if (depth > maxDepth) {
        return [];
    }

    // Check if this is an array of products
    if (Array.isArray(obj)) {
        // Look for product-like objects
        for (const item of obj) {
            if (item && typeof item === 'object' && item.urlKey && item.title) {
                return obj; // Found products array
            }
        }

        // Recursively search array items
        for (const item of obj) {
            const found = findNestedProducts(item, depth + 1, maxDepth);
            if (found.length > 0) return found;
        }
    }

    // Search object properties
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const found = findNestedProducts(obj[key], depth + 1, maxDepth);
            if (found.length > 0) return found;
        }
    }

    return [];
}

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
