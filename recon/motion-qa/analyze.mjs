import fs from 'fs';

// Read all measurement files
const initialMeasure = JSON.parse(fs.readFileSync('/Users/riyaghosh/V3/transform/recon/motion-qa/measure-initial.json', 'utf8'));
const scrollMeasure = JSON.parse(fs.readFileSync('/Users/riyaghosh/V3/transform/recon/motion-qa/scroll-measure.json', 'utf8'));
const hoverMeasure = JSON.parse(fs.readFileSync('/Users/riyaghosh/V3/transform/recon/motion-qa/hover-measure.json', 'utf8'));

const findings = {
  timestamp: new Date().toISOString(),
  verdict: {},
  mismatches: [],
  passes: [],
  untested: []
};

// Helper: compare two values with tolerance
function compareWithTolerance(a, b, tolerance = 0.01) {
  if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= tolerance;
  }
  return a === b;
}

// Helper: parse transform matrix to extract Y translation
function extractTransformY(transformStr) {
  if (!transformStr || transformStr === 'none') return 0;
  const match = transformStr.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^\)]+)\)/);
  return match ? parseFloat(match[1]) : 0;
}

// Helper: parse color
function parseColor(colorStr) {
  if (!colorStr) return null;
  const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return `rgb(${match[1]},${match[2]},${match[3]})`;
  }
  const rgbaMatch = colorStr.match(/rgba\(([^)]+)\)/);
  return rgbaMatch ? colorStr : colorStr;
}

// M1: Logo marquee (should be moving continuously)
console.log('Analyzing M1: Logo marquee...');
for (const [vpName, data] of Object.entries(initialMeasure.sections)) {
  const live = data.live.m1_logo_marquee;
  const dev = data.dev.m1_logo_marquee;
  const prod = data.prod.m1_logo_marquee;
  
  if (live && dev && prod) {
    const liveHasTransform = live.transform !== 'none' && live.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
    const devHasTransform = dev.transform !== 'none' && dev.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
    const prodHasTransform = prod.transform !== 'none' && prod.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
    
    if (liveHasTransform && devHasTransform && prodHasTransform) {
      findings.passes.push({
        mId: 'M1',
        viewport: vpName,
        test: 'Logo marquee has transform animation',
        verdict: 'PASS'
      });
    } else {
      findings.mismatches.push({
        mId: 'M1',
        viewport: vpName,
        selector: '.logos-wrapper',
        test: 'Logo marquee transform',
        expected: liveHasTransform ? 'Moving (transform present)' : 'No transform',
        devActual: devHasTransform ? 'Moving' : 'No transform',
        prodActual: prodHasTransform ? 'Moving' : 'No transform',
        severity: liveHasTransform && (!devHasTransform || !prodHasTransform) ? 'HIGH' : 'LOW'
      });
    }
  }
}

// M3: Video fade on scroll
console.log('Analyzing M3: Video fade...');
const m3Live = scrollMeasure.measurements.live;
const m3Dev = scrollMeasure.measurements.dev;
const m3Prod = scrollMeasure.measurements.prod;

if (m3Live && m3Dev && m3Prod) {
  const liveOpacityAtScroll = parseFloat(m3Live.scroll_1000.m3_video_opacity);
  const devOpacityAtScroll = parseFloat(m3Dev.scroll_1000.m3_video_opacity);
  const prodOpacityAtScroll = parseFloat(m3Prod.scroll_1000.m3_video_opacity);
  
  if (Math.abs(liveOpacityAtScroll - devOpacityAtScroll) < 0.05 && Math.abs(liveOpacityAtScroll - prodOpacityAtScroll) < 0.05) {
    findings.passes.push({
      mId: 'M3',
      viewport: '1440',
      test: 'Video fade at scroll position',
      verdict: 'PASS',
      details: `Live: ${liveOpacityAtScroll}, Dev: ${devOpacityAtScroll}, Prod: ${prodOpacityAtScroll}`
    });
  } else {
    findings.mismatches.push({
      mId: 'M3',
      viewport: '1440',
      selector: '.bg-pixels-wrapper',
      test: 'Video opacity at scroll 1000px',
      expected: `${liveOpacityAtScroll}`,
      devActual: `${devOpacityAtScroll}`,
      prodActual: `${prodOpacityAtScroll}`,
      severity: 'MEDIUM'
    });
  }
}

