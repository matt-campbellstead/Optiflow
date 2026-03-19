import { login, logout } from './login';
import { changeStyle } from './changeStyle';
import { viewShipmentLogs } from './opsFunctions';
import { submitMaster } from './submitData';

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  changeStyle();
}
const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.login-form');
const submitDataForm = document.querySelector('.data-form__master');
const themeBtn = document.querySelector('.theme');
const viewDbxBtn = document.querySelector('.view-dbx');
const checkboxes = document.querySelectorAll('ul input');
const submitBtn = document.querySelector('.submit');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
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

if (viewDbxBtn) {
  viewDbxBtn.addEventListener('click', () => {
    viewShipmentLogs(id);
  });
}

if (submitDataForm)
  submitDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const object = {};

    const fileId = document.getElementById('shipment_file_id').value;
    const userId = document.getElementById('users').value;

    object.shipment_file_id = fileId;
    object.users = userId;

    submitMaster(object);
  });
