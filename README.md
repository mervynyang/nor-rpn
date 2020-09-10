# nor-rpn

> 测试覆盖率100%

## 项目概述

用来计算与或表达式，如 `1 and 2 or 3` ，多用于条件查询的场景，在 mur survey 中有用到。

## 使用

### 1.从npm安装依赖
```bash
npm i nor-rpn -S
```

### 2.使用

```js
import NorRpn from 'nor-rpn';

const norRpn = new NorRpn();

// 基本使用
norRpn.calculate('1 and 2', [true, true]); // true
norRpn.calculate('1 and 2', [false, true]); // false

// 严格等于模式，必须显式赋值，否则当成 false
norRpn.calculate('1 and 2', [true]); // false

// 非严格等于模式，null undefined 会被当作为true
norRpn.calculate('1 and 2', [true]); // true

```

### api文档

[norrpn](./docs/classes/_index_.norrpn.html)