import { stringify } from "qs";
// ant 自己封装好的发送ajax请求的工具
import request from "@/utils/request";


// http://localhost:8083/userAssets/selectAll
export async function selectAssets(params) {
  return request(`/api/friday/equity/userAssets/selectAll?${stringify(params)}`,{
    method:"GET"
  });
}

export async function updateAssets(params) {
  return request(`/api/friday/equity/userAssets/update`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}

export async function insertAssets(params) {
  return request(`/api/friday/equity/userAssets/insert`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}


export async function deleteAssets(params) {
  return request(`/api/friday/equity/userAssets/delete?${stringify(params)}`, {
    method: "GET"
  });
}

export async function findAssetsTypeName(params) {
  return request(`/api/friday/equity/userAssets/getAssetsCollection?${stringify(params)}`, {
    method: "GET"
  });
}

export async function getAssetsCollection(params) {
  return request(`/api/friday/equity/userAssets/selectOne?${stringify(params)}`, {
    method: "GET"
  });
}

// http://localhost:10010/friday/equity/userExpenses/selectAll
