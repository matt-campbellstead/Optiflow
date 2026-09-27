import axios from 'axios';
import { showAlert } from './alert';
import { renderFileHtml, renderUpdateTableHtml } from './renderHtml';
import { convertTableName } from './functions';

const getCsrf = () => document.getElementById('_csrf').value;
// TO BE REPLACED WITH MARIADB CALL
export const viewShipmentLogs = async (id) => {
  const userid = id;
  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_CALL_URL}/api/v1/users/${userid}/shipmentlogs`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User shipments loaded');
      //console.log(res.data.data.data);

      const data = JSON.stringify(res.data.data.data, null, 4);

      document.querySelector('.shipment-logs').textContent = data;
    }
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};

export const updateTimeline = async (docId, data) => {
  const token = getCsrf();
  const id = docId;
  const newData = { ...data };
  //console.log(id, newData);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${process.env.API_CALL_URL}/api/v1/data/timeline/${id}`,
      data: newData,
      headers: {
        'x-csrf-token': token,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Timeline updated successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 4600);
    }
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};

export const getAndRenderTable = async (name, id) => {
  const table = convertTableName(name);

  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_CALL_URL}/api/v1/data/${table}/${id}`,
    });

    if (res.data.status === 'success') {
      console.log(res.data.data);
      const tableHtml = renderUpdateTableHtml(res.data.data.document);
      document
        .querySelectorAll('.dashboard__container')[1]
        .insertAdjacentHTML('afterbegin', tableHtml);
      /*
      const markupShipment = `<div class="shipment-box-detail"> <span class="shipment-box_label"> ${JSON.stringify(res.data.data.document, null, 4).replaceAll('"', '')}</span></div>`;
      Object.keys(res.data.data.document).forEach((key) => {
        document
          .querySelector('.field-select')
          .insertAdjacentHTML('afterbegin', `<option>${key}</option>`);
      });
      document
        .querySelector('.shipment-box')
        .insertAdjacentHTML('afterbegin', markupShipment);
        */
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const getDogs = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://dog.ceo/api/breeds/image/random',
    });
    if (res.data.status === 'success') {
      console.log(res.data);
      const breed = res.data.message.split('/')[4];
      document
        .querySelector('.main')
        .insertAdjacentHTML(
          'afterbegin',
          `<h1> Random dog!🐶 ${breed}</h1> <img src="${res.data.message}">`,
        );
    }
  } catch (err) {
    console.log(err);
  }
};

export const tablesIterator = (array, el) => {
  let matchFound = false;

  return new Promise((res, rej) => {
    for (const element of array) {
      if (element.firstChild.textContent.trim() === el.textContent.trim()) {
        element.classList.remove('hidden');

        matchFound = true;

        res(matchFound);
        break;
      }
    }

    if (!matchFound) rej(matchFound);
  });
};

export const filterData = async (queryString) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_CALL_URL}/api/v1/data/${queryString}`,
    });
    if (res.data.status === 'success') {
      // Clear '.file__container' elements
      document
        .querySelectorAll('.file__container')
        .forEach((container) => container.remove());

      // replace them with elements containing the response data
      console.log(res.data);
      res.data.data.masterQuery.forEach((query) =>
        document
          .querySelector('.file-nav-box')
          .insertAdjacentHTML('afterend', renderFileHtml(query)),
      );
    }
  } catch (err) {
    console.error(err);
    showAlert('error', 'Something went wrong while trying to load the data');
  }
};

export const getData = async (url) => {
  try {
    const res = await axios({
      method: 'GET',
      url: url,
    });

    if (res.data.status === 'success') return res.data.data;
  } catch (err) {
    console.error(err);
    showAlert('error', 'There was a problem making that request');
  }
};
