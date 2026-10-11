const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 }
  });
  await page.goto('http://127.0.0.1:8080');
  await page.waitForTimeout(2000);

  const rects = await page.evaluate(() => {
    const section = document.querySelector('.countdown-section');
    const canvas = document.querySelector('.countdown-canvas');
    const img = document.querySelector('.countdown-banner-img');
    const widget = document.querySelector('.countdown-widget');
    const grid = document.querySelector('.countdown-timer-grid');
    const days = document.getElementById('days');

    return {
      section: section ? section.getBoundingClientRect() : null,
      canvas: canvas ? canvas.getBoundingClientRect() : null,
      img: img ? img.getBoundingClientRect() : null,
      widget: widget ? widget.getBoundingClientRect() : null,
      grid: grid ? grid.getBoundingClientRect() : null,
      days: days ? days.getBoundingClientRect() : null,
      windowWidth: window.innerWidth
    };
  });

  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
