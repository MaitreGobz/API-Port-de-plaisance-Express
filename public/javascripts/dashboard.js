document.addEventListener('submit', function (e) {
  const f = e.target;
  if (!f.matches('.js-rest-form')) return;

  const template = f.getAttribute('data-action-template');
  if (!template) return;

  const idInput  = f.querySelector('[name="id"]');
  const resInput = f.querySelector('[name="idReservation"]');

  let action = template;
  if (idInput && idInput.value) {
    action = action.replace(':id', encodeURIComponent(idInput.value.trim()));
  }
  if (resInput && resInput.value) {
    action = action.replace(':idReservation', encodeURIComponent(resInput.value.trim()));
  }

  console.log('[form submit]', {
    before: f.getAttribute('action'),
    template,
    final: action
  });

  f.setAttribute('action', action);

  if (action.includes(':')) {
  e.preventDefault();
  alert("Formulaire incomplet. Vérifiez les champs.");
  return;
  }
});

document.addEventListener('submit', function (e) {
  const f = e.target.closest('form.js-go-to-show');
  if (!f) return;

  e.preventDefault();

  const template = f.getAttribute('data-template'); // ex: "/catways/:id"
  const id  = (f.querySelector('[name="id"]') || {}).value?.trim() || '';

  if (!template) return;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    alert('Id invalide (24 caractères hexadécimaux attendus).');
    return;
  }

  const href = template.replace(':id', encodeURIComponent(id));
  window.location.href = href;
})
