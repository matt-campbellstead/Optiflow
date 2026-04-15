import axios from 'axios';
import { showAlert } from './alert';

const getCsrf = () => document.getElementById('_csrf').value;

export const login = async (email, password) => {
  const token = getCsrf();

  try {
    const res = await axios({
      method: 'POST',
      url: `${process.env.API_CALL_URL}/api/v1/users/login`,
      data: {
        email,
        password,
      },
      headers: {
        'x-csrf-token': token,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response?.data?.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_CALL_URL}/api/v1/users/logout`,
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
// ${process.env.API_CALL_URL}
//'http://127.0.0.1:8000/api/v1/users/login'
//'http://127.0.0.1:8000/api/v1/users/logout'
