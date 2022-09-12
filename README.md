# gf-event-store
a lightweight state maneger
## 说明文档

### gf-event-store 是一个基于事件总线和数据劫持实现的轻量级状态管理库

#### 安装

> npm install gf-event-store

#### 使用

```js
const eventStore = new GFEventStore({
  state: {
    name: "why",
    friends: ["abc", "cba", "nba"],
    banners: [],
    recommends: [],
  },
  actions: {
    getHomeMultidata(ctx) {
      //   console.log(ctx);
      // 赋值
      ctx.banners = banner
      ctx.recommends = recommend
    },
  },
})

eventStore.onState("banners", (value) => {
  console.log("监听banners:", value)
})

eventStore.onState("recommends", (value) => {
  console.log("监听recommends", value)
})

// 同时监听多个数据
eventStore.onStates(["name", "friends"], (value) => {
  console.log("监听多个数据:", value) // 数组类型
})

// 数据变化
setTimeout(() => {
  eventStore.setState("name", "lilei")
  eventStore.setState("friends", ["kobe", "james"])
}, 1000)

eventStore.dispatch("getHomeMultidata")
```
