import { login, logout } from './login';
import { changeStyle } from './changeStyle';
import { viewShipmentLogs } from './opsFunctions';

const currentTheme = localStorage.getItem('theme');
//console.log(currentTheme);
if (currentTheme) {
  changeStyle();
}
const logOutBtn = document.querySelector('.nav__el--logout');
const form = document.querySelector('.form');
const themeBtn = document.querySelector('.theme');
const viewDbxBtn = document.querySelector('.view-dbx');
const checkboxes = document.querySelectorAll('ul input');
const milestones = document.querySelectorAll('input[type="checkbox"]');
const submitBtn = document.querySelector('.submit');
const milestoneBtn = document.querySelector('.btn.milestone');

if (form)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

themeBtn.addEventListener('click', changeStyle);

let id;

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        const idStr = document
          .querySelector(`.user-li--${i}`)
          .textContent.split('/')[1];

        id = idStr;
      }
    }
  });
}
// for (const [checkbox, i] of checkboxes) {
//   console.log(document.querySelector(`li.${i}`).textContent);
//   if (checkbox[i].value === 'on') id = `li.${i}`.textContent;
// }
if (viewDbxBtn) {
  viewDbxBtn.addEventListener('click', () => {
    viewShipmentLogs(id);
  });
}
if (milestoneBtn) {
  milestoneBtn.addEventListener('click', function () {
    console.log('Howdy!');

    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].checked) console.log(milestones[i].className);
    }
  });
}
