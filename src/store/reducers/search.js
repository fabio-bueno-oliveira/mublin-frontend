import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  lastSearches: [
    { query: '' }
  ],
  errorLastSearches: '',
  users: {
    total: 0,
    success: false,
      result: [
      {
        id: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        publicProfile: '',
        plan: '',
        status: '',
        legend: '',
        verified: '',
        city: '',
        region: '',
        country: '',
        roleName: '',
        mainRole: '',
        instrumentalist: '',
        projectRelated: '',
        projectPublic: '',
        availabilityStatus: '',
        availability_color: '',
        projectType: '',
        totalProjects: 0,
        openToWork: '',
        openToWorkText: ''
      }
    ]
  },
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
        relatedUserName: '',
        relatedUserLastname: '',
        relatedUserUsername: '',
        relatedUserPicture: '',
        relatedUserId: '',
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
        rare: '',
        seriesId: '',
        seriesName: '',
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
  brands: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        name: '',
        slug: '',
        logo: '',
        cover: '',
        website: '',
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
    success: false,
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
  },
  featuredGear: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        name: '',
        short_subtitle: '',
        picture: '',
        rare: '',
        featured: '',
        brandName: '',
        brandSlug: '',
        brandLogo: ''
      }
    ]
  },
  featuredGenres: [
    {
      id: '',
      name: ''
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
    case searchTypes.RESET_SEARCH_PROJECTS:
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
        gear: initialState.gear,
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
    // BRANDS
    case searchTypes.SEARCH_BRANDS_REQUEST:
      return {
        ...state,
        brands: initialState.brands,
        requesting: true,
        error: ''
      };
    case searchTypes.SEARCH_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.results,
        requesting: false,
        error: ''
      };
    case searchTypes.SEARCH_BRANDS_FAILURE:
      return {
        ...state,
        brands: initialState.brands,
        requesting: false,
        error: 'Nenhuma marca encontrada'
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
    // FEATURED GEAR PRODUCTS
    case searchTypes.GET_FEATURED_GEAR_REQUEST:
      return {
        ...state,
        featuredGear: initialState.featuredGear,
        requesting: true,
        error: ''
      };
    case searchTypes.GET_FEATURED_GEAR_SUCCESS:
      return {
        ...state,
        featuredGear: action.results,
        requesting: false
      };
    case searchTypes.GET_FEATURED_GEAR_FAILURE:
      return {
        ...state,
        featuredGear: initialState.featuredGear,
        requesting: false,
        error: 'Nenhum produto em destaque encontrado'
      };
    // FEATURED GENRES
    case searchTypes.GET_FEATURED_GENRES_REQUEST:
      return {
        ...state,
        featuredGenres: initialState.featuredGenres,
        requesting: true,
        error: ''
      };
    case searchTypes.GET_FEATURED_GENRES_SUCCESS:
      return {
        ...state,
        featuredGenres: action.results,
        requesting: false
      };
    case searchTypes.GET_FEATURED_GENRES_FAILURE:
      return {
        ...state,
        featuredGenres: initialState.featuredGenres,
        requesting: false,
        error: 'Nenhum gênero em destaque encontrado'
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