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
test('every declared home component has a Twig template', () => {
    for (const c of theme.components) assert.ok(fs.existsSync(path.join(root, 'src/views/components', c.path.replaceAll('.', '/') + '.twig')), c.path);
    assert.equal(new Set(theme.components.map(c => c.key)).size, theme.components.length);
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
test('motion has lifecycle cleanup and reduced-motion handling', () => {
    const js = read('src/assets/js/athar/fragrance-journey.js');
    assert.match(js, /prefers-reduced-motion/);
    assert.match(js, /disconnectedCallback/);
    assert.match(js, /cancelAnimationFrame/);
    assert.doesNotMatch(js, /preventDefault|innerHTML|fetch\(/);
});
