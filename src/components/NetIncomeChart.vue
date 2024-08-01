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

export default {
	name: 'NetIncomeChart',
	components: { Bar },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
	},
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
						padding: 10,
						color: tickTextColor,
						callback: (value) => `${value}`,
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
