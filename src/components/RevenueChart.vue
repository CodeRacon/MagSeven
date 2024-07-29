<template>
	<div class="revenue-chart">
		<Line
			v-if="computedChartData"
			:data="computedChartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	CategoryScale,
	PointElement,
} from 'chart.js';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	CategoryScale,
	PointElement
);

export default {
	name: 'RevenueChart',
	components: { Line },
	props: {
		stockData: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const chartData = ref(null);

		const computedChartData = computed(() => {
			if (
				chartData.value &&
				chartData.value.labels &&
				chartData.value.datasets
			) {
				return {
					labels: chartData.value.labels,
					datasets: chartData.value.datasets,
				};
			}
			return null;
		});

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			pointStyle: false,
			tension: 0.325,
			borderWidth: 1,
			color: '#ffffff',

			scales: {
				y: {
					beginAtZero: true,
					title: {
						color: '#ffffff',
					},
					ticks: {
						padding: 10,
						color: '#ffffff',
						callback: function (value, index) {
							return index % 2 === 0 ? value : '';
						},
						font: {
							size: 10,
						},
					},
					grid: {
						drawTicks: false,
						color: 'rgba(255, 255, 255, 0.075)',
					},
				},

				x: {
					ticks: {
						padding: 10,
						color: '#ffffff',
						font: {
							size: 10,
						},
					},
					grid: {
						drawTicks: false,
						color: 'rgba(255, 255, 255, 0.075)',
					},
				},
			},

			plugins: {
				tooltip: {
					mode: 'nearest',
					intersect: false,
					callbacks: {
						title: (context) => {
							return context[0].label;
						},
						label: (context) => {
							return `${context.dataset.label}: ${context.parsed.y.toFixed(
								2
							)} Bill. USD`;
						},
						labelColor: (context) => {
							return {
								backgroundColor: context.dataset.borderColor,
								borderColor: 'unset',
							};
						},
					},
				},

				title: {
					align: 'start',
					display: true,
					text: 'Revenue of the last 3 years',
					color: '#ffffff',
					font: {
						size: 16,
					},
				},
				legend: {
					position: 'right',
					margin: {
						left: 200,
					},
					labels: {
						usePointStyle: false,
						boxWidth: 32,
						boxHeight: 10,
						color: '#ffffff',

						font: {
							size: 12,
						},
						generateLabels: (chart) => {
							const datasets = chart.data.datasets;
							return datasets.map((dataset, i) => ({
								text: dataset.label,
								fillStyle: dataset.borderColor,
								strokeStyle: '#ffffff',
								color: '#ffffff',
								fontColor: '#ffffff',

								lineWidth: 1,
								hidden: !chart.isDatasetVisible(i),
								index: i,
							}));
						},
					},
				},
			},
		});

		watch(
			() => props.stockData,
			(newStockData) => {
				if (Object.keys(newStockData).length > 0) {
					chartData.value = newStockData;
					console.log(
						'Chart-Daten in RevenueChart:',
						JSON.stringify(chartData.value, null, 2)
					);
				}
			},
			{ immediate: true }
		);

		return {
			computedChartData,
			chartOptions,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/revenueChart.scss';
</style>
