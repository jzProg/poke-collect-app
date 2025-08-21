const formulaMixin = {
  data() {
    return {
      growthRate: {
        SLOW: 'slow',
        MEDIUM: 'medium',
        FAST: 'fast',
        MEDIUM_SLOW: 'medium-slow',
        SLOW_THEN_FAST: 'slow-then-very-fast',
        FAST_THEN_SLOW: 'fast-then-very-slow'
      }
    }
  },
  methods: {
    getBattleExperience({ pokemonNotFainted, ...rest }) {
       const sum = Object.values(rest).reduce((a, b) => Number(a) *  Number(b));
       return Math.floor(sum/(7*parseInt(pokemonNotFainted, 10)));
    },
    getExperienceBasedlevel(growthRateType, level) {
      switch (growthRateType) {
        case this.growthRate.SLOW: return level === 1  ? 0 : Math.floor(5*Math.pow(level, 3)/4);
        case this.growthRate.MEDIUM: return level === 1 ? 0 : Math.floor(Math.pow(level, 3));
        case this.growthRate.FAST: return Math.floor(4*Math.pow(level, 3)/5);
        case this.growthRate.MEDIUM_SLOW: return level === 1 ? 0 : Math.floor(6/5*Math.pow(level, 3) - 15*Math.pow(level, 2) + 100*level - 140);
        case this.growthRate.SLOW_THEN_FAST: return this.calcErratic(level);
        case this.growthRate.FAST_THEN_SLOW: return this.calcFluctuate(level);
      };
    },
    calcNewHp(baseHp, level) {
       return ((2 × baseHp × level) / 100) + level + 10;
    },
    calcErratic(level) {
      if (level <= 1) return 0;
      else if (level <= 50) return Math.floor((Math.pow(level, 3)*(100 - level))/50);
      else if (level <= 68) return Math.floor((Math.pow(level, 3)*(150 - level))/100);
      else if (level <= 98) return Math.floor((Math.pow(level, 3)*Math.floor((1911 - 10*level)/3))/500);
      else if (level <= 100) return Math.floor((Math.pow(level, 3)*(160 - level))/100);
    },
    calcFluctuate(level) {
      if (level <= 1) return 0;
      else if (level <= 15) return Math.floor(Math.pow(level, 3)*(((Math.floor((level + 1)/3)) + 24)/50));
      else if (level <= 36) return Math.floor(Math.pow(level, 3)*((level + 14)/50));
      else if (level <= 100) return Math.floor(Math.pow(level, 3)*(((Math.floor(level/2)) + 32)/50));
    }
  },
};

export default formulaMixin;
