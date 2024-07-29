<template>
	<div class="dashboard" v-if="isDataLoaded">
		<section class="top">
			<stock-tile-list :stocks="stocks" />
		</section>
		<section class="center">
			<div class="line-chart">
				<revenue-chart :stockData="chartData" />
			</div>
		</section>
		<section class="bottom"></section>
	</div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {
	fetchStockData,
	prepareStockTileData,
	prepareRevenueChartData,
} from '@/services/stockService';
import StockTileList from '@/components/StockTileList.vue';
import RevenueChart from '@/components/RevenueChart.vue';

export default {
	name: 'DashboardView',
	components: {
		StockTileList,
		RevenueChart,
	},
	setup() {
		const stockData = ref({});
		const stocks = ref([]);
		const chartData = ref(null);
		const isDataLoaded = computed(
			() => Object.keys(stockData.value).length > 0
		);

		const loadStockData = async () => {
			try {
				const rawData = await fetchStockData();
				stockData.value = rawData;
				stocks.value = Object.values(prepareStockTileData(rawData));
				chartData.value = prepareRevenueChartData(rawData);
			} catch (error) {
				console.error('Error loading stock data:', error);
			}
		};

		onMounted(loadStockData);

		return {
			stockData,
			stocks,
			chartData,
			isDataLoaded,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/dashboard.scss';
</style>
