<template>
	<div class="dashboard" v-if="isDataLoaded">
		<div class="heading">
			<h1>The M7 Stock Earning Dashboard</h1>
		</div>
		<section class="top">
			<stock-tile-list :stocks="stocks" />
		</section>
		<section class="center">
			<div class="line-chart">
				<revenue-chart :chartData="revenueChartData" />
			</div>
			<div class="ttm-chart">
				<donut-chart :chartData="donutChartData" />
			</div>
		</section>
		<section class="bottom">
			<div class="bar-charts">
				<div class="netincome-bar-chart-1">
					<net-income-chart :chartData="netIncomeChartData" />
				</div>
				<div class="netincome-bar-chart-2">
					<net-income-chart :chartData="netIncomeChartData" />
				</div>
			</div>

			<div class="netincome-bar-chart-3">
				<net-income-chart :chartData="netIncomeChartData" />
			</div>
		</section>
	</div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {
	fetchStockData,
	prepareStockTileData,
	prepareRevenueChartData,
	calculateTTMRevenue,
	prepareNetIncomeTTMData,
} from '@/services/stockService';
import StockTileList from '@/components/StockTileList.vue';
import RevenueChart from '@/components/RevenueChart.vue';
import DonutChart from '@/components/DonutChart.vue';
import NetIncomeChart from '@/components/NetIncomeChart.vue';

export default {
	name: 'DashboardView',
	components: {
		StockTileList,
		RevenueChart,
		DonutChart,
		NetIncomeChart,
	},
	setup() {
		const rawStockData = ref(null);
		const stocks = ref([]);
		const revenueChartData = ref(null);
		const donutChartData = ref(null);
		const netIncomeChartData = ref(null);

		const isDataLoaded = computed(() => rawStockData.value !== null);

		const loadStockData = async () => {
			try {
				rawStockData.value = await fetchStockData();
				stocks.value = Object.values(prepareStockTileData(rawStockData.value));
				revenueChartData.value = prepareRevenueChartData(rawStockData.value);
				donutChartData.value = calculateTTMRevenue(rawStockData.value);
				netIncomeChartData.value = prepareNetIncomeTTMData(rawStockData.value);
			} catch (error) {
				console.error('Error loading stock data:', error);
			}
		};

		onMounted(loadStockData);

		return {
			stocks,
			revenueChartData,
			donutChartData,
			netIncomeChartData,

			isDataLoaded,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/dashboard.scss';
</style>
