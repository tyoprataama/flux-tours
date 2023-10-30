/*eslint-disable*/
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signin',
      data: {
        email,
        password
      }
    })
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
}
const signup = async (name, email, password, passwordConfirm) => {
  console.log(name, email, password, passwordConfirm);
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
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
}
// Wrap your event listeners in a function and call it after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const formSignup = document.querySelector('.form-signup');

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
});