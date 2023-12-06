const mixin = {
  methods: {
   getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
   },
   guid() {
      return this.s4() +
        this.s4() +
        '-' +
        this.s4() +
        '-' +
        this.s4() +
        '-' +
        this.s4() +
        '-' +
        this.s4() +
        this.s4() +
        this.s4();
    },
    s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    },
    hashCode(text) {
      let hash = 0, i, chr;
      if (text.length === 0) return hash;
      for (i = 0; i < text.length; i++) {
        chr   = text.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },
  }
};

export default mixin;
