const GFEventBus = require("./event-bus");
const isObject = require("./utils");

class GFEventStore {
  constructor(store) {
    if (!isObject(store.state)) {
      throw new Error("the state must be object type");
    }
    if (store.actions && isObject(store.actions)) {
      const values = Object.values(store.actions);
      for (const value of values) {
        if (typeof value !== "function") {
          throw new Error("the value of actions must be function type");
        }
      }
      this.actions = store.actions;
    }
    this.state = store.state;
    this._observe(store.state);
    this.EventBus = new GFEventBus(); //监听多个事件
    this.EventBus2 = new GFEventBus(); //监听单个事件
  }

  _observe(state) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get: function () {
          return _value;
        },
        set: function (newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.EventBus.emit(key, _value);
          _this.EventBus2.emit(key, { [key]: _value }); //
        },
      });
    });
  }

  onState(stateKey, stateCallback) {
    if (typeof stateKey !== "string" || !stateKey) {
      throw new TypeError(
        "the action name must be string type and event name not be null string"
      );
    }
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("stateKey is not found in state");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    this.EventBus.on(stateKey, stateCallback);
    const value = this.state[stateKey];
    stateCallback.apply(this.state, [value]);
  }

  onStates(stateKeys, stateCallback) {
    if (!(stateKeys instanceof Array)) {
      throw new TypeError("the stateKeys must be array type");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    const keys = Object.keys(this.state);
    const value = {};
    for (const stateKey of stateKeys) {
      if (keys.indexOf(stateKey) === -1) {
        throw new Error("stateKey is not found in state");
      }
      this.EventBus2.on(stateKey, stateCallback);
      value[stateKey] = this.state[stateKey];
    }
    stateCallback.apply(this.state, [value]);
  }

  offState(stateKey, stateCallback) {
    if (typeof stateKey !== "string" || !stateKey) {
      throw new TypeError(
        "the action name must be string type and event name not be null string"
      );
    }
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("stateKey is not found in state");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    this.EventBus.off(stateKey, stateCallback);
  }

  offStates(stateKeys, stateCallback) {
    if (!(stateKeys instanceof Array)) {
      throw new TypeError("the stateKeys must be array type");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    const keys = Object.keys(this.state);
    for (const stateKey of stateKeys) {
      if (keys.indexOf(stateKey) === -1) {
        throw new Error("stateKey is not found in state");
      }
      this.EventBus2.off(stateKey, stateCallback);
    }
  }

  setState(stateKey, stateValue) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("stateKey is not found in state");
    }
    this.state.stateKey = stateValue;
  }

  dispatch(actionName, ...args) {
    if (typeof actionName !== "string" || !actionName) {
      throw new TypeError(
        "the action name must be string type and event name not be null string"
      );
    }
    const names = Object.keys(this.actions);
    if (names.indexOf(actionName) === -1) {
      throw new Error("actionName is not found in actions");
    }
    const actionFn = this.actions[actionName];
    actionFn.apply(this, [this.state, ...args]);
  }
}

module.exports = GFEventStore;
