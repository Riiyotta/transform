import playwright from 'playwright';
import fs from 'fs';

const ORIGINAL = 'https://www.transform9.com/';
const DEV = 'http://127.0.0.1:5179';
const PROD = 'http://127.0.0.1:5180';

const results = {
  timestamp: new Date().toISOString(),
  tests: {}
};

async function testHoverInteraction(page, selector, description) {
  try {
    // Wait for element to be stable
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.waitForTimeout(500);

    // Get element position and try clicking as alternative to hover
    const element = await page.$(selector);
    if (!element) {
      return { error: `Element not found: ${selector}` };
    }

    // Get initial state
    const initialState = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const computed = getComputedStyle(el);
      const children = Array.from(el.querySelectorAll('*'));
      return {
        display: computed.display,
        opacity: computed.opacity,
        transform: computed.transform,
        backgroundColor: computed.backgroundColor,
        children: children.slice(0, 3).map(c => ({
          opacity: getComputedStyle(c).opacity,
          transform: getComputedStyle(c).transform
        }))
      };
    }, selector);

    // Try hover with no delay check
    try {
      await page.locator(selector).first().hover({ force: true });
    } catch {
      // Fallback: move mouse to element
      const box = await element.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
    }
    await page.waitForTimeout(300); 

    const hoverState = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const computed = getComputedStyle(el);
      const children = Array.from(el.querySelectorAll('*'));
      return {
        display: computed.display,
        opacity: computed.opacity,
        transform: computed.transform,
        backgroundColor: computed.backgroundColor,
        children: children.slice(0, 3).map(c => ({
          opacity: getComputedStyle(c).opacity,
          transform: getComputedStyle(c).transform
        }))
      };
    }, selector);

    // Mouse out
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    const outState = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const computed = getComputedStyle(el);
      const children = Array.from(el.querySelectorAll('*'));
      return {
        display: computed.display,
        opacity: computed.opacity,
        transform: computed.transform,
        backgroundColor: computed.backgroundColor,
        children: children.slice(0, 3).map(c => ({
          opacity: getComputedStyle(c).opacity,
          transform: getComputedStyle(c).transform
        }))
      };
    }, selector);

    return {
      description,
      selector,
      initial: initialState,
      onHover: hoverState,
      onOut: outState
    };
  } catch (e) {
    return { error: `${description}: ${e.message}` };
  }
}

async function testPopupInteraction(page) {
  try {
    const openBtn = await page.waitForSelector('.hero-cta-link.get-a-call', { timeout: 5000 });
    if (!openBtn) {
      return { error: 'Hero CTA button not found' };
    }

    const initialModal = await page.evaluate(() => {
      const modal = document.querySelector('.modal-wrap');
      return {
        display: getComputedStyle(modal).display,
        opacity: getComputedStyle(modal).opacity,
        isOpen: modal.classList.contains('is-open')
      };
    });

    // Click to open
    await openBtn.click();
    await page.waitForTimeout(600);

    const openModal = await page.evaluate(() => {
      const modal = document.querySelector('.modal-wrap');
      return {
        display: getComputedStyle(modal).display,
        opacity: getComputedStyle(modal).opacity,
        isOpen: modal.classList.contains('is-open')
      };
    });

    // Close with close button
    const closeBtn = await page.$('.close-popup-wrap');
    if (closeBtn) {
      try {
        await closeBtn.click();
      } catch {
        // Try pressing Escape
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    }

    const closedModal = await page.evaluate(() => {
      const modal = document.querySelector('.modal-wrap');
      return {
        display: getComputedStyle(modal).display,
        opacity: getComputedStyle(modal).opacity,
        isOpen: modal.classList.contains('is-open')
      };
    });

    return {
      description: 'Popup open/close cycle',
      initial: initialModal,
      afterOpen: openModal,
      afterClose: closedModal
    };
  } catch (e) {
    return { error: `Popup test failed: ${e.message}` };
  }
}

async function testMobileMenu(page, viewport) {
  try {
    if (viewport.width >= 992) {
      return { skipped: 'Desktop viewport' };
    }

    const menuBtn = await page.waitForSelector('.menu-btn', { timeout: 5000 });
    if (!menuBtn) {
      return { error: 'Menu button not found' };
    }

    const initialMenu = await page.evaluate(() => {
      const nav = document.querySelector('nav.nav-links');
      return {
        navDisplay: nav ? getComputedStyle(nav).display : 'not found',
        isOpen: document.documentElement.classList.contains('is-menu-open')
      };
    });

    await menuBtn.click();
    await page.waitForTimeout(400);

    const openMenu = await page.evaluate(() => {
      const nav = document.querySelector('nav.nav-links');
      return {
        navDisplay: nav ? getComputedStyle(nav).display : 'not found',
        isOpen: document.documentElement.classList.contains('is-menu-open')
      };
    });

    await menuBtn.click();
    await page.waitForTimeout(400);

    const closedMenu = await page.evaluate(() => {
      const nav = document.querySelector('nav.nav-links');
      return {
        navDisplay: nav ? getComputedStyle(nav).display : 'not found',
        isOpen: document.documentElement.classList.contains('is-menu-open')
      };
    });

    return {
      description: 'Mobile menu toggle',
      initial: initialMenu,
      afterOpen: openMenu,
      afterClose: closedMenu
    };
  } catch (e) {
    return { error: `Menu test failed: ${e.message}` };
  }
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

    // M12: Underline pair (test first as it's quick)
    console.log(`    - M12 underline...`);
    tests.m12_underline = await testHoverInteraction(page, '.hero-cta-link.get-a-call', 'Hero CTA underline');

    // M11/M11b: Popup
    console.log(`    - M11/M11b popup...`);
    tests.m11_popup = await testPopupInteraction(page);

    // M18: Mobile menu
    console.log(`    - M18 mobile menu...`);
    tests.m18_mobile_menu = await testMobileMenu(page, viewport);

    // M5: Stats hover (desktop only)
    if (viewport.width >= 992) {
      console.log(`    - M5 stats hover...`);
      tests.m5_stats_hover = await testHoverInteraction(page, '.stats-block', 'Stats block hover');
    }

    // M15: Nav link text (desktop only)
    if (viewport.width >= 992) {
      console.log(`    - M15 nav link...`);
      const navLink = await page.$('.nav-link-block._1st');
      if (navLink) {
        tests.m15_nav_link = await testHoverInteraction(page, '.nav-link-block._1st', 'Nav link hover');
      }
    }

    return tests;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    // Test at desktop and mobile
    const configs = [
      { name: 'desktop', viewport: { width: 1440, height: 900 } },
      { name: 'mobile', viewport: { width: 390, height: 844 } }
    ];

    for (const config of configs) {
      console.log(`Testing ${config.name} interactions...`);
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

  const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/hover-measure.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`Results written to ${outFile}`);
}

main().catch(console.error);
