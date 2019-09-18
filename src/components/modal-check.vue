<template>
  <div>
    <Button type="error" @click="onCancel">{{cancelText}}</Button>
    <Button type="primary" :loading="loading" @click="onSave">{{saveText}}</Button>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    saveText: {
      type: String,
      default: "通过"
    },
    cancelText: {
      type: String,
      default: "驳回"
    }
  },
  methods: {
    onSave() {
      this.$emit("on-save");
    },
    onCancel() {
      this.$emit("on-cancel");
    }
  }
};
</script>