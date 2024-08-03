<template>
	<div class="gross-margin-chart">
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
 * The `GrossMarginChart` component is a Vue.js component that renders a bar chart to display the gross margin percentage over time.
 *
 * The component accepts a `chartData` prop, which is an object containing the chart data, including labels and datasets.
 *
 * The component uses the `vue-chartjs` library to render the chart, and it registers the necessary chart.js components.
 *
 * The component also defines the chart options, including the tooltip, legend, and axis configurations.
 */
export default {
	name: 'GrossMarginChart',
	components: { Bar },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
	},
	/**
	 * The `setup` function is a Vue.js composition API function that is used to initialize the state and computed properties for the `GrossMarginChart` component.
	 *
	 * The `setup` function takes a `props` object as an argument, which contains the `chartData` prop passed to the component.
	 *
	 * The function computes the `computedChartData` object, which is derived from the `chartData` prop and formatted for use with the `vue-chartjs` library.
	 *
	 * The function also defines the `chartOptions` object, which configures the appearance and behavior of the chart, including the tooltip, legend, and axis settings.
	 *
	 * The `setup` function returns an object containing the `computedChartData` and `chartOptions` properties, which are then used in the component's template to render the chart.
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
							return `${label}: ${value.toFixed(1)}%`;
						},
					},
				},

				legend: {
					display: false,
				},
				title: {
					align: 'start',
					display: true,
					text: 'Gross Margin in % LQ',
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
@import '../styles/grossMarginChart.scss';
</style>
