import { stringify } from "qs";
// ant 自己封装好的发送ajax请求的工具
import request from "@/utils/request";


// http://localhost:8083/claimsAndDebt/selectAll
export async function selectClaimsAndDebts(params) {
  return request(`/api/friday/equity/claimsAndDebt/selectAll?${stringify(params)}`,{
    method:"GET"
  });
}

export async function updateClaimsAndDebts(params) {
  return request(`/api/friday/equity/claimsAndDebt/update`, {
    method: "PUT",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}

export async function insertClaimsAndDebts(params) {
  return request(`/api/friday/equity/claimsAndDebt/insert`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body:JSON.stringify(params)
  });
}


export async function deleteClaimsAndDebts(params) {
  return request(`/api/friday/equity/claimsAndDebt/delete?${stringify(params)}`, {
    method: "GET"
  });
}

export async function findClaimsAndDebtsTypeName() {
  return request(`/api/friday/equity/claimsAndDebt/getClaimsAndDebtsCollection?${stringify(params)}`, {
    method: "GET"
  });
}

export async function getClaimsAndDebtsCollection() {
  return request(`/api/friday/equity/claimsAndDebt/getClaimsAndDebtsCollection`, {
    method: "GET"
  });
}

// http://localhost:10010/friday/equity/userExpenses/selectAll
