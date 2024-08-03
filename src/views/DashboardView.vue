<template>
	<div class="dashboard" v-if="isDataLoaded">
		<div class="heading">
			<img src="../assets/logo.png" alt="logo" />
			<h1>Stock Earning Dashboard</h1>
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

			<div class="glossary-m">
				<glossary-component />
			</div>

			<div class="revenuegrowth-bar-chart">
				<revenue-growth-chart :chartData="revenueGrowthChartData" />
			</div>

			<div class="netincome-bar-chart">
				<net-income-chart :chartData="netIncomeChartData" />
			</div>
			<div class="grossmargin-bar-chart">
				<gross-margin-chart :chartData="grossMarginChartData" />
			</div>

			<div class="glossary-s-l">
				<glossary-component />
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
	prepareGrossMarginData,
	prepareRevenueGrowthData,
} from '@/services/stockService';
import StockTileList from '@/components/StockTileList.vue';
import RevenueChart from '@/components/RevenueChart.vue';
import DonutChart from '@/components/DonutChart.vue';
import NetIncomeChart from '@/components/NetIncomeChart.vue';
import GrossMarginChart from '@/components/GrossMarginChart.vue';
import RevenueGrowthChart from '@/components/RevenueGrowthChart.vue';
import GlossaryComponent from '@/components/GlossaryComponent.vue';

export default {
	name: 'DashboardView',
	components: {
		StockTileList,
		RevenueChart,
		DonutChart,
		NetIncomeChart,
		GrossMarginChart,
		RevenueGrowthChart,
		GlossaryComponent,
	},

	/**
	 * The `setup` function is a Vue.js composition API function that is called when the component is created. It is responsible for initializing the component's state and handling any side effects.
	 *
	 * The `setup` function in this component does the following:
	 * - Initializes several reactive references to hold the raw stock data, the prepared stock tile data, and the data for various charts.
	 * - Defines a `loadStockData` function that fetches the stock data, prepares it, and updates the component's state accordingly.
	 * - Calls the `loadStockData` function when the component is mounted using the `onMounted` hook.
	 * - Defines a computed property `isDataLoaded` that indicates whether the stock data has been loaded.
	 * - Returns an object containing the component's state and the `isDataLoaded` computed property.
	 */
	setup(props, { emit }) {
		const rawStockData = ref(null);
		const stocks = ref([]);
		const revenueChartData = ref(null);
		const donutChartData = ref(null);
		const netIncomeChartData = ref(null);
		const grossMarginChartData = ref(null);
		const revenueGrowthChartData = ref(null);

		const isDataLoaded = computed(() => rawStockData.value !== null);

		const loadStockData = async () => {
			try {
				rawStockData.value = await fetchStockData();
				stocks.value = Object.values(prepareStockTileData(rawStockData.value));
				revenueChartData.value = prepareRevenueChartData(rawStockData.value);
				donutChartData.value = calculateTTMRevenue(rawStockData.value);
				netIncomeChartData.value = prepareNetIncomeTTMData(rawStockData.value);
				grossMarginChartData.value = prepareGrossMarginData(rawStockData.value);
				revenueGrowthChartData.value = prepareRevenueGrowthData(
					rawStockData.value
				);
				emit('data-loaded');
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
			grossMarginChartData,
			revenueGrowthChartData,

			isDataLoaded,
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../styles/dashboard.scss';
</style>
