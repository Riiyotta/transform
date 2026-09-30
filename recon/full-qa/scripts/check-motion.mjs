import { chromium } from 'playwright';

async function checkMotion() {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  console.log('=== CHECKING MOTION/ANIMATIONS ===\n');
  
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://127.0.0.1:5179/', {waitUntil: 'networkidle'});
  
  // M1: Client logo marquee - check if it's scrolling
  console.log('M1: Logo marquee');
  let marqueeX1 = await page.evaluate(() => {
    const wrapper = document.querySelector('.logos-wrapper');
    if (!wrapper) return null;
    return wrapper.getBoundingClientRect().x;
  });
  
  await page.waitForTimeout(1000);
  
  let marqueeX2 = await page.evaluate(() => {
    const wrapper = document.querySelector('.logos-wrapper');
    if (!wrapper) return null;
    return wrapper.getBoundingClientRect().x;
  });
  
  console.log(`  Position moved: ${marqueeX1 !== marqueeX2} (${marqueeX1?.toFixed(1)} → ${marqueeX2?.toFixed(1)})`);
  
  // M5: Stats hover
  console.log('\nM5: Stats hover expansion');
  const statsBlock = await page.$('.stats-block');
  if (statsBlock) {
    await page.evaluate(() => {
      const block = document.querySelector('.stats-block');
      const width1 = window.getComputedStyle(block).width;
      console.log('  Before hover:', width1);
    });
    
    await statsBlock.hover();
    await page.waitForTimeout(700);
    
    await page.evaluate(() => {
      const block = document.querySelector('.stats-block');
      const width2 = window.getComputedStyle(block).width;
      console.log('  After hover:', width2);
    });
  }
  
  // M22: Smooth scroll - check if Lenis is active
  console.log('\nM22: Lenis smooth scroll');
  const lenisActive = await page.evaluate(() => {
    return !!window.lenis && window.lenis.isScrolling !== undefined;
  });
  
  console.log(`  Lenis instance active: ${lenisActive}`);
  
  // Check scroll behavior
  const scrollBefore = await page.evaluate(() => window.scrollY);
  
  // Simulate scroll
  await page.evaluate(() => {
    window.scrollBy(0, 500);
  });
  
  await page.waitForTimeout(500);
  
  const scrollAfter = await page.evaluate(() => window.scrollY);
  
  console.log(`  Scroll movement: ${scrollBefore} → ${scrollAfter}`);
  
  // M3: Background video fade on scroll
  console.log('\nM3: Background video fade');
  const videoBefore = await page.evaluate(() => {
    const wrapper = document.querySelector('.bg-pixels-wrapper');
    if (!wrapper) return null;
    return window.getComputedStyle(wrapper).opacity;
  });
  
  console.log(`  Video wrapper opacity (top): ${videoBefore}`);
  
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  
  await page.waitForTimeout(500);
  
  const videoAfter = await page.evaluate(() => {
    const wrapper = document.querySelector('.bg-pixels-wrapper');
    if (!wrapper) return null;
    return window.getComputedStyle(wrapper).opacity;
  });
  
  console.log(`  Video wrapper opacity (after scroll): ${videoAfter}`);
  
  await browser.close();
}

checkMotion().catch(console.error);
