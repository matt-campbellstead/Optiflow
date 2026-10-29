import { logout } from './login';
import { toggleDarkMode } from './toggleDarkMode';

import {
  updateTimeline,
  getAndRenderTable,
  filterData,
  getData,
} from './opsFunctions';

import {
  attachBtnListeners,
  hideElementsExceptFirst,
  convertTableName,
  prepareButtonUI,
  makeRequestWithButtonUI,
  hideElAndDisplayMessage,
} from './functions';

import {
  iterator,
  initialize,
  customerIdArray,
  consigneesIdArray,
  metaArray,
  setObject,
  locations,
} from './data'; //TODO: move to ./functions.js

import { showAlert } from './alert';

import { displayMap } from './mapbox';

const currentTheme = localStorage.getItem('theme');

if (currentTheme) toggleDarkMode();

const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.login-form');
const submitDataForm = document.querySelector('.data-form__master');
const submitShipperForm = document.querySelector('.data-form__shipper');
const submitFinancialsForm = document.querySelector('.data-form__financials');
const submitCustomsForm = document.querySelector('.data-form__customs');
const submitDetailsForm = document.querySelector('.data-form__details');
const submitConveyanceForm = document.querySelector('.data-form__conveyance');
const timelineForm = document.querySelector('.data-form__timeline');
const customersForm = document.querySelector('.data-form__customers');
const consigneesForm = document.querySelector('.data-form__consignees');
const themeBtn = document.querySelector('.theme');
const showCustomerFormBtn = document.querySelector('.show-form');
const activationBtn = document.querySelector('.activation-btn');
const resetPasswordInitForm = document.querySelector(
  '.reset-password-init-form',
);
const resetPasswordActionForm = document.querySelector(
  '.reset-password-action-form',
);
const signUpForm = document.querySelector('.sign-up-form');
const errorMsg = document.querySelector('.error__msg');
const uploadsForm = document.querySelector('.file-uploads-form');

const formElements = [];
formElements.push(
  submitShipperForm,
  submitFinancialsForm,
  submitCustomsForm,
  submitDetailsForm,
  submitConveyanceForm,
  timelineForm,
  consigneesForm,
);

for (const el of formElements) if (el) initialize(el);

if (
  errorMsg &&
  errorMsg.textContent === 'You are not logged in! Please log in to get access'
) {
  document.querySelector('.refresh-box').classList.remove('hidden');
  document.querySelector('.refresh-btn').addEventListener('click', function () {
    prepareButtonUI(this);
    makeRequestWithButtonUI('refresh', null, this).then(() =>
      document.querySelector('.refresh-box').classList.add('hidden'),
    );
  });
}

if (uploadsForm)
  uploadsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('pdf', document.getElementById('file-input').files[0]);

    const btn = document.querySelector('.form__group .btn');
    prepareButtonUI(btn);
    makeRequestWithButtonUI('upload', { data: form }, btn);
  });

if (document.getElementById('map'))
  try {
    displayMap(locations);
  } catch (error) {
    console.error(error);
  }

if (signUpForm) {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    if (password !== passwordConfirm)
      return showAlert(
        'error',
        'Your password and password confirm do not match. Please try again.',
      );

    const btn = document.querySelector('.form__group .btn');
    const elementToHide = document.querySelector('form');
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'signUp',
      { name, email, password, passwordConfirm },
      btn,
    ).then((result) =>
      result === true ? hideElAndDisplayMessage(elementToHide) : '',
    );
  });
}

if (activationBtn) {
  const token = window.location.search.split('=')[1];

  activationBtn.addEventListener('click', async function () {
    const btn = this;

    prepareButtonUI(btn);
    makeRequestWithButtonUI('activation', { token }, btn).then((result) =>
      result === true ? hideElAndDisplayMessage(btn) : '',
    );
  });
}

if (resetPasswordInitForm) {
  resetPasswordInitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const btn = document.querySelector('.form__group .btn');
    const elementToHide = document.querySelector('form');
    prepareButtonUI(btn);
    makeRequestWithButtonUI('resetInit', { email }, btn).then((result) =>
      result === true ? hideElAndDisplayMessage(elementToHide) : '',
    );
  });
}

