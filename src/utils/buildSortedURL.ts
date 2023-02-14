/*
 * @Author: zhangxiangyi
 * @Date: 2023-02-09 09:26:46
 * @LastEditTime: 2023-02-09 10:39:23
 * @LastEditors: zhangxiangyi
 * @Description: description
 * @FilePath: /jc-axios-adapter/src/utils/buildSortedURL.ts
 */

// @ts-ignore
import buildURL from 'axios/lib/helpers/buildURL';

/**
 * @description: 根据axios url 生成缓存url
 * @param {array} args
 * @return {*}
 */
export default function buildSortedURL(...args: any[]) {
	const builtURL = buildURL(...args);
	const [urlPath, queryString] = builtURL.split('?');
	if (queryString) {
		const paramsPair = queryString.split('&');
		return `${urlPath}?${paramsPair.sort().join('&')}`;
	}
	return builtURL;
}
