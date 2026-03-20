'use strict';
import axios from 'axios';
import { showAlert } from './alert';

export const submit = async (dataObj, url) => {
  const localObj = { ...dataObj };
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/v1/data/${url}`,
      data: localObj,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
      let data = JSON.stringify(res.data.data.data, null, 4);
      document.querySelector('.data-preview').textContent = data;
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err.response.data);
  }
};

export const submitMaster = async (dataObj) => {
  const localObj = { ...dataObj };
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/data',
      data: localObj,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
      let data = JSON.stringify(res.data.data.data, null, 4);
      document.querySelector('.data-preview').textContent = data;
    }
  } catch (err) {
    showAlert('error', err);
  }
};
