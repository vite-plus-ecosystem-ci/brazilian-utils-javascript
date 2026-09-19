import { test } from "vite-plus/test";

import { type Benchmark, bench as noopBench } from "./noop";

export {
	afterEach,
	beforeEach,
	describe,
	expect,
	expectTypeOf,
	it,
	test,
	vi,
} from "vite-plus/test";

const isBenchmarkMode = (): boolean => import.meta.env.MODE === "benchmark";

/** Preserve benchmark execution and todo registration in regular test mode. */
export const bench: Benchmark = isBenchmarkMode()
	? (name, fn) => {
			test(name, async ({ bench }) => {
				await bench(name, fn).run();
			});
		}
	: Object.assign((name: string): void => {
			test.todo(name);
		}, noopBench);
