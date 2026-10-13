'use strict';
const toggle = document.querySelector('#mobile-nav-toggle');
const menu = document.querySelector('#mobile-menu');
function closeMenu() {
  menu.classList.add('hidden');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const opening = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !opening);
  toggle.setAttribute('aria-expanded', String(opening));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
    closeMenu();
    toggle.focus();
  }
});
const desktop = window.matchMedia('(min-width: 768px)');
desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });
const navLinks = document.querySelectorAll('header nav a, #mobile-menu a[data-path]');
function markSection(id) {
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === '#' + id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
// Remove the original static Home highlight; the visible section controls it.
document.querySelector('header nav a').classList.remove('bg-primary-container', 'text-on-primary-container', 'font-semibold');
let scheduled = false;
function updateSection() {
  const sections = [...document.querySelectorAll('main section[id]')];
  let current = sections[0].id;
  for (const section of sections) if (section.getBoundingClientRect().top <= 160) current = section.id;
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
  markSection(current);
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateSection); }
}, { passive: true });
updateSection();
const email = document.querySelector('#email-text').textContent.trim();
document.querySelector('#copy-email-btn').addEventListener('click', async () => {
  const label = document.querySelector('#copy-text');
  try {
    await navigator.clipboard.writeText(email);
    label.textContent = '복사됨!';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#email-text'));
    selection.removeAllRanges();
    selection.addRange(range);
    label.textContent = '직접 복사';
  }
  setTimeout(() => { label.textContent = '복사'; }, 2500);
});
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const value = id => document.getElementById(id).value.trim();
  const body = `성함: ${value('contact-name')}\n이메일: ${value('contact-email')}\n\n${value('contact-message')}`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(value('contact-subject'))}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-feedback').classList.remove('hidden');
});
