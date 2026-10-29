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
      return true;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    return false;
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
      return true;
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
    return false;
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
      return true;
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
    return false;
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
      return true;
    }
  } catch (err) {
    console.error(err.response.data);
    showAlert('error', err.response.data.message);
    return false;
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
      return true;
    }
  } catch (err) {
    console.error(err);
    showAlert('error', 'Session not refreshed. Try logging in again.');
    return false;
  }
};

export const makeUploadRequest = async (data, type = 'PDF') => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      method: 'POST',
      url: `${process.env.API_CALL_URL}/api/v1/uploads`,
      headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} uploaded!`);
      return true;
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
    return false;
  }
};

export const requestPasswordChange = async (data) => {
  const csrfToken = getCsrf();

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${process.env.API_CALL_URL}/api/v1/users/auth/updatemypassword`,
      headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true,
      data: {
        passwordCurrent: data.passwordCurrent,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfully!');
      return true;
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
    return false;
  }
};
