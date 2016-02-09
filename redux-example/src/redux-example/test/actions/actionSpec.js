import {expect} from 'chai';

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

import {
  fetchPostsIfNeeded,
  selectReddit,
  invalidateReddit,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  INVALIDATE_REDDIT,
  SELECT_REDDIT
} from './../../actions';

function jsonOk (body) {
  var mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return Promise.resolve(mockResponse);
}

describe('selectReddit', function () {
  it('should create INVALIDATE_REDDIT action', function () {
      expect(selectReddit('frontend')).deep.equal({type: SELECT_REDDIT, reddit: 'frontend'})
  });
})

describe('invalidateReddit', function () {
  it('should create INVALIDATE_REDDIT action', function () {
      expect(invalidateReddit('frontend')).deep.equal({type: INVALIDATE_REDDIT, reddit: 'frontend'})
  });
})

describe('fetchPostsIfNeeded', function() {
    beforeEach(function(){
      sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.resolve(jsonOk({data: {
            children: [{
              data: {id:46, title:'Redux' }
            }]
          }})));
    });
    afterEach(function (){
      window.fetch.restore();
    });

    context('store has no posts', function (){
      it('should dispatch REQUEST_POSTS and RECEIVE_POSTS', function (done) {
          const expectedActions = [
            {
              type: REQUEST_POSTS,
              reddit: 'reactjs'
            },
            {
              type: RECEIVE_POSTS,
              reddit: 'reactjs',
              posts: [{id:46, title:'Redux' }],
              receivedAt: '123'
            }
          ]
          let storeMock = { postsByReddit: { } };
          const store = mockStore(storeMock, expectedActions, done)
          store.dispatch(fetchPostsIfNeeded('reactjs'))

        })

    })

    context('store has reactjs as postsByReddit and didInvalidate is true', function () {
      it('should dispatch REQUEST_POSTS and RECEIVE_POSTS', function (done) {
          const expectedActions = [
            {
              type: REQUEST_POSTS,
              reddit: 'reactjs'
            },
            {
              type: RECEIVE_POSTS,
              reddit: 'reactjs',
              posts: [{id:46, title:'Redux' }],
              receivedAt: '123'
            }
          ]
          let storeMock = { postsByReddit: { reactjs: { didInvalidate: true, item: [{id:44, title:'Confusion about Flux and Relay' }]}} };
          const store = mockStore(storeMock, expectedActions, done)
          store.dispatch(fetchPostsIfNeeded('reactjs'))


        })
    })

    context('store has reactjs as postsByReddit and isFetching is true', function () {
      it('should dispatch nothing', function (done) {
          let storeMock = { postsByReddit: { reactjs: {
            isFetching: true,
            didInvalidate: false,
            item: [{id:44, title:'Confusion about Flux and Relay' }]}}
          };
          const store = mockStore(storeMock, [undefined], done)
          store.dispatch(fetchPostsIfNeeded('reactjs'))
          done();
        })
    })

});
