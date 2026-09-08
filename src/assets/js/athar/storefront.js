/** Progressive enhancement only: the store is readable before this module runs. */
const initializeAthar = () => {
    if (!document.body.classList.contains('athar-theme')) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('.athar-header');
    let frame = 0;
    const updateHeader = () => {
        frame = 0;
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 32);
        // Resolve the surface below the header, not arbitrary dominant image colors.
        let surface = null;
        const sample = header.getBoundingClientRect().bottom + 4;
        document.querySelectorAll('[data-athar-surface]').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= sample && rect.bottom > sample) surface = section;
        });
        header.classList.toggle('is-on-dark', surface?.dataset.atharSurface === 'dark');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateHeader); };
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule, {passive:true});
    document.addEventListener('athar:scene', schedule);
    updateHeader();

    document.querySelectorAll('[data-athar-search]').forEach(trigger => {
        trigger.addEventListener('click', event => {
            const search = document.querySelector('salla-search');
            if (typeof search?.open === 'function') {event.preventDefault(); search.open();}
        });
    });
    document.querySelectorAll('[data-athar-pause]').forEach(button => {
        button.addEventListener('click', () => {
            const pressed = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(pressed));
            button.closest('.athar-marquee')?.classList.toggle('is-paused', pressed);
        });
    });

    // Keep automatic storefronts compact when the connected demo catalog has no matching items.
    document.querySelectorAll('.athar-products salla-products-list, .athar-product-story salla-products-list').forEach(list => {
        const section = list.closest('.athar-products, .athar-product-story');
        const syncCatalogState = () => {
            const hasProducts = Boolean(list.querySelector('.s-product-card-entry'));
            const hasFinishedEmpty = Boolean(list.querySelector('.s-products-list-placeholder'));
            section?.classList.toggle('athar-catalog-empty', hasFinishedEmpty && !hasProducts);
        };
        new MutationObserver(syncCatalogState).observe(list, {childList:true, subtree:true});
        syncCatalogState();
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}
        }), {threshold:0.08});
        document.querySelectorAll('.athar-reveal').forEach(el => {
            if (reduced.matches) return;
            el.classList.add('will-reveal'); observer.observe(el);
        });
        reduced.addEventListener('change', () => {
            if (reduced.matches) {document.querySelectorAll('.will-reveal').forEach(el => el.classList.remove('will-reveal')); observer.disconnect();}
        });
    }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAthar, {once:true});
else initializeAthar();
