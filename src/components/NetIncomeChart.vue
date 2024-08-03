<template>
	<div class="net-income-chart">
		<Bar
			v-if="computedChartData"
			:data="computedChartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
} from 'chart.js';

ChartJS.register(
	Title,
	Legend,
	Tooltip,
	BarElement,
	CategoryScale,
	LinearScale
);

const tickTextColor = '#cddae5';
const textColor = '#fff';
const gridColor = 'rgba(255, 255, 255, 0.075)';

/**
 * Provides a bar chart component that displays net income data over time.
 * The chart is configured with options for responsive layout, tooltip formatting, and axis styling.
 * The chart data is computed from the `chartData` prop passed to the component.
 */
export default {
	name: 'NetIncomeChart',
	components: { Bar },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
	},
	/**
	 * Computes the chart data and options for the net income bar chart.
	 * The chart data is computed from the `chartData` prop passed to the component.
	 * The chart options are configured for responsive layout, tooltip formatting, and axis styling.
	 *
	 * @param {Object} props - The component props, including the `chartData` object.
	 * @returns {Object} - An object containing the computed chart data and options.
	 */
	setup(props) {
		const computedChartData = computed(() => {
			if (props.chartData) {
				const { labels, datasets } = props.chartData;
				return {
					labels: labels,
					datasets: [
						{
							data: datasets[0].data,
							backgroundColor: datasets[0].backgroundColor,
							hoverBackgroundColor: datasets[0].backgroundColor,
							borderColor: datasets[0].backgroundColor,
							hoverBorderColor: textColor,
							hoverBorderWidth: 2,
						},
					],
				};
			}
			return null;
		});

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			indexAxis: 'y',

			plugins: {
				tooltip: {
					usePointStyle: true,
					boxPadding: 4,
					callbacks: {
						label: (context) => {
							const label = context.label || '';
							const value = context.raw || 0;
							return `${label}: ${value.toFixed(2)} Bill. USD`;
						},
					},
				},

				legend: {
					display: false,
				},
				title: {
					align: 'start',
					display: true,
					text: 'Net Income TTM',
					color: textColor,
					font: {
						size: 20,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						stepSize: 25,
						max: 125,
						padding: 10,
						color: tickTextColor,
						callback: (value) => `${value}`,
						font: {
							size: 9,
						},
					},
					grid: {
						color: gridColor,
						drawTicks: false,
					},
				},
				y: {
					ticks: {
						padding: 10,
						color: tickTextColor,
						font: {
							size: 9,
						},
					},
					grid: {
						color: gridColor,
						drawTicks: false,
					},
				},
			},
		});

		return {
			computedChartData,
			chartOptions,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/netIncomeChart.scss';
</style>
