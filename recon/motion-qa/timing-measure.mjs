import playwright from 'playwright';
import fs from 'fs';

const ORIGINAL = 'https://www.transform9.com/';
const DEV = 'http://127.0.0.1:5179';
const PROD = 'http://127.0.0.1:5180';

const results = {
  timestamp: new Date().toISOString(),
  tests: {}
};

async function measureMarqueeSpeed(page, selector) {
  // Measure marquee transform change over time
  const positions = [];
  for (let i = 0; i < 5; i++) {
    const pos = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const transform = getComputedStyle(el).transform;
      const match = transform.match(/translate[X]*\(([^,)]+)/);
      if (match) {
        return parseFloat(match[1]);
      }
      return 0;
    }, selector);
    positions.push({ time: i * 500, x: pos });
    await page.waitForTimeout(500);
  }
  return positions;
}

async function measureAnimationTiming(page, triggerSelector, targetSelector, triggerAction = 'hover') {
  // Measure timing of an animation from trigger to completion
  const element = await page.$(triggerSelector);
  if (!element) return { error: 'Element not found' };

  const startState = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      color: getComputedStyle(el).color
    };
  }, targetSelector);

  // Trigger action
  if (triggerAction === 'hover') {
    try {
      await element.hover({ force: true });
    } catch {
      const box = await element.boundingBox();
      if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
  } else if (triggerAction === 'click') {
    await element.click();
  }

  // Sample during animation
  const samples = [];
  const startTime = Date.now();
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(50);
    const sample = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return {
        opacity: getComputedStyle(el).opacity,
        transform: getComputedStyle(el).transform,
        color: getComputedStyle(el).color
      };
    }, targetSelector);
    samples.push({ elapsedMs: Date.now() - startTime, ...sample });
  }

  return { startState, samples, durationMs: Date.now() - startTime };
}

async function testTaskingTabRotation(page) {
  // Test auto-rotation at desktop
  const vp = page.viewportSize();
  if (!vp || vp.width < 992) {
    return { skipped: 'Not desktop' };
  }

  const measurements = [];
  for (let i = 0; i < 3; i++) {
    const activeTab = await page.evaluate(() => {
      const tab = document.querySelector('.tab-link.w--current');
      return tab ? tab.textContent.trim() : null;
    });
    measurements.push({ check: i, tab: activeTab, time: i * 1000 });
    await page.waitForTimeout(1000);
  }
  return { tabSequence: measurements };
}

async function testStatsAccordion(page) {
  // Test stats accordion at tablet
  const vp = page.viewportSize();
  if (!vp || vp.width >= 992) {
    return { skipped: 'Not tablet/mobile' };
  }

  // Check which block is initially active
  const initialActive = await page.evaluate(() => {
    const active = document.querySelector('.stats-block.is-active');
    return active ? active.textContent.slice(0, 10) : null;
  });

  // Click on a different block
  const blocks = await page.$$('.stats-block');
  if (blocks.length > 1) {
    await blocks[1].click();
    await page.waitForTimeout(600);
  }

  const afterClick = await page.evaluate(() => {
    const active = document.querySelector('.stats-block.is-active');
    return active ? active.textContent.slice(0, 10) : null;
  });

  return { initialActive, afterClick, changed: initialActive !== afterClick };
}

async function testPopupFormValidation(page) {
  // Open popup
  const openBtn = await page.$('.hero-cta-link.get-a-call');
  if (!openBtn) return { error: 'Open button not found' };

  await openBtn.click();
  await page.waitForTimeout(600);

  // Try to submit without filling form
  const submitBtn = await page.$('.submit-form');
  if (!submitBtn) return { error: 'Submit button not found' };

  const beforeSubmit = await page.evaluate(() => {
    const form = document.querySelector('#wf-form-Get-a-Call-Form');
    return {
      display: form ? getComputedStyle(form).display : 'not found',
      hasError: !!document.querySelector('.error-message.popup:not([style*="display: none"])')
    };
  });

  // Click submit (should fail validation)
  try {
    await submitBtn.click();
  } catch {}
  await page.waitForTimeout(300);

  const afterSubmit = await page.evaluate(() => {
    return {
      hasError: !!document.querySelector('.error-message.popup:not([style*="display: none"])')
    };
  });

  return { beforeSubmit, afterSubmit };
}

async function testSite(browser, url, vpName, viewport) {
  const page = await browser.newPage({
    viewport: viewport,
    deviceScaleFactor: 1
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    try {
      await page.evaluate(() => document.fonts.ready);
    } catch {}
    await page.waitForTimeout(1000);

    const tests = {};

    // M1: Marquee speed (sample at desktop)
    if (viewport.width === 1440) {
      console.log(`    - Marquee speed...`);
      tests.m1_marquee_speed = await measureMarqueeSpeed(page, '.logos-wrapper');
    }

    // M2: Integration marquees
    if (viewport.width === 1440) {
      console.log(`    - Integration marquee...`);
      const scrollPos = await page.evaluate(() => window.scrollY);
      tests.m2_integration_scroll = await measureMarqueeSpeed(page, '.intagrations-row._1');
    }

    // M10: Tasking tab rotation
    if (viewport.width >= 992) {
      console.log(`    - Tasking rotation...`);
      tests.m10_tasking_rotation = await testTaskingTabRotation(page);
    }

    // M6: Stats accordion
    if (viewport.width < 992) {
      console.log(`    - Stats accordion...`);
      tests.m6_stats_accordion = await testStatsAccordion(page);
    }

    // M11: Popup form validation
    console.log(`    - Popup validation...`);
    tests.m11_popup_validation = await testPopupFormValidation(page);

    return tests;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    const configs = [
      { name: 'desktop', viewport: { width: 1440, height: 900 } },
      { name: 'tablet', viewport: { width: 768, height: 1024 } }
    ];

    for (const config of configs) {
      console.log(`Testing ${config.name} timing...`);
      results.tests[config.name] = {};

      console.log('  Live site...');
      results.tests[config.name].live = await testSite(browser, ORIGINAL, config.name, config.viewport);

      console.log('  Dev clone...');
      results.tests[config.name].dev = await testSite(browser, DEV, config.name, config.viewport);

      console.log('  Prod clone...');
      results.tests[config.name].prod = await testSite(browser, PROD, config.name, config.viewport);
    }
  } finally {
    await browser.close();
  }

  const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/timing-measure.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`Results written to ${outFile}`);
}

main().catch(console.error);
