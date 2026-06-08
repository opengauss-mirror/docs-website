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
    query: string;
    lang: string;
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

/**
 * 图片上传
 * @param image 图片文件
 */
export function imageUpload(image: File): Promise<{
  msg: string;
  obj: any;
  status: number;
}> {
  const url = '/api-search/search/sort/upload/image';
  const formData = new FormData();
  formData.append('image', image);
  return request
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        source: 'opengauss',
      },
    })
    .then((res: AxiosResponse) => res.data);
}

/**
 * 图片搜索
 */
export function imageSearch(params: {
  lang: string;
  imageUrl: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
  type?: string;
  hq?: string;
  card?: string;
  filter?: { components: string; version: string }[];
  limit?: { components: string; version: string }[];
}): Promise<{
  msg: string;
  obj: any;
  status: number;
}> {
  const url = '/api-search/search/multitimodal';
  return request
    .post(url, params, {
      headers: {
        source: 'opengauss',
      },
    })
    .then((res: AxiosResponse) => res.data);
}
