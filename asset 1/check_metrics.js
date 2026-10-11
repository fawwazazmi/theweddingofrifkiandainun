const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 8000, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8080/index.html?to=Tamu+Undangan&unlocked=1', { waitUntil: 'networkidle0' });
  
  const metrics = await page.evaluate(() => {
    const mem = document.getElementById('mempelai');
    const cd = document.getElementById('countdown');
    const memRect = mem.getBoundingClientRect();
    const cdRect = cd.getBoundingClientRect();
    const ainun = document.querySelector('img[src*="ainun tdr"]');
    const ainunRect = ainun ? ainun.getBoundingClientRect() : null;
    const cdImg = document.querySelector('.countdown-banner-img');
    const cdImgRect = cdImg ? cdImg.getBoundingClientRect() : null;
    
    return {
      mem: { top: memRect.top, bottom: memRect.bottom, height: memRect.height },
      cd: { top: cdRect.top, bottom: cdRect.bottom, height: cdRect.height },
      ainun: ainunRect ? { top: ainunRect.top, bottom: ainunRect.bottom } : null,
      cdImg: cdImgRect ? { top: cdImgRect.top, bottom: cdImgRect.bottom } : null
    };
  });
  
  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
})();
