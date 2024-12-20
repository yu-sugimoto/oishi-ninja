<script lang="ts" setup>
import { marked } from 'marked';

interface Props {
	text: string
}

const props = defineProps<Props>()
const markdown = marked.parse(props.text);
console.log(props.text)

</script>

<template>
	<div class="markdown-txt" v-html="markdown">
	</div>
</template>

<style lang="css" scoped>
.markdown-txt {
	font-size: 16px;
}
</style>
