import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/Users/riyaghosh/V3/transform/recon/full-qa';

async function quickAudit(url, envName) {
  console.log(`\n========== Quick QA: ${envName} ==========`);
  console.log(`URL: ${url}`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const allErrors = [];
  const allRequests = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      allErrors.push(msg.text());
    }
  });
  
  page.on('response', resp => {
    allRequests.push({ url: resp.url(), status: resp.status() });
  });
  
  // Test 1: Load at 1440
  console.log('Loading homepage...');
  await page.setViewportSize({ width: 1440, height: 900 });
  const startTime = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const loadTime = Date.now() - startTime;
  
  // Wait for fonts
  try {
    await page.evaluate(() => document.fonts.ready, { timeout: 5000 });
  } catch (e) {
    console.log('Font load timeout (expected)');
  }
  
  console.log(`Page loaded in ${loadTime}ms`);
  
  // Get page title and H1
  const title = await page.title();
  const h1 = await page.textContent('h1.white-text.hero-home');
  
  console.log(`Title: ${title.substring(0, 60)}...`);
  console.log(`H1 found: ${!!h1}`);
  
  // Check sections
  const sectionCount = await page.evaluate(() => {
    const selectors = ['.nav-menu', '.hero.home', '.client-logos', '.stats', '.testimonials', 
                       '.how-it-works', '.white-section', '.stacking-cards-section', 
                       '.half-split-wrap', '.row-tabs-section', '.split-cards-section',
                       '.specialty-section', '.integration-section', '.secure-section', 
                       '.cta-section', '.footer'];
    return selectors.filter(sel => document.querySelector(sel)).length;
  });
  
  console.log(`Sections found: ${sectionCount}/17`);
  
  // Check errors
  console.log(`Console errors: ${allErrors.length}`);
  if (allErrors.length > 0) {
    allErrors.slice(0, 3).forEach(e => console.log(`  - ${e.substring(0, 100)}`));
  }
  
  // Check external requests
  const externalRequests = allRequests.filter(r => 
    !r.url.includes('localhost') && !r.url.includes('127.0.0.1') && 
    !r.url.includes('data:') && !r.url.includes('blob:')
  );
  
  const badRequests = externalRequests.filter(r => r.status >= 400);
  console.log(`External requests: ${externalRequests.length}`);
  console.log(`Bad external requests: ${badRequests.length}`);
  
  if (badRequests.length > 0) {
    badRequests.slice(0, 3).forEach(r => console.log(`  - ${r.url.substring(0, 100)} (${r.status})`));
  }
  
  // Test hero CTA
  console.log('\nTesting interactions...');
  const heroCTA = await page.$('a.hero-cta-link.get-a-call');
  if (heroCTA) {
    await heroCTA.click();
    await page.waitForTimeout(600);
    
    const modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('.modal-wrap');
      return modal && window.getComputedStyle(modal).display !== 'none';
    });
    
    console.log(`Hero CTA opens modal: ${modalVisible}`);
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }
  
  // Test YouTube facade
  const yt = await page.$('figure.yt-facade');
  if (yt) {
    const visible = await page.isVisible('figure.yt-facade');
    console.log(`YouTube facade visible: ${visible}`);
  }
  
  // Test links
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map(a => ({
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel') || ''
    }));
  });
  
  console.log(`Total links: ${links.length}`);
  
  const result = {
    environment: envName,
    url,
    title: title.includes('Transform9') && title.includes('Custom AI Agent'),
    h1Present: !!h1,
    sectionsFound: sectionCount,
    consoleErrors: allErrors.length,
    externalRequests: externalRequests.length,
    badRequests: badRequests.length,
    totalRequests: allRequests.length,
    linksFound: links.length,
    loadTimeMs: loadTime
  };
  
  await browser.close();
  return result;
}

async function main() {
  const results = [];
  
  results.push(await quickAudit('http://127.0.0.1:5179/', 'DEV'));
  results.push(await quickAudit('http://127.0.0.1:5180/', 'PROD'));
  
  console.log('\n========== SUMMARY ==========');
  results.forEach(r => {
    console.log(`\n${r.environment}:`);
    console.log(`  Title OK: ${r.title}`);
    console.log(`  H1 Present: ${r.h1Present}`);
    console.log(`  Sections: ${r.sectionsFound}/17`);
    console.log(`  Console errors: ${r.consoleErrors}`);
    console.log(`  External requests: ${r.externalRequests}`);
    console.log(`  Bad requests: ${r.badRequests}`);
    console.log(`  Load time: ${r.loadTimeMs}ms`);
  });
  
  // Write report
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'quick-audit.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✓ Quick audit complete');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
