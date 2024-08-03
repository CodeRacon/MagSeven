<template>
	<div class="glossary">
		<div class="heading">
			<h2>Glossary</h2>
			<div class="labels">
				<div class="term-label">
					<div class="term"></div>
					<span>Term</span>
				</div>
				<div class="chart-label">
					<div class="chart"></div>
					<span>Chart</span>
				</div>
			</div>
		</div>
		<ul class="glossary-list">
			<li v-for="(item, index) in glossaryItems" :key="index">
				<div class="glossary-item" @click="toggleItem(index)">
					{{ item.title }}
				</div>
				<transition name="fade">
					<p v-if="openIndex === index" class="glossary-explanation">
						{{ item.explanation }}
					</p>
				</transition>
			</li>
		</ul>
	</div>
</template>

<script>
import { ref } from 'vue';

import { getGlossaryItems } from '../services/glossary';

/**
 * Provides the main functionality for the Glossary component, including managing the state of the currently open glossary item.
 *
 * @component
 * @name GlossaryComponent
 * @description Renders a list of glossary items, allowing the user to toggle the explanation for each item.
 */
export default {
	name: 'GlossaryComponent',
	setup() {
		const openIndex = ref(null);
		const glossaryItems = getGlossaryItems();

		const toggleItem = (index) => {
			openIndex.value = openIndex.value === index ? null : index;
		};

		return {
			openIndex,
			glossaryItems,
			toggleItem,
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../styles/glossary.scss';
</style>
