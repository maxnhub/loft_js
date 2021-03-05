export default class LoginPage {
  constructor(element, onLogin) {
    this.element = element;
    this.onLogin = onLogin;

    const loginName = element.querySelector('[data-role=login-input]');
    const loginEntry = element.querySelector('[data-role=login-submit]');
    const loginError = element.querySelector('[data-role=login-error]');

    loginEntry.addEventListener('click', () => {
      loginError.textContent = '';

      const name = loginName.value.trim();

      if (!name) {
        loginError.textContent = 'Введите логин';
      } else {
        this.onLogin(name);
      }
    });
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
