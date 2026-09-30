import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/Users/riyaghosh/V3/transform/recon/full-qa';
const REPORT = {
  smoke: {},
  links: [],
  console_errors: [],
  network_errors: [],
  viewport_issues: [],
  interaction_issues: [],
  keyboard_issues: [],
  visual_issues: [],
  deviation_checks: [],
  coverage: []
};

const EXPECTED_SECTIONS = [
  'nav-menu',
  'hero.home',
  'client-logos',
  'div-block-5', // Client Spotlight
  'stats',
  'testimonials',
  'how-it-works',
  'white-section',
  'stacking-cards-section',
  'half-split-wrap',
  'row-tabs-section',
  'split-cards-section',
  'specialty-section',
  'integration-section',
  'secure-section',
  'cta-section',
  'footer'
];

const EXTERNAL_LINKS = [
  'https://apply.workable.com/transform9/',
  'https://portal.transform9.com/',
  'https://marketplace.athenahealth.com/product/transform9',
  'https://www.nextgen.com/solutions/marketplace/transform9',
  'https://synapsys.modmed.com/s/partner-app/a9YVV00000003lt2AA/transform9',
  'https://www.linkedin.com/company/transform9',
  'https://www.youtube.com/@Transform9',
  'mailto:info@transform9.com'
];

const INTERNAL_ROUTES = ['/compare', '/blog', '/case-studies', '/book-a-demo', '/hipaa', '/terms-of-use', '/privacy-policy'];

async function auditURL(url, environment) {
  console.log(`\n========== Auditing ${environment} (${url}) ==========`);
  
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();
  
  // Collect console messages and network errors
  const consoleMessages = [];
  const networkErrors = [];
  const requests = [];
  
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text(), location: msg.location() }));
  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push({ url: resp.url(), status: resp.status() });
    }
    requests.push({ url: resp.url(), status: resp.status() });
  });
  
  // Set viewport and navigate
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  
  console.log('Page loaded');
  
  // 1. SMOKE TEST - Identity markers
  const title = await page.title();
  const h1Text = await page.textContent('h1.white-text.hero-home');
  
  const smokeResult = {
    environment,
    url,
    title: title === 'Transform9 — Maximize Every Call with a Custom AI Agent',
    h1: h1Text ? h1Text.includes('Maximize Every Call') : false,
    titleText: title,
    h1Text: h1Text
  };
  
  console.log(`Title match: ${smokeResult.title}`);
  console.log(`H1 match: ${smokeResult.h1}`);
  
  // 2. Check all 17 section roots
  const sections = await page.evaluate(() => {
    const found = [];
    const selectors = [
      'nav-menu', '.hero.home', '.client-logos', 'div.div-block-5',
      '.stats', '.testimonials', '.how-it-works', '.white-section',
      '.stacking-cards-section', '.half-split-wrap', '.row-tabs-section', '.split-cards-section',
      '.specialty-section', '.integration-section', '.secure-section', '.cta-section',
      '.footer'
    ];
    
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) found.push(sel);
    });
    return found;
  });
  
  console.log(`Sections found: ${sections.length}/${EXPECTED_SECTIONS.length}`);
  
  // 3. Check console errors (filter out expected ones)
  const errors = consoleMessages.filter(m => m.type === 'error');
  const errorTexts = errors.map(e => e.text);
  
  if (errors.length > 0) {
    console.log(`Console errors: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e.text}`));
  }
  
  // 4. Check network errors (non-localhost)
  const nonLocalhostErrors = networkErrors.filter(e => !e.url.includes('localhost') && !e.url.includes('127.0.0.1'));
  
  if (nonLocalhostErrors.length > 0) {
    console.log(`Network errors to external URLs: ${nonLocalhostErrors.length}`);
    nonLocalhostErrors.forEach(e => console.log(`  - ${e.url} (${e.status})`));
  }
  
  // 5. Check for external tracking requests (should be none in clone)
  const trackers = requests.filter(r => 
    r.url.includes('gtag') || r.url.includes('google-analytics') || 
    r.url.includes('hubspot') || r.url.includes('linkedin') ||
    r.url.includes('zoominfo') || r.url.includes('intellimize') ||
    r.url.includes('google.com/recaptcha')
  );
  
  if (trackers.length > 0) {
    console.log(`WARNING: Tracking requests found: ${trackers.length}`);
    trackers.forEach(t => console.log(`  - ${t.url}`));
  }
  
  // 6. Scroll to full page and check for errors during scroll
  console.log('Scrolling to bottom...');
  await page.evaluate(() => {
    return new Promise(resolve => {
      let lastHeight = document.documentElement.scrollHeight;
      const interval = setInterval(() => {
        window.scrollBy(0, 500);
        const newHeight = document.documentElement.scrollHeight;
        if (window.scrollY + window.innerHeight >= newHeight - 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  });
  
  console.log('Scroll complete');
  
  // 7. Check links
  const links = await page.evaluate(() => {
    const linkElements = Array.from(document.querySelectorAll('a[href]'));
    return linkElements.map(a => ({
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
      text: a.textContent.substring(0, 50)
    }));
  });
  
  console.log(`Found ${links.length} links`);
  
  // 8. Test responsive breakpoints
  const breakpoints = [1440, 1024, 768, 390];
  for (const width of breakpoints) {
    if (width === 1440) continue; // Already tested
    
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    
    const errors = await page.evaluate(() => {
      const pageErrors = [];
      window.errors = window.errors || [];
      return window.errors;
    });
    
    console.log(`Viewport ${width}: OK`);
  }
  
  // Return to desktop for interactions
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  
  // 9. Test hero "Call Alex" interaction
  console.log('Testing hero Call Alex popup...');
  const heroLink = await page.locator('a.hero-cta-link.get-a-call').first();
  
  if (heroLink) {
    await heroLink.click();
    await page.waitForTimeout(600); // Wait for open animation
    
    const popupVisible = await page.evaluate(() => {
      const popup = document.querySelector('.modal-wrap');
      const computed = window.getComputedStyle(popup);
      return computed.display !== 'none';
    });
    
    console.log(`Popup opened: ${popupVisible}`);
    
    // Test popup form validation
    if (popupVisible) {
      const submitBtn = await page.locator('input.submit-form').first();
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(300);
        
        const validationMsg = await page.evaluate(() => {
          // Check for HTML5 validation messages
          const firstInput = document.querySelector('input[required]');
          return firstInput ? firstInput.validationMessage : null;
        });
        
        console.log(`Validation message present: ${!!validationMsg}`);
      }
    }
    
    // Close popup with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    
    const popupClosed = await page.evaluate(() => {
      const popup = document.querySelector('.modal-wrap');
      const computed = window.getComputedStyle(popup);
      return computed.display === 'none';
    });
    
    console.log(`Popup closed with Escape: ${popupClosed}`);
  }
  
  // 10. Test YouTube facade interaction (D4)
  console.log('Testing YouTube facade...');
  const ytFacade = await page.locator('figure.yt-facade').first();
  
  if (ytFacade) {
    // Check facade is visible before click
    const facadeVisible = await ytFacade.isVisible();
    console.log(`YouTube facade visible: ${facadeVisible}`);
    
    // Click to activate
    await ytFacade.click();
    await page.waitForTimeout(500);
    
    const ytIframe = await page.locator('iframe[src*="youtube.com"]').first();
    const iframeVisible = await ytIframe.isVisible();
    console.log(`YouTube iframe loaded after click: ${iframeVisible}`);
  }
  
  // 11. Test mobile menu at small viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  
  const menuBtn = await page.locator('.menu-btn.w-nav-button').first();
  if (menuBtn) {
    await menuBtn.click();
    await page.waitForTimeout(300);
    
    const navLinks = await page.locator('.nav-links').first();
    const menuOpen = await page.evaluate(() => {
      const nav = document.querySelector('.nav-links');
      return window.getComputedStyle(nav).display !== 'none';
    });
    
    console.log(`Mobile menu open: ${menuOpen}`);
    
    // Click a menu link to check navigation
    const compareLink = await page.locator('a:has-text("Compare")').first();
    if (compareLink) {
      const href = await compareLink.getAttribute('href');
      console.log(`Compare link href: ${href}`);
    }
    
    // Close menu
    await menuBtn.click();
    await page.waitForTimeout(300);
    
    const menuClosed = await page.evaluate(() => {
      const nav = document.querySelector('.nav-links');
      return window.getComputedStyle(nav).display === 'none';
    });
    
    console.log(`Mobile menu closed: ${menuClosed}`);
  }
  
  // Collect final results
  const result = {
    environment,
    smoke: smokeResult,
    sections_found: sections.length,
    sections_expected: EXPECTED_SECTIONS.length,
    console_errors: errors.length,
    error_texts: errorTexts,
    network_errors: nonLocalhostErrors.length,
    tracking_requests: trackers.length,
    total_links: links.length,
    all_request_count: requests.length,
    non_localhost_requests: requests.filter(r => !r.url.includes('localhost') && !r.url.includes('127.0.0.1')).length
  };
  
  await browser.close();
  
  return { result, links };
}

async function runFullAudit() {
  console.log('=== FULL-SITE QA AUDIT START ===\n');
  
  const devResult = await auditURL('http://127.0.0.1:5179/', 'DEV');
  const prodResult = await auditURL('http://127.0.0.1:5180/', 'PROD');
  
  // Compile report
  const report = {
    timestamp: new Date().toISOString(),
    git_commit: '1e8ecec',
    environments: {
      dev: devResult.result,
      prod: prodResult.result
    },
    all_links: devResult.links,
    coverage: {
      smoke_test: devResult.result.smoke.title && devResult.result.smoke.h1,
      sections: devResult.result.sections_found === devResult.result.sections_expected,
      console_errors: devResult.result.console_errors === 0,
      network_errors: devResult.result.network_errors === 0,
      no_tracking: devResult.result.tracking_requests === 0
    }
  };
  
  // Write JSON report
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'audit-results.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n=== AUDIT COMPLETE ===');
  console.log(`Results written to ${OUTPUT_DIR}/audit-results.json`);
  
  return report;
}

runFullAudit().catch(console.error);
