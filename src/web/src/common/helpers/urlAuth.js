const urlAuthMixin = {
  methods: {
    isLoggedIn() {
      return localStorage.getItem('token');
    },
    isPage(path) {
      const currentPathName = window.location.pathname;
      return path === currentPathName;
    }
  }
};

export default urlAuthMixin;
