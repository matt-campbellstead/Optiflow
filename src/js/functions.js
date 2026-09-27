import { tablesIterator } from './opsFunctions';
import { showAlert } from './alert';

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