if (resetPasswordActionForm) {
  const token = window.location.search.split('=')[1];
  console.log(token);

  resetPasswordActionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password').value;
    const passwordConfirmInput =
      document.getElementById('passwordConfirm').value;

    const btn = document.querySelector('.form__group .btn');
    const elementToHide = document.querySelector('form');
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'resetAction',
      { passwordInput, passwordConfirmInput, token },
      btn,
    ).then((result) =>
      result === true ? hideElAndDisplayMessage(elementToHide) : '',
    );
  });
}

if (loginForm)
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('login-btn');
    prepareButtonUI(btn);
    makeRequestWithButtonUI('login', { email, password }, btn);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

themeBtn.addEventListener('click', toggleDarkMode);

if (window.location.pathname === '/ops-data') {
  if (!document.querySelector('.error__msg'))
    document.querySelectorAll('.container').forEach((element) => {
      element.style.margin = '1rem';
      element.style.justifyContent = 'start';
    });

  let count = 0;
  const allForms = document.querySelectorAll('.form');

  document
    .querySelector('.next-shipment')
    .addEventListener('click', function () {
      allForms[count].classList.add('hidden');

      count++;

      if (count + 2 === allForms.length) this.setAttribute('disabled', true);

      if (count === 1)
        document
          .querySelector('.previous-shipment')
          .removeAttribute('disabled');

      if (count > 0) {
        // hide customer selector and show master selector
        // hide instructions block
        document
          .querySelector('.selector-box.customer1')
          .classList.add('hidden');
        document
          .querySelector('.selector-box.master')
          .classList.remove('hidden');
        document.querySelector('.instruction-box').classList.add('hidden');
      }

      if (count < 1)
        document
          .querySelector('.previous-shipment')
          .setAttribute('disabled', true);

      allForms[count].classList.remove('hidden');

      window.location.assign('#form-top');
    });

  document.querySelector('.previous-shipment').setAttribute('disabled', true);

  document
    .querySelector('.previous-shipment')
    .addEventListener('click', function () {
      allForms[count].classList.add('hidden');

      count--;

      if (count + 1 < allForms.length)
        document.querySelector('.next-shipment').removeAttribute('disabled');

      if (count < 1) {
        document
          .querySelector('.selector-box.customer1')
          .classList.remove('hidden');
        document.querySelector('.selector-box.master').classList.add('hidden');
        this.setAttribute('disabled', true);
      }

      allForms[count].classList.remove('hidden');

      window.location.assign('#form-top');
    });

  const allSubmitButtons = document.querySelectorAll(
    '.form__group .btn.submit',
  );

  submitDataForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    const object = {};
    object.shipment_file_id = document.getElementById('shipment_file_id').value;
    object.users = document.getElementById('users').value;
    object.CustomerId = document.getElementById('CustomerId').value;
    makeRequestWithButtonUI('submit', { object, tableName: 'master' }, btn);
  });

  submitShipperForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const shipperObj = setObject(
      metaArray.find((el) => el.name === 'Shippers').array,
    );
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'submit',
      { object: shipperObj, tableName: 'shippers' },
      btn,
    );
  });

  submitFinancialsForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const financialsObj = setObject(
      metaArray.find((el) => el.name === 'Financials').array,
    );
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'submit',
      { object: financialsObj, tableName: 'financials' },
      btn,
    );
  });

  submitCustomsForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const customsObj = setObject(
      metaArray.find((el) => el.name === 'Customs').array,
    );
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'submit',
      { object: customsObj, tableName: 'customs' },
      btn,
    );
  });

  submitDetailsForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const detailsObj = setObject(
      metaArray.find((el) => el.name === 'Shipment-details').array,
    );
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'submit',
      { object: detailsObj, tableName: 'shipment-details' },
      btn,
    );
  });

  submitConveyanceForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const conveyanceObj = setObject(
      metaArray.find((el) => el.name === 'Conveyance').array,
    );
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI(
      'submit',
      { object: conveyanceObj, tableName: 'conveyance' },
      btn,
    );
  });

  timelineForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const object = {};
    object.timelineMasterId = document.getElementById('timelineMasterId').value;
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI('submit', { object, tableName: 'timeline' }, btn);
  });

  customersForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const object = {};
    for (const key of metaArray.find((el) => el.name === 'Customers').array) {
      object[key] = null;
    }
    customerIdArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      el = el.split('_');
      let key = iterator(object, el[0]);
      object[key] = node.value;
    });
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI('submit', { object, tableName: 'customers' }, btn);
  });

  consigneesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    let object = {};
    for (const key of metaArray.find((el) => el.name === 'Consignees').array) {
      object[key] = null;
    }
    consigneesIdArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      el = el.split('_');
      let key = iterator(object, el[0]);
      object[key] = node.value;
    });
    const btn = allSubmitButtons[count];
    prepareButtonUI(btn);
    makeRequestWithButtonUI('submit', { object, tableName: 'consignees' }, btn);
  });

  let isHidden = true;

  if (showCustomerFormBtn) {
    const lastContainerElement = Array.from(
      document.querySelectorAll('.container'),
    ).findLast((el) => el);

    lastContainerElement.classList.add('hidden');

    showCustomerFormBtn.addEventListener('click', () => {
      isHidden
        ? lastContainerElement.classList.remove('hidden')
        : lastContainerElement.classList.add('hidden');

      isHidden = isHidden ? false : true;
    });
  }

  document
    .querySelector('.selector-box.customer1 button')
    .addEventListener('click', () => {
      const selection = document.querySelector(
        '.selector-box.customer1 select',
      ).value;

      // make axios request
      getData(
        `${process.env.API_CALL_URL}/api/v1/data/customers/?companyName=${selection}`,
      )
        .then((data) => {
          if (!data.query) {
            return showAlert(
              'error',
              'There is no customer entry for that user (not yet)!',
            );
          }
          // use the returned response data to fill in the fields
          document.getElementById('users').value = data.query.userId;
          document.getElementById('CustomerId').value = data.query.id;
        })
        .catch((err) => console.error(err));
    });

  document
    .querySelector('.selector-box.master button')
    .addEventListener('click', function () {
      let selection = document
        .querySelector('.selector-box.master select')
        .value.split(' ')[2];

      const allForms = Array.from(this.parentElement.parentElement.children);

      const currentForm = allForms.findLast(
        (el) => !Array.from(el.classList).some((el) => el === 'hidden'),
      );

      if (currentForm === allForms[allForms.length - 1])
        currentForm.children[2].children[1].value = selection.slice(0, -1);
      else currentForm.children[1].children[1].value = selection.slice(0, -1);
    });

  document
    .querySelector('.selector-box.customer2 button')
    .addEventListener('click', () => {
      const selection = document.querySelector(
        '.selector-box.customer2 select',
      ).value;

      getData(`${process.env.API_CALL_URL}/api/v1/users/?name=${selection}`)
        .then((data) => {
          console.log(data);
          if (!data.user)
            showAlert('error', 'There was a problem getting this user');

          // use the returned response data to fill in the field
          document.getElementById('userId').value = data.user._id;
        })
        .catch((err) => console.error('Oops, there was an error', err));
    });
}

