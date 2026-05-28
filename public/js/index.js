import { login, logout } from './login';
import { changeStyle } from './changeStyle';
import {
  viewShipmentLogs, // REMOVE
  updateTimeline,
  getTable,
  getDogs,
} from './opsFunctions';
import { submit, update } from './submitData';
import {
  iterator,
  toggleHidden,
  initialize,
  customerIdArray,
  consigneesIdArray,
  metaArray,
  setObject,
} from './data';
console.log('page origin:', window.location.origin);

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  changeStyle();
}

if (document.querySelector('.main--dogs')) getDogs();

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
const nextBtn1 = document.querySelector('.next1');
const nextBtn2 = document.querySelector('.next2');
const nextBtn3 = document.querySelector('.next3');
const nextBtn4 = document.querySelector('.next4');
const nextBtn5 = document.querySelector('.next5');
const nextBtn6 = document.querySelector('.next6');
const nextBtn7 = document.querySelector('.next7');
const backBtn = document.querySelector('.back');
const showCustomerFormBtn = document.querySelector('.show-form');

const dbUpdateSelect1 = document.querySelector('.db-select');
const dbUpdateBtn1 = document.querySelector('.update-select');
const dbUpdateId = document.querySelector('.document-id');
const fieldAddBtn = document.querySelector('.update-add1');
const fieldSelector = document.querySelector('.field-select');
const updateForm = document.querySelector('.update-form');
const updateContainer = document.querySelector('.dashboard__container');

const formElements = [];
formElements.push(
  submitShipperForm,
  submitFinancialsForm,
  submitCustomsForm,
  submitDetailsForm,
  submitConveyanceForm,
  timelineForm,
  customersForm,
  consigneesForm,
  nextBtn2,
  nextBtn3,
  nextBtn4,
  nextBtn5,
  nextBtn6,
  nextBtn7,
  backBtn,
);

for (const el of formElements) if (el) initialize(el);

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
    object.shipment_file_id = document.getElementById('shipment_file_id').value;
    object.users = document.getElementById('users').value;
    object.CustomerId = document.getElementById('CustomerId').value;

    submit(object, 'master');
  });

if (submitShipperForm)
  submitShipperForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const shipperObj = setObject(
      metaArray.find((el) => el.name === 'Shippers').array,
    );
    submit(shipperObj, 'shippers');
  });

if (submitFinancialsForm)
  submitFinancialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const financialsObj = setObject(
      metaArray.find((el) => el.name === 'Financials').array,
    );
    submit(financialsObj, 'financials');
  });

if (submitCustomsForm)
  submitCustomsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const customsObj = setObject(
      metaArray.find((el) => el.name === 'Customs').array,
    );
    submit(customsObj, 'customs');
  });

if (submitDetailsForm)
  submitDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const detailsObj = setObject(
      metaArray.find((el) => el.name === 'Shipment-details').array,
    );
    submit(detailsObj, 'shipment-details');
  });

if (submitConveyanceForm)
  submitConveyanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const conveyanceObj = setObject(
      metaArray.find((el) => el.name === 'Conveyance').array,
    );
    submit(conveyanceObj, 'conveyance');
  });

if (timelineForm)
  timelineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const object = {};
    object.timelineMasterId = document.getElementById('timelineMasterId').value;
    submit(object, 'timeline');
  });

if (customersForm)
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

if (consigneesForm)
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

if (nextBtn1)
  nextBtn1.addEventListener('click', () => {
    toggleHidden([nextBtn1, submitDataForm, submitShipperForm, nextBtn2]);
    updateContainer.classList.add('hidden');
  });

if (nextBtn2)
  nextBtn2.addEventListener('click', () =>
    toggleHidden([nextBtn2, submitShipperForm, submitDetailsForm, nextBtn3]),
  );

if (nextBtn3)
  nextBtn3.addEventListener('click', () =>
    toggleHidden([nextBtn3, submitDetailsForm, submitFinancialsForm, nextBtn4]),
  );

if (nextBtn4)
  nextBtn4.addEventListener('click', () =>
    toggleHidden([nextBtn4, submitFinancialsForm, submitCustomsForm, nextBtn5]),
  );

if (nextBtn5)
  nextBtn5.addEventListener('click', () =>
    toggleHidden([nextBtn5, submitCustomsForm, submitConveyanceForm, nextBtn6]),
  );

if (nextBtn6)
  nextBtn6.addEventListener('click', () =>
    toggleHidden([nextBtn6, submitConveyanceForm, timelineForm, nextBtn7]),
  );

if (nextBtn7)
  nextBtn7.addEventListener('click', () =>
    toggleHidden([nextBtn7, timelineForm, consigneesForm, backBtn]),
  );

if (backBtn)
  backBtn.addEventListener('click', () => {
    formElements.forEach((el) => initialize(el));
    nextBtn1.classList.remove('hidden');
    updateContainer.classList.remove('hidden');
    submitDataForm.classList.remove('hidden');
  });

let hidden = true;
if (showCustomerFormBtn)
  showCustomerFormBtn.addEventListener('click', () => {
    if (hidden) {
      customersForm.classList.remove('hidden');
      hidden = false;
    } else if (!hidden) {
      customersForm.classList.add('hidden');
      hidden = true;
    }
  });

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
if (dbUpdateBtn1)
  dbUpdateBtn1.addEventListener('click', () => {
    const selection = dbUpdateSelect1.value;
    const id = dbUpdateId.value;

    getTable(selection, id);
  });

if (fieldAddBtn)
  fieldAddBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selection = fieldSelector.value;
    //console.log(selection);
    const markup = `<div class="form__group">
  <label class="form__label" for="${selection}">
    ${selection.toUpperCase()}
  </label>
  <input class="form__input" id="${selection}">
</div>`;
    document
      .querySelector('.update-form')
      .insertAdjacentHTML('afterbegin', markup);
  });

if (updateForm)
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tableSelection = dbUpdateSelect1.value;
    const object = {};

    metaArray.forEach((obj) => {
      if (tableSelection === obj.name) {
        //console.log(obj.name, obj.array);
        obj.array.forEach((el) => {
          const node = document.getElementById(el);
          if (!node) return;

          let key = el;
          object[key] = node.value;
        });
      }
    });
    const route = tableSelection.toLowerCase();
    const id = dbUpdateId.value;
    //console.log(object);
    update(object, route, id);
  });
