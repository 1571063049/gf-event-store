const { GFEventStore } = require("../src");

const banner = [1, 2, 3, 4];
const recommend = ["hellow", "world"];

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
      ctx.banners = banner;
      ctx.recommends = recommend;
    },
  },
});

// 数据监听
// eventStore.onState("name", (value) => {
//   console.log("监听name:", value)
// })

// eventStore.onState("friends", (value) => {
//   console.log("监听friends:", value)
// })

eventStore.onState("banners", (value) => {
  console.log("监听banners:", value);
});

eventStore.onState("recommends", (value) => {
  console.log("监听recommends", value);
});

// 同时监听多个数据
eventStore.onStates(["name", "friends"], (value) => {
  console.log("监听多个数据:", value); // 数组类型
});

// 数据变化
setTimeout(() => {
  eventStore.setState("name", "lilei");
  eventStore.setState("friends", ["kobe", "james"]);
}, 1000);

eventStore.dispatch("getHomeMultidata");