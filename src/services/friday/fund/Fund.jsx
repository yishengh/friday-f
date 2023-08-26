import { stringify } from "qs";
// ant 自己封装好的发送ajax请求的工具
import request from "@/utils/request";


// http://localhost:8083/userFund/selectAll
export async function selectFund(params) {
  return request(`/api/friday/finance/userFund/selectAll?${stringify(params)}`,{
    method:"GET"
  });
}

export async function updateFund(params) {
  return request(`/api/friday/finance/userFund/update`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}

export async function insertFund(params) {
  return request(`/api/friday/finance/userFund/insert`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}


export async function deleteFund(params) {
  return request(`/api/friday/finance/userFund/delete?${stringify(params)}`, {
    method: "GET"
  });
}

export async function findFundTypeName() {
  return request(`/api/friday/finance/userFund/findType`, {
    method: "GET"
  });
}

export async function getFundCollection(params) {
  return request(`/api/friday/finance/userFund/getFundCollection?${stringify(params)}`, {
    method: "GET"
  });
}

// http://localhost:10010/friday/finance/userExpenses/selectAll
