/**
 * Action - Explorder Reducer
 *
 * @file explorer.js
 * @author mudio(job.mudio@gmail.com)
 */

import u from 'lodash';
import {
    LIST_BUCKET_REQUEST, LIST_BUCKET_SUCCESS, LIST_BUCKET_FAILURE,
    LIST_OBJECT_REQUEST, LIST_OBJECT_SUCCESS, LIST_OBJECT_FAILURE,
    LIST_MORE_REQUEST, LIST_MORE_SUCCESS, LIST_MORE_FAILURE
} from '../actions/window';

const defaultState = {
    // 当前bucket名称
    bucketName: null,
    // 匹配前缀
    prefix: null,
    // 数据是否正在请求
    isFetching: false,
    // 是否出错
    hasError: false,
    // 错误信息
    error: null,
    // 数据是否全部返回
    isTruncated: false,
    // 下次请求起点，isTruncated为true时候有效
    nextMarker: null,
    // buckets集合，最多100个
    buckets: [],
    // 文件夹集合, 这里存放多次请求的response
    folders: [],
    // 文件集合，这里存放多次请求的response
    objects: []
};

export default function explorer(state = defaultState, action) {
    switch (action.type) {
    // start
    case LIST_MORE_REQUEST: {
        return Object.assign({}, state, {isFetching: true});
    }
    case LIST_OBJECT_REQUEST:
    case LIST_BUCKET_REQUEST:
        return Object.assign({}, defaultState, {isFetching: true});
    // failure
    case LIST_MORE_FAILURE: {
        return Object.assign({}, state, {
            isFetching: false,
            hasError: true,
            error: action.error
        });
    }
    case LIST_OBJECT_FAILURE:
    case LIST_BUCKET_FAILURE:
        return Object.assign({}, defaultState, {
            hasError: true,
            error: action.error
        });
    // success
    case LIST_MORE_SUCCESS: {
        const {objects = [], folders = [], isTruncated = false, nextMarker} = action.response;
        return Object.assign({}, state, {
            nextMarker,
            isTruncated,
            hasError: false,
            isFetching: false,
            objects: [...state.objects, ...objects],
            folders: u.uniq([...state.folders, ...folders], item => item.key)
        });
    }
    case LIST_OBJECT_SUCCESS:
    case LIST_BUCKET_SUCCESS: {
        const {
            name,
            prefix,
            isTruncated = false,
            nextMarker,
            buckets = [],
            folders = [],
            objects = []
        } = action.response;

        return Object.assign({}, defaultState, {
            bucketName: name,
            prefix,
            buckets,
            folders,
            objects,
            nextMarker,
            isTruncated
        });
    }

    default:
        return state;
    }
}
