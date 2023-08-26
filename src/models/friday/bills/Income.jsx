import {
  selectIncome ,
  updateIncome ,
  insertIncome ,
  deleteIncome ,
  findTypeName ,
  getIncomeCollection,
} from "@/services/friday/bills/Income";

export default {
  namespace: "incomeMSG",

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




      *selectIncome({ payload }, { call, put }) {
      const response = yield call(selectIncome, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "queryIncome",
        payload: response
      });
    },

    *updateIncome({ payload }, { call, put }) {
      const response = yield call(updateIncome, payload);
      yield put({
        type: "editIncome",
        payload: response
      });
    },

    *insertIncome({ payload }, { call, put }) {
      const response = yield call(insertIncome, payload);
      yield put({
        type: "addIncome",
        payload: response
      });
    },

    *deleteIncome({ payload }, { call, put }) {
      const response = yield call(deleteIncome, payload);
      yield put({
        type: "dropIncome",
        payload: response
      });
    },

    *findTypeName({ payload,callback }, { call, put }) {
      const response = yield call(findTypeName, payload);
      yield put({
        type: "findGroupName",
        payload: response
      });
      callback(response)
    },

    *getIncomeCollection({ payload,callback }, { call, put }) {
      const response = yield call(getIncomeCollection, payload);
      yield put({
        type: "incomeCollection",
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
    queryIncome(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    addIncome(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    editIncome(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    dropIncome(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    findGroupName(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    incomeCollection(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  }
};
