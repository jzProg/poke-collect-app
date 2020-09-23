const urlAuthMixin = {
  methods: {
    isLoggedIn() {
      return localStorage.getItem('token');
    },
    isPath(path) {
      const currentPathName = window.location.pathname;
      return path === currentPathName;
    },
  }
};

export default urlAuthMixin;