const milestoneBool = document.querySelectorAll('td');

if (milestoneBool)
  milestoneBool.forEach((el) => {
    if (el.textContent === 'true') el.classList.add('truthy');
  });

if (document.querySelector('.timeline-select'))
  document
    .querySelector('.timeline-id__submit')
    .addEventListener('click', () => {
      // Preparing arguments for update function
      const timelineId = document.querySelector('.timeline-id').value;
      let object = {};
      // for (const x of metaArray.find((el) => el.name === 'Timelines').array) {
      //   object[x] = null;
      // }
      // 1) Specify which timeline field the user is selecting
      let input = document.querySelector('.timeline-select').value;

      // 2) Convert the string using string and array methods
      input = input.replace('/', ' ');
      let arrayOfStrings = input.split(' ');
      console.log('1)', arrayOfStrings);

      for (let i = 0; i < arrayOfStrings.length; i++)
        arrayOfStrings[i] = arrayOfStrings[i].toLowerCase();

      if (arrayOfStrings.length >= 3) arrayOfStrings.pop();

      let arrayOfStringsCopy = [...arrayOfStrings];
      console.log('2) ', arrayOfStringsCopy);

      arrayOfStrings = arrayOfStrings.join('_');
      console.log('3) ', arrayOfStrings);

      // 3) Loop through the keys array to match input to a key
      let key;

      metaArray
        .find((el) => el.name === 'Timelines')
        .array.forEach((el) => (arrayOfStrings.includes(el) ? (key = el) : ''));
      // if (arr.includes(el))
      //   key = el );

      // object[key] = 'true';
      object[key] = true;

      // Get date input and add it to the object
      const dateInput = document.querySelector('.timeline-date').value;

      for (let i = 0; i <= 3; i++)
        while (arrayOfStringsCopy.length >= 3) arrayOfStringsCopy.pop();

      arrayOfStringsCopy.push('date');
      arrayOfStringsCopy = arrayOfStringsCopy.join('_');

      object[arrayOfStringsCopy] = dateInput;

      console.log('Data object before function call: ', object);
      // Call the update function with the ID and object as arguments
      updateTimeline(timelineId, object);
    });

