import axios from 'axios';
import { showAlert } from './alert';

const getCsrf = () => document.getElementById('_csrf').value;

export const sendToken = async (token) => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      url: `${process.env.API_CALL_URL}/api/v1/users/auth/activate-account/${token}`,
      method: 'PATCH',
      headers: {
        'x-csrf-token': csrfToken,
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

export const sendEmailAddress = async (email) => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      url: `${process.env.API_CALL_URL}/api/v1/users/auth/forgotpassword`,
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
      },
      data: {
        email,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const sendResetPasswords = async (
  passwordInput,
  passwordConfirmInput,
  token,
) => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      url: `${process.env.API_CALL_URL}/api/v1/users/auth/resetpassword/${token}`,
      method: 'PATCH',
      headers: {
        'x-csrf-token': csrfToken,
      },
      data: {
        password: passwordInput,
        passwordConfirm: passwordConfirmInput,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const sendSignUpDetails = async (
  name,
  email,
  password,
  passwordConfirm,
) => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      url: `${process.env.API_CALL_URL}/api/v1/users/auth/signup`,
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
      },
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data submitted successfully');
      //TODO: hide form and display success message
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const requestRefresh = async () => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_CALL_URL}/api/v1/users/auth/refresh`,
      headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Session refreshed');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    showAlert('error', 'Session not refreshed. Try logging in again.');
  }
};
