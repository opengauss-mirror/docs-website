import { request } from '@/shared/axios';

export interface FeedBackQueryT {
  feedbackPageUrl: string;
  feedbackText: string;
  feedbackValue: number;
}

export interface FeedBackDataT {
  feedbackPageUrl: string;
  efficiency: number;
  accuracy: number;
  completeness: number;
  usability: number;
}

/**
 * 文档中心满意度评分
 * @param {FeedBackQueryT} params
 * @returns {Promise<ResponseT>}
 */
export function postFeedback(params: FeedBackQueryT): Promise<{
  code: number;
  data: string;
  msg: string;
  update_at: string;
}> {
  const url = '/api-dsapi/query/nps?community=opengauss';
  return request.post(url, params, { showError: false }).then((res) => res.data);
}

/**
 * 文档内容满意度评分
 * @param {FeedBackQueryT} params
 * @returns {Promise<ResponseT>}
 */
export function postArticleFeedback(params: FeedBackDataT): Promise<{
  code: number;
  data: string;
  msg: string;
  update_at: string;
}> {
  const url = '/api-dsapi/query/doc/nps/opengauss';
  return request.post(url, params, { showError: false }).then((res) => res.data);
}
