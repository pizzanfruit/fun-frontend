import Vue from "vue";

// Register a global custom directive called `v-focus`
Vue.directive("focus", {
  // When the bound element is inserted into the DOM...
  inserted(el) {
    // Focus the element
    el.focus();
  }
});

Vue.directive("click-outside", {
  bind(el: any, binding: any, vnode: any) {
    el.clickOutsideEvent = (event: any) => {
      // here I check that click was outside the el and his childrens
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el: any) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  }
});
