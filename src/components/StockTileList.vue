<template>
	<div class="stock-tile-list" ref="tileListContainer">
		<stock-tile v-for="stock in stocks" :key="stock.name" :stock="stock" />
	</div>
</template>

<script>
import StockTile from './StockTile.vue';
import { ref, onMounted, onUnmounted } from 'vue';

/**
 * The `StockTileList` component is responsible for rendering a list of `StockTile` components, which display information about stocks.
 *
 * The component receives a `stocks` prop, which is an array of stock objects. It then renders a `StockTile` component for each stock in the array.
 *
 * The component also includes some logic to detect if the list of stock tiles is overflowing horizontally, and applies CSS classes to the container element to indicate this.
 */
export default {
	name: 'StockTileList',
	components: { StockTile },
	props: {
		stocks: {
			type: Array,
			required: true,
		},
	},

	/**
	 * The `setup()` function is responsible for setting up the logic for the `StockTileList` component.
	 *
	 * It creates a ref called `tileListContainer` to hold a reference to the container element for the list of stock tiles.
	 *
	 * The `checkOverflow()` function is defined, which checks if the list of stock tiles is overflowing horizontally and applies CSS classes to the container element to indicate this.
	 *
	 * The `onMounted()` hook is used to add event listeners for the 'resize' and 'scroll' events on the window and the container element, respectively. The `checkOverflow()` function is also called to initialize the overflow state.
	 *
	 * The `onUnmounted()` hook is used to remove the event listeners added in the `onMounted()` hook.
	 *
	 * Finally, the `tileListContainer` ref is returned from the `setup()` function.
	 */
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
