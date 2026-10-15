const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH);
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:8765';
const deadline = setTimeout(() => {console.error('Browser checks timed out'); process.exit(1);}, 150000);
deadline.unref();
async function checkWidth(page, label) {
  const size = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth, viewport: innerWidth,
    wide: Array.from(document.querySelectorAll('body *')).filter(el => el.getBoundingClientRect().right > innerWidth + 1).slice(0,5).map(el => el.tagName+'.'+el.className)
  }));
  assert.ok(size.content <= size.viewport+1, label+': '+JSON.stringify(size));
}
(async () => {
 const browser = await chromium.launch({headless:true});
 try {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  await context.route('**/*', route => ['127.0.0.1','cdn.jsdelivr.net'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(base,{waitUntil:'load'});
  await page.locator('#preloader').waitFor({state:'hidden'});
  await page.locator('#menu-toggle').click();
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
  await page.locator('.nav-links a').first().click();
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:900});
    await checkWidth(page,'Invitation at '+width+'px');
  }
  assert.ok(await page.locator('.nav-links').isVisible());
  assert.equal(await page.evaluate(() => eventDate), Date.parse('2026-10-31T09:00:00+02:00'));
  for (const src of await page.locator('img').evaluateAll(images=>images.map(img=>img.getAttribute('src')))) {
    assert.equal((await context.request.get(new URL(src,base).toString())).status(),200,src);
  }
  assert.equal((await context.request.get(base+'/assets/audio/song.mp3')).status(),200);
  console.log('PASS: mobile menu, desktop navigation, event timezone, responsive layout and relocated media assets.');
  assert.deepEqual(errors, []);
 } finally { await browser.close(); }
})().catch(error => {console.error(error.stack);process.exit(1);});
