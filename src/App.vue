<template>
	<div id="app">
		<div v-if="isLoading" class="spinner-overlay">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
			>
				<rect width="9" height="9" x="1.5" y="1.5" fill="#a0a0e5" rx="1">
					<animate
						id="svgSpinnersBlocksScale0"
						attributeName="x"
						begin="0;svgSpinnersBlocksScale1.end+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="1.5;.5;1.5"
					/>
					<animate
						attributeName="y"
						begin="0;svgSpinnersBlocksScale1.end+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="1.5;.5;1.5"
					/>
					<animate
						attributeName="width"
						begin="0;svgSpinnersBlocksScale1.end+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
					<animate
						attributeName="height"
						begin="0;svgSpinnersBlocksScale1.end+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
				</rect>
				<rect width="9" height="9" x="13.5" y="1.5" fill="#a0a0e5" rx="1">
					<animate
						attributeName="x"
						begin="svgSpinnersBlocksScale0.begin+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="13.5;12.5;13.5"
					/>
					<animate
						attributeName="y"
						begin="svgSpinnersBlocksScale0.begin+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="1.5;.5;1.5"
					/>
					<animate
						attributeName="width"
						begin="svgSpinnersBlocksScale0.begin+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
					<animate
						attributeName="height"
						begin="svgSpinnersBlocksScale0.begin+0.15s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
				</rect>
				<rect width="9" height="9" x="13.5" y="13.5" fill="#a0a0e5" rx="1">
					<animate
						attributeName="x"
						begin="svgSpinnersBlocksScale0.begin+0.3s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="13.5;12.5;13.5"
					/>
					<animate
						attributeName="y"
						begin="svgSpinnersBlocksScale0.begin+0.3s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="13.5;12.5;13.5"
					/>
					<animate
						attributeName="width"
						begin="svgSpinnersBlocksScale0.begin+0.3s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
					<animate
						attributeName="height"
						begin="svgSpinnersBlocksScale0.begin+0.3s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
				</rect>
				<rect width="9" height="9" x="1.5" y="13.5" fill="#a0a0e5" rx="1">
					<animate
						id="svgSpinnersBlocksScale1"
						attributeName="x"
						begin="svgSpinnersBlocksScale0.begin+0.45s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="1.5;.5;1.5"
					/>
					<animate
						attributeName="y"
						begin="svgSpinnersBlocksScale0.begin+0.45s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="13.5;12.5;13.5"
					/>
					<animate
						attributeName="width"
						begin="svgSpinnersBlocksScale0.begin+0.45s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
					<animate
						attributeName="height"
						begin="svgSpinnersBlocksScale0.begin+0.45s"
						dur="0.6s"
						keyTimes="0;.2;1"
						values="9;11;9"
					/>
				</rect>
			</svg>
		</div>
		<DashboardView @data-loaded="hideSpinner" />
	</div>
</template>

<script>
import { ref } from 'vue';
import DashboardView from './views/DashboardView';

/**
 * The main Vue.js component for the application.
 *
 * This component sets up the initial loading state and provides a method to hide the loading spinner once data has been loaded.
 */
export default {
	name: 'App',
	components: {
		DashboardView,
	},
	setup() {
		const isLoading = ref(true);

		const hideSpinner = () => {
			isLoading.value = false;
		};

		return {
			isLoading,
			hideSpinner,
		};
	},
};
</script>

<style lang="scss">
@import './styles.scss';
</style>
