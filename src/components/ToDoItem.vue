<template>
  <div>
    <h2>Item {{ txtId }}</h2>
    <input type="checkbox" :checked="isDone" /><label
      >{{ txtLabel }}: {{ isDone }}</label
    >
  </div>
</template>

<script>
export default {
  props: {
    label: { required: true, type: String },
    done: { default: false, type: Boolean },
    id: { required: true, type: Object },
  },
  data() {
    return {
      isDone: this.done,
      txtLabel: this.label,
      txtId: this.id,
    };
  },
};
</script>

<style></style>
