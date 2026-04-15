'use strict';
import axios from 'axios';
import { showAlert } from './alert';

const getCsrf = () => document.getElementById('_csrf').value;

export const submit = async (dataObj, type) => {
  const token = getCsrf();
  const url =
    type === 'master'
      ? `${process.env.API_CALL_URL}/api/v1/data`
      : `${process.env.API_CALL_URL}/api/v1/data/${type}`;
  const localObj = { ...dataObj };
  try {
    const res = await axios({
      method: 'POST',
      url: url,
      data: localObj,
      headers: {
        'x-csrf-token': token,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
      let data = JSON.stringify(res.data.data.data, null, 4);
      document.querySelector('.data-preview').textContent = data;
    }
  } catch (err) {
    //console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const update = async (dataObj, table, id) => {
  const token = getCsrf();
  const localObj = { ...dataObj };
  const url = `${process.env.API_CALL_URL}/api/v1/data/${table}/${id}`;

  try {
    const res = await axios({
      method: 'PATCH',
      url: url,
      data: localObj,
      headers: {
        'x-csrf-token': token,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//'http://127.0.0.1:8000/api/v1/data'
// `http://127.0.0.1:8000/api/v1/data/${type}`;
//  `http://127.0.0.1:8000/api/v1/data/${table}/${id}`;
//
