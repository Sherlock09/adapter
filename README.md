# axios-adapter

## cache Usage

```javascript
import axios from 'axios';
import { cacheAdapter } from 'axios-adapter';
const request = axios.create({
	baseURL: '/',
	adapter: cacheAdapter(axios.defaults.adapter, {
    maxAge: 5000, // 最大过期时间
  }),
});
// get接口开启接口缓存
request.get('/users', { cache: true });
// 非get接口强制开启接口缓存【!!不建议，缓存post接口容易导致问题】
request.get('/users', { forceCache: true });
```

## cache Usage

```javascript
import axios from 'axios';
import { cacheAdapter } from 'axios-adapter';
const request = axios.create({
	baseURL: '/',
	adapter: cacheAdapter(axios.defaults.adapter, {
    maxAge: 5000, // 最大过期时间
  }),
});
// get接口开启接口缓存
request.get('/users', { cache: true });
// 非get接口强制开启接口缓存【!!谨慎开启，缓存post接口容易导致问题】
request.get('/users', { forceCache: true });

```

### 存储算法使用lru-cache 请放心食用[https://www.npmjs.com/package/lru-cache]
