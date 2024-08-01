<template>
	<div class="stock-tile-list" ref="tileListContainer">
		<stock-tile v-for="stock in stocks" :key="stock.name" :stock="stock" />
	</div>
</template>

<script>
import StockTile from './StockTile.vue';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
	name: 'StockTileList',
	components: { StockTile },
	props: {
		stocks: {
			type: Array,
			required: true,
		},
	},

	setup() {
		const tileListContainer = ref(null);

		const checkOverflow = () => {
			if (tileListContainer.value) {
				const container = tileListContainer.value;
				const hasLeftOverflow = container.scrollLeft > 0;
				const hasRightOverflow =
					container.scrollLeft < container.scrollWidth - container.clientWidth;

				container.classList.toggle('left-overflow', hasLeftOverflow);
				container.classList.toggle('right-overflow', hasRightOverflow);
			}
		};

		onMounted(() => {
			window.addEventListener('resize', checkOverflow);
			if (tileListContainer.value) {
				tileListContainer.value.addEventListener('scroll', checkOverflow);
			}
			checkOverflow();
		});

		onUnmounted(() => {
			window.removeEventListener('resize', checkOverflow);
			if (tileListContainer.value) {
				tileListContainer.value.removeEventListener('scroll', checkOverflow);
			}
		});

		return { tileListContainer };
	},
};
</script>

<style lang="scss">
@import '../styles/stockTileList.scss';
</style>
