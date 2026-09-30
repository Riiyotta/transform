import { chromium } from 'playwright';
import fs from 'fs';

async function quickChecks() {
  const results = {};
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://127.0.0.1:5179/', {waitUntil: 'domcontentloaded'});
  
  console.log('=== QUICK CHECKS ===\n');
  
  // 1. Check all data-section markers
  console.log('1. Data-section roots:');
  const sections = await page.evaluate(() => {
    const roots = document.querySelectorAll('[data-section]');
    return Array.from(roots).map(el => ({
      tag: el.tagName,
      class: el.className.substring(0, 40),
      id: el.id || 'none'
    }));
  });
  console.log(`  Found ${sections.length} elements with data-section`);
  
  // 2. Link types
  console.log('\n2. Link validation:');
  const linkData = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return {
      total: links.length,
      external: links.filter(a => a.getAttribute('href').startsWith('http')).length,
      internal: links.filter(a => a.getAttribute('href').startsWith('/')).length,
      anchors: links.filter(a => a.getAttribute('href').startsWith('#')).length,
      mailto: links.filter(a => a.getAttribute('href').startsWith('mailto:')).length,
      tel: links.filter(a => a.getAttribute('href').startsWith('tel:')).length
    };
  });
  console.log(`  Total: ${linkData.total}`);
  console.log(`  External: ${linkData.external}`);
  console.log(`  Internal: ${linkData.internal}`);
  console.log(`  Anchors: ${linkData.anchors}`);
  console.log(`  Mailto: ${linkData.mailto}`);
  
  // 3. Lenis initialization
  console.log('\n3. Lenis smooth scroll:');
  const lenisReady = await page.evaluate(() => {
    return !!(window.Lenis && document.documentElement.classList.contains('lenis'));
  });
  console.log(`  Lenis active: ${lenisReady}`);
  
  // 4. Video status
  console.log('\n4. Background video:');
  const videoStatus = await page.evaluate(() => {
    const video = document.querySelector('video.w-background-video');
    if (!video) return {found: false};
    return {
      found: true,
      playing: !video.paused,
      duration: video.duration.toFixed(2),
      sources: video.querySelectorAll('source').length
    };
  });
  console.log(`  Found: ${videoStatus.found}`);
  if (videoStatus.found) {
    console.log(`  Playing: ${videoStatus.playing}`);
    console.log(`  Duration: ${videoStatus.duration}s`);
    console.log(`  Sources: ${videoStatus.sources}`);
  }
  
  // 5. Form detection
  console.log('\n5. Forms:');
  const forms = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('form, div[data-name*="form"]')).map(f => ({
      id: f.id || 'unknown',
      inputs: f.querySelectorAll('input').length
    }));
  });
  console.log(`  Forms found: ${forms.length}`);
  forms.forEach(f => console.log(`    - ${f.id} (${f.inputs} inputs)`));
  
  // 6. Navigation structure
  console.log('\n6. Navigation:');
  const navData = await page.evaluate(() => {
    const nav = document.querySelector('.nav-menu');
    return {
      fixed: nav ? window.getComputedStyle(nav).position === 'fixed' : false,
      height: nav ? nav.getBoundingClientRect().height : 0,
      hasLogo: !!nav?.querySelector('.logo-wrap'),
      hasMenuBtn: !!document.querySelector('.menu-btn')
    };
  });
  console.log(`  Fixed: ${navData.fixed}`);
  console.log(`  Height: ${navData.height}px`);
  console.log(`  Logo: ${navData.hasLogo}`);
  console.log(`  Menu button: ${navData.hasMenuBtn}`);
  
  // 7. Modal structure
  console.log('\n7. Modal/Popup:');
  const modalData = await page.evaluate(() => {
    const modal = document.querySelector('.modal-wrap');
    if (!modal) return {found: false};
    return {
      found: true,
      fixed: window.getComputedStyle(modal).position === 'fixed',
      hidden: window.getComputedStyle(modal).display === 'none',
      hasForm: !!modal.querySelector('form'),
      hasClose: !!modal.querySelector('.close-popup-wrap')
    };
  });
  console.log(`  Found: ${modalData.found}`);
  if (modalData.found) {
    console.log(`  Fixed: ${modalData.fixed}`);
    console.log(`  Initially hidden: ${modalData.hidden}`);
    console.log(`  Has form: ${modalData.hasForm}`);
    console.log(`  Has close button: ${modalData.hasClose}`);
  }
  
  // 8. Asset status
  console.log('\n8. Image assets:');
  const imageStatus = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    const broken = images.filter(img => !img.complete || img.naturalWidth === 0);
    return {
      total: images.length,
      broken: broken.length,
      srcs: images.map(img => img.src.substring(img.src.length - 30)).filter((s, i) => i < 5)
    };
  });
  console.log(`  Total images: ${imageStatus.total}`);
  console.log(`  Broken: ${imageStatus.broken}`);
  
  // 9. CSS variables
  console.log('\n9. Design tokens (CSS vars):');
  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      black: styles.getPropertyValue('--black'),
      white: styles.getPropertyValue('--white'),
      green: styles.getPropertyValue('--green'),
      blue_light: styles.getPropertyValue('--blue-light')
    };
  });
  console.log(`  --black: ${tokens.black.trim()}`);
  console.log(`  --white: ${tokens.white.trim()}`);
  console.log(`  --green: ${tokens.green.trim()}`);
  console.log(`  --blue-light: ${tokens.blue_light.trim()}`);
  
  results.sections = sections.length;
  results.links = linkData;
  results.lenis = lenisReady;
  results.video = videoStatus;
  results.forms = forms.length;
  results.nav = navData;
  results.modal = modalData;
  results.images = imageStatus;
  
  await browser.close();
  return results;
}

quickChecks().then(r => {
  fs.writeFileSync('/Users/riyaghosh/V3/transform/recon/full-qa/quick-checks.json', JSON.stringify(r, null, 2));
  console.log('\n✓ Quick checks complete');
}).catch(console.error);
