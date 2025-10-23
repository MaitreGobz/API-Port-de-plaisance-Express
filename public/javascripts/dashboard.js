document.addEventListener('submit', function (e) {
  const f = e.target;
  if (!f.matches('.js-rest-form')) return;

  const template = f.getAttribute('data-action-template');
  if (!template) return;

  const idInput  = f.querySelector('[name="id"]');
  const resInput = f.querySelector('[name="reservationId"]');

  let action = template;
  if (idInput && idInput.value) {
    action = action.replace(':id', encodeURIComponent(idInput.value.trim()));
  }
  if (resInput && resInput.value) {
    action = action.replace(':reservationId', encodeURIComponent(resInput.value.trim()));
  }

  console.log('[form submit]', {
    before: f.getAttribute('action'),
    template,
    final: action
  });

  f.setAttribute('action', action);
});
