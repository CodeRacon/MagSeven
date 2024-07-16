const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	transpileDependencies: true,
	css: {
		loaderOptions: {
			sass: {
				additionalData: `
          @import "@/variables.scss";
          @import "@/mixins.scss";
          @import "@/styles.scss";
        `,
			},
		},
	},
});
