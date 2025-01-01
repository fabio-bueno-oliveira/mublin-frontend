import { feedTypes } from '../types/feed';

const initialState = {
  requesting: false,
  requestingLikes: false,
  list: [
    { 
      id: '',
      created: '',
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
  likes: [
    {
      feedId: '',
      likes: '',
      likedByMe: '',
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
    case feedTypes.GET_USER_FEED_LIKES_REQUEST:
      return {
        ...state,
        requestingLikes: true,
        error: ""
      };
    case feedTypes.GET_USER_FEED_LIKES_SUCCESS:
      return {
        ...state,
        likes: action.likes,
        requestingLikes: false,
        error: ""
      };
    case feedTypes.GET_USER_FEED_LIKES_FAILURE:
      return {
        ...state,
        likes: initialState.likes,
        requestingLikes: false,
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
    default:
      return state
  }
}