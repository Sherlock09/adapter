/*
 * @Author: Sherlock09
 * @Date: 2023-02-09 09:26:46
 * @LastEditTime: 2023-02-14 18:04:29
 * @LastEditors: Sherlock09
 * @Description: description
 * @FilePath: /adapter/src/core/retry.ts
 */



import { AxiosAdapter, AxiosResponse } from 'axios';
declare module 'axios' {
	interface AxiosRequestConfig {
		retryTimes?: number;
	}
}

export type Options = {
	/**
	* 重试次数
	*/
	times?: number;
};

/**
 * @description: retry adapter
 * @param {AxiosAdapter} adapter axios adapter
 * @param {Options} options
 * @return {*}
 */
export default function retryHandle(adapter: AxiosAdapter, options: Options = {}): AxiosAdapter {
	const { times = 2 } = options;
	return async config => {
		const { retryTimes = times } = config;
		let timeUp = false;
		let count = 0;
		const request = async (): Promise<AxiosResponse> => {
			try {
				return await adapter(config);
			} catch (e) {
				timeUp = retryTimes === count;

				if (timeUp) {
					throw e;
				}
				count++;
				if (process.env.LOGGER_LEVEL === 'info') {
					console.info(`[axios-adapter] request start retrying --> url: ${config.url} , time: ${count}`);
				}

				return request();
			}
		};

		return request();
	};
}
