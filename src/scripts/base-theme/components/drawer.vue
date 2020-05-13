<template>
  <transition :name="'drawer-'+position">
    <div class="drawer" :class="position" v-if="isOpen">
      <div class="overlay" @click="$emit('close')"></div>
      <div class="drawer__container">
        <div class="drawer__heading">
          <slot name="header"></slot>
          <button class="close" aria-label="Close" @click="$emit('close')">
            <svg
              aria-hidden="true"
              focusable="false"
              role="presentation"
              class="icon icon-close"
              viewBox="0 0 64 64"
            >
              <path d="M19 17.61l27.12 27.13m0-27.12L19 44.74"></path>
            </svg>
          </button>
        </div>

        <div class="drawer__body">
          <slot></slot>
        </div>

        <div class="drawer__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    position: String,
    id: String,
    header: String,
    isOpen: Boolean
  },
  watch: {
    isOpen(isOpen) {
      if(isOpen) $('body').addClass(`${this.id} drawer--is-open`)
      else $('body').removeClass(`${this.id} drawer--is-open`)
    }
  }
};
</script>
