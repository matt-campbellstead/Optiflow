import axios from 'axios';
import { showAlert } from './alert';

// export const formatJson = (data) => {
//   const firstStage = data.replaceAll(',', '\n');
//   return firstStage;
// };

export const viewShipmentLogs = async (id) => {
  const userid = id;
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/users/${userid}/shipmentlogs`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User shipments loaded');
      console.log(res.data.data.data);

      let data = JSON.stringify(res.data.data.data, null, 4);

      document.querySelector('.shipment-logs').textContent = data;
    }
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};

export const updateTimeline = async (docId, data) => {
  const id = docId;
  const newData = { ...data };
  console.log(id, newData);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/data/timeline/${id}`,
      data: newData,
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
      url: `http://127.0.0.1:8000/api/v1/data/${selection}/${id}`,
    });

    if (res.data.status === 'success') {
      console.log(res.data);
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
    console.log(err);
    showAlert('error', err.response);
  }
};
