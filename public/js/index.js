import { login, logout } from './login';
import { changeStyle } from './changeStyle';
import { viewShipmentLogs, updateTimeline, getTable } from './opsFunctions';
import { submit, update } from './submitData';
import {
  detailsArray,
  conveyanceArray,
  customsArray,
  financialsArray,
  shipperArray,
  iterator,
  addRemoveClasslist,
  initialize,
  timelineKeysArr,
  customerIdArray,
  customerKeyArray,
  consigneesIdArray,
  consigneesKeyArray,
  metaArray,
} from './data';

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  changeStyle();
}
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
const nextBtn8 = document.querySelector('.next8');
const dbUpdateSelect1 = document.querySelector('.db-select');
const dbUpdateBtn1 = document.querySelector('.update-select');
const dbUpdateId = document.querySelector('.document-id');
const fieldAddBtn = document.querySelector('.update-add1');
const fieldSelector = document.querySelector('.field-select');
const updateForm = document.querySelector('.update-form');

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
  nextBtn8,
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

    const fileId = document.getElementById('shipment_file_id').value;
    const userId = document.getElementById('users').value;

    object.shipment_file_id = fileId;
    object.users = userId;

    submit(object, 'master');
  });

if (submitShipperForm)
  submitShipperForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const object = {};
    for (const key of shipperArray) {
      object[key] = null;
    }
    shipperArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      let key = iterator(object, el);
      object[key] = node.value;
    });

    submit(object, 'shippers');
  });

if (submitFinancialsForm)
  submitFinancialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const object = {};
    for (const key of financialsArray) {
      object[key] = null;
    }
    financialsArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      let key = iterator(object, el);
      object[key] = node.value;
    });

    console.log(object);

    submit(object, 'financials');
  });

if (submitCustomsForm)
  submitCustomsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const object = {};
    for (const key of customsArray) {
      object[key] = null;
    }
    customsArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      let key = iterator(object, el);
      object[key] = node.value;
    });

    submit(object, 'customs');
  });

if (submitDetailsForm)
  submitDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let object = {};
    for (const key of detailsArray) {
      object[key] = null;
    }
    detailsArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      let key = iterator(object, el);
      object[key] = node.value;
    });
    // if (object.dangerousGoods === 'true') {
    //   object.dangerousGoods = true;
    // } else if (object.dangerousGoods === 'false') {
    //   object.dangerousGoods = false;
    // }
    submit(object, 'shipment-details');
  });

if (submitConveyanceForm)
  submitConveyanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let object = {};
    for (const key of conveyanceArray) {
      object[key] = null;
    }
    conveyanceArray.forEach((el) => {
      const node = document.getElementById(el);
      if (!node) return;
      let key = iterator(object, el);
      object[key] = node.value;
    });
    submit(object, 'conveyance');
  });

if (timelineForm)
  timelineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let object = {};
    object.timelineMasterId = document.getElementById('timelineMasterId').value;

    submit(object, 'timeline');
  });

if (customersForm)
  customersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let object = {};
    for (const key of customerKeyArray) {
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
    for (const key of consigneesKeyArray) {
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
    addRemoveClasslist([nextBtn1, submitDataForm, submitShipperForm, nextBtn2]);
  });

if (nextBtn2)
  nextBtn2.addEventListener('click', () => {
    addRemoveClasslist([
      nextBtn2,
      submitShipperForm,
      submitDetailsForm,
      nextBtn3,
    ]);
  });

if (nextBtn3)
  nextBtn3.addEventListener('click', () => {
    addRemoveClasslist([
      nextBtn3,
      submitDetailsForm,
      submitFinancialsForm,
      nextBtn4,
    ]);
  });

if (nextBtn4)
  nextBtn4.addEventListener('click', () => {
    addRemoveClasslist([
      nextBtn4,
      submitFinancialsForm,
      submitCustomsForm,
      nextBtn5,
    ]);
  });

if (nextBtn5)
  nextBtn5.addEventListener('click', () => {
    addRemoveClasslist([
      nextBtn5,
      submitCustomsForm,
      submitConveyanceForm,
      nextBtn6,
    ]);
  });

if (nextBtn6)
  nextBtn6.addEventListener('click', () => {
    addRemoveClasslist([
      nextBtn6,
      submitConveyanceForm,
      timelineForm,
      nextBtn7,
    ]);
  });

if (nextBtn7)
  nextBtn7.addEventListener('click', () => {
    timelineForm.classList.add('hidden');
    nextBtn7.classList.add('hidden');
    customersForm.classList.remove('hidden');
    nextBtn8.classList.remove('hidden');
  });

if (nextBtn8)
  nextBtn8.addEventListener('click', () => {
    customersForm.classList.add('hidden');
    nextBtn8.classList.add('hidden');
    consigneesForm.classList.remove('hidden');
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
      for (const x of timelineKeysArr) {
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
      timelineKeysArr.forEach((el) => {
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
if (dbUpdateSelect1)
  dbUpdateBtn1.addEventListener('click', () => {
    const selection = dbUpdateSelect1.value;
    const id = dbUpdateId.value;

    getTable(selection, id);
  });

if (fieldSelector)
  fieldAddBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selection = fieldSelector.value;
    console.log(selection);
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
        console.log(obj.name, obj.array);
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
    console.log(object);
    update(object, route, id);
  });
