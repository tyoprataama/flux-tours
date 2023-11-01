/*eslint-disable*/
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}
const showAlert = (type, message) => {
  hideAlert();
  const popUp = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', popUp);
  window.setTimeout(hideAlert, 4000);
}