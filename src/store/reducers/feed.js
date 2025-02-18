import { feedTypes } from '../types/feed';

const initialState = {
  requesting: false,
  requestingLikes: false,
  newPostIsWriting: false,
  list: [
    { 
      id: '',
      created: '',
      likes: 0,
      likedByMe: 0,
      totalComments: 0,
      relatedItemId: '',
      extraText: '',
      extraInfo: '',
      image: '',
      videoUrl: '',
      suggested: '',
      relatedItemType: '',
      relatedUserName: '',
      relatedUserLastname: '',
      relatedUserPicture: '',
      relatedUserUsername: '',
      relatedUserMainRole: '',
      relatedUserCity: '',
      relatedUserRegion: '',
      relatedUserPlan: '',
      relatedUserVerified: '',
      relatedProjectName: '',
      relatedProjectUsername: '',
      relatedProjectPicture: '',
      relatedProjectType: '',
      relatedGearId: '',
      relatedGearName: '',
      relatedGearBrand: '',
      relatedGearPicture: '',
      action: '',
      category: '',
      categoryId: '',
      relatedEventId: '',
      relatedEventTitle: ''
    }
  ],
  itemLikes: {
    total: 0,
    success: '',
    list: [
      {
        id: '',
        idItem: '',
        created: '',
        name: '',
        lastname: '',
        picture: '',
        username: '',
        verified: '',
        legend_badge: '',
        description_ptbr: '',
      },
    ],
  },
  requestingComments: false,
  itemComments: {
    total: 0,
    success: '',
    list: [
      {
        id: '',
        created: '',
        text: '',
        userId: '',
        name: '',
        lastname: '',
        picture: '',
        username: '',
        role: '',
      },
    ],
  },
  likedNow: {
    items: [],
    removeLikedByMe: []
  }
}

export function feed(state = initialState, action) {
  switch (action.type) {
    case feedTypes.GET_USER_FEED_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case feedTypes.GET_USER_FEED_SUCCESS:
      return {
        ...state,
        list: action.list,
        requesting: false,
        error: ""
      };
    case feedTypes.GET_USER_FEED_FAILURE:
      return {
        ...state,
        list: initialState.list,
        requesting: false,
        error: "A solicitação falhou"
      };
    case feedTypes.GET_ITEM_LIKES_REQUEST:
      return {
        ...state,
        itemLikes: initialState.itemLikes,
        requestingLikes: true,
        error: ""
      };
    case feedTypes.GET_ITEM_LIKES_SUCCESS:
      return {
        ...state,
        itemLikes: action.result,
        requestingLikes: false,
        error: ""
      };
    case feedTypes.GET_ITEM_LIKES_FAILURE:
      return {
        ...state,
        itemLikes: initialState.itemLikes,
        requestingLikes: false,
        error: "A solicitação falhou"
      };
    case feedTypes.GET_ITEM_COMMENTS_REQUEST:
      return {
        ...state,
        itemComments: initialState.itemComments,
        requestingComments: true,
        error: ""
      };
    case feedTypes.GET_ITEM_COMMENTS_SUCCESS:
      return {
        ...state,
        itemComments: action.result,
        requestingComments: false,
        error: ""
      };
    case feedTypes.GET_ITEM_COMMENTS_FAILURE:
      return {
        ...state,
        itemComments: initialState.itemComments,
        requestingComments: false,
        error: "A solicitação falhou"
      };
    case feedTypes.INSERT_SESSION_LIKE:
      return state.likedNow.items.push(action.itemId), {
        ...state,
        likedNow: {
          items: state.likedNow.items,
          removeLikedByMe: state.likedNow.removeLikedByMe.filter(function(item) {
            return item !== action.itemId
          })
        }
      };
    case feedTypes.REMOVE_SESSION_LIKE:
      return state.likedNow.removeLikedByMe.push(action.itemId), {
        ...state,
        likedNow: {
          items: state.likedNow.items.filter(function(item) {
            return item !== action.itemId
          }),
          removeLikedByMe: state.likedNow.removeLikedByMe,
        }
      };
    case feedTypes.REMOVE_COMMENT:
      return {
        ...state,
        itemComments: {
          ...state.itemComments,
          total: (state.itemComments.total - 1),
          list: state.itemComments.list.filter(function(x) {
            return x.id !== action.commentId
          })
        }
      };
    case feedTypes.NEW_POST_IS_WRITING:
      return {
        ...state,
        newPostIsWriting: action.option
      };
    default:
      return state
  }
}