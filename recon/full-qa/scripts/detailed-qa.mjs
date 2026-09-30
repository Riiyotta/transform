import { chromium } from 'playwright';
import fs from 'fs';

const findings = {
  interactions: [],
  deviations: [],
  issues: []
};

async function detailedAudit(url, env) {
  console.log(`\n=== DETAILED ${env} TEST ===`);
  
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  
  // Test 1: In-page anchors
  console.log('Testing in-page anchors...');
  const anchors = ['products', 'testimonials', 'specialties', 'integrations', 'security'];
  for (const anchor of anchors) {
    const link = await page.$(`a[href="#${anchor}"]`);
    if (link) {
      await link.click();
      await page.waitForTimeout(500);
      
      const section = await page.$(`section[id="${anchor}"], div[id="${anchor}"]`);
      if (section) {
        const scrolledTo = await page.evaluate((id) => {
          const el = document.querySelector(`[id="${id}"]`);
          const rect = el.getBoundingClientRect();
          return rect.top < 200 && rect.top > -200;
        }, anchor);
        
        console.log(`  #${anchor}: ${scrolledTo ? '✓' : '✗'}`);
        findings.interactions.push({type: 'anchor', anchor, works: scrolledTo});
      }
    }
  }
  
  // Test 2: Stats hover
  console.log('Testing stats hover...');
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  const statsBlock = await page.$('.stats-block');
  if (statsBlock) {
    await statsBlock.hover();
    await page.waitForTimeout(300);
    
    const flexBasis = await page.evaluate(() => {
      const block = document.querySelector('.stats-block');
      return window.getComputedStyle(block).flexBasis;
    });
    
    // On hover at 1440, should be ~100% width (or much larger than 16%)
    const isExpanded = flexBasis.includes('100') || parseInt(flexBasis) > 200;
    console.log(`  Stats hover works: ${isExpanded}`);
    findings.interactions.push({type: 'stats', hover_expands: isExpanded});
  }
  
  // Test 3: Testimonial arrows
  console.log('Testing testimonial navigation...');
  const arrow = await page.$('.test-arrow-wrap.right');
  if (arrow) {
    await arrow.click();
    await page.waitForTimeout(600);
    
    const slide2 = await page.evaluate(() => {
      const slides = document.querySelectorAll('.testim-slide-wrap');
      if (slides.length > 1) {
        const opacity = window.getComputedStyle(slides[1]).opacity;
        return opacity > 0.5;
      }
      return false;
    });
    
    console.log(`  Testimonial slide advances: ${slide2}`);
    findings.interactions.push({type: 'testimonials', arrow_advances: slide2});
  }
  
  // Test 4: Nav hover text
  console.log('Testing nav link hover...');
  const navLink = await page.$('a.nav-link-block:not(.cta)');
  if (navLink) {
    await navLink.hover();
    await page.waitForTimeout(300);
    
    const textMoved = await page.evaluate(() => {
      const wrap = document.querySelector('.nav-text-wrap');
      if (!wrap) return false;
      const texts = wrap.querySelectorAll('.nav-text');
      if (texts.length < 2) return false;
      const y0 = texts[0].getBoundingClientRect().y;
      const y1 = texts[1].getBoundingClientRect().y;
      return Math.abs(y0 - y1) < 20; // Moved together
    });
    
    console.log(`  Nav text hover works: ${textMoved}`);
    findings.interactions.push({type: 'nav', text_hover: textMoved});
  }
  
  // Test 5: Specialty/Navigator tab clicks
  console.log('Testing tab interactions...');
  const specialtyTab = await page.$('.specialty-tab-link');
  if (specialtyTab) {
    const initialText = await page.textContent('.specialty-tabs-content');
    
    // Find second tab
    const tabs = await page.$$('.specialty-tab-link');
    if (tabs.length > 1) {
      await tabs[1].click();
      await page.waitForTimeout(200);
      
      const newText = await page.textContent('.specialty-tabs-content');
      console.log(`  Specialty tab changes content: ${initialText !== newText}`);
      findings.interactions.push({type: 'specialty_tabs', content_changes: initialText !== newText});
    }
  }
  
  // Test 6: Phone input sync (D2)
  console.log('Testing phone input sync (D2)...');
  const phoneInputs = await page.$$('input[type="tel"]');
  if (phoneInputs.length >= 2) {
    // Type in first input
    await phoneInputs[0].fill('1234567890');
    await page.waitForTimeout(100);
    
    // Check if synced to second
    const val1 = await phoneInputs[0].inputValue();
    const val2 = await phoneInputs[1].inputValue();
    
    const synced = val1 === val2;
    console.log(`  Phone inputs synced: ${synced}`);
    findings.deviations.push({id: 'D2', check: 'phone_sync', result: synced});
  }
  
  // Test 7: reCAPTCHA spacer (D3)
  console.log('Testing reCAPTCHA spacer (D3)...');
  const captchaSpan = await page.$('.captcha-popup');
  if (captchaSpan) {
    const rect = await captchaSpan.boundingBox();
    console.log(`  reCAPTCHA spacer: ${rect.width}×${rect.height}px (expected 304×78)`);
    const correctSize = rect.width >= 300 && rect.height >= 75;
    findings.deviations.push({id: 'D3', check: 'spacer_size', result: correctSize, actual: `${rect.width}×${rect.height}`});
  }
  
  // Test 8: Popup focus management (D8)
  console.log('Testing popup focus (D8)...');
  const heroCTA = await page.$('a.hero-cta-link.get-a-call');
  if (heroCTA) {
    // Open popup
    await heroCTA.click();
    await page.waitForTimeout(700);
    
    const focused = await page.evaluate(() => {
      const first = document.querySelector('.modal-window input');
      return document.activeElement === first || document.activeElement.closest('.modal-window');
    });
    
    console.log(`  Focus moves to modal on open: ${focused}`);
    findings.deviations.push({id: 'D8', check: 'focus_management', result: focused});
    
    // Close and check focus returns
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    
    const focusReturned = await page.evaluate(() => {
      return document.activeElement === document.querySelector('a.hero-cta-link.get-a-call') ||
             document.activeElement.closest('.hero-bottom-block');
    });
    
    console.log(`  Focus returns to opener on close: ${focusReturned}`);
  }
  
  // Test 9: Viewport edge cases
  console.log('Testing viewport edge cases...');
  const viewports = [
    {w: 992, h: 900}, {w: 991, h: 900},
    {w: 768, h: 1024}, {w: 767, h: 1024},
    {w: 480, h: 844}, {w: 479, h: 844}
  ];
  
  for (const vp of viewports) {
    await page.setViewportSize({width: vp.w, height: vp.h});
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    
    const errors = await page.evaluate(() => {
      const pageErrors = [];
      if (window.errors) return window.errors.length;
      
      // Check for visible overflow or layout breaks
      const html = document.documentElement;
      if (html.scrollWidth > vp.w + 10) return 1; // Overflow
      return 0;
    });
    
    if (errors === 0) {
      console.log(`  ${vp.w}×${vp.h}: ✓`);
    } else {
      console.log(`  ${vp.w}×${vp.h}: ✗ (errors or overflow)`);
      findings.issues.push({viewport: `${vp.w}×${vp.h}`, issue: 'Layout problem'});
    }
  }
  
  await browser.close();
}

async function main() {
  await detailedAudit('http://127.0.0.1:5179/', 'DEV');
  await detailedAudit('http://127.0.0.1:5180/', 'PROD');
  
  fs.writeFileSync('/Users/riyaghosh/V3/transform/recon/full-qa/detailed-results.json', JSON.stringify(findings, null, 2));
  
  console.log('\n=== DETAILED AUDIT SUMMARY ===');
  console.log(`Interactions tested: ${findings.interactions.length}`);
  console.log(`Deviations verified: ${findings.deviations.length}`);
  console.log(`Issues found: ${findings.issues.length}`);
}

main().catch(console.error);
