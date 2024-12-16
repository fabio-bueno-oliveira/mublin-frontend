import { feedTypes } from '../types/feed';

const initialState = {
  requesting: false,
  list: [
    { 
      id: '',
      relatedItemId: '',
      extraText: '',
      extraInfo: '',
      created: '',
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
      action: '',
      category: '',
      categoryId: '',
      relatedEventId: '',
      relatedEventTitle: '',
      likes: '',
      likedByMe: ''
    }
  ]
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
        list: [
          { 
            id: '',
            itemId: '',
            extraText: '',
            extraInfo: '',
            created: '',
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
            action: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}