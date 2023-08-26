import { stringify } from "qs";
// ant 自己封装好的发送ajax请求的工具
import request from "@/utils/request";

export async function selectExpenses(params) {
  return request(`/api/friday/bills/userExpenses/selectAll?${stringify(params)}`,{
    method:"GET"
  });
}

export async function updateExpenses(params) {
  return request(`/api/friday/bills/userExpenses/update`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}

export async function insertExpenses(params) {
  return request(`/api/friday/bills/userExpenses/insert?${stringify(params)}`, {
    method: "GET",
    headers: {
      'content-type': 'application/json'
    }
  });
}


export async function deleteExpenses(params) {
  return request(`/api/friday/bills/userExpenses/delete?${stringify(params)}`, {
    method: "GET"
  });
}

export async function findType() {
  return request(`/api/friday/bills/userExpenses/findType`, {
    method: "GET"
  });
}

export async function getExpensesCollection(params) {
  return request(`/api/friday/bills/userExpenses/getExpensesCollection?${stringify(params)}`, {
    method: "GET"
  });
}

