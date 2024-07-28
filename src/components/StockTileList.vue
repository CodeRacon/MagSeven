<template>
	<div class="stock-tile-list">
		<stock-tile v-for="stock in stocks" :key="stock.name" :stock="stock" />
	</div>
</template>

<script>
import StockTile from './StockTile.vue';

export default {
	name: 'StockTileList',
	components: { StockTile },
	props: {
		stocks: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style lang="scss">
@import '../styles/stockTileList.scss';
</style>
