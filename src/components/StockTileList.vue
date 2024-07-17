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
.stock-tile-list {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
}
</style>
