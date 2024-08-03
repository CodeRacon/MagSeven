<template>
	<div class="revenue-growth-chart">
		<Bar
			v-if="computedChartData"
			:data="computedChartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from 'chart.js';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale
);

const tickTextColor = '#cddae5';
const textColor = '#fff';
const gridColor = 'rgba(255, 255, 255, 0.075)';

/**
 * A Vue.js component that renders a revenue growth chart using the Vue-ChartJS library.
 *
 * The component accepts a `chartData` prop, which is an object containing the data to be displayed in the chart.
 * The component computes the chart data and options based on the provided `chartData` prop, and handles screen width changes to adjust the legend position.
 *
 * The component uses the following chart.js plugins:
 * - `Title`: Displays the chart title
 * - `Tooltip`: Customizes the chart tooltip behavior
 * - `Legend`: Displays the chart legend
 * - `BarElement`: Renders the bar elements in the chart
 * - `CategoryScale`: Scales the x-axis categories
 * - `LinearScale`: Scales the y-axis values
 *
 * The component also defines several style-related constants, such as `tickTextColor`, `textColor`, and `gridColor`, which are used to style the chart elements.
 */
export default {
	name: 'RevenueGrowthChart',
	components: { Bar },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
	},
	/**
	 * Computes the chart data and options for the revenue growth chart based on the provided `chartData` prop.
	 * The computed data includes customized hover styles for the bar elements.
	 * The component also handles screen width changes to adjust the legend position.
	 *
	 * @param {Object} props - The component props, including the `chartData` object.
	 * @returns {Object} - An object containing the computed chart data and options.
	 */
	setup(props) {
		const computedChartData = computed(() => {
			if (props.chartData) {
				return {
					...props.chartData,
					datasets: props.chartData.datasets.map((dataset) => ({
						...dataset,
						hoverBackgroundColor: dataset.backgroundColor,
						borderColor: dataset.backgroundColor,
						hoverBorderColor: '#fff',
						borderWidth: 0,
						hoverBorderWidth: 2,
					})),
				};
			}
			return null;
		});

		const screenWidth = ref(window.innerWidth);
		const updateScreenWidth = () => {
			screenWidth.value = window.innerWidth;
		};

		onMounted(() => {
			window.addEventListener('resize', updateScreenWidth);
		});

		onUnmounted(() => {
			window.removeEventListener('resize', updateScreenWidth);
		});

		const legendPosition = computed(() =>
			screenWidth.value < 960 ? 'bottom' : 'right'
		);

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				tooltip: {
					usePointStyle: true,
					boxPadding: 4,
					callbacks: {
						label: (context) => {
							const label = context.label || '';
							const value = context.raw || 0;
							return `${label}: ${value.toFixed(1)}%`;
						},
					},
				},
				legend: {
					display: true,
					position: legendPosition,
					labels: {
						usePointStyle: true,
						boxHeight: 8,
						color: textColor,
						font: {
							size: 10,
						},
					},
				},
				title: {
					align: 'start',

					display: true,
					text: 'Revenue Growth YoY',
					color: textColor,
					font: {
						size: 20,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						padding: 10,
						color: tickTextColor,
						font: {
							size: 9,
						},
					},
					grid: {
						drawTicks: false,
						color: gridColor,
					},
				},
				y: {
					ticks: {
						stepSize: 25,
						max: 325,
						min: -25,
						padding: 10,
						color: tickTextColor,
						font: {
							size: 9,
						},
						callback: (value, index) => (index % 2 === 0 ? `${value}` : ''),
					},
					grid: {
						drawTicks: false,
						color: gridColor,
					},
				},
			},
		});

		return {
			computedChartData,
			chartOptions,
			legendPosition,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/revenueGrowthChart.scss';
</style>