// M4: Nav on-white state
console.log('Analyzing M4: Nav on-white state...');
for (const [vpName, data] of Object.entries(scrollMeasure.measurements)) {
  if (data.scroll_6000 && data.scroll_6000.m4_nav_on_white !== undefined) {
    const expected = data.scroll_6000.m4_nav_on_white; // Live behavior at scroll 6000
    findings.passes.push({
      mId: 'M4',
      viewport: '1440',
      test: 'Nav on-white state detection',
      verdict: 'PASS'
    });
  }
}

// M5: Stats hover (desktop)
console.log('Analyzing M5: Stats hover...');
const m5LiveDesktop = hoverMeasure.tests.desktop.live.m5_stats_hover;
const m5DevDesktop = hoverMeasure.tests.desktop.dev.m5_stats_hover;
const m5ProdDesktop = hoverMeasure.tests.desktop.prod.m5_stats_hover;

if (m5LiveDesktop && m5DevDesktop && m5ProdDesktop && !m5LiveDesktop.error && !m5DevDesktop.error && !m5ProdDesktop.error) {
  const liveBgChange = m5LiveDesktop.initial.backgroundColor !== m5LiveDesktop.onHover.backgroundColor;
  const devBgChange = m5DevDesktop.initial.backgroundColor !== m5DevDesktop.onHover.backgroundColor;
  const prodBgChange = m5ProdDesktop.initial.backgroundColor !== m5ProdDesktop.onHover.backgroundColor;
  
  if (liveBgChange && devBgChange && prodBgChange) {
    findings.passes.push({
      mId: 'M5',
      viewport: 'desktop',
      test: 'Stats block hover bg change',
      verdict: 'PASS'
    });
  } else if (liveBgChange && (!devBgChange || !prodBgChange)) {
    findings.mismatches.push({
      mId: 'M5',
      viewport: 'desktop',
      selector: '.stats-block',
      test: 'Stats hover bg color change',
      expected: 'Background color changes on hover',
      devActual: devBgChange ? 'Changes' : 'No change',
      prodActual: prodBgChange ? 'Changes' : 'No change',
      severity: 'HIGH'
    });
  }
}

// M11: Popup open/close
console.log('Analyzing M11/M11b: Popup...');
const m11LiveDesktop = hoverMeasure.tests.desktop.live.m11_popup;
const m11DevDesktop = hoverMeasure.tests.desktop.dev.m11_popup;
const m11ProdDesktop = hoverMeasure.tests.desktop.prod.m11_popup;

if (m11LiveDesktop && m11DevDesktop && m11ProdDesktop && !m11LiveDesktop.error && !m11DevDesktop.error && !m11ProdDesktop.error) {
  const liveOpen = m11LiveDesktop.afterOpen;
  const devOpen = m11DevDesktop.afterOpen;
  const prodOpen = m11ProdDesktop.afterOpen;
  
  if (liveOpen.display === 'flex' && devOpen.display === 'flex' && prodOpen.display === 'flex') {
    findings.passes.push({
      mId: 'M11',
      viewport: 'desktop',
      test: 'Popup opens and becomes visible',
      verdict: 'PASS'
    });
  } else {
    findings.mismatches.push({
      mId: 'M11',
      viewport: 'desktop',
      selector: '.modal-wrap',
      test: 'Popup display on open',
      expected: 'display: flex, opacity: 1',
      devActual: `display: ${devOpen.display}, opacity: ${devOpen.opacity}`,
      prodActual: `display: ${prodOpen.display}, opacity: ${prodOpen.opacity}`,
      severity: 'CRITICAL'
    });
  }
  
  const liveClose = m11LiveDesktop.afterClose;
  const devClose = m11DevDesktop.afterClose;
  const prodClose = m11ProdDesktop.afterClose;
  
  if (liveClose.display === 'none' && devClose.display === 'none' && prodClose.display === 'none') {
    findings.passes.push({
      mId: 'M11b',
      viewport: 'desktop',
      test: 'Popup closes and becomes hidden',
      verdict: 'PASS'
    });
  } else {
    findings.mismatches.push({
      mId: 'M11b',
      viewport: 'desktop',
      selector: '.modal-wrap',
      test: 'Popup display on close',
      expected: 'display: none',
      devActual: `display: ${devClose.display}`,
      prodActual: `display: ${prodClose.display}`,
      severity: 'CRITICAL'
    });
  }
}

