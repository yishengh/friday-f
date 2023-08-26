import { stringify } from "qs";
// ant 自己封装好的发送ajax请求的工具
import request from "@/utils/request";

export async function selectIncome(params) {
  return request(`/api/friday/bills/userIncome/selectAll?${stringify(params)}`,{
    method:"GET"
  });
}

export async function updateIncome(params) {
  return request(`/api/friday/bills/userIncome/updateIncome`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}

export async function insertIncome(params) {
  return request(`/api/friday/bills/userIncome/insertIncome?${stringify(params)}`, {
    method: "GET",
    headers: {
      'content-type': 'application/json'
    }
  });
}


export async function deleteIncome(params) {
  return request(`/api/friday/bills/userIncome/deleteIncome?${stringify(params)}`, {
    method: "GET"
  });
}

export async function findTypeName() {
  return request(`/api/friday/bills/userIncome/findType`, {
    method: "GET"
  });
}

export async function getIncomeCollection(params) {
  return request(`/api/friday/bills/userIncome/getIncomeCollection?${stringify(params)}`, {
    method: "GET"
  });
}

// http://localhost:10010/friday/bills/userExpenses/selectAll
