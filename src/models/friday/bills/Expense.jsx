import {
  selectExpenses ,
  updateExpenses ,
  insertExpenses ,
  deleteExpenses ,
  findType ,
  getExpensesCollection,

} from "@/services/friday/bills/Expenses";

export default {
  namespace: "expensesMSG",

  state: {
    data: []
  },

  effects: {
    /**
     * @param payload 参数
     * @param call 执行异步函数调用接口
     * @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
     * @returns {IterableIterator<*>}
     */




      *selectExpenses({ payload }, { call, put }) {
      const response = yield call(selectExpenses, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "queryExpenses",
        payload: response
      });
    },

    *updateExpenses({ payload }, { call, put }) {
      const response = yield call(updateExpenses, payload);
      yield put({
        type: "editExpenses",
        payload: response
      });
    },

    *insertExpenses({ payload }, { call, put }) {
      const response = yield call(insertExpenses, payload);
      yield put({
        type: "addExpenses",
        payload: response
      });
    },

    *deleteExpenses({ payload }, { call, put }) {
      const response = yield call(deleteExpenses, payload);
      yield put({
        type: "dropExpenses",
        payload: response
      });
    },

    *findType({ payload,callback }, { call, put }) {
      const response = yield call(findType, payload);
        yield put({
          type: "findGroup",
          payload: response
        });
        callback(response)
    },


    *getExpensesCollection({ payload,callback }, { call, put }) {
      const response = yield call(getExpensesCollection, payload);
      yield put({
        type: "expensesCollection",
        payload: response
      });
      callback(response)
    },

  },


  reducers: {
    /**
     *
     * @param state
     * @param action
     * @returns {{[p: string]: *}}
     */
    queryExpenses(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    addExpenses(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    editExpenses(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    dropExpenses(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    findGroup(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    expensesCollection(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  }
};
