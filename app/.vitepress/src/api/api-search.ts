import type { CancelToken } from 'axios';
import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';

import type { SearchRecommendT, SearchDocQueryT } from '@/@types/type-search';

/**
 * 获取热门搜索数据
 * @param {String} params 语言
 * @returns {Object}
 */
export function getPop(params: string): Promise<{
  msg: string;
  obj: string[];
  status: number;
}> {
  const url = `/api-search/search/pop?${params}`;
  return request
    .post(
      url,
      {},
      {
        showError: false,
      }
    )
    .then((res: AxiosResponse) => res.data);
}

/**
 * 关联搜索
 * @param {Object} params 申请表格数据
 * @return  {Object}
 */
export function getSearchRecommend(
  params: { 
    query: string,
    lang: string,
  },
  cancelToken?: CancelToken
): Promise<{
  status: number;
  obj: {
    word: SearchRecommendT[];
  };
  msg: string;
}> {
  const url = `/api-search/search/word?query=${params.query}&lang=${params.lang}`;
  return request
    .post(url, params, {
      showError: false,
      cancelToken,
    })
    .then((res: AxiosResponse) => res.data);
}

/**
 * 获取文档搜索结果
 * @param {SearchDocQueryT} params 搜索参数对象
 * @returns {Promise<ResponseT>}  搜索结果
 */
export function getSearchDocs(params: SearchDocQueryT) {
  const url = '/api-search/search/sort/docs';
  return request.post(url, params, { showError: false, headers: { source: 'opengauss' } }).then((res: AxiosResponse) => res.data);
}
