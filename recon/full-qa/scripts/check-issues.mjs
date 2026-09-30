import { chromium } from 'playwright';

async function checkIssues() {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  console.log('=== INVESTIGATING CRITICAL ISSUES ===\n');
  
  // 1. Check Lenis after scroll
  console.log('1. Lenis status:');
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://127.0.0.1:5179/', {waitUntil: 'networkidle'});
  
  let lenisExists = await page.evaluate(() => typeof window.Lenis !== 'undefined');
  console.log(`  Lenis in window: ${lenisExists}`);
  
  // Wait a bit for initialization
  await page.waitForTimeout(1000);
  
  const lenisStatus = await page.evaluate(() => {
    return {
      hasClass: document.documentElement.classList.contains('lenis'),
      hasLensisSmooth: document.documentElement.classList.contains('lenis-smooth'),
      windowLenis: typeof window.Lenis !== 'undefined',
      windowLenisInstance: typeof window.lenis !== 'undefined'
    };
  });
  
  console.log(`  Classes on html: lenis=${lenisStatus.hasClass}, lenis-smooth=${lenisStatus.hasLensisSmooth}`);
  console.log(`  window.Lenis: ${lenisStatus.windowLenis}`);
  console.log(`  window.lenis (instance): ${lenisStatus.windowLenisInstance}`);
  
  // 2. Check CSS vars
  console.log('\n2. CSS Variables:');
  const cssVars = await page.evaluate(() => {
    const html = document.documentElement;
    const style = getComputedStyle(html);
    const vars = ['--black', '--white', '--green', '--blue-light', '--_paddings--margins---padding'];
    const results = {};
    vars.forEach(v => {
      const val = style.getPropertyValue(v).trim();
      results[v] = val || '(empty)';
    });
    return results;
  });
  
  Object.entries(cssVars).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });
  
  // 3. Check images individually
  console.log('\n3. Image Status (sampling):');
  const imgStatus = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).slice(0, 10);
    return imgs.map(img => ({
      src: img.src.substring(Math.max(0, img.src.length - 40)),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      alt: img.alt.substring(0, 20)
    }));
  });
  
  imgStatus.forEach((img, i) => {
    console.log(`  ${i+1}. ${img.src} - complete=${img.complete}, width=${img.naturalWidth}, alt=${img.alt}`);
  });
  
  // 4. Check video element
  console.log('\n4. Background Video:');
  const videoInfo = await page.evaluate(() => {
    const wrappers = ['.bg-video-pixels', '.bg-pixels-wrapper', 'video'];
    const results = {};
    
    wrappers.forEach(sel => {
      const els = document.querySelectorAll(sel);
      results[sel] = {found: els.length > 0, count: els.length};
    });
    
    const video = document.querySelector('video');
    if (video) {
      results.video_detail = {
        src: video.src.substring(0, 50),
        sources: Array.from(video.querySelectorAll('source')).map(s => ({
          type: s.getAttribute('type'),
          src: s.getAttribute('src').substring(0, 40)
        }))
      };
    }
    
    return results;
  });
  
  console.log(`  Video wrapper found: ${videoInfo['.bg-pixels-wrapper'].found}`);
  console.log(`  Video element found: ${videoInfo['video'].found}`);
  if (videoInfo.video_detail) {
    console.log(`  Video sources: ${videoInfo.video_detail.sources.length}`);
  }
  
  // 5. Check scroll trigger initialization
  console.log('\n5. GSAP/ScrollTrigger:');
  const scrollStatus = await page.evaluate(() => {
    return {
      hasGSAP: typeof window.gsap !== 'undefined',
      hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
      hasWebflowIX: typeof window.Webflow !== 'undefined'
    };
  });
  
  console.log(`  GSAP: ${scrollStatus.hasGSAP}`);
  console.log(`  ScrollTrigger: ${scrollStatus.hasScrollTrigger}`);
  console.log(`  Webflow: ${scrollStatus.hasWebflowIX}`);
  
  await browser.close();
}

checkIssues().catch(console.error);
