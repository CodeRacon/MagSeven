<template>
	<div class="donut-chart">
		<Doughnut
			v-if="computedChartData"
			:data="computedChartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const textColor = '#fff';

export default {
	name: 'DonutChart',
	components: { Doughnut },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
	},

	/**
	 * The `setup` function is a Vue.js composition API function that is called when the component is created. It sets up the state and computed properties for the donut chart component.
	 *
	 * The function takes in `props` as a parameter, which contains the `chartData` prop passed down to the component.
	 *
	 * The function returns an object with the following properties:
	 * - `computedChartData`: a computed property that transforms the `chartData` prop into the format required by the Doughnut chart component.
	 * - `chartOptions`: an object that configures the options for the Doughnut chart, including the title, legend, and tooltip.
	 * - `legendPosition`: a computed property that determines the position of the legend based on the screen width.
	 *
	 * The function also sets up event listeners for window resize events to update the `screenWidth` reactive variable, which is used to determine the legend position.
	 */
	setup(props) {
		const chartData = ref(null);

		const computedChartData = computed(() => {
			if (chartData.value) {
				const { ttmRevenue, colors } = chartData.value;
				return {
					labels: Object.keys(ttmRevenue),
					datasets: [
						{
							data: Object.values(ttmRevenue),
							backgroundColor: colors,
							hoverBackgroundColor: colors,

							borderColor: '#0D152B',
							hoverBorderColor: textColor,
						},
					],
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
			screenWidth.value < 768 ? 'bottom' : 'right'
		);

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			cutout: '40%',
			plugins: {
				hoverPlugin: {
					id: 'hoverPlugin',
					beforeDraw: (chart) => {
						if (!chart || !chart.getActiveElements) return;
					},
				},

				title: {
					align: 'start',
					display: true,
					text: 'Revenue Breakdown',
					color: textColor,
					font: {
						size: 20,
					},
				},
				legend: {
					position: legendPosition,
					labels: {
						usePointStyle: true,

						boxHeight: 8,
						color: textColor,
						font: {
							size: 10,
						},
						generateLabels: (chart) => {
							const data = chart.data;
							return data.labels.map((label, i) => ({
								text: `${label} → ${data.datasets[0].data[i].toFixed(2)} `,
								fillStyle: data.datasets[0].backgroundColor[i],

								strokeStyle: 'transparent',
								fontColor: textColor,
								index: i,
							}));
						},
					},
				},
				tooltip: {
					usePointStyle: true,
					boxPadding: 4,
					borderWidth: 0,
					callbacks: {
						label: (context) => {
							const label = context.label || '';
							const value = context.parsed || 0;
							return `${label}: ${value.toFixed(2)} Bill. USD`;
						},
						labelColor: (context) => {
							return {
								backgroundColor:
									context.dataset.backgroundColor[context.dataIndex],

								borderColor: context.dataset.backgroundColor[context.dataIndex],
							};
						},
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
@import '../styles/donutChart.scss';
</style>
