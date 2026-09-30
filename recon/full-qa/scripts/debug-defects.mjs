import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  console.log('=== DEBUGGING DEFECTS ===\n');
  
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://127.0.0.1:5179/', {waitUntil: 'networkidle'});
  
  // 1. Specialty tabs
  console.log('1. Specialty Tab Issue:\n');
  
  const tabsInfo = await page.evaluate(() => {
    const menu = document.querySelector('.specialty-tabs-menu');
    const content = document.querySelector('.specialty-tabs-content');
    const tabs = document.querySelectorAll('.specialty-tab-link');
    
    return {
      tabsCount: tabs.length,
      menuClasses: menu?.className,
      contentImg1: content?.querySelector('img')?.src.substring(0, 80),
      activeTab: Array.from(tabs).findIndex(t => t.classList.contains('w--current')),
      tabTexts: Array.from(tabs).slice(0, 3).map(t => t.textContent.substring(0, 20))
    };
  });
  
  console.log('Initial state:', JSON.stringify(tabsInfo, null, 2));
  
  // Click second tab
  const tab2 = await page.$('.specialty-tab-link:nth-child(2)');
  if (tab2) {
    await tab2.click();
    await page.waitForTimeout(500);
    
    const newState = await page.evaluate(() => {
      const tabs = document.querySelectorAll('.specialty-tab-link');
      const content = document.querySelector('.specialty-tabs-content');
      
      return {
        activeTab: Array.from(tabs).findIndex(t => t.classList.contains('w--current')),
        contentImg: content?.querySelector('img')?.src.substring(0, 80),
        currentDisplay: window.getComputedStyle(content).display
      };
    });
    
    console.log('After click:', JSON.stringify(newState, null, 2));
  }
  
  // 2. YouTube iframe issue
  console.log('\n2. YouTube Facade Issue:\n');
  
  const facadeInfo = await page.evaluate(() => {
    const facade = document.querySelector('figure.yt-facade');
    const iframe = document.querySelector('iframe[src*="youtube.com"]');
    
    return {
      facadeFound: !!facade,
      facadeHTML: facade?.innerHTML.substring(0, 100),
      iframeFound: !!iframe,
      facadeDataVideoId: facade?.getAttribute('data-video-id'),
      iframeOnclick: facade?.onclick ? 'yes' : 'no',
      iframeDataOnclick: facade?.getAttribute('data-onclick')
    };
  });
  
  console.log('Initial state:', JSON.stringify(facadeInfo, null, 2));
  
  const facade = await page.$('figure.yt-facade');
  if (facade) {
    console.log('Clicking facade...');
    
    // Capture network requests
    const requests = [];
    page.on('response', r => {
      if (r.url().includes('youtube')) {
        requests.push(r.url());
      }
    });
    
    await facade.click();
    await page.waitForTimeout(1000);
    
    console.log('Network requests to YouTube:', requests);
    
    const afterClick = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="youtube.com"]');
      const facadeContent = document.querySelector('figure.yt-facade')?.innerHTML;
      
      return {
        iframeFound: !!iframe,
        iframeSrc: iframe?.src.substring(0, 100),
        facadeHTML: facadeContent?.substring(0, 150)
      };
    });
    
    console.log('After click:', JSON.stringify(afterClick, null, 2));
  }
  
  await browser.close();
}

debug().catch(console.error);
