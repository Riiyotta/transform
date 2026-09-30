import { chromium } from 'playwright';
import fs from 'fs';

async function minimalQA() {
  const results = [];
  
  for (const [env, url] of [['DEV', 'http://127.0.0.1:5179'], ['PROD', 'http://127.0.0.1:5180']]) {
    console.log(`\nTesting ${env}: ${url}`);
    
    const browser = await chromium.launch({ headless: true, args: ['--disable-web-resources'] });
    const page = await browser.newPage();
    
    const errors = [];
    const requests = [];
    
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    page.on('response', r => requests.push({url: r.url(), status: r.status()}));
    
    // Load page
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 20000}).catch(() => {});
    
    // Basic checks
    const title = await page.title().catch(() => '');
    const h1 = await page.textContent('h1').catch(() => '');
    
    const sectionCount = await page.evaluate(() => {
      const sels = ['.nav-menu', '.hero.home', '.client-logos', '.stats', '.testimonials', 
                    '.how-it-works', '.white-section', '.stacking-cards-section', '.half-split-wrap',
                    '.row-tabs-section', '.split-cards-section', '.specialty-section', 
                    '.integration-section', '.secure-section', '.cta-section', '.footer', '.modal-wrap'];
      return sels.filter(s => document.querySelector(s)).length;
    }).catch(() => 0);
    
    const externalReqs = requests.filter(r => 
      !r.url.includes('localhost') && !r.url.includes('127.0.0.1') && 
      !r.url.includes('data:') && !r.url.includes('blob:')
    );
    
    results.push({
      env,
      title: title.substring(0,80),
      h1: h1.substring(0,80),
      sections: sectionCount,
      consoleErrors: errors.length,
      externalRequests: externalReqs.length,
      badRequests: externalReqs.filter(r => r.status >= 400).length
    });
    
    await browser.close();
  }
  
  console.log('\n=== RESULTS ===');
  results.forEach(r => {
    console.log(`${r.env}: title=${r.title}, h1=${r.h1}, sections=${r.sections}, errors=${r.consoleErrors}, external=${r.externalRequests}, bad=${r.badRequests}`);
  });
  
  fs.writeFileSync('/Users/riyaghosh/V3/transform/recon/full-qa/minimal-results.json', JSON.stringify(results, null, 2));
}

minimalQA().catch(e => console.error(e.message));