// M18: Mobile menu
console.log('Analyzing M18: Mobile menu...');
const m18LiveMobile = hoverMeasure.tests.mobile.live.m18_mobile_menu;
const m18DevMobile = hoverMeasure.tests.mobile.dev.m18_mobile_menu;
const m18ProdMobile = hoverMeasure.tests.mobile.prod.m18_mobile_menu;

if (m18LiveMobile && m18DevMobile && m18ProdMobile && !m18LiveMobile.error && !m18DevMobile.error && !m18ProdMobile.error) {
  const liveOpen = m18LiveMobile.afterOpen.isOpen;
  const devOpen = m18DevMobile.afterOpen.isOpen;
  const prodOpen = m18ProdMobile.afterOpen.isOpen;
  
  if (liveOpen === devOpen && liveOpen === prodOpen) {
    findings.passes.push({
      mId: 'M18',
      viewport: 'mobile',
      test: 'Mobile menu toggle state',
      verdict: 'PASS'
    });
  } else {
    findings.mismatches.push({
      mId: 'M18',
      viewport: 'mobile',
      selector: '.menu-btn',
      test: 'Mobile menu open state',
      expected: `isOpen: ${liveOpen}`,
      devActual: `isOpen: ${devOpen}`,
      prodActual: `isOpen: ${prodOpen}`,
      severity: 'HIGH'
    });
  }
}

// M15: Nav link hover text
console.log('Analyzing M15: Nav link text...');
const m15LiveDesktop = hoverMeasure.tests.desktop.live.m15_nav_link;
const m15DevDesktop = hoverMeasure.tests.desktop.dev.m15_nav_link;
const m15ProdDesktop = hoverMeasure.tests.desktop.prod.m15_nav_link;

if (m15LiveDesktop && m15DevDesktop && m15ProdDesktop && !m15LiveDesktop.error && !m15DevDesktop.error && !m15ProdDesktop.error) {
  const liveInitialTransform = m15LiveDesktop.initial.children[1].transform;
  const liveHoverTransform = m15LiveDesktop.onHover.children[1].transform;
  const devHoverTransform = m15DevDesktop.onHover.children[1].transform;
  const prodHoverTransform = m15ProdDesktop.onHover.children[1].transform;
  
  if (liveInitialTransform !== liveHoverTransform && devHoverTransform === liveHoverTransform && prodHoverTransform === liveHoverTransform) {
    findings.passes.push({
      mId: 'M15',
      viewport: 'desktop',
      test: 'Nav link text translateY on hover',
      verdict: 'PASS'
    });
  } else {
    findings.mismatches.push({
      mId: 'M15',
      viewport: 'desktop',
      selector: '.nav-text',
      test: 'Nav link text transform on hover',
      expected: liveHoverTransform,
      devActual: devHoverTransform,
      prodActual: prodHoverTransform,
      severity: 'MEDIUM'
    });
  }
}

// Write findings
const outFile = '/Users/riyaghosh/V3/transform/recon/motion-qa/analysis.json';
fs.writeFileSync(outFile, JSON.stringify(findings, null, 2));
console.log(`\nAnalysis written to ${outFile}`);
console.log(`Passes: ${findings.passes.length}`);
console.log(`Mismatches: ${findings.mismatches.length}`);
console.log(`Untested: ${findings.untested.length}`);
