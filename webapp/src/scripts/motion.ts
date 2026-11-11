/**
 * The site's motion layer (site starter kit): parts of a section rise in once as it enters, figures count up.
 * Nothing is hidden before the script runs: an element is only animated from the moment it enters the view, so
 * content stays readable without JavaScript and is never stuck invisible. Off under prefers-reduced-motion.
 */

const RISE = '[data-rise] > *, .panel, .wcard';

function start() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement);
      entering.forEach((element, index) => {
        observer.unobserve(element);
        if (element.dataset.count !== undefined) countUp(element);
        else rise(element, index);
      });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  document.querySelectorAll<HTMLElement>(`${RISE}, [data-count]`).forEach((element) => observer.observe(element));
}

function rise(element: HTMLElement, index: number) {
  element.style.setProperty('--rise-delay', `${Math.min(index, 6) * 70}ms`);
  element.classList.add('is-rising');
  element.addEventListener('animationend', () => element.classList.remove('is-rising'), { once: true });
}

/** Counts from 0 to the number already written in the element (ease-out, about 1.4 s). */
function countUp(element: HTMLElement) {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target) || target === 0) return;
  const final = element.textContent ?? '';
  const duration = 1400;
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / duration);
    element.textContent = k < 1 ? String(Math.round(target * (1 - Math.pow(1 - k, 3)))) : final;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

start();
