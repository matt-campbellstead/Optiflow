export const changeStyle = () => {
  document.body.classList.toggle('dark-mode-bg');

  const elements = [];
  const header = document.querySelector('.header');
  const footer = document.querySelector('.footer');
  const footerT = document.querySelector('.footer-text');
  const form = document.querySelector('.form');
  const formInput = document.querySelector('.form__input');
  const btn = document.querySelectorAll('.btn');
  const links = document.querySelectorAll('.nav__el');
  const dashboard = document.querySelector('.dashboard__container');

  elements.push(header, footer, footerT, form, dashboard);

  elements.forEach((el) => {
    if (el) el.classList.toggle('dark-mode-el');
  });

  if (formInput) formInput.classList.toggle('dark-mode-input');

  btn.forEach((btn) => {
    btn.classList.toggle('dark-mode-btn');
  });

  links.forEach((link) => {
    link.classList.toggle('dark-mode-btn');
  });
  //document.querySelector('.nav__el').classList.toggle('dark-mode-el');

  if (document.body.classList[0].startsWith('dark'))
    localStorage.setItem('theme', 'dark-mode');

  //   if (
  //     document.body.classList.contains('dark-mode-bg') &&
  //     elements.classList.contains('dark-mode-el') &&
  //     btn.classList.contains('dark-mode-btn') &&
  //     links.classList.contains('dark-mode-btn')
  //   ) {
  //     localStorage.setItem('theme', 'dark-mode');
  //   } else {
  //     localStorage.setItem('theme', '');
  //   }
};
