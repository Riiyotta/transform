import { chromium } from 'playwright';
import fs from 'fs';

const defects = [];

async function verifyDefects() {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  console.log('=== VERIFYING POTENTIAL DEFECTS ===\n');
  
  // Test on both dev and prod
  for (const [env, url] of [['DEV', 'http://127.0.0.1:5179'], ['PROD', 'http://127.0.0.1:5180']]) {
    console.log(`\n--- ${env} ---\n`);
    
    // 1. Stats hover (M5)
    console.log('1. Stats block hover (M5):');
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto(url, {waitUntil: 'networkidle'});
    
    const statsBlock = await page.$('.stats-block');
    if (statsBlock) {
      const flexBefore = await page.evaluate(() => {
        return parseInt(window.getComputedStyle(document.querySelector('.stats-block')).width);
      });
      
      await statsBlock.hover();
      await page.waitForTimeout(800);
      
      const flexAfter = await page.evaluate(() => {
        return parseInt(window.getComputedStyle(document.querySelector('.stats-block')).width);
      });
      
      const expanded = flexAfter > flexBefore * 1.5;
      console.log(`  Before: ${flexBefore}px, After: ${flexAfter}px`);
      console.log(`  Expanded: ${expanded ? '✓' : '✗'}`);
      
      if (!expanded) {
        defects.push({env, route: '/', section: 'stats', issue: 'Stats block does not expand on hover (M5)', severity: 'high'});
      }
    }
    
    // 2. Specialty tabs (should change content on hover/click)
    console.log('\n2. Specialty tabs content change:');
    await page.goto(url, {waitUntil: 'networkidle'});
    
    const tabs = await page.$$('.specialty-tab-link');
    if (tabs.length > 1) {
      const content1 = await page.textContent('.specialty-tabs-content img');
      
      // Click second tab
      await tabs[1].click();
      await page.waitForTimeout(300);
      
      const content2 = await page.textContent('.specialty-tabs-content img');
      
      const changed = content1 !== content2;
      console.log(`  Content changed: ${changed ? '✓' : '✗'}`);
      
      if (!changed) {
        defects.push({env, route: '/', section: 'specialties', issue: 'Specialty tab does not change content', severity: 'high'});
      }
    }
    
    // 3. Phone input sync (D2) - scroll to make inputs visible first
    console.log('\n3. Phone input sync (D2):');
    await page.goto(url, {waitUntil: 'networkidle'});
    
    // Scroll to hero section
    await page.evaluate(() => {
      document.querySelector('.input-hero-wrap')?.scrollIntoView({behavior: 'instant'});
    });
    await page.waitForTimeout(200);
    
    const heroInput = await page.$('#input-main-phone');
    if (heroInput) {
      await heroInput.fill('1234567890');
      await page.waitForTimeout(200);
      
      const ctaInput = await page.$('#input-footer-phone');
      if (ctaInput) {
        const val1 = await heroInput.inputValue();
        const val2 = await ctaInput.inputValue();
        
        const synced = val1 === val2 && val1.length > 0;
        console.log(`  Hero: ${val1}, CTA: ${val2}`);
        console.log(`  Synced: ${synced ? '✓' : '✗'}`);
        
        if (!synced) {
          defects.push({env, route: '/', section: 'forms', issue: 'Phone inputs not synced (D2)', severity: 'medium'});
        }
      }
    }
    
    // 4. YouTube iframe loads after click (D4)
    console.log('\n4. YouTube facade interaction (D4):');
    await page.goto(url, {waitUntil: 'networkidle'});
    
    const facade = await page.$('figure.yt-facade');
    if (facade) {
      const iframeBeforeClick = await page.$('iframe[src*="youtube.com"]');
      console.log(`  Iframe before click: ${iframeBeforeClick ? '✓' : '✗ (expected)'}`);
      
      await facade.click();
      await page.waitForTimeout(500);
      
      const iframeAfterClick = await page.$('iframe[src*="youtube.com"]');
      console.log(`  Iframe after click: ${iframeAfterClick ? '✓' : '✗'}`);
      
      if (!iframeAfterClick) {
        defects.push({env, route: '/', section: 'spotlight', issue: 'YouTube iframe does not load after click (D4)', severity: 'high'});
      }
    }
    
    // 5. Popup form required validation
    console.log('\n5. Popup validation:');
    await page.goto(url, {waitUntil: 'networkidle'});
    
    const heroCTA = await page.$('a.hero-cta-link.get-a-call');
    if (heroCTA) {
      await heroCTA.click();
      await page.waitForTimeout(700);
      
      const submitBtn = await page.$('input.submit-form');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(300);
        
        const validationMsg = await page.evaluate(() => {
          const input = document.querySelector('input[name="First-Name"]');
          return input ? input.validationMessage : '';
        });
        
        const hasValidation = validationMsg.length > 0;
        console.log(`  Validation message: "${validationMsg}"`);
        console.log(`  Validation works: ${hasValidation ? '✓' : '✗'}`);
        
        if (!hasValidation) {
          defects.push({env, route: '/', section: 'popup', issue: 'Popup form validation not working', severity: 'high'});
        }
      }
    }
    
    // 6. In-page anchor navigation
    console.log('\n6. In-page anchor navigation:');
    await page.goto(url, {waitUntil: 'networkidle'});
    
    const anchorLink = await page.$('a[href="#products"]');
    if (anchorLink) {
      await anchorLink.click();
      await page.waitForTimeout(800);
      
      const inView = await page.evaluate(() => {
        const section = document.querySelector('section[id="products"], div[id="products"]');
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        // Check if section is roughly in view (top within viewport +/- buffer)
        return rect.top < 400 && rect.top > -100;
      });
      
      console.log(`  Scrolled to #products: ${inView ? '✓' : '✗'}`);
      
      if (!inView) {
        defects.push({env, route: '/', section: 'navigation', issue: 'In-page anchor navigation not working', severity: 'high'});
      }
    }
  }
  
  await browser.close();
  
  return defects;
}

verifyDefects().then(issues => {
  fs.writeFileSync('/Users/riyaghosh/V3/transform/recon/full-qa/defects-found.json', JSON.stringify(issues, null, 2));
  
  console.log('\n=== DEFECTS SUMMARY ===');
  if (issues.length === 0) {
    console.log('✓ No critical defects found');
  } else {
    console.log(`Found ${issues.length} defect(s):`);
    const byEnv = {};
    issues.forEach(d => {
      byEnv[d.env] = (byEnv[d.env] || 0) + 1;
      console.log(`  [${d.severity}] ${d.section}: ${d.issue}`);
    });
  }
}).catch(console.error);
