<template>
  <div class="slid">
    <slot></slot>
  </div>
</template>

<script>
	export default {
		name: "Slide"
	}
</script>

<style scoped>
  .slid {
    width: 100%;
    flex-shrink: 0;
  }
  .slid img {
    width: 100%;
  }
</style>