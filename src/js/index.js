import { login, logout } from './login';
import { toggleDarkMode } from './toggleDarkMode';

import {
  viewShipmentLogs, // REMOVE
  updateTimeline,
  getAndRenderTable,
  getDogs,
  filterData,
  getData,
} from './opsFunctions';

import {
  attachBtnListeners,
  hideElementsExceptFirst,
  convertTableName,
} from './functions';

import { submit, update } from './submitData';

import {
  iterator,
  toggleHidden,
  initialize,
  customerIdArray, //FIXME: change to environment variable?
  consigneesIdArray, // idem?
  //metaArray,
  setObject,
} from './data'; //TODO: move to ./functions.js

import {
  sendToken,
  sendEmailAddress,
  sendResetPasswords,
  sendSignUpDetails,
  requestRefresh,
} from './accountActions';

import { showAlert } from './alert';

import { displayMap } from './mapbox';

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  toggleDarkMode();
}

// if (document.querySelector('.main--dogs')) getDogs();

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
const viewDbxBtn = document.querySelector('.view-dbx');
const checkboxes = document.querySelectorAll('ul input');
const submitBtn = document.querySelector('.submit');

const showCustomerFormBtn = document.querySelector('.show-form');
/*
const dbUpdateSelect1 = document.querySelector('.db-select');
const dbUpdateBtn1 = document.querySelector('.update-select');
const dbUpdateId = document.querySelector('.document-id');
const fieldAddBtn = document.querySelector('.update-add1');
const fieldSelector = document.querySelector('.field-select');
const updateForm = document.querySelector('.update-form');
const updateContainer = document.querySelector('.dashboard__container');
*/

const activationBtn = document.querySelector('.activation-btn');
const resetPasswordInitForm = document.querySelector(
  '.reset-password-init-form',
);
const resetPasswordActionForm = document.querySelector(
  '.reset-password-action-form',
);
const signUpForm = document.querySelector('.sign-up-form');
const errorMsg = document.querySelector('.error__msg');

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

if (errorMsg) {
  document.querySelector('.refresh-btn').addEventListener('click', () => {
    requestRefresh();
  });
}

if (document.getElementById('map'))
  try {
    displayMap('');
  } catch (error) {
    console.error(error);
  }

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const passwordConfirmInput =
      document.getElementById('passwordConfirm').value;
    sendSignUpDetails(name, email, passwordInput, passwordConfirmInput);
  });
}

if (activationBtn) {
  const token = window.location.search.split('=')[1];

  activationBtn.addEventListener('click', () => sendToken(token));
}

if (resetPasswordInitForm) {
  resetPasswordInitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    sendEmailAddress(email);
  });
}

if (resetPasswordActionForm) {
  const token = window.location.search.split('=')[1];
  console.log(token);

  resetPasswordActionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password').value;
    const passwordConfirmInput =
      document.getElementById('passwordConfirm').value;

    sendResetPasswords(passwordInput, passwordConfirmInput, token);
  });
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

themeBtn.addEventListener('click', toggleDarkMode);

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

if (window.location.pathname.includes('ops-data')) {
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
    });

  submitDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const object = {};
    object.shipment_file_id = document.getElementById('shipment_file_id').value;
    object.users = document.getElementById('users').value;
    object.CustomerId = document.getElementById('CustomerId').value;

    submit(object, 'master');
  });

  submitShipperForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const shipperObj = setObject(
      metaArray.find((el) => el.name === 'Shippers').array,
    );
    submit(shipperObj, 'shippers');
  });

  submitFinancialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const financialsObj = setObject(
      metaArray.find((el) => el.name === 'Financials').array,
    );
    submit(financialsObj, 'financials');
  });

  submitCustomsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const customsObj = setObject(
      metaArray.find((el) => el.name === 'Customs').array,
    );
    submit(customsObj, 'customs');
  });

  submitDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const detailsObj = setObject(
      metaArray.find((el) => el.name === 'Shipment-details').array,
    );
    submit(detailsObj, 'shipment-details');
  });

  submitConveyanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const conveyanceObj = setObject(
      metaArray.find((el) => el.name === 'Conveyance').array,
    );
    submit(conveyanceObj, 'conveyance');
  });

  timelineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const object = {};
    object.timelineMasterId = document.getElementById('timelineMasterId').value;
    submit(object, 'timeline');
  });

  customersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let object = {};
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

    submit(object, 'customers');
  });

  consigneesForm.addEventListener('submit', (e) => {
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

    submit(object, 'consignees');
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
      for (const x of metaArray.find((el) => el.name === 'Timelines').array) {
        object[x] = null;
      }

      // 1) Specify which timeline field the user is selecting
      let input = document.querySelector('.timeline-select').value;

      // 2) Convert the string using string and array methods
      input = input.replace('/', ' ');
      let arr = input.split(' ');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toLowerCase();
      }
      if (arr.length >= 3) arr.pop();
      let arrCopy = [...arr];
      arr = arr.join('_');

      // 3) Loop through the keys array to match input to a key
      let key;
      metaArray
        .find((el) => el.name === 'Timelines')
        .array.forEach((el) => {
          if (arr.includes(el)) {
            key = el;
          }
        });

      object[key] = 'true';

      // Get date input and add it to the object
      const dateInput = document.querySelector('.timeline-date').value;

      for (let i = 0; i <= 3; i++) {
        while (arrCopy.length >= 3) {
          arrCopy.pop();
        }
      }
      arrCopy.push('date');
      arrCopy = arrCopy.join('_');

      object[arrCopy] = dateInput;
      // Call the update function with the ID and object as arguments
      updateTimeline(timelineId, object);
    });

// if (dbUpdateBtn1)
//   dbUpdateBtn1.addEventListener('click', () => {
//     const selection = dbUpdateSelect1.value;
//     // make axios request
//     getData(
//       `${process.env.API_CALL_URL}/api/v1/data/customers/?userId=${selection}`,
//     )
//       .then((data) => console.log(data))
//       .catch((err) => console.error(err));
//     // use the returned response data to fill in the fields

//     const id = dbUpdateId.value;

//     //getTable(selection, id);
//   });

//TODO:
if (document.querySelector('.selector-box.customer1 button'))
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
          if (!data.query)
            showAlert(
              'error',
              'There is no customer entry for that user (not yet)!',
            );

          // use the returned response data to fill in the fields
          document.getElementById('users').value = data.query.userId;
          document.getElementById('CustomerId').value = data.query.id;
          console.log(data);
        })
        .catch((err) => console.error(err));
    });

if (document.querySelector('.selector-box.master button'))
  document
    .querySelector('.selector-box.master button')
    .addEventListener('click', function () {
      let selection = document
        .querySelector('.selector-box.master select')
        .value.split(' ')[2];

      const allForms = this.parentElement.parentElement.children;

      const currentForm = Array.from(allForms).findLast(
        (el) => !Array.from(el.classList).some((el) => el === 'hidden'),
      );

      currentForm.children[2].children[1].value = selection.slice(0, -1);
      // if (!classlistArray.some((el) => el === 'hidden'))
      //   document.getElementById('consigneesMasterId').value = selection;
    });

if (document.querySelector('.selector-box.customer2 button'))
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

// if (fieldAddBtn)
//   fieldAddBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const selection = fieldSelector.value;
//     //console.log(selection);
//     const markup = `<div class="form__group">
//   <label class="form__label" for="${selection}">
//     ${selection.toUpperCase()}
//   </label>
//   <input class="form__input" id="${selection}">
// </div>`;
//     document
//       .querySelector('.update-form')
//       .insertAdjacentHTML('afterbegin', markup);
//   });

// if (updateForm)
//   updateForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const tableSelection = dbUpdateSelect1.value;
//     const object = {};

//     metaArray.forEach((obj) => {
//       if (tableSelection === obj.name) {
//         //console.log(obj.name, obj.array);
//         obj.array.forEach((el) => {
//           const node = document.getElementById(el);
//           if (!node) return;

//           let key = el;
//           object[key] = node.value;
//         });
//       }
//     });
//     const route = tableSelection.toLowerCase();
//     const id = dbUpdateId.value;
//     //console.log(object);
//     update(object, route, id);
//   });

let filePaginationCount = 0;

// if (document.querySelector('.file__container')) {
if (window.location.pathname.includes('ops-dashboard')) {
  let fileContainerElements = document.querySelectorAll('.file__container');
  let fileTableElements = document.querySelectorAll('.shipment-box-detail');

  document
    .querySelectorAll('.file__container .heading-secondary')
    .forEach((element) => (element.style.color = 'white'));

  hideElementsExceptFirst(fileContainerElements);

  hideElementsExceptFirst(fileTableElements);
  //FIXME:
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
      //FIXME:
      button.addEventListener('click', function () {
        /*
        const currentTable =
          this.parentElement.children[5].children[0].childNodes[0].data;

        const id = document.querySelector('table td').textContent;
        */
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

        // window.location.assign(
        //   `/ops-update/?table=${this.parentElement.children[5].children[0].childNodes[0].data.trim()}&?id=${
        //     this.parentElement.children[5].children[0].children[0].children[1]
        //       .children[0].children[1].textContent
        //   }`,
        // );
      });
    });
}

if (window.location.pathname.includes('ops-update')) {
  const table = window.location.search.split('&')[0].slice(7);
  const id = window.location.search.split('&')[1].slice(4);

  document.querySelector('.dashboard__container').style.display = 'flex';
  document.querySelector('.dashboard__container').style.flexDirection =
    'column';
  document.querySelector('.dashboard__container').style.justifyContent =
    'center';
  document.querySelector('.dashboard__container').style.alignItems = 'center';

  getAndRenderTable(table, id)
    .then(() => {
      document.querySelectorAll('table button').forEach((button) => {
        button.addEventListener('click', function () {
          console.log(this.parentElement.parentElement.children);

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

  document.querySelector('.update-btn').addEventListener('click', () => {
    const updateObject = {};

    document.querySelectorAll('.form__input').forEach((input) => {
      updateObject[input.parentElement.parentElement.children[0].innerText] =
        input.value;
    });

    console.log(updateObject);
    console.log(table);

    update(updateObject, table, id);
  });
}
