/*eslint-disable*/
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signin',
      data: {
        email,
        password
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Login success!')
      window.setTimeout(() => {
        location.assign('/')
      }, 500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Signup success!')
      window.setTimeout(() => {
        location.assign('/')
      }, 500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Loging out!')
      window.setTimeout(() => {
        location.assign('/')
      }, 500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

const updateUser = async (data, type) => {
  try {
    const url = type === 'password' ? 'http://localhost:3000/api/v1/users/changePassword' : 'http://localhost:3000/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} UPDATED!`)
      window.setTimeout(() => {
        location.assign('/me')
      }, 1000)
      
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
// Wrap your event listeners in a function and call it after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form--login');
  const formSignup = document.querySelector('.form-signup');
  const btnLogout = document.querySelector('.nav__el--logout');
  const updateDataUser = document.querySelector('.form-user-data');
  const updatePasswordUser = document.querySelector('.form-user-password');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  if (formSignup) {
    formSignup.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      signup(name, email, password, passwordConfirm);
    });
  }

  if (btnLogout) btnLogout.addEventListener('click', logout)
  if (updateDataUser) {
    updateDataUser.addEventListener('submit', e => {
      e.preventDefault();
      document.querySelector('#savesettings').textContent = 'Updating...'
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      updateUser({name, email}, 'data');
    })
  }
  if (updatePasswordUser) {
    updatePasswordUser.addEventListener('submit', e => {
      e.preventDefault();
      document.querySelector('#btnpass').textContent = 'Updating...'
      const currPassword = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      updateUser({currPassword, password, passwordConfirm}, 'password');
    })
  }
});