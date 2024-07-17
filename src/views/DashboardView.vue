<template>
	<div class="dashboard">
		<stock-tile-list :stocks="stocks" />
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchStockData } from '@/services/stockService';
import StockTileList from '@/components/StockTileList.vue';

export default {
	name: 'DashboardView',
	components: {
		StockTileList,
	},
	setup() {
		const stockData = ref({});
		const stocks = ref([]);

		const loadStockData = async () => {
			try {
				stockData.value = await fetchStockData();
				stocks.value = Object.keys(stockData.value).map((name) => ({
					name,
					...stockData.value[name],
				}));
			} catch (error) {
				console.error('Error loading stock data:', error);
			}
		};

		onMounted(loadStockData);

		return {
			stockData,
			stocks,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/dashboard.scss';
</style>