if (window.location.pathname === '/me') {
  document
    .querySelector('.change-password-form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {};
      data.passwordCurrent = document.getElementById('password-current').value;
      data.password = document.getElementById('password').value;
      data.passwordConfirm = document.getElementById('password-confirm').value;
      if (data.password !== data.passwordConfirm)
        return showAlert(
          'error',
          'Your password and password confirm do not match. Please try again.',
        );
      const btn = document.querySelector('.btn');
      prepareButtonUI(btn);
      makeRequestWithButtonUI('changePassword', { data }, btn);
    });
}

if (
  window.location.pathname === '/dashboard' ||
  window.location.pathname === '/my-files' ||
  window.location.pathname === '/me'
) {
  document.querySelectorAll('.container').forEach((container) => {
    container.style.marginTop = '10vh auto';
    //container.style.marginLeft = '1rem';
  });
  document.querySelectorAll('.shipment-box').forEach((box) => {
    box.style.display = 'grid';
    box.style.gridTemplateColumns = '1fr 1fr';
    box.style.border = '1px solid #bbb';
  });
}

let filePaginationCount = 0;

if (window.location.pathname === '/ops-dashboard') {
  let fileContainerElements = document.querySelectorAll('.file__container');
  let fileTableElements = document.querySelectorAll('.shipment-box-detail');

  document
    .querySelectorAll('.file__container .heading-secondary')
    .forEach((element) => (element.style.color = 'white'));

  hideElementsExceptFirst(fileContainerElements);

  hideElementsExceptFirst(fileTableElements);

  document.querySelectorAll('.table-nav-box button').forEach((button) => {
    button.addEventListener('click', function () {
      attachBtnListeners(this);
    });
  });

  document
    .querySelector('.next-shipment')
    .addEventListener('click', function () {
      fileContainerElements[filePaginationCount].classList.add('hidden');

      filePaginationCount++;

      if (filePaginationCount + 1 === fileContainerElements.length)
        this.setAttribute('disabled', true);

      if (filePaginationCount === 1)
        document
          .querySelector('.previous-shipment')
          .removeAttribute('disabled');

      if (filePaginationCount < 1)
        document
          .querySelector('.previous-shipment')
          .setAttribute('disabled', true);

      fileContainerElements[filePaginationCount].classList.remove('hidden');
    });

  document.querySelector('.previous-shipment').setAttribute('disabled', true);

  document
    .querySelector('.previous-shipment')
    .addEventListener('click', function () {
      fileContainerElements[filePaginationCount].classList.add('hidden');

      filePaginationCount--;

      if (filePaginationCount + 1 < fileContainerElements.length)
        document.querySelector('.next-shipment').removeAttribute('disabled');

      if (filePaginationCount < 1) this.setAttribute('disabled', true);

      fileContainerElements[filePaginationCount].classList.remove('hidden');
    });

  document.querySelector('.filter-apply').addEventListener('click', () => {
    const userSelection = document.querySelector('.filter-select').value;
    let parameter;
    // make axios request with query string to /api/v1/data/

    if (userSelection === 'Imports') parameter = '?routing=Import';

    if (userSelection === 'Exports') parameter = '?routing=Export';

    if (userSelection === 'Past shipments') parameter = '?isCurrent=false';

    filterData(parameter)
      .then(() => {
        // hide elements after the first ones in each set
        fileContainerElements = document.querySelectorAll('.file__container');
        fileTableElements = document.querySelectorAll('.shipment-box-detail');
        hideElementsExceptFirst(fileContainerElements);
        hideElementsExceptFirst(fileTableElements);

        // reset filePaginationCount"
        filePaginationCount = 0;
        document
          .querySelector('.previous-shipment')
          .setAttribute('disabled', true);
        if (fileContainerElements.length === 1)
          document
            .querySelector('.next-shipment')
            .setAttribute('disabled', true);

        // reattach listeners to buttons '.file-editor-btn'
        document.querySelectorAll('.table-nav-box button').forEach((button) => {
          button.addEventListener('click', function () {
            attachBtnListeners(this);
          });
        });

        // update 'number of files'  teext
        document.querySelector('.file-count-text').textContent =
          `Number of files: ${fileContainerElements.length}`;
      })
      .catch((err) => console.error('Filter function error: ', err));
  });

  document
    //.getElementById('edit-file-link')
    .querySelectorAll('#edit-file-link')
    .forEach((button) => {
      button.addEventListener('click', function () {
        let currentTable;

        for (const element of this.parentElement.children[5].children) {
          if (!Array.from(element.classList).some((el) => el === 'hidden')) {
            currentTable = element;
            break;
          }
        }

        console.log(currentTable.childNodes[0].data);
        console.log(
          currentTable.children[0].children[0].children[0].children[1]
            .textContent,
        );

        // split the table name getter switch block into its own function then use it here
        window.location.assign(
          `/ops-update/?table=${convertTableName(currentTable.childNodes[0].data.trim())}&?id=${
            currentTable.children[0].children[0].children[0].children[1]
              .textContent
          }`,
        );
      });
    });
}

