import {
  selectAssets ,
  updateAssets ,
  insertAssets ,
  deleteAssets ,
  findAssetsTypeName ,
  getAssetsCollection,
} from "@/services/friday/assets/Assets";

export default {
  namespace: "assetsMSG",

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




    *selectAssets({ payload,callback }, { call, put }) {
      const response = yield call(selectAssets, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "queryAssets",
        payload: response
      });
      callback(response)
    },

    *updateAssets({ payload,callback }, { call, put }) {
      const response = yield call(updateAssets, payload);
      yield put({
        type: "editAssets",
        payload: response
      });
      callback(response)
    },

    *insertAssets({ payload,callback }, { call, put }) {
      const response = yield call(insertAssets, payload);
      yield put({
        type: "addAssets",
        payload: response
      });
      callback(response)
    },

    *deleteAssets({ payload,callback }, { call, put }) {
      const response = yield call(deleteAssets, payload);
      yield put({
        type: "dropAssets",
        payload: response
      });
      callback(response)
    },

    *findAssetsTypeName({ payload,callback }, { call, put }) {
      const response = yield call(findAssetsTypeName, payload);
      yield put({
        type: "findAssetsGroupName",
        payload: response
      });
      callback(response)
    },

    *getAssetsCollection({ payload,callback }, { call, put }) {
      const response = yield call(getAssetsCollection, payload);
      yield put({
        type: "assetsCollection",
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
    queryAssets(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    addAssets(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    editAssets(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    dropAssets(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    findAssetsGroupName(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    assetsCollection(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  }
};
