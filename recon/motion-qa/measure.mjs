import playwright from 'playwright';
import fs from 'fs';

const ORIGINAL = 'https://www.transform9.com/';
const DEV = 'http://127.0.0.1:5179';
const PROD = 'http://127.0.0.1:5180';

// Viewport configs to test
const VIEWPORTS = {
  'desktop': { width: 1440, height: 900 },
  'tablet': { width: 1024, height: 900 },
  'tablet-768': { width: 768, height: 1024 },
  'mobile': { width: 390, height: 844 }
};

const results = {
  timestamp: new Date().toISOString(),
  sections: {}
};

async function measureSite(browser, url, viewport, vpName) {
  const page = await browser.newPage({
    viewport: viewport,
    deviceScaleFactor: 1
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Wait a bit for Lenis to settle
    await page.waitForTimeout(500);

    const data = {};

    // M1: Logo marquee speed
    const logoMarqueeData = await page.evaluate(() => {
      const wrapper = document.querySelector('.logos-wrapper');
      if (!wrapper) return null;
      const rect = wrapper.getBoundingClientRect();
      const computed = getComputedStyle(wrapper);
      return {
        width: wrapper.offsetWidth,
        computedWidth: computed.width,
        transform: computed.transform
      };
    });
    data.m1_logo_marquee = logoMarqueeData;

    // M3: Video fade on scroll (check initial state)
    const videoData = await page.evaluate(() => {
      const wrapper = document.querySelector('.bg-pixels-wrapper');
      if (!wrapper) return null;
      const video = wrapper.querySelector('video');
      const computed = getComputedStyle(wrapper);
      return {
        opacity: computed.opacity,
        display: computed.display,
        videoPlaying: video ? video.currentTime > 0 : null
      };
    });
    data.m3_video_initial = videoData;

    // M4: Nav state (initial, not on white)
    const navData = await page.evaluate(() => {
      const nav = document.querySelector('.nav-menu');
      if (!nav) return null;
      const computed = getComputedStyle(nav);
      const logoWhite = document.querySelector('.logo-white');
      const logoBlack = document.querySelector('.logo-black');
      return {
        bg: computed.backgroundColor,
        hasOnWhiteClass: nav.classList.contains('is-on-white'),
        logoWhiteOpacity: logoWhite ? getComputedStyle(logoWhite).opacity : null,
        logoBlackOpacity: logoBlack ? getComputedStyle(logoBlack).opacity : null
      };
    });
    data.m4_nav_initial = navData;

    // M5: Stats block default state (desktop)
    const statsData = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('.stats-block'));
      return blocks.map((block, idx) => {
        const computed = getComputedStyle(block);
        const head = block.querySelector('.stat-head');
        const img = block.querySelector('.stats-img-wrap');
        return {
          index: idx,
          flexBasis: computed.flexBasis,
          width: block.offsetWidth,
          headTransformY: head ? getComputedStyle(head).transform : null,
          imgOpacity: img ? getComputedStyle(img).opacity : null
        };
      });
    });
    data.m5_stats = statsData;

    // M7: How It Works initial state
    const hiwData = await page.evaluate(() => {
      const leftBlock = document.querySelector('.hiw-text-block.left');
      const words = Array.from(document.querySelectorAll('.hiw-text._1, .hiw-text._2, .hiw-text._3'));
      return {
        leftY: leftBlock ? getComputedStyle(leftBlock).transform : null,
        wordColors: words.map(w => ({
          class: w.className,
          color: getComputedStyle(w).color
        }))
      };
    });
    data.m7_hiw_initial = hiwData;

    // M9: Scheduling cards (check initial transform and bg)
    const schedData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.scheduling-card'));
      return cards.slice(0, 4).map((card, idx) => {
        const computed = getComputedStyle(card);
        const img = card.querySelector('.sch-img');
        return {
          index: idx + 1,
          transform: computed.transform,
          backgroundColor: computed.backgroundColor,
          imgOpacity: img ? getComputedStyle(img).opacity : null
        };
      });
    });
    data.m9_scheduling = schedData;

    // M10: Tasking tab progress bar
    const taskingData = await page.evaluate(() => {
      const tabProgress = document.querySelector('.tab-progress-vert');
      if (!tabProgress) return null;
      const computed = getComputedStyle(tabProgress);
      return {
        height: computed.height,
        backgroundColor: computed.backgroundColor
      };
    });
    data.m10_tasking = taskingData;

    // M11/M11b: Popup initial state
    const popupData = await page.evaluate(() => {
      const modal = document.querySelector('.modal-wrap');
      if (!modal) return null;
      const computed = getComputedStyle(modal);
      return {
        display: computed.display,
        opacity: computed.opacity,
        isOpen: modal.classList.contains('is-open')
      };
    });
    data.m11_popup_initial = popupData;

    // M12: Underline pair in hero CTA
    const underlineData = await page.evaluate(() => {
      const link = document.querySelector('.hero-cta-link.get-a-call');
      if (!link) return null;
      const ul1 = link.querySelector('.underline._1');
      const ul2 = link.querySelector('.underline._2');
      return {
        line1Width: ul1 ? getComputedStyle(ul1).width : null,
        line1Transform: ul1 ? getComputedStyle(ul1).transform : null,
        line2Width: ul2 ? getComputedStyle(ul2).width : null,
        line2Transform: ul2 ? getComputedStyle(ul2).transform : null
      };
    });
    data.m12_underline = underlineData;

    // M13: Testimonial arrow
    const arrowData = await page.evaluate(() => {
      const arrow = document.querySelector('.test-arrow-wrap.right');
      if (!arrow) return null;
      const computed = getComputedStyle(arrow);
      const whiteArrow = arrow.querySelector('.arrow.white');
      const blackArrow = arrow.querySelector('.arrow.black');
      return {
        bg: computed.backgroundColor,
        whiteTransform: whiteArrow ? getComputedStyle(whiteArrow).transform : null,
        blackTransform: blackArrow ? getComputedStyle(blackArrow).transform : null
      };
    });
    data.m13_arrow = arrowData;

    // M14: Integration block
    const integrationData = await page.evaluate(() => {
      const block = document.querySelector('.integration-block.bl');
      if (!block) return null;
      const computed = getComputedStyle(block);
      const whiteImg = block.querySelector('img:not([style*="opacity: 0"])');
      return {
        bg: computed.backgroundColor,
        display: computed.display
      };
    });
    data.m14_integration = integrationData;

    // M15: Nav link hover text
    const navLinkData = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link-block'));
      return links.slice(0, 2).map(link => {
        const textElements = Array.from(link.querySelectorAll('.nav-text'));
        return {
          transforms: textElements.map(t => getComputedStyle(t).transform)
        };
      });
    });
    data.m15_nav_text = navLinkData;

    // M16: Close popup button
    const closeData = await page.evaluate(() => {
      const closeBtn = document.querySelector('.close-popup-wrap');
      if (!closeBtn) return null;
      const computed = getComputedStyle(closeBtn);
      return {
        bg: computed.backgroundColor
      };
    });
    data.m16_close_btn = closeData;

    // M18: Mobile menu button
    const menuBtnData = await page.evaluate(() => {
      const menuBtn = document.querySelector('.menu-btn');
      if (!menuBtn) return null;
      const burger = menuBtn.querySelector('.burger-white');
      const computed = getComputedStyle(menuBtn);
      return {
        display: computed.display,
        burgerDisplay: burger ? getComputedStyle(burger).display : null
      };
    });
    data.m18_menu_btn = menuBtnData;

    // M21: Video playback
    const videoPlayData = await page.evaluate(() => {
      const video = document.querySelector('.bg-video-pixels video');
      if (!video) return null;
      return {
        duration: video.duration,
        currentTime: video.currentTime,
        isPlaying: !video.paused
      };
    });
    data.m21_video = videoPlayData;

    return { viewport: vpName, data };
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
      console.log(`\nTesting viewport: ${vpName} ${viewport.width}x${viewport.height}`);
      
      results.sections[vpName] = {};
      
      console.log('  Live site...');
      const liveResult = await measureSite(browser, ORIGINAL, viewport, vpName);
      results.sections[vpName].live = liveResult.data;
      
      console.log('  Dev clone...');
      const devResult = await measureSite(browser, DEV, viewport, vpName);
      results.sections[vpName].dev = devResult.data;
      
      console.log('  Prod clone...');
      const prodResult = await measureSite(browser, PROD, viewport, vpName);
      results.sections[vpName].prod = prodResult.data;
    }
  } finally {
    await browser.close();
  }

  // Write results
  const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/measure-initial.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outFile}`);
}

main().catch(console.error);
