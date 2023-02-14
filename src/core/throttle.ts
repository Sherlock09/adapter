/*
 * @Author: zhangxiangyi
 * @Date: 2023-02-09 09:26:46
 * @LastEditTime: 2023-02-10 10:40:01
 * @LastEditors: zhangxiangyi
 * @Description: description
 * @FilePath: /jc-axios-adapter/src/core/throttle.ts
 */

import { AxiosAdapter, AxiosPromise, AxiosRequestConfig } from 'axios';
import LRUCache from 'lru-cache';
import buildSortedURL from '../utils/buildSortedURL';
import { ICacheLike } from '../utils/isCacheLike';

export type RecordedCache = {
	/**
	* 时间戳
	*/
	timestamp: number;
	/**
	* axios promise 数据
	*/
	value?: AxiosPromise;
};

export type Options = {
	/**
	* 发送请求时间间隔 ms
	*/
	threshold?: number,
	/**
	* 缓存池
	*/
	cache?: ICacheLike<RecordedCache>,
};

/**
 * @description: throttle adapter
 * @param {AxiosAdapter} adapter axios adapter
 * @param {Options} options
 * @return {*}
 */
export default function throttleHandle(adapter: AxiosAdapter, options: Options = {}): AxiosAdapter {

	const {
		threshold = 1000,
		cache = new LRUCache<string, RecordedCache>({ max: 10 })
	} = options;

 /**
  * @description: record request
  * @param {string} index
  * @param {AxiosRequestConfig} config
  * @return {*}
  */
	const recordCacheWithRequest = (index: string, config: AxiosRequestConfig) => {
		const responsePromise = (async () => {
			try {
				const response = await adapter(config);
				cache.set(index, {
					timestamp: Date.now(),
					value: Promise.resolve(response),
				});
				return response;
			} catch (reason) {

				'delete' in cache
					? cache.delete(index)
					: cache.del(index);

				throw reason;
			}
		})();
		cache.set(index, {
			timestamp: Date.now(),
			value: responsePromise,
		});
		return responsePromise;
	};
	return config => {
		const {
			url,
			method,
			params,
			paramsSerializer
		} = config;
		const index = buildSortedURL(url, params, paramsSerializer);
		const now = Date.now();
		const cachedRecord = cache.get(index) || { timestamp: now };
		// if (method === 'get') {
		if (now - cachedRecord.timestamp <= threshold) {
			const responsePromise = cachedRecord.value;
			if (responsePromise) {
				/* istanbul ignore next */
				if (process.env.LOGGER_LEVEL === 'info') {
					// eslint-disable-next-line no-console
					console.info(`[jc-request-adapter] request cached by throttle adapter --> url: ${index}`);
				}
				return responsePromise;
			}
		}
		return recordCacheWithRequest(index, config);
		// }
		// return adapter(config);
	};
}
