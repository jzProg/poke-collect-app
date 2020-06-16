const urlAuthMixin = {
  methods: {
    isExcludedPage () {
      const fullUrl = window.location.href;
      return fullUrl.substr(fullUrl.indexOf('#') + 2).includes('profile');
    },
    isLoggedIn() {
      return localStorage.getItem('token');
    },
    notAuthPage() {
      const fullUrl = window.location.href;
      return fullUrl.substr(fullUrl.indexOf('#') + 2) !== 'home';
    }
  }
};

export default urlAuthMixin;
