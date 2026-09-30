import playwright from 'playwright';
import fs from 'fs';

const ORIGINAL = 'https://www.transform9.com/';
const DEV = 'http://127.0.0.1:5179';
const PROD = 'http://127.0.0.1:5180';

const results = {
  timestamp: new Date().toISOString(),
  measurements: {}
};

// Helper to measure at specific scroll positions
async function measureAtScroll(page, scrollY, label) {
  await page.evaluate(sy => window.scrollTo(0, sy), scrollY);
  await page.waitForTimeout(300); // Let animations settle

  return await page.evaluate(() => {
    const measures = {};

    // M3: Video opacity as we scroll past hero
    const videoWrapper = document.querySelector('.bg-pixels-wrapper');
    if (videoWrapper) {
      measures.m3_video_opacity = getComputedStyle(videoWrapper).opacity;
    }

    // M4: Nav on-white state
    const nav = document.querySelector('.nav-menu');
    if (nav) {
      measures.m4_nav_on_white = nav.classList.contains('is-on-white');
      const logoWhite = document.querySelector('.logo-white');
      if (logoWhite) {
        measures.m4_logo_white_opacity = getComputedStyle(logoWhite).opacity;
      }
    }

    // M7: How it works colors
    const words = Array.from(document.querySelectorAll('.hiw-text._1, .hiw-text._2, .hiw-text._3'));
    if (words.length > 0) {
      measures.m7_word_colors = words.map((w, i) => ({
        idx: i + 1,
        color: getComputedStyle(w).color,
        class: w.className
      }));
    }

    // M8: Pixel transitions
    const blackToWhitePixels = Array.from(document.querySelectorAll('.transition-cont.black-to-white .pixel'));
    if (blackToWhitePixels.length > 0) {
      const samplePixels = blackToWhitePixels.slice(0, 5);
      measures.m8_black_to_white_opacities = samplePixels.map((p, i) => ({
        idx: i,
        opacity: getComputedStyle(p).opacity
      }));
    }

    // M9: Scheduling card transforms
    const schedCards = Array.from(document.querySelectorAll('.scheduling-card'));
    if (schedCards.length > 0) {
      measures.m9_card_transforms = schedCards.slice(0, 4).map((card, i) => ({
        idx: i + 1,
        transform: getComputedStyle(card).transform,
        backgroundColor: getComputedStyle(card).backgroundColor
      }));
    }

    return measures;
  });
}

async function testSite(browser, url, vpName) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const siteResults = {
      initial: await measureAtScroll(page, 0, 'top'),
      scroll_1000: await measureAtScroll(page, 1000, 'scroll 1000'),
      scroll_2000: await measureAtScroll(page, 2000, 'scroll 2000'),
      scroll_4000: await measureAtScroll(page, 4000, 'scroll 4000'),
      scroll_6000: await measureAtScroll(page, 6000, 'scroll 6000')
    };

    return siteResults;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    console.log('Measuring scroll-based animations at 1440x900...\n');
    
    console.log('Live site...');
    results.measurements.live = await testSite(browser, ORIGINAL, 'desktop');
    
    console.log('Dev clone...');
    results.measurements.dev = await testSite(browser, DEV, 'desktop');
    
    console.log('Prod clone...');
    results.measurements.prod = await testSite(browser, PROD, 'desktop');
  } finally {
    await browser.close();
  }

  const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/scroll-measure.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outFile}`);
}

main().catch(console.error);
