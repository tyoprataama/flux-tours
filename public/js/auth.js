/*eslint-disable*/
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signin',
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
      url: '/api/v1/users/signup',
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
    console.log(err);
  }
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
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
    const url = type === 'password' ? '/api/v1/users/changePassword' : '/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })
    if (res.data.status === 'success') {
      const btnUpdate = type === 'password' ? '#btnpass' : '#savesettings';
      showAlert('success', `${type.toUpperCase()} UPDATED!`)
      document.querySelector(btnUpdate).textContent = 'Updating...'
      window.setTimeout(() => {
        location.assign('/me')
      }, 1000)

    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

function payWithMidtrans(transactionToken) {
  snap.pay(transactionToken, {
    onSuccess: function (result) {
      console.log('Payment success:', result);
      // Tambahkan logika atau redirect ke halaman sukses
    },
    onPending: function (result) {
      console.log('Payment pending:', result);
      // Tambahkan logika atau redirect ke halaman yang sesuai
    },
    onError: function (result) {
      console.error('Payment error:', result);
      // Tambahkan logika atau redirect ke halaman error
    }
  });
}
// Wrap your event listeners in a function and call it after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form--login');
  const formSignup = document.querySelector('.form-signup');
  const btnLogout = document.querySelector('.nav__el--logout');
  const updateDataUser = document.querySelector('.form-user-data');
  const updatePasswordUser = document.querySelector('.form-user-password');
  const bookBtn = document.getElementById('book-tour');

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
      document.getElementById('btnsignup').textContent = 'Creating...'
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
      const formUser = new FormData();
      formUser.append('name', document.getElementById('name').value)
      formUser.append('email', document.getElementById('email').value)
      formUser.append('photo', document.getElementById('photo').files[0])
      console.log(formUser);
      updateUser(formUser, 'data');
    })
  }
  if (updatePasswordUser) {
    updatePasswordUser.addEventListener('submit', e => {
      e.preventDefault();
      const currPassword = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      updateUser({
        currPassword,
        password,
        passwordConfirm
      }, 'password');
    })
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', function () {
      const originalButtonText = document.getElementById('book-tour').textContent;
      document.getElementById('book-tour').textContent = 'Memproses ...'
      const tourId = this.getAttribute('data-tour-id');
      axios.get(`/api/v1/bookings/checkout-session/${tourId}`)
        .then(response => {
          const data = response.data;
          payWithMidtrans(data.transactionToken);
        })
        .catch(error => console.error('Error:', error));
      document.getElementById('book-tour').textContent = originalButtonText;
    });
  }
});