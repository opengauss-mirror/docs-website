import { request } from '@/shared/axios';

const APP_ID = import.meta.env.VITE_APP_ID;

/**
 * 获取用户信息
 * @param {Object} params 用户信息查询参数
 * @param {string} params.xCsrf csrf token
 * @param {string} params.account 用户名
 * @returns {Promise} 用户信息
 */
export function getUserInfo() {
  const url = `/api-oneid/oneid/user/refresh?community=opengauss&client_id=${APP_ID}`;
  return request
    .get(url, {
      global: true,
      showError: false,
    })
    .then((res) => {
      return res.data;
    });
}

/**
 * 获取全量用户信息
 * @returns {Promise} 用户信息
 */
export function getUserAllInfo() {
  const url = `/api-oneid/oneid/personal/center/user?community=opengauss&client_id=${APP_ID}`;
  return request
    .get(url, {
      global: true,
    })
    .then((res) => {
      return res.data;
    });
}

/**
 * 获取id token，构造登出URL
 * @returns {Promise} id token
 */
export function getUserIdToken() {
  const url = `/api-oneid/oneid/logout?community=opengauss&client_id=${APP_ID}`;
  return request.get(url, { showError: false }).then((res) => {
    return res.data;
  });
}
