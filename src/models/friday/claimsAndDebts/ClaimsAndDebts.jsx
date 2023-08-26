import {
  selectClaimsAndDebts ,
  updateClaimsAndDebts ,
  insertClaimsAndDebts ,
  deleteClaimsAndDebts ,
  findClaimsAndDebtsTypeName ,
  getClaimsAndDebtsCollection,
} from "@/services/friday/claimsAndDebts/ClaimsAndDebts";

export default {
  namespace: "claimsAndDebtsMSG",

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


    *selectClaimsAndDebts({ payload }, { call, put }) {
      const response = yield call(selectClaimsAndDebts, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "queryClaimsAndDebts",
        payload: response
      });
    },

    *updateClaimsAndDebts({ payload }, { call, put }) {
      const response = yield call(updateClaimsAndDebts, payload);
      yield put({
        type: "editClaimsAndDebts",
        payload: response
      });
    },

    *insertClaimsAndDebts({ payload }, { call, put }) {
      const response = yield call(insertClaimsAndDebts, payload);
      yield put({
        type: "addClaimsAndDebts",
        payload: response
      });
    },

    *deleteClaimsAndDebts({ payload,callback }, { call, put }) {
      const response = yield call(deleteClaimsAndDebts, payload);
      yield put({
        type: "dropClaimsAndDebts",
        payload: response
      });
      callback(response)
    },

    *findClaimsAndDebtsTypeName({ payload,callback }, { call, put }) {
      const response = yield call(findClaimsAndDebtsTypeName, payload);
      yield put({
        type: "findClaimsAndDebtsGroupName",
        payload: response
      });
      callback(response)
    },

    *getClaimsAndDebtsCollection({ payload,callback }, { call, put }) {
      const response = yield call(getClaimsAndDebtsCollection, payload);
      yield put({
        type: "claimsAndDebtsCollection",
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
    queryClaimsAndDebts(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    addClaimsAndDebts(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    editClaimsAndDebts(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    dropClaimsAndDebts(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    findClaimsAndDebtsGroupName(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    claimsAndDebtsCollection(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  }
};
