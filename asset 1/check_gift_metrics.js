const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 12000, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8080/index.html?to=Tamu+Undangan&unlocked=1', { waitUntil: 'networkidle0' });
  
  const metrics = await page.evaluate(() => {
    const gift = document.getElementById('gift');
    const canvas = document.querySelector('.gift-canvas');
    const wrapper = document.querySelector('.gift-slots-wrapper');
    const card = document.querySelector('.gift-slot-card');
    const bubble = document.querySelector('.gift-bubble-bg');
    const content = document.querySelector('.gift-card-content');
    const rsvp = document.getElementById('rsvp');
    
    return {
      rsvp: rsvp.getBoundingClientRect(),
      gift: gift.getBoundingClientRect(),
      canvas: canvas.getBoundingClientRect(),
      wrapper: wrapper.getBoundingClientRect(),
      card: card ? card.getBoundingClientRect() : null,
      bubble: bubble ? bubble.getBoundingClientRect() : null,
      content: content ? content.getBoundingClientRect() : null
    };
  });
  
  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
})();
