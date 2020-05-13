export default {
  sections: [],
  register(section) {
    this.sections.push(section);
  },
  get(elId) {
    return this.sections.filter(vue => vue.$options.el === elId)[0];
  }
}
