/*
 * @Author: Sherlock09
 * @Date: 2023-02-09 09:26:46
 * @LastEditTime: 2023-02-14 18:04:42
 * @LastEditors: Sherlock09
 * @Description: description
 * @FilePath: /adapter/src/utils/isCacheLike.ts
 */


export type ICacheLike<T> = {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
} & ({ del(key: string): void } | { delete(key: string): void });

/**
 * @description: 判断是否为cahce操作
 * @param {any} cache
 * @return {*}
 */
export default function isCacheLike(cache: any): cache is ICacheLike<any> {
	return typeof cache.get === 'function' && typeof cache.set === 'function' && (typeof cache.delete === 'function' || typeof cache.del === 'function');
}
