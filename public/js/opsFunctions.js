import axios from 'axios';
import { showAlert } from './alert';

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

export const getTable = async (name, id) => {
  let [x, ...arr] = name;
  x = x.toLowerCase();
  arr.unshift(x);
  const selection = arr.join('');

  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_CALL_URL}/api/v1/data/${selection}/${id}`,
    });

    if (res.data.status === 'success') {
      //console.log(res.data);
      const markupShipment = `<div class="shipment-box-detail"> <span class="shipment-box_label"> ${JSON.stringify(res.data.data.document, null, 4).replaceAll('"', '')}</span></div>`;
      Object.keys(res.data.data.document).forEach((key) => {
        document
          .querySelector('.field-select')
          .insertAdjacentHTML('afterbegin', `<option>${key}</option>`);
      });
      document
        .querySelector('.shipment-box')
        .insertAdjacentHTML('afterbegin', markupShipment);
    }
  } catch (err) {
    //console.log(err);
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
