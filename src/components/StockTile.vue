<template>
	<div class="stock-tile">
		<div class="title">
			<img :src="iconUrl" :alt="stock.name + ' logo'" class="company-logo" />
			<h3>{{ stock.name }}</h3>
		</div>
		<p class="revenue-quarter">Revenue {{ formatQuarter(stock.quarter) }}</p>
		<div class="revenue-growth">
			<p class="current-revenue">
				{{ formatRevenueChange(stock.currentRevenue) }}
			</p>
			<div class="revenue-change">
				<p :class="['change-absolute', changeClass]">
					{{ formatRevenueChange(stock.absoluteChange) }}
				</p>
				<p :class="['change-percentage', changeClass]">
					{{ formatGrowthPercentage(stock.relativeChange) }}
				</p>
			</div>
		</div>
		<span>in Bill. USD</span>
	</div>
</template>

<script>
import { formatQuarter } from '@/services/stockService';

/**
 * The `StockTile` component represents a visual tile for displaying information about a stock.
 * It receives a `stock` prop of type `Object` which contains the necessary data to display the stock information.
 *
 * The component computes the URL for the company logo icon, and a CSS class based on the sign of the stock's absolute revenue change.
 *
 * It also provides several methods to format the revenue change and growth percentage for display.
 */
export default {
	name: 'StockTile',
	props: {
		stock: {
			type: Object,
			required: true,
		},
	},
	computed: {
		iconUrl() {
			return require(`@/assets/icons/${this.stock.symbol}_icon.svg`);
		},
		changeClass() {
			return parseFloat(this.stock.absoluteChange) >= 0
				? 'positive'
				: 'negative';
		},
	},
	methods: {
		formatQuarter,
		formatRevenueChange(change) {
			return parseFloat(change).toFixed(2);
		},
		formatGrowthPercentage(growth) {
			return `${parseFloat(growth).toFixed(2)}%`;
		},
	},
};
</script>

<style lang="scss">
@import '../styles/stockTile.scss';
</style>
