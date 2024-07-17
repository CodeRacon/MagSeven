<template>
	<div class="stock-tile">
		<div class="title">
			<img :src="iconUrl" :alt="stock.name + ' logo'" class="company-logo" />
			<h3>{{ stock.symbol }}</h3>
		</div>
		<div class="revenue-info">
			<p>Revenue {{ formatQuarter(stock.quarter) }}</p>
			<p>{{ formatRevenueChange(stock.currentRevenue) }}</p>
			<p>{{ formatRevenueChange(stock.absoluteChange) }}</p>
			<p>{{ formatGrowthPercentage(stock.relativeChange) }}</p>
			<span>in Bill. USD</span>
		</div>
	</div>
</template>

<script>
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
	},
	methods: {
		formatQuarter(quarter) {
			const parts = quarter.replace('-', ' ').split(/\s+/);
			let q, year;

			if (parts.length === 2) {
				if (parts[0].startsWith('Q')) {
					[q, year] = parts;
				} else {
					[year, q] = parts;
				}
			} else {
				q = parts[0].slice(-2);
				year = parts[0].slice(0, -2);
			}

			year = year.length === 2 ? '20' + year : year;
			q = q.startsWith('Q') ? q : 'Q' + q;

			return `${q} ${year}`;
		},
		formatRevenueChange(change) {
			return change;
		},
		formatGrowthPercentage(growth) {
			return `${growth}%`;
		},
	},
};
</script>

<style lang="scss">
@import '../styles/stockTile.scss';
</style>
