const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const theme = JSON.parse(read('twilight.json'));

test('independent project metadata', () => {
    assert.equal(theme.repository, 'https://github.com/mgeed500100-cpu/athar-fragrance');
    assert.equal(JSON.parse(read('package.json')).name, 'athar-fragrance');
});
test('Salla review requirements stay current', () => {
    const pkg = JSON.parse(read('package.json'));
    for (const dependency of ['@salla.sa/twilight', '@salla.sa/twilight-components']) {
        const version = pkg.devDependencies[dependency].replace(/^[^0-9]*/, '').split('.').map(Number);
        assert.equal(version[0], 2, `${dependency} major version`);
        assert.equal(version[1], 14, `${dependency} minor version`);
        assert.ok(version[2] >= 575, `${dependency} patch version`);
    }
    const order = read('src/views/pages/customer/orders/single.twig');
    assert.match(order, /<salla-review-factors-tags/);
    assert.match(order, /order-id="\{\{ order\.id \}\}"/);
    assert.match(order, /rating-id="\{\{ item\.rating\.id \}\}"/);
});
test('every declared home component has a Twig template', () => {
    for (const c of theme.components) assert.ok(fs.existsSync(path.join(root, 'src/views/components', c.path.replaceAll('.', '/') + '.twig')), c.path);
    assert.equal(new Set(theme.components.map(c => c.key)).size, theme.components.length);
});
test('theme editor exposes Athar components only', () => {
    assert.ok(theme.components.length > 0);
    assert.ok(theme.components.every(component => component.path.startsWith('home.athar-')));
    assert.equal(theme.features.some(feature => feature.startsWith('component-')), false);
});
test('journey has bounded merchant-editable scenes and no price input', () => {
    const journey = theme.components.find(c => c.path === 'home.athar-journey');
    const scenes = journey.fields.find(f => f.id === 'scenes');
    assert.equal(scenes.maxLength, 5);
    assert.equal(scenes.minLength, 1);
    for (const key of ['image','title','story','top','heart','base','url']) assert.ok(scenes.fields.some(f => f.id === `scenes.${key}`));
    assert.ok(!scenes.fields.some(f => f.id.includes('price')));
});
test('journey translations exist in both locales', () => {
    for (const language of ['ar','en']) {
        const locale = JSON.parse(read(`src/locales/${language}.json`));
        for (const key of ['top','heart','base','discover']) assert.ok(locale.athar.journey[key]);
    }
});
test('entry points include journey source and styles', () => {
    assert.match(read('src/assets/js/home.js'), /athar\/fragrance-journey/);
    assert.match(read('src/assets/styles/app.scss'), /06-athar\/journey/);
    assert.match(read('src/views/pages/index.twig'), /component home/);
});
test('all Athar storefront product sections filter the fragrance catalog', () => {
    const products = read('src/views/components/home/athar-products.twig');
    assert.match(products, /source="search"/);
    assert.doesNotMatch(products, /source="\{\{ latest \? 'latest'/);
    assert.match(products, /athar_catalog_keyword/);
});
test('motion has lifecycle cleanup and reduced-motion handling', () => {
    const js = read('src/assets/js/athar/fragrance-journey.js');
    assert.match(js, /prefers-reduced-motion/);
    assert.match(js, /disconnectedCallback/);
    assert.match(js, /cancelAnimationFrame/);
    assert.doesNotMatch(js, /preventDefault|innerHTML|fetch\(/);
});
