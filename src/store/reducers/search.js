import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  lastSearches: [
    { query: '' }
  ],
  errorLastSearches: '',
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
  projects: {
    total: 0,
    success: false,
    result: [
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
    ]
  },
  gear: {
    total: 0,
    success: false,
    result: [
      {
        productId: '',
        productName: '',
        productPicture: '',
        brand: '',
        brandSlug: '',
        brandLogo: '',
        colorPTBR: '',
        color: '',
        name_ptbr: '',
        macro_category: '',
        totalOwners: 0
      }
    ]
  },
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
  ],
  suggestedFeaturedUsers: [
    {
      id: '',
      name: '',
      lastname: '',
      username: '',
      role: '',
      picture: '',
      verified: '',
      legend: '',
      city: '',
      region: '',
      uf: '',
    }
  ],
  suggestedNewUsers: [
    {
      id: '',
      name: '',
      lastname: '',
      username: '',
      role: '',
      picture: '',
      verified: '',
      legend: '',
      city: '',
      region: '',
      uf: '',
    }
  ],
  featuredProjects: {
    total: 0,
    success: '',
    result: [
      {
        id: '',
        name: '',
        username: '',
        picture: '',
        currentlyOnTour: '',
        genre1: '',
        genre2: '',
        city: '',
        region: '',
        uf: '',
        type: ''
      }
    ]
  }
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
        users: initialState.users,
        error: 'Nenhum resultado encontrado'
      };
    // PROJECTS
    case searchTypes.SEARCH_PROJECTS_REQUEST:
      return {
        ...state,
        projects: initialState.projects,
        requesting: true,
        error: ''
      };
    case searchTypes.SEARCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.results,
        requesting: false,
        error: ''
      };
    case searchTypes.SEARCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: initialState.projects,
        requesting: false,
        error: 'Nenhum projeto encontrado'
      };
    // GEAR
    case searchTypes.SEARCH_GEAR_REQUEST:
      return {
        ...state,
        gear: initialState.projects,
        requesting: true,
        error: ''
      };
    case searchTypes.SEARCH_GEAR_SUCCESS:
      return {
        ...state,
        gear: action.results,
        requesting: false,
        error: ''
      };
    case searchTypes.SEARCH_GEAR_FAILURE:
      return {
        ...state,
        gear: initialState.gear,
        requesting: false,
        error: 'Nenhum equipamento encontrado'
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
    // SUGGESTED FEATURED USERS
    case searchTypes.GET_SUGGESTED_FEATURED_USERS_REQUEST:
      return {
        ...state,
        suggestedFeaturedUsers: initialState.suggestedFeaturedUsers,
        requesting: true,
        error: ''
      };
    case searchTypes.GET_SUGGESTED_FEATURED_USERS_SUCCESS:
      return {
        ...state,
        suggestedFeaturedUsers: action.results,
        requesting: false
      };
    case searchTypes.GET_SUGGESTED_FEATURED_USERS_FAILURE:
      return {
        ...state,
        suggestedFeaturedUsers: initialState.suggestedFeaturedUsers,
        requesting: false,
        error: 'Nenhum usuário em destaque encontrado'
      };
    // SUGGESTED NEW USERS
    case searchTypes.GET_SUGGESTED_NEW_USERS_REQUEST:
      return {
        ...state,
        suggestedNewUsers: initialState.suggestedNewUsers,
        requesting: true,
        error: ''
      };
    case searchTypes.GET_SUGGESTED_NEW_USERS_SUCCESS:
      return {
        ...state,
        suggestedNewUsers: action.results,
        requesting: false
      };
    case searchTypes.GET_SUGGESTED_NEW_USERS_FAILURE:
      return {
        ...state,
        suggestedNewUsers: initialState.suggestedNewUsers,
        requesting: false,
        error: 'Nenhum novo usuário sugerido encontrado'
      };
    // FEATURED PROJECTS
    case searchTypes.GET_FEATURED_PROJECTS_REQUEST:
      return {
        ...state,
        featuredProjects: initialState.featuredProjects,
        requesting: true,
        error: ''
      };
    case searchTypes.GET_FEATURED_PROJECTS_SUCCESS:
      return {
        ...state,
        featuredProjects: action.results,
        requesting: false
      };
    case searchTypes.GET_FEATURED_PROJECTS_FAILURE:
      return {
        ...state,
        featuredProjects: initialState.featuredProjects,
        requesting: false,
        error: 'Nenhum projeto em destaque encontrado'
      };
    // LAST SEARCHES
    case searchTypes.GET_USERLASTSEARCHES_REQUEST:
      return {
        ...state,
        lastSearches: initialState.lastSearches,
        requesting: true,
        errorLastSearches: '',
        error: ''
      };
    case searchTypes.GET_USERLASTSEARCHES_SUCCESS:
      return {
        ...state,
        lastSearches: action.results,
        requesting: false
      };
    case searchTypes.GET_USERLASTSEARCHES_FAILURE:
      return {
        ...state,
        lastSearches: initialState.lastSearches,
        requesting: false,
        errorLastSearches: 'Nenhuma busca recente encontrada',
        error: ''
      };
    default:
      return state
  }
}