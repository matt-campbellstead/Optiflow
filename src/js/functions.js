import { tablesIterator } from './opsFunctions';
import { showAlert } from './alert';
import * as accountRequests from './accountActions';
import { login } from './login';
import { submit, update } from './submitData';

export const iterator = (obj, str) => {
  for (let x of Object.keys(obj)) {
    if (x === str) return x;
  }
  return undefined;
};

export const initialize = (el) => el.classList.add('hidden');

export const setObject = (arr) => {
  const object = {};
  for (const key of arr) {
    object[key] = null;
  }
  arr.forEach((el) => {
    const node = document.getElementById(el);
    if (!node) return;
    let key = iterator(object, el);
    object[key] = node.value;
  });
  return object;
};

export const attachBtnListeners = (element) => {
  let tablesInParentEl;
  tablesInParentEl = element.parentElement.parentElement.children[5].children;

  // Hide currently displayed table
  for (const element of tablesInParentEl) {
    const classListArray = Array.from(element.classList);
    if (!classListArray.some((el) => el === 'hidden'))
      element.classList.add('hidden');
  }

  // Select and display different table
  tablesIterator(tablesInParentEl, element)
    .then()
    .catch((err) => {
      showAlert('error', 'There is currently no data for the selected table!');
    });
};

export const hideElementsExceptFirst = (elements) => {
  try {
    elements.forEach((file, i) => {
      if (i > 0) file.classList.add('hidden');
    });
  } catch (err) {
    console.error(err);
  }
};

export const convertTableName = (name) => {
  let table;

  switch (name) {
    case 'Customer':
      table = 'customers';
      break;
    case 'Shipment Details':
      table = 'shipment-details';
      break;
    case 'Shipper':
      table = 'shippers';
      break;
    case 'Consignee':
      table = 'consignees';
      break;
    case 'Financial':
      table = 'financials';
      break;
    default:
      table = name.toLowerCase();
      break;
  }

  return table;
};

export const prepareButtonUI = (btn) => {
  btn.style.width = btn.offsetWidth + 'px';
  btn.classList.add('is-loading');
  btn.disabled = true;
};

export const makeRequestWithButtonUI = async (type, options = null, btn) => {
  try {
    let isSuccess;
    switch (type) {
      case 'login':
        isSuccess = await login(options.email, options.password);
        break;
      case 'submit':
        isSuccess = await submit(options.object, options.tableName);
        break;
      case 'update':
        isSuccess = await update(
          options.updateObject,
          options.table,
          options.id,
        );
        break;
      case 'signUp':
        isSuccess = await accountRequests.sendSignUpDetails(
          options.name,
          options.email,
          options.password,
          options.passwordConfirm,
        );
        break;
      case 'refresh':
        isSuccess = await accountRequests.requestRefresh();
        break;
      case 'activation':
        isSuccess = await accountRequests.sendToken(options.token);
        break;
      case 'resetInit':
        isSuccess = await accountRequests.sendEmailAddress(options.email);
        break;
      case 'resetAction':
        isSuccess = await accountRequests.sendResetPasswords(
          options.passwordInput,
          options.passwordConfirmInput,
          options.token,
        );
        break;
      case 'upload':
        isSuccess = await accountRequests.makeUploadRequest(options.data);
        break;
      case 'changePassword':
        isSuccess = await accountRequests.requestPasswordChange(options.data);
        break;
    }

    if (isSuccess) {
      btn.classList.remove('is-loading');
      btn.classList.add('is-success');
      setTimeout(() => {
        btn.classList.remove('is-success');
        btn.disabled = false;
      }, 1800);
      return true;
    } else {
      btn.classList.remove('is-loading');
      btn.disabled = false;
      return false;
    }
  } catch (err) {
    console.error(err);
  }
};

export const hideElAndDisplayMessage = (el) => {
  el.classList.add('hidden');
  document.querySelector('.dashboard__container').classList.remove('hidden');
};
