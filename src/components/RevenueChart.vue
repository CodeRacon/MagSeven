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
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
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

const tickTextColor = '#cddae5';
const textColor = '#fff';
const gridColor = 'rgba(255, 255, 255, 0.075)';

export default {
	name: 'RevenueChart',
	components: { Line },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
	},

	/**
	 * Computes the chart data and options for the revenue chart component.
	 *
	 * The `setup` function is responsible for the following:
	 * - Initializing the `chartData` reactive ref and computing the `computedChartData` based on the `chartData` prop.
	 * - Handling screen width changes and updating the `legendPosition` computed property accordingly.
	 * - Registering a custom "hoverPlugin" to handle the hover behavior of the chart.
	 * - Defining the `chartOptions` object with various configurations for the chart, such as scales, tooltip, and legend.
	 * - Watching for changes in the `chartData` prop and updating the `chartData` ref accordingly.
	 *
	 * The computed properties and reactive refs returned by the `setup` function are used in the component's template to render the chart.
	 */
	setup(props) {
		const chartData = ref(null);

		const computedChartData = computed(() => {
			if (chartData.value && chartData.value.datasets) {
				return {
					labels: chartData.value.labels,
					datasets: chartData.value.datasets.map((dataset) => ({
						...dataset,
						pointRadius: 10,
						pointHoverRadius: 10,

						pointBorderColor: 'transparent',
						pointHoverBorderColor: 'transparent',

						pointBackgroundColor: 'transparent',
						pointHoverBackgroundColor: 'transparent',

						borderWidth: 1,
						hoverBorderWidth: 3,
						hoverBorderColor: dataset.borderColor,
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

		const hoverPlugin = {
			id: 'hoverPlugin',
			defaults: {
				hoverLineWidth: 3,
				normalLineWidth: 1,
			},
			beforeDraw: (chart, _, options) => {
				const activeElements = chart.getActiveElements();
				if (activeElements.length > 0) {
					const datasetIndex = activeElements[0].datasetIndex;
					chart.data.datasets.forEach((_, index) => {
						const meta = chart.getDatasetMeta(index);
						if (meta.dataset && meta.dataset.options) {
							meta.dataset.options.borderWidth =
								index === datasetIndex
									? options.hoverLineWidth
									: options.normalLineWidth;
						}
					});
				}
			},
		};

		ChartJS.register(hoverPlugin);

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			pointStyle: true,
			tension: 0.325,
			color: textColor,

			interaction: {
				mode: 'nearest',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: false,
			},

			scales: {
				y: {
					beginAtZero: true,
					title: {
						color: tickTextColor,
					},
					ticks: {
						padding: 10,
						color: tickTextColor,
						callback: function (value, index) {
							return index % 2 === 0 ? value : '';
						},
						font: {
							size: 9,
						},
					},
					grid: {
						drawTicks: false,
						color: gridColor,
					},
				},

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
			},

			plugins: {
				tooltip: {
					usePointStyle: true,
					boxPadding: 4,
					borderWidth: 0,
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
								borderColor: context.dataset.borderColor,
							};
						},
					},
				},

				title: {
					align: 'start',
					display: true,
					text: 'Revenue of the last 3 years',
					color: textColor,
					font: {
						size: 20,
					},
				},
				legend: {
					position: legendPosition,

					labels: {
						usePointStyle: true,
						boxWidth: 32,
						boxHeight: 8,
						color: textColor,
						font: {
							size: 10,
						},
						generateLabels: (chart) => {
							const datasets = chart.data.datasets;
							return datasets.map((dataset, i) => {
								const lastValue = dataset.data[dataset.data.length - 1];
								return {
									text: `${dataset.label} → ${lastValue.toFixed(2)} `,
									fillStyle: dataset.borderColor,
									strokeStyle: 'transparent',
									fontColor: textColor,
									lineWidth: 1,
									hidden: !chart.isDatasetVisible(i),
									index: i,
								};
							});
						},
						useHTML: true,
					},
				},
			},
		});

		watch(
			() => props.chartData,
			(newChartData) => {
				if (newChartData) {
					chartData.value = newChartData;
				}
			},
			{ immediate: true }
		);

		return {
			computedChartData,
			chartOptions,
			legendPosition,
		};
	},
};
</script>

<style lang="scss">
@import '../styles/revenueChart.scss';
</style>
