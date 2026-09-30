import { chromium } from 'playwright';

async function fixTests() {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  console.log('=== FIXED DEFECT VERIFICATION ===\n');
  
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://127.0.0.1:5179/', {waitUntil: 'networkidle'});
  
  // 1. YouTube - check for youtube-nocookie iframe
  console.log('1. YouTube iframe (corrected selector):');
  const facade = await page.$('figure.yt-facade');
  if (facade) {
    const beforeClick = await page.$('iframe[src*="youtube"]');
    console.log(`  Before click: ${beforeClick ? '✓' : '✗'}`);
    
    await facade.click();
    await page.waitForTimeout(1000);
    
    const afterClick = await page.$('iframe[src*="youtube"]');
    console.log(`  After click: ${afterClick ? '✓' : '✗'}`);
  }
  
  // 2. Specialty tabs - investigate the tab structure
  console.log('\n2. Specialty tabs investigation:');
  
  const tabsStructure = await page.evaluate(() => {
    const tabs = document.querySelectorAll('.specialty-tab-link');
    const panes = document.querySelectorAll('[role="tabpanel"]');
    
    return {
      tabCount: tabs.length,
      paneCount: panes.length,
      webflowTabsElement: !!document.querySelector('.specialty-tabs.w-tabs'),
      firstTabOnhover: tabs[0]?.getAttribute('data-w-tab') || tabs[0]?.getAttribute('ms-code-onhover'),
      secondTabText: tabs[1]?.textContent.substring(0, 20),
      activeClass: Array.from(tabs).find(t => t.classList.contains('w--current'))?.textContent.substring(0, 20)
    };
  });
  
  console.log('Tab structure:', JSON.stringify(tabsStructure, null, 2));
  
  // Try hovering instead of clicking (per spec M20)
  const tabs = await page.$$('.specialty-tab-link');
  if (tabs.length > 1) {
    console.log('\nTesting hover activation (M20):');
    
    const img1Before = await page.$eval('.specialty-tabs-content img', el => el.src);
    
    await tabs[1].hover();
    await page.waitForTimeout(300);
    
    const img1After = await page.$eval('.specialty-tabs-content img', el => el.src);
    
    console.log(`  Image changed: ${img1Before !== img1After ? '✓' : '✗'}`);
    console.log(`  Before: ${img1Before.substring(60)}`);
    console.log(`  After: ${img1After.substring(60)}`);
  }
  
  // 3. In-page anchors - scroll test
  console.log('\n3. In-page anchor navigation:');
  
  // Scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  const links = await page.$$('a[href^="#"]');
  console.log(`  Total anchor links: ${links.length}`);
  
  for (let i = 0; i < Math.min(3, links.length); i++) {
    const href = await links[i].getAttribute('href');
    const text = await links[i].textContent();
    
    await links[i].click();
    await page.waitForTimeout(800);
    
    const inView = await page.evaluate((anchorId) => {
      const el = document.querySelector(anchorId);
      if (!el) return 'not found';
      const rect = el.getBoundingClientRect();
      return (rect.top > -200 && rect.top < 500) ? 'in view' : `out of view (top=${rect.top.toFixed(0)})`;
    }, href);
    
    console.log(`  ${href}: ${inView}`);
  }
  
  await browser.close();
}

fixTests().catch(console.error);