if (window.location.pathname === '/ops-update/') {
  const table = window.location.search.split('&')[0].slice(7);
  const id = window.location.search.split('&')[1].slice(4);

  document.querySelector('.dashboard__container').style.display = 'flex';
  document.querySelector('.dashboard__container').style.flexDirection =
    'column';
  document.querySelector('.dashboard__container').style.justifyContent =
    'center';
  document.querySelector('.dashboard__container').style.alignItems = 'center';

  let originalFieldData;

  getAndRenderTable(table, id)
    .then(() => {
      document.querySelectorAll('table button').forEach((button) => {
        button.style.margin = '0.15rem';

        button.addEventListener('click', function () {
          // Insert cancel button
          this.parentElement.parentElement.children[2].insertAdjacentHTML(
            'afterbegin',
            "<button class='file-editor-btn cancel-btn' type='button'>Cancel</button>",
          );
          document.querySelector('.cancel-btn').style.margin = '0.15rem';

          // add event listener to new button
          document
            .querySelector('.cancel-btn')
            .addEventListener('click', function () {
              document.querySelector('.form__input').remove();
              this.parentElement.parentElement.children[1].textContent =
                originalFieldData;
              this.remove();
            });

          // Save text content of field in case of cancellation
          originalFieldData =
            this.parentElement.parentElement.children[1].textContent;

          // Empty text content of field and replace with input element
          this.parentElement.parentElement.children[1].textContent = '';

          this.parentElement.parentElement.children[1].insertAdjacentHTML(
            'afterbegin',
            "<input class='form__input'></input>",
          );

          document
            .querySelectorAll('.form__input')
            .forEach((element) => (element.style.width = '100%'));
        });
      });
    })
    .catch((err) => console.error('Oh noooo,', err));

  document
    .querySelector('.update-btn')
    .addEventListener('click', async function () {
      const updateObject = {};

      document.querySelectorAll('.form__input').forEach((input) => {
        updateObject[input.parentElement.parentElement.children[0].innerText] =
          input.value;
      });

      const btn = this;
      prepareButtonUI(btn);
      makeRequestWithButtonUI('update', { updateObject, table, id }, btn);
    });
}
