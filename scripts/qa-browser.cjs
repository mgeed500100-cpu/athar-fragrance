// Local layout/interaction checks only. Salla web components are not emulated.
// QA_TWIG_MODULE and QA_PLAYWRIGHT_MODULE can point to externally installed packages.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
const Twig = require(process.env.QA_TWIG_MODULE || 'twig');
const {chromium} = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = process.env.QA_OUTPUT || require('node:os').tmpdir();
Twig.extendFilter('asset', value => '/public/' + value);
Twig.extendFilter('cdn', value => value);
let locale;
Twig.extendFunction('trans', key => key.split('.').reduce((obj, part) => obj?.[part], locale) || key);
Twig.extendFunction('link', value => value === '/' ? '/' : '/' + value);
const files = fs.readdirSync(path.join(root,'src/views/components/home')).filter(f => f.startsWith('athar-')).map(f => ['components.home.'+f.slice(0,-5),'src/views/components/home/'+f]);
files.push(['components.athar.bottle','src/views/components/athar/bottle.twig'],['components.athar.storefront','src/views/components/athar/storefront.twig'],['header','src/views/components/header/athar-header.twig']);
for (const [id,file] of files) Twig.twig({id,data:fs.readFileSync(path.join(root,file),'utf8'),allowInlineIncludes:true,rethrow:true});
const errors=[];
if (process.argv.includes('--templates-only')) {
    for (const lang of ['ar','en']) {
        locale=JSON.parse(fs.readFileSync(path.join(root,'src/locales/'+lang+'.json')));
        for (const url of [undefined,'javascript:alert(1)','https://example.com/signup']) {
            const context={component:{},theme:{mode:'live',settings:{get:(key,fallback)=>key==='athar_newsletter_url'?url:fallback}},store:{name:'Athar',url:'/',settings:{},social:[]}};
            const html=Twig.twig({ref:'components.athar.storefront'}).render(context);
            assert.equal((html.match(/data-journey-step/g)||[]).length,5);
            assert.ok(html.includes('source="latest"'));
            assert.ok(html.includes('row-cards'));
            assert.equal(html.includes('class="athar-section athar-newsletter"'),url==='https://example.com/signup');
            assert.ok(!html.includes('javascript:'));
            assert.ok(!html.includes('athar.story.title'));
        }
    }
    console.log('PASS: Arabic/English composition, five scenes, latest source, native spotlight and missing/unsafe/HTTPS signup settings.');
    process.exit(0);
}
const server=http.createServer((req,res)=>{
    const file=path.resolve(root,'.'+decodeURI(req.url));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
    res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/javascript');
    res.end(fs.readFileSync(file));
});
(async()=>{
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const origin='http://127.0.0.1:'+server.address().port;
    const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
    try {
        for (const lang of ['ar','en']) for(const width of [360,390,768,1440]) {
            locale=JSON.parse(fs.readFileSync(path.join(root,'src/locales/'+lang+'.json')));
            const context={component:{},theme:{mode:'live',settings:{get:(_,fallback)=>fallback}},store:{name:'Athar',url:'/',settings:{},social:[]}};
            const body=Twig.twig({ref:'header'}).render(context)+Twig.twig({ref:'components.athar.storefront'}).render(context);
            const page=await browser.newPage({viewport:{width,height:900}});
            page.on('pageerror',e=>errors.push(e.message));
            await page.setContent(`<html dir="${lang==='ar'?'rtl':'ltr'}" lang="${lang}"><head><base href="${origin}"><link rel="stylesheet" href="/public/app.css"></head><body class="athar-theme"><main>${body}</main></body></html>`);
            await page.addScriptTag({path:path.join(root,'src/assets/js/athar/fragrance-journey.js')});
            await page.addScriptTag({path:path.join(root,'src/assets/js/athar/storefront.js')});
            await page.evaluate(()=>document.fonts.ready);
            const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('.athar-hero__copy,.athar-hero__note,.athar-actions,.athar-nav__actions')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1||r.left< -1}).map(e=>e.className)}));
            assert.ok(geometry.scroll<=width+1,JSON.stringify({lang,width,geometry}));
            assert.deepEqual(geometry.bad,[],JSON.stringify({lang,width,geometry}));
            await page.screenshot({path:path.join(output,`athar-${lang}-${width}.png`)});
            const steps=page.locator('[data-journey-step]');
            for(let i=0;i<5;i++) {await steps.nth(i).scrollIntoViewIfNeeded();await page.waitForTimeout(80);assert.equal(await page.locator('[data-journey-count]').textContent(),String(i+1).padStart(2,'0'));}
            await page.emulateMedia({reducedMotion:'reduce'});
            assert.equal(await page.locator('athar-fragrance-journey').evaluate(e=>e.classList.contains('is-enhanced')),false);
            await page.close();
        }
        assert.deepEqual(errors,[]);
        console.log('PASS: 8 RTL/LTR viewports, horizontal containment, five scene changes, reduced motion, no browser JS errors. Native commerce and live Salla are NOT covered.');
    } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1});
