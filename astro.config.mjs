// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import catppuccin from "@catppuccin/starlight";
import starlightOpenAPI from 'starlight-openapi';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			plugins: [catppuccin()],
			title: 'Hermetic Labs',
			logo: {
				src: './src/assets/logo.svg',
				dark: './src/assets/logo-dark.svg',
			},
			customCss: [
				// Path to your custom CSS files
				'./src/styles/custom.css',
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/hermeticlab' }
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Who We Are', link: '/start-here/who-we-are/' },
						{ label: 'How to Use These Docs', link: '/start-here/how-to-use/' },
						{ label: 'Our Projects', link: '/start-here/our-projects/' },
					],
				},
				{
					label: 'Using Our Tools',
					items: [
						{ label: 'Installing from the Monorepo', link: '/using-our-tools/installing-monorepo/' },
					],
				},
				{
					label: 'Hermetic MLS',
					items: [
						{ label: 'Installing', link: '/hermetic-mls/installing/' },
						{ label: 'Creating Clients', link: '/hermetic-mls/creating-clients/' },
						{ label: 'Creating Key Packages', link: '/hermetic-mls/creating-key-packages/' },
						{ label: 'Persistence', link: '/hermetic-mls/persistence/' },
					],
				},
				{
					label: 'Hermetic FHE',
					items: [
						{ label: 'Docs Coming Soon', link: '/hermetic-fhe/coming-soon/' },
					],
				},
				{
					label: 'Hermetic Cloud',
					items: [
						{ label: 'OpenAPI Spec', link: '/hermetic-cloud/openapi/' },
					],
				},
			],
		}),
	],
});
