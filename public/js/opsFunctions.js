import axios from 'axios';
import { showAlert } from './alert';

export const formatJson = (data) => {
  const firstStage = data.replaceAll(',', '\n');
  return firstStage;
};

export const viewShipmentLogs = async (id) => {
  userid = id;
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/users/${userid}/shipmentlogs`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User shipments loaded');
      console.log(res.data.data.data);
      //   let firstObj = res.data.data.data[0];
      //   let secondObj = res.data.data.data[1];
      //   firstObj = Object.values(firstObj);
      //   secondObj = Object.values(secondObj);
      let data = JSON.stringify(res.data.data.data, null, 4);
      //data = formatJson(data);
      document.querySelector('.shipment-logs').textContent = data;
      //`Shipment id: ${firstObj[1]}, DB crossover id: ${firstObj[0]}`;
    }
  } catch (err) {
    console.log(err);
    //showAlert('error', err.response.data.msg);
  }
};
