// Theme: dark by default, light on request. Loaded synchronously in <head> so the page never flashes the wrong theme.
// ?theme=light|dark wins for that visit; the toggle's choice is remembered in this browser only.
(function () {
  var root = document.documentElement;
  var KEY = 'circus.theme';
  var theme = 'dark';
  try {
    var asked = new URLSearchParams(location.search).get('theme');
    var saved = localStorage.getItem(KEY);
    if (asked === 'light' || asked === 'dark') theme = asked;
    else if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) {}
  root.setAttribute('data-theme', theme);
  root.classList.add('js');

  function label(button) {
    var light = root.getAttribute('data-theme') === 'light';
    button.setAttribute('aria-label', button.getAttribute(light ? 'data-to-dark' : 'data-to-light'));
    button.setAttribute('title', button.getAttribute('aria-label'));
  }
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) label(buttons[i]);
  });
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (!button) return;
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    label(button);
  });
})();
