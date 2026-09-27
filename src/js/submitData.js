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
      console.log(res.data.data);
      showAlert('success', 'Data submitted successfully');

      let html = '<table>';

      if (res.data.data.masterPost) {
        for (const [key, value] of Object.entries(res.data.data.masterPost))
          html += `<tr><th>${key}</th><td>${value}</td></tr>`;
      }

      if (res.data.data.document) {
        for (const [key, value] of Object.entries(res.data.data.document))
          html += `<tr><th>${key}</th><td>${value}</td></tr>`;
      }

      html += '</table>';

      document
        .querySelector('.container .heading-secondary')
        .insertAdjacentHTML('afterend', html);
    }
  } catch (err) {
    console.error(err);
    showAlert('error', 'something went wrong');
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
    console.error('Oh noooo,', err);
    showAlert('error', err.response.data.message);
  }
};
