const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/assets/js/athar/fragrance-journey.js'), 'utf8');
function setup(count = 5, reduced = false) {
    const listeners = new Map(), frames = new Map(), registry = new Map();
    const media = {matches: reduced, addEventListener(_, fn) {this.change = fn;}, removeEventListener() {}};
    const space = {...media, matches: true};
    let id = 0, scroll = 0;
    const classes = () => {const values = new Set(); return {
        contains: v => values.has(v), remove: v => values.delete(v),
        toggle(v, on) {on ? values.add(v) : values.delete(v);}
    };};
    const bottles = Array.from({length: count}, () => ({classList: classes()}));
    const steps = bottles.map((_, i) => ({getBoundingClientRect: () => ({top: i * 800 - scroll})}));
    class Element {
        constructor() {this.classList = classes(); this.properties = new Map(); this.style = {
            setProperty: (k,v) => this.properties.set(k,v), removeProperty: k => this.properties.delete(k)
        };}
        querySelectorAll(selector) {return selector.includes('step') ? steps : bottles;}
    }
    vm.runInNewContext(source, {
        HTMLElement: Element, customElements: {get: n => registry.get(n), define: (n,c) => registry.set(n,c)},
        window: {innerHeight: 900, matchMedia: q => q.includes('reduced') ? media : space,
            addEventListener: (n,f) => listeners.set(n,f), removeEventListener: n => listeners.delete(n)},
        requestAnimationFrame: fn => {frames.set(++id, fn); return id;}, cancelAnimationFrame: id => frames.delete(id)
    });
    const element = new (registry.get('athar-fragrance-journey'))();
    const flush = () => {const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn());};
    element.connectedCallback(); flush();
    return {element, bottles, media, space, listeners, frames, flush,
        scrollTo(value) {scroll = value; listeners.get('scroll')?.(); flush();}};
}
test('scroll switches bottles and palette in both directions', () => {
    const h = setup();
    assert.ok(h.bottles[0].classList.contains('is-active'));
    h.scrollTo(3200);
    assert.ok(h.bottles[4].classList.contains('is-active'));
    assert.equal(h.element.properties.get('--journey-bg'), '#11100F');
    assert.equal(h.bottles.filter(b => b.classList.contains('is-active')).length, 1);
    h.scrollTo(800);
    assert.ok(h.bottles[1].classList.contains('is-active'));
});
test('reduced motion and short screens disable enhancement', () => {
    const h = setup(5, true);
    assert.ok(!h.element.classList.contains('is-enhanced'));
    h.media.matches = false; h.media.change(); h.flush();
    assert.ok(h.element.classList.contains('is-enhanced'));
    h.space.matches = false; h.space.change(); h.flush();
    assert.ok(!h.element.classList.contains('is-enhanced'));
});
test('single and empty scenes do not attach scroll listeners', () => {
    for (const count of [0,1]) assert.equal(setup(count).listeners.size, 0);
});
test('disconnect removes listeners; reconnect initializes cleanly', () => {
    const h = setup();
    h.element.disconnectedCallback();
    assert.equal(h.listeners.size, 0);
    assert.equal(h.frames.size, 0);
    h.element.connectedCallback(); h.flush();
    assert.equal(h.listeners.size, 2);
    assert.ok(h.element.classList.contains('is-enhanced'));
});
