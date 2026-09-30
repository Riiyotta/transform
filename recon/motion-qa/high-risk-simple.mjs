import playwright from 'playwright';
import fs from 'fs';

const ORIGINAL = 'https://www.transform9.com/';
const DEV = 'http://127.0.0.1:5179';
const PROD = 'http://127.0.0.1:5180';

const results = {
  timestamp: new Date().toISOString(),
  tests: {}
};

async function testLenisScroll(page) {
  console.log('    - Lenis scroll behavior...');
  
  const scrollPositions = [];
  
  // Start at top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  
  // Scroll down to key positions
  const scrollTargets = [500, 1000, 2000, 3000];
  
  for (const target of scrollTargets) {
    await page.evaluate(t => window.scrollTo(0, t), target);
    await page.waitForTimeout(300);
    
    const measurement = await page.evaluate(() => ({
      scrollY: window.scrollY,
      navOnWhite: document.querySelector('.nav-menu')?.classList.contains('is-on-white'),
      videoOpacity: getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity
    }));
    
    scrollPositions.push(measurement);
  }
  
  return scrollPositions;
}

async function testPopupBasic(page) {
  console.log('    - Popup open/close...');
  
  const openBtn = await page.$('.hero-cta-link.get-a-call');
  if (!openBtn) return { error: 'Open button not found' };
  
  // Open
  await openBtn.click();
  await page.waitForTimeout(600);
  
  const openState = await page.evaluate(() => ({
    display: getComputedStyle(document.querySelector('.modal-wrap')).display,
    opacity: parseFloat(getComputedStyle(document.querySelector('.modal-wrap')).opacity)
  }));
  
  // Close with button
  const closeBtn = await page.$('.close-popup-wrap');
  if (closeBtn) {
    await closeBtn.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(600);
  
  const closeState = await page.evaluate(() => ({
    display: getComputedStyle(document.querySelector('.modal-wrap')).display,
    opacity: parseFloat(getComputedStyle(document.querySelector('.modal-wrap')).opacity)
  }));
  
  return { open: openState, closed: closeState };
}

async function testConsoleErrors(page, url) {
  console.log('    - Console errors...');
  
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  return { errorCount: errors.length, hasErrors: errors.length > 0 };
}

async function testReducedMotion(page, url) {
  console.log('    - Reduced motion support...');
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(500);
  
  const state = await page.evaluate(() => {
    const video = document.querySelector('.bg-video-pixels video');
    const still = document.querySelector('.bg-pic-pixels');
    const marquee = document.querySelector('.logos-wrapper');
    return {
      videoPlaying: video ? !video.paused : null,
      stillVisible: still ? getComputedStyle(still).display !== 'none' : false,
      marqueeAnimating: marquee ? getComputedStyle(marquee).transform !== 'none' : false
    };
  });
  
  return state;
}

async function testProdBuild(page) {
  console.log('    - Production build checks...');
  
  const isReact = await page.evaluate(() => {
    return typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
  });
  
  const hasMotionWindow = await page.evaluate(() => {
    return typeof window.__motion !== 'undefined';
  });
  
  const navElements = await page.evaluate(() => ({
    navMenuExists: !!document.querySelector('.nav-menu'),
    heroExists: !!document.querySelector('.hero'),
    popupExists: !!document.querySelector('.modal-wrap')
  }));
  
  return { isReact, hasMotionWindow, navElements };
}

async function testSite(browser, url, viewport) {
  const page = await browser.newPage({
    viewport: viewport,
    deviceScaleFactor: 1
  });

  try {
    const tests = {};
    
    // Basic page load
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    try { await page.evaluate(() => document.fonts.ready); } catch {}
    await page.waitForTimeout(1000);
    
    // Test console errors
    tests.console = { errorCount: 0 };
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    // Test Lenis scroll
    tests.lenis = await testLenisScroll(page);
    
    // Reload for popup test
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    tests.popup = await testPopupBasic(page);
    
    // Reload for reduced motion
    tests.reduced_motion = await testReducedMotion(page, url);
    
    // Production build checks
    tests.prod_checks = await testProdBuild(page);
    
    return tests;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    const vpName = 'desktop';
    const viewport = { width: 1440, height: 900 };
    
    console.log('High-risk motion tests at 1440×900\n');
    results.tests[vpName] = {};
    
    console.log('Live site...');
    results.tests[vpName].live = await testSite(browser, ORIGINAL, viewport);
    
    console.log('\nDev clone...');
    results.tests[vpName].dev = await testSite(browser, DEV, viewport);
    
    console.log('\nProd clone...');
    results.tests[vpName].prod = await testSite(browser, PROD, viewport);
  } finally {
    await browser.close();
  }

  const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/high-risk-simple.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outFile}`);
}

main().catch(console.error);
