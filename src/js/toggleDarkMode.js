export const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode-bg');

  const elements = [];
  const header = document.querySelector('.header');
  const footer = document.querySelector('.footer');
  const footerT = document.querySelector('.footer-text');
  const forms = document.querySelectorAll('.form');
  const formInput = document.querySelector('.form__input');
  const btn = document.querySelectorAll('.btn');
  const links = document.querySelectorAll('.nav__el');
  const dashboard = document.querySelector('.dashboard__container');
  const table = document.querySelector('.milestones__table');
  const update = document.querySelector('.milestones__update');
  const checkbox = document.querySelector('.checkbox-table');

  elements.push(
    header,
    footer,
    footerT,
    dashboard,
    table,
    update,
    document.querySelector('.shipment-box-detail'),
  );

  elements.forEach((el) => {
    if (el) el.classList.toggle('dark-mode-el');
  });

  if (formInput) formInput.classList.toggle('dark-mode-input');

  btn.forEach((btn) => {
    btn.classList.toggle('dark-mode-btn');
  });

  // links.forEach((link) => {
  //   link.classList.toggle('dark-mode-btn');
  // });

  if (forms)
    forms.forEach((form) => {
      form.classList.toggle('dark-mode-el');
    });

  const boxes = document.querySelectorAll('.shipment-box');
  if (boxes) {
    boxes.forEach((box) => {
      box.classList.toggle('dark-mode-container');
    });
  }

  const labels = document.querySelectorAll('.shipment-box_label');
  if (labels)
    labels.forEach((label) => {
      label.classList.toggle('dark-mode-span');
    });

  const inputs = document.querySelectorAll('.form__input');
  if (inputs)
    inputs.forEach((input) => {
      input.classList.toggle('dark-mode-container');
    });

  if (checkbox) checkbox.classList.toggle('dark-mode-container');
  if (document.querySelector('table'))
    document.querySelector('table').classList.toggle('dark-mode-container');

  if (document.querySelector('.data-submit__container'))
    document
      .querySelector('.data-submit__container')
      .classList.toggle('dark-mode-container');

  if (document.querySelector('.heading-secondary'))
    document
      .querySelectorAll('.heading-secondary')
      .forEach((el) => el.classList.toggle('dark-mode-span'));

  document.querySelector('.footer-text img').src =
    document.querySelector('.footer-text img').src === '/img/OFSicon.png'
      ? '/img/OFSiconDark.png'
      : '/img/OFSicon.png';

  if (document.body.classList.contains('dark-mode-bg')) {
    localStorage.setItem('theme', 'dark-mode');
  } else {
    localStorage.setItem('theme', '');
  }
};
