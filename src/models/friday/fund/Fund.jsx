import {
  selectFund ,
  updateFund ,
  insertFund ,
  deleteFund ,
  findFundTypeName ,
  getFundCollection,
} from "@/services/friday/fund/Fund";

export default {
  namespace: "fundMSG",

  state: {
    data: []
  },

  effects: {
    /**
     * @param payload,callback 参数
     * @param call 执行异步函数调用接口
     * @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
     * @returns {IterableIterator<*>}
     */




    *selectFund({ payload,callback }, { call, put }) {
      const response = yield call(selectFund, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "queryFund",
        payload: response
      });
      callback(response)
    },

    *updateFund({ payload,callback }, { call, put }) {
      const response = yield call(updateFund, payload);
      yield put({
        type: "editFund",
        payload: response
      });
      callback(response)
    },

    *insertFund({ payload,callback }, { call, put }) {
      const response = yield call(insertFund, payload);
      yield put({
        type: "addFund",
        payload: response
      });
      callback(response)
    },

    *deleteFund({ payload,callback }, { call, put }) {
      const response = yield call(deleteFund, payload);
      yield put({
        type: "dropFund",
        payload: response
      });
      callback(response)
    },

    *findFundTypeName({ payload,callback }, { call, put }) {
      const response = yield call(findFundTypeName, payload);
      yield put({
        type: "findFundGroupName",
        payload: response
      });
      callback(response)
    },

    *getFundCollection({ payload,callback }, { call, put }) {
      const response = yield call(getFundCollection, payload);
      yield put({
        type: "fundCollection",
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
    queryFund(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    addFund(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    editFund(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    dropFund(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    findFundGroupName(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    fundCollection(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  }
};
