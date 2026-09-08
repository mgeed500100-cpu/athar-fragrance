/** Optional, self-contained scroll storytelling. Native commerce is untouched. */
class AtharFragranceJourney extends HTMLElement {
    connectedCallback() {
        if (this.cleanup) return;
        const steps = [...this.querySelectorAll('[data-journey-step]')];
        const bottles = [...this.querySelectorAll('[data-journey-bottle]')];
        if (steps.length < 2 || steps.length !== bottles.length) return;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const space = window.matchMedia('(min-height: 650px)');
        let frame = 0;
        let visible = true;
        let active = -1;
        const rootStyle = getComputedStyle(document.body);
        const color = (name, fallback) => rootStyle.getPropertyValue(name).trim() || fallback;
        const cream = color('--athar-cream', '#F3EFE5');
        const ink = color('--athar-ink', '#211C19');
        const colors = [
            [cream, ink],
            [color('--athar-rose', '#D9AAA8'), ink],
            [color('--athar-amber', '#A87545'), ink],
            [color('--athar-wine', '#5A1825'), '#FFF8ED'],
            [color('--athar-night', '#11100F'), cream],
        ];
        const update = () => {
            frame = 0;
            if (!this.classList.contains('is-enhanced') || !visible) return;
            const target = window.innerHeight * 0.55;
            let next = 0;
            steps.forEach((step, index) => {
                if (step.getBoundingClientRect().top <= target) next = index;
            });
            if (next === active) return;
            active = next;
            bottles.forEach((bottle, index) => bottle.classList.toggle('is-active', index === next));
            const palette = colors[next % colors.length];
            this.style.setProperty('--journey-bg', palette[0]);
            this.style.setProperty('--journey-ink', palette[1]);
            if (this.dataset) this.dataset.atharSurface = next >= 3 ? 'dark' : 'light';
            const counter = this.querySelector?.('[data-journey-count]');
            if (counter) counter.textContent = String(next + 1).padStart(2, '0');
            this.dispatchEvent?.(new CustomEvent('athar:scene', {bubbles:true}));
        };
        const schedule = () => {
            if (!frame && visible && this.classList.contains('is-enhanced')) frame = requestAnimationFrame(update);
        };
        const configure = () => {
            this.classList.toggle('is-enhanced', !motion.matches && space.matches);
            active = -1;
            if (motion.matches || !space.matches) {
                this.style.removeProperty('--journey-bg');
                this.style.removeProperty('--journey-ink');
                if (this.dataset) this.dataset.atharSurface = 'light';
            }
            schedule();
        };
        const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            if (visible) schedule();
        }, {rootMargin: '120px'}) : null;
        observer?.observe(this);
        window.addEventListener('scroll', schedule, {passive: true});
        window.addEventListener('resize', schedule, {passive: true});
        motion.addEventListener('change', configure);
        space.addEventListener('change', configure);
        this.cleanup = () => {
            observer?.disconnect();
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            motion.removeEventListener('change', configure);
            space.removeEventListener('change', configure);
            this.classList.remove('is-enhanced');
            this.style.removeProperty('--journey-bg');
            this.style.removeProperty('--journey-ink');
        };
        configure();
    }
    disconnectedCallback() {
        this.cleanup?.();
        this.cleanup = null;
    }
}

if (!customElements.get('athar-fragrance-journey')) {
    customElements.define('athar-fragrance-journey', AtharFragranceJourney);
}
