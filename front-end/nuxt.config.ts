// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@nuxtjs/google-fonts"],
	css: ["./assets/styles/globals.scss"],
	googleFonts: {
		families: {
			Roboto: [400, 600],
			"Roboto Slab": [600, 800]
		},
		display: "swap"
	}
})
