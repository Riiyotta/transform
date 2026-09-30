import playwright from 'playwright';
import fs from 'fs';

const ORIGINAL = 'https://www.transform9.com/';
const DEV = 'http://127.0.0.1:5179';
const PROD = 'http://127.0.0.1:5180';

const results = {
  timestamp: new Date().toISOString(),
  tests: {}
};

async function testLenisScroll(page, url, vpName, viewport) {
  // Test real scroll behavior with Lenis
  console.log(`  Testing Lenis scroll at ${vpName}...`);
  
  // Get document height
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  
  // Do a real scroll with mouse wheel simulation
  const scrollPositions = [];
  
  // Start at top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  
  let currentScroll = 0;
  scrollPositions.push({
    scroll: currentScroll,
    timestamp: 0,
    navOnWhite: await page.evaluate(() => document.querySelector('.nav-menu')?.classList.contains('is-on-white')),
    videoOpacity: await page.evaluate(() => getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity)
  });
  
  // Scroll down in steps, measuring at each point
  const scrollTargets = [500, 1000, 2000, 3000, 4000, 5000];
  
  for (const target of scrollTargets) {
    if (target > docHeight - viewport.height) break;
    
    await page.evaluate(t => window.scrollTo(0, t), target);
    await page.waitForTimeout(300);
    
    const measurement = await page.evaluate(() => ({
      scrollY: window.scrollY,
      navOnWhite: document.querySelector('.nav-menu')?.classList.contains('is-on-white'),
      videoOpacity: getComputedStyle(document.querySelector('.bg-pixels-wrapper')).opacity,
      hiw_word_1_color: getComputedStyle(document.querySelector('.hiw-text._1')).color,
      hiw_word_2_color: getComputedStyle(document.querySelector('.hiw-text._2')).color
    }));
    
    scrollPositions.push(measurement);
  }
  
  return scrollPositions;
}

async function testPopupInteractionSequence(page) {
  console.log(`  Testing popup interaction sequence...`);
  
  const interactions = [];
  
  // First open/close cycle
  const openBtn = await page.$('.hero-cta-link.get-a-call');
  if (!openBtn) return { error: 'Open button not found' };
  
  for (let i = 1; i <= 3; i++) {
    await openBtn.click();
    await page.waitForTimeout(600);
    
    const openState = await page.evaluate(() => ({
      display: getComputedStyle(document.querySelector('.modal-wrap')).display,
      opacity: getComputedStyle(document.querySelector('.modal-wrap')).opacity
    }));
    
    interactions.push({ cycle: i, action: 'open', state: openState });
    
    // Close with different methods
    if (i === 1) {
      // Close with close button
      const closeBtn = await page.$('.close-popup-wrap');
      if (closeBtn) await closeBtn.click();
    } else if (i === 2) {
      // Close with overlay click
      await page.click('.modal-overlay', { force: true }).catch(() => {});
    } else {
      // Close with Escape
      await page.keyboard.press('Escape');
    }
    
    await page.waitForTimeout(600);
    
    const closeState = await page.evaluate(() => ({
      display: getComputedStyle(document.querySelector('.modal-wrap')).display,
      opacity: getComputedStyle(document.querySelector('.modal-wrap')).opacity
    }));
    
    interactions.push({ cycle: i, action: 'close', state: closeState });
  }
  
  return interactions;
}

async function testResizeAnimation(page) {
  console.log(`  Testing resize mid-page...`);
  
  // Scroll to middle of page
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(300);
  
  const before = await page.evaluate(() => ({
    scrollY: window.scrollY,
    navOnWhite: document.querySelector('.nav-menu')?.classList.contains('is-on-white'),
    viewport: { width: window.innerWidth, height: window.innerHeight }
  }));
  
  // Resize to tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  
  const afterResize = await page.evaluate(() => ({
    scrollY: window.scrollY,
    navOnWhite: document.querySelector('.nav-menu')?.classList.contains('is-on-white'),
    viewport: { width: window.innerWidth, height: window.innerHeight }
  }));
  
  // Scroll should be restored
  await page.waitForTimeout(300);
  
  const afterRestoration = await page.evaluate(() => ({
    scrollY: window.scrollY,
    navOnWhite: document.querySelector('.nav-menu')?.classList.contains('is-on-white')
  }));
  
  return { before, afterResize, afterRestoration };
}

async function testConsoleErrors(page, url) {
  console.log(`  Checking console for errors...`);
  
  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });
  
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  return { errorCount: errors.length, warningCount: warnings.length, errors };
}

async function testReducedMotion(page) {
  console.log(`  Testing reduced motion...`);
  
  // Emulate reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(500);
  
  const videoState = await page.evaluate(() => {
    const video = document.querySelector('.bg-video-pixels video');
    const still = document.querySelector('.bg-pic-pixels');
    return {
      videoDisplay: video ? getComputedStyle(video).display : 'not found',
      stillDisplay: still ? getComputedStyle(still).display : 'not found',
      isPlaying: video ? !video.paused : null
    };
  });
  
  // Check if marquees still run
  const marqueeStill = await page.evaluate(() => {
    const wrapper = document.querySelector('.logos-wrapper');
    return getComputedStyle(wrapper).transform;
  });
  
  return { videoState, marqueeHasTransform: marqueeStill !== 'none' };
}

async function testSite(browser, url, vpName, viewport) {
  const page = await browser.newPage({
    viewport: viewport,
    deviceScaleFactor: 1
  });

  try {
    const tests = {};
    
    // Console error check first
    tests.console_errors = await testConsoleErrors(page, url);
    
    // Refresh for next test
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    try { await page.evaluate(() => document.fonts.ready); } catch {}
    await page.waitForTimeout(1000);
    
    // Lenis scroll test
    tests.lenis_scroll = await testLenisScroll(page, url, vpName, viewport);
    
    // Popup interaction sequence
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    tests.popup_sequence = await testPopupInteractionSequence(page);
    
    // Reduced motion test
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    tests.reduced_motion = await testReducedMotion(page);
    
    return tests;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    // Test desktop only for this suite
    const vpName = 'desktop';
    const viewport = { width: 1440, height: 900 };
    
    console.log('Testing high-risk items at 1440×900...\n');
    results.tests[vpName] = {};
    
    console.log('Live site...');
    results.tests[vpName].live = await testSite(browser, ORIGINAL, vpName, viewport);
    
    console.log('\nDev clone...');
    results.tests[vpName].dev = await testSite(browser, DEV, vpName, viewport);
    
    console.log('\nProd clone...');
    results.tests[vpName].prod = await testSite(browser, PROD, vpName, viewport);
  } finally {
    await browser.close();
  }

  const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/high-risk-test.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outFile}`);
}

main().catch(console.error);
