import {expect} from 'chai';
import deepFreeze  from 'deep-freeze';

import {selectedReddit, postsByReddit} from './../../reducers';
import {SELECT_REDDIT, INVALIDATE_REDDIT, REQUEST_POSTS, RECEIVE_POSTS} from './../../actions';

describe('selectedReddit reducer', function() {
    it('should handle initial state', function () {
      let newState = selectedReddit(undefined, {});
      expect(newState).deep.equal('reactjs');
    });
    it('should handle SELECT_REDDIT', function () {
      let newState = selectedReddit('reactjs', {type: SELECT_REDDIT, reddit: 'javascript'})
      expect(newState).deep.equal('javascript');
    });
});

describe('postsByReddit reducer', function() {
    context('when state is initial', function () {
      let oldState = undefined;
      it('should handle empty action', function () {
        let newState = postsByReddit(oldState, {});
        expect(newState).deep.equal({});
      });

      it('should handle INVALIDATE_REDDIT', function () {
        let newState = postsByReddit(oldState, {
          type: INVALIDATE_REDDIT, reddit: 'reactjs'
        });
        expect(newState).deep.equal({reactjs: {
          isFetching: false,
          didInvalidate: true,
          items: []
        }});
      });

      it('should handle REQUEST_POSTS', function () {
        let newState = postsByReddit(oldState, {
          type: REQUEST_POSTS, reddit: 'reactjs'
        });
        expect(newState).deep.equal({reactjs: {
          isFetching: true,
          didInvalidate: false,
          items: []
        }});
      });

      it('should handle RECEIVE_POSTS', function () {
        let newState = postsByReddit(oldState, {
          type: RECEIVE_POSTS,
          reddit: 'reactjs',
          posts: [{id:44, title:'Confusion about Flux and Relay' }],
          receivedAt: 123
        })

        expect(newState).deep.equal({ reactjs: {
          didInvalidate: false ,
          isFetching: false,
          items: [{id:44, title:'Confusion about Flux and Relay' }],
          lastUpdated: 123
        }});
      });

    });

    context('state is not initial', function () {
      it('should handle empty action', function () {
        let oldState = { reactjs: { didInvalidate: false}};
        let newState = postsByReddit(oldState, {});
        expect(newState).deep.equal(oldState);
      });
      it('should handle INVALIDATE_REDDIT', function () {
        let oldState = { reactjs: { didInvalidate: false}};
        let newState = postsByReddit(deepFreeze(oldState), {
          type: INVALIDATE_REDDIT, reddit: 'reactjs'
        })
        expect(newState).deep.equal({ reactjs: { didInvalidate: true}});
      });

      it('should handle REQUEST_POSTS', function () {
        let oldState = { reactjs: { didInvalidate: false, isFetching: false}};
        let newState = postsByReddit(deepFreeze(oldState), {type: REQUEST_POSTS, reddit: 'reactjs'})
        expect(newState).deep.equal({ reactjs: { didInvalidate: false , isFetching: true}});
      });

      it('should handle RECEIVE_POSTS', function () {
        let oldState = { reactjs: {
          didInvalidate: false,
          isFetching: false,
          items: [{id:44, title:'Confusion about Flux and Relay' }]
        }};

        let newState = postsByReddit(deepFreeze(oldState), {
          type: RECEIVE_POSTS,
          reddit: 'reactjs',
          posts: [{id:49, title:'Awesome redux' }],
          receivedAt: 123
        })

        expect(newState).deep.equal({ reactjs: {
          didInvalidate: false ,
          isFetching: false,
          items: [{id:49, title:'Awesome redux' }],
          lastUpdated: 123
        }});
      });
    })
});
