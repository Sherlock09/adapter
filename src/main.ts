/*
 * @Author: zhangxiangyi
 * @Date: 2023-02-09 09:26:46
 * @LastEditTime: 2023-02-09 13:54:30
 * @LastEditors: zhangxiangyi
 * @Description: main
 * @FilePath: /jc-axios-adapter/src/main.ts
 */

import Cache from 'lru-cache';
import cacheHandle from './core/cache';
import retryHandle from './core/retry';
import throttleHandle from './core/throttle';
import { ICacheLike } from './utils/isCacheLike';

export {
	Cache,
	ICacheLike,
	cacheHandle,
	throttleHandle,
	retryHandle,
};
