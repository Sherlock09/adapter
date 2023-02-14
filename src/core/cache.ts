/*
 * @Author: Sherlock09
 * @Date: 2023-02-09 09:26:46
 * @LastEditTime: 2023-02-14 18:04:23
 * @LastEditors: Sherlock09
 * @Description: description
 * @FilePath: /adapter/src/core/cache.ts
 */


import { AxiosAdapter, AxiosPromise } from 'axios';
import LRUCache from 'lru-cache';
import buildSortedURL from '../utils/buildSortedURL';
import isCacheLike, { ICacheLike } from '../utils/isCacheLike';

declare module 'axios' {
	interface AxiosRequestConfig {
		forceUpdate?: boolean;
		cache?: boolean | ICacheLike<any>;
		forceCache?: boolean;
	}
}
/**
* 全局设置缓存的最大时间；默认5
*/
const FIVE_MINUTES = 1000 * 60 * 5;
/*
*
* 缓存个数
*/
const CAPACITY = 100;
export type Options = {
 	/**
  * 是否启用缓存
  */
	enabledByDefault?: boolean,
	/**
  * 缓存标志，用于配置请求 config 对象上的缓存属性；
  */
	cacheFlag?: string,
	/**
  * 全局设置缓存的最大时间；
  */
	maxAge?: number,
	/**
  * 用于设置使用的缓存对象。
  */
	defaultCache?: ICacheLike<AxiosPromise>,
};

/**
 * @description: cache adapter
 * @param {AxiosAdapter} adapter axios adapter
 * @param {Options} options
 * @return {*}
 */
export default function cacheHandle(adapter: AxiosAdapter, options: Options = {}): AxiosAdapter {
	const {
		maxAge,
		enabledByDefault = true,
		cacheFlag = 'cache',
		defaultCache = new LRUCache({ ttl: maxAge || FIVE_MINUTES, max: CAPACITY }),
	} = options;
	return config => {
		const {
			url,
			method,
			params,
			paramsSerializer,
			forceUpdate,
			forceCache
		} = config;

		const useCache = ((config as any)[cacheFlag] !== void 0 && (config as any)[cacheFlag] !== null)
			? (config as any)[cacheFlag]
			: enabledByDefault;

		if ((method === "get" && useCache) || (forceCache && useCache)) {
			const cache: ICacheLike<AxiosPromise> = isCacheLike(useCache)
				? useCache
				: defaultCache;
			const index = buildSortedURL(url, params, paramsSerializer);
			let responsePromise = cache.get(index);

			if (!responsePromise || forceUpdate) {
				responsePromise = (async () => {

					try {
						return await adapter(config);
					} catch (reason) {
						'delete' in cache
							? cache.delete(index)
							: cache.del(index);
						throw reason;
					}

				})();
				cache.set(index, responsePromise);
				return responsePromise;
			}
			if (process.env.LOGGER_LEVEL === 'info') {
				// eslint-disable-next-line no-console
				console.info(`[jc-request-adapter] request cached by cache adapter --> url: ${index}`);
			}
			return responsePromise;
		}

		return adapter(config);
	};
}
