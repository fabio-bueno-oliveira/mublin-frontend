import { feedTypes } from '../types/feed';
import { miscService } from '../../api/misc';

export const feedActions = {
  getItemComments: getItemComments,
  addLikedNow: addLikedNow,
  removeLikedNow: removeLikedNow,
  removeComment: removeComment,
  newPostSubmitted: newPostSubmitted
};

function getItemComments(feedId) {
  return dispatch => {
    dispatch(request());

    miscService.getItemComments(feedId)
      .then(
        result => dispatch(success(result)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: feedTypes.GET_ITEM_COMMENTS_REQUEST} }
  function success(result) { return { type: feedTypes.GET_ITEM_COMMENTS_SUCCESS, result } }
  function failure(error) { return { type: feedTypes.GET_ITEM_COMMENTS_FAILURE, error } }
}

function addLikedNow(itemId) {
  return { type: feedTypes.INSERT_SESSION_LIKE, itemId }
}

function removeLikedNow(itemId) {
  return { type: feedTypes.REMOVE_SESSION_LIKE, itemId }
}

function removeComment(commentId) {
  return { type: feedTypes.REMOVE_COMMENT, commentId }
}

function newPostSubmitted() {
  return { type: feedTypes.NEW_POST_SUBMITTED }
}