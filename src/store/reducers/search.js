import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  users: [
    {
      id: '',
      name: '',
      lastname: '',
      username: '',
      picture: '',
      publicProfile: '',
      plan: '',
      status: '',
      city: '',
      region: '',
      verified: '',
      country: '',
      roleName: '',
      mainRole: '',
      projectRelated: '',
      projectType: '',
      availabilityStatus: '',
      availability_color: '',
      legend: '',
      totalProjects: '',
      instrumentalist: '',
      projects: [
        { id: '', name: '', username: '', picture: '' }
      ]
    }
  ],
  projects: [
    {
      id: '',
      name: '',
      username: '',
      picture: '',
      public: '',
      city: '',
      region: '',
      country: '',
      mainGenre: '',
      secondGenre: '',
      thirdGenre: '',
      type: '',
      labelShow: '',
      labelText: '',
      labelColor: '',
      foundationYear: '',
      endYear: '',
      participationStatus: '',
      participationId: '',
      members: [
        { id: '', name: '', lastname: '', username: '', picture: '' }
      ]
    }
  ],
  suggestedUsers: [
    {
      id: '',
      name: '',
      lastname: '',
      username: '',
      picture: '',
      bio: '',
      roleName: '',
      mainRole: '',
      instrumentalist: '',
      city: '',
      region: '',
      country: '',
      plan: '',
      availabilityId: '',
      availabilityTitle: '',
      availabilityColor: '',
      totalProjects: '',
      verified: ''
    }
  ]
}

export function search(state = initialState, action) {
  switch (action.type) {
    // USERS
    case searchTypes.SEARCH_USERS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.SEARCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.results,
        requesting: false
      };
    case searchTypes.SEARCH_USERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: 'Nenhum resultado encontrado'
      };
    // PROJECTS
    case searchTypes.SEARCH_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.SEARCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.results,
        requesting: false
      };
    case searchTypes.SEARCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [
          {
            id: '',
            name: '',
            username: '',
            picture: '',
            public: '',
            city: '',
            region: '',
            country: '',
            members: [
              { id: '', name: '', lastname: '', username: '', picture: '' }
            ]
          }
        ],
        requesting: false,
        error: 'Nenhum projeto encontrado'
      };
    // SUGGESTED USERS
    case searchTypes.GET_SUGGESTEDUSERS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case searchTypes.GET_SUGGESTEDUSERS_SUCCESS:
      return {
        ...state,
        suggestedUsers: action.results,
        requesting: false
      };
    case searchTypes.GET_SUGGESTEDUSERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: 'Nenhum usuário sugerido encontrado'
      };
    default:
      return state
  }
}