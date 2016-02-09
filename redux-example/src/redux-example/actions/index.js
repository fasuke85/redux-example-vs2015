import fetch from 'whatwg-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

const createActionCreator = (actionType, ...payloadNames) => (...payloads) => {
    let payloadObjs = payloadNames
      .map((name, index) => ({[name]: payloads[index]}));
    return Object.assign({type: actionType}, ...payloadObjs);
};

export const selectReddit = createActionCreator(SELECT_REDDIT, 'reddit');
export const invalidateReddit = createActionCreator(INVALIDATE_REDDIT, 'reddit');

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  }
}

function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: '123'//Date.now()
  }
}

function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit))
    return window.fetch(`http://www.reddit.com:80/r/${reddit}.json/`)
      .then(response => {
        console.log("response",response);
        return response.json();
      })
      .then(json => {
        console.log('json',json);
        return dispatch(receivePosts(reddit, json));
      })
  }
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}
