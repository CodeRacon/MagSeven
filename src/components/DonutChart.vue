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
import { ref, watch, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const hoverPlugin = {
	id: 'hoverPlugin',
	beforeDraw: (chart) => {
		if (!chart || !chart.getActiveElements) return;
	},
};

ChartJS.register(hoverPlugin);

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

		const chartOptions = ref({
			responsive: true,
			maintainAspectRatio: false,
			cutout: '40%',
			plugins: {
				title: {
					align: 'start',
					display: true,
					text: 'Revenue Breakdown of the MagSeven',
					color: textColor,
					font: {
						size: 16,
					},
				},
				legend: {
					position: 'right',
					labels: {
						usePointStyle: true,

						boxHeight: 10,
						color: textColor,
						font: {
							size: 12,
						},
						generateLabels: (chart) => {
							const data = chart.data;
							return data.labels.map((label, i) => ({
								text: `${label} ${data.datasets[0].data[i].toFixed(2)} `,
								fillStyle: data.datasets[0].backgroundColor[i],
								strokeStyle: 'transparent',
								fontColor: textColor,
								index: i,
							}));
						},
					},
				},
				tooltip: {
					callbacks: {
						label: (context) => {
							const label = context.label || '';
							const value = context.parsed || 0;
							return `${label}: ${value.toFixed(2)} Bill. USD`;
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
		};
	},
};
</script>

<style lang="scss">
@import '../styles/donutChart.scss';
</style>
