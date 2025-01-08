import { feedTypes } from '../types/feed';

export const feedActions = {
  addLikedNow: addLikedNow,
  removeLikedNow: removeLikedNow
};

function addLikedNow(itemId) {
  return { type: feedTypes.INSERT_SESSION_LIKE, itemId }
}

function removeLikedNow(itemId) {
  return { type: feedTypes.REMOVE_SESSION_LIKE, itemId }
}