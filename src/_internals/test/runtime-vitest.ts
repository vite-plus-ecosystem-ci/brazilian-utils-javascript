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
			// oxlint-disable-next-line vitest/expect-expect -- This test registers a benchmark workload.
			test(name, async ({ bench: runBenchmark }) => {
				await runBenchmark(name, fn).run();
			});
		}
	: Object.assign((name: string): void => {
			test.todo(name);
		}, noopBench);
