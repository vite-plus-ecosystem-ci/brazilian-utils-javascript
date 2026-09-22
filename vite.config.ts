import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { webdriverio } from "@vitest/browser-webdriverio";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite-plus";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	fmt: {
		ignorePatterns: ["dist", "coverage", "docs"],
		singleQuote: false,
		sortImports: true,
		useTabs: true,
	},
	lint: {
		categories: {
			correctness: "error",
			suspicious: "error",
		},
		ignorePatterns: ["dist", "coverage", "docs"],
		rules: {
			"unicorn/no-array-reverse": "off",
			"unicorn/no-array-sort": "off",
		},
		overrides: [
			{
				files: ["**/*.test.ts", "**/*.spec.ts"],
				plugins: ["oxc", "typescript", "unicorn", "vitest"],
				rules: {
					"@typescript-eslint/no-explicit-any": "off",
				},
			},
			{
				env: {
					node: true,
				},
				files: ["scripts/**/*.ts", "vite.config.ts"],
			},
		],
	},
	test: {
		// Vitest v4 compatibility: preserve mock call history.
		// Remove after tests no longer rely on calls from setup or earlier tests.
		// https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
		// https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
		clearMocks: false,
		browser: {
			locators: {
				// Vitest v4 compatibility: keep partial, case-insensitive locator matching.
				// Remove after updating locators for full, case-sensitive matches.
				// https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
				// https://vitest.dev/guide/migration/#locators-are-strict-by-default
				exact: false,
			},
			provider: webdriverio(),
			instances: [
				{ browser: "edge" },
				{ browser: "chrome" },
				{ browser: "safari" },
				{ browser: "firefox" },
			],
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
	],
	build: {
		lib: {
			entry: resolve(rootDir, "src/index.ts"),
			name: "BrazilianUtils",
			fileName: "brazilian-utils",
		},
		outDir: "dist",
		sourcemap: true,
		rollupOptions: {
			output: {
				preserveModules: false,
				exports: "named",
			},
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
			},
		},
	},
});
