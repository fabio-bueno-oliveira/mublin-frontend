import { profileTypes } from '../types/profile';

const initialState = {
  requesting: false,
  requested: false,
  success: false,
  id: '',
  name: '',
  lastname: '',
  email: '',
  picture: '',
  pictureLarge: '',
  bio: '',
  country: '',
  region: '',
  city: '',
  availabilityId: '',
  availabilityTitle: '',
  availabilityColor: '',
  availabilityFocusId: '',
  availabilityFocus: '',
  plan: '',
  legend: '',
  verified: '',
  instagram: '',
  website: '',
  public: '',
  roles: [
    { 
      id: '', 
      name: '',
      description: '',
      main: '',
      icon: ''
    }
  ],
  genres: [
    { 
      id: '', 
      name: '',
      main: ''
    }
  ],
  projects: [
    {
      confirme: '',
      joined_in: '',
      left_in: '',
      show_on_profile: '',
      portfolio: '',
      created: '',
      id: '',
      name: '',
      username: '',
      picture: '',
      featured: '',
      type: '',
      workTitle: '',
      workIcon: '',
      role1: '',
      role2: '',
      role3: ''
    }
  ],
  followers: [
    {
      id: '',
      followerId: '',
      followedId: '',
      name: '',
      lastname: '',
      username: '',
      picture: ''
    }
  ],
  following: [
    {
      id: '',
      followerId: '',
      followedId: '',
      name: '',
      lastname: '',
      username: '',
      picture: ''
    }
  ],
  recentActivity: [
    {
      id: '',
      typeId: '',
      created: '',
      created_date: '',
      action: '',
      extraText: '',
      image: ''
    }
  ],
  strengths: {
    total: 0,
    success: false,
    result: [
      { 
        strengthId: '',
        strengthTitle: '',
        idUserTo: '',
        percent: '',
        totalVotes: '',
        icon: ''
      }
    ]
  },
  strengthsTotalVotes: [
    {
      idUserTo: '',
      strengthId: '',
      totalVotes: '',
    }
  ],
  strengthsRaw: [
    { 
      id: '',
      idUserTo: '',
      idUserFrom: '',
      strengthId: '',
      icon: '',
      strengthTitle: '',
      created: ''
    }
  ],
  gear: [
    {
      brandId: '',
      brandName: '',
      brandLogo: '',
      productId: '',
      productName: '',
      category: '',
      picture: '',
      currentlyUsing: '',
      featured: '',
      forSale: '',
      price: '',
      tuning: '',
      tuningDescription: ''
    }
  ],
  gearSetups: [
    { 
      id: '',
      name: '',
      created: '',
      image: ''
    }
  ],
  gearCategories: [
    { category: '', macroCategory: '', total: 0 }
  ],
  partners: {
    total: 0,
    success: false,
    result: [
      { 
        featured: '',
        type: '',
        brandName: '',
        brandLogo: ''
      }
    ]
  },
  availabilityItems: [
    {
      id: '',
      itemId: '',
      itemName: ''
    }
  ],
  testimonials: [
    { 
      id: '',
      created: '',
      title: '',
      testimonial: '',
      friendId: '',
      friendName: '',
      friendUsername: '',
      friendPicture: '',
      friendPlan: ''
    }
  ]
}

export function profile(state = initialState, action) {
  switch (action.type) {
    case profileTypes.GET_PROFILE_INFO_REQUEST:
      return {
        ...state,
        id: '',
        name: '',
        lastname: '',
        email: '',
        picture: '',
        pictureLarge: '',
        bio: '',
        country: '',
        region: '',
        city: '',
        availabilityId: '',
        availabilityTitle: '',
        availabilityColor: '',
        availabilityFocusId: '',
        availabilityFocus: '',
        plan: '',
        legend: '',
        verified: '',
        instagram: '',
        website: '',
        public: '',
        requesting: true,
        requested: false,
        success: false
      };
    case profileTypes.GET_PROFILE_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        requested: true,
        success: true,
        id: action.info.id,
        name: action.info.name,
        lastname: action.info.lastname,
        email: action.info.email,
        picture: action.info.picture,
        pictureLarge: action.info.pictureLarge,
        bio: action.info.bio,
        country: action.info.country,
        region: action.info.region,
        city: action.info.city,
        availabilityId: action.info.availabilityId,
        availabilityTitle: action.info.availabilityTitle,
        availabilityColor: action.info.availabilityColor,
        availabilityFocusId: action.info.availabilityFocusId,
        availabilityFocus: action.info.availabilityFocus,
        firstAccess: action.info.firstAccess,
        plan: action.info.plan,
        legend: action.info.legend,
        verified: action.info.verified,
        instagram: action.info.instagram,
        website: action.info.website,
        public: action.info.public
      };
    case profileTypes.GET_PROFILE_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        requested: true,
        success: false,
        error: "A solicitação falhou"
      };
    // PROJECTS
    case profileTypes.GET_PROFILE_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_PROJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // ROLES
    case profileTypes.GET_PROFILE_ROLES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_ROLES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // GENRES
    case profileTypes.GET_PROFILE_GENRES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_GENRES_SUCCESS:
      return {
        ...state,
        genres: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_GENRES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // FOLLOWERS
    case profileTypes.GET_PROFILE_FOLLOWERS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_FOLLOWERS_SUCCESS:
      return {
        ...state,
        followers: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_FOLLOWERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // FOLLOWING
    case profileTypes.GET_PROFILE_FOLLOWING_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_FOLLOWING_SUCCESS:
      return {
        ...state,
        following: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_FOLLOWING_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // POSTS (RECENT ACTIVITY)
    case profileTypes.GET_PROFILE_POSTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_POSTS_SUCCESS:
      return {
        ...state,
        recentActivity: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_POSTS_FAILURE:
      return {
        ...state,
        recentActivity: [
          {
            id: '',
            typeId: '',
            created: '',
            created_date: '',
            action: '',
            extraText: '',
            image: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    // GEAR
    case profileTypes.GET_PROFILE_GEAR_REQUEST:
      return {
        ...state,
        gear: initialState.gear,
        requesting: true
      };
    case profileTypes.GET_PROFILE_GEAR_SUCCESS:
      return {
        ...state,
        gear: action.list[0],
        gearCategories: action.list[1],
        requesting: false,
      };
    case profileTypes.GET_PROFILE_GEAR_FAILURE:
      return {
        ...state,
        gear: initialState.gear,
        gearCategories: [
          { category: '', macroCategory: '', total: 0 }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    // GEAR SETUPS
    case profileTypes.GET_PROFILE_GEARSETUPS_REQUEST:
      return {
        ...state,
        gearSetups: initialState.gearSetups,
        requesting: true
      };
    case profileTypes.GET_PROFILE_GEARSETUPS_SUCCESS:
      return {
        ...state,
        gearSetups: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_GEARSETUPS_FAILURE:
      return {
        ...state,
        gearSetups: initialState.gearSetups,
        requesting: false,
        error: "A solicitação falhou"
    };
    // PARTNERS
    case profileTypes.GET_PROFILE_PARTNERS_REQUEST:
      return {
        ...state,
        partners: initialState.partners,
        requesting: true
      };
    case profileTypes.GET_PROFILE_PARTNERS_SUCCESS:
      return {
        ...state,
        partners: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_PARTNERS_FAILURE:
      return {
        ...state,
        partners: initialState.partners,
        requesting: false,
        error: "A solicitação falhou"
      };
    // AVAILABILITY ITEMS (SHOWS, REHEARSALS, ETC)
    case profileTypes.GET_PROFILE_AVAILABILITYITEMS_REQUEST:
      return {
        ...state,
        availabilityItems: initialState.availabilityItems,
        requesting: true
      };
    case profileTypes.GET_PROFILE_AVAILABILITYITEMS_SUCCESS:
      return {
        ...state,
        availabilityItems: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_AVAILABILITYITEMS_FAILURE:
      return {
        ...state,
        availabilityItems: initialState.availabilityItems,
        requesting: false,
        error: "A solicitação falhou"
      };
    // STRENGTHS GROUPED BY PERCENTAGE
    case profileTypes.GET_PROFILE_STRENGTHS_REQUEST:
      return {
        ...state,
        strengths: initialState.strengths,
        requesting: true
      };
    case profileTypes.GET_PROFILE_STRENGTHS_SUCCESS:
      return {
        ...state,
        strengths: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_STRENGTHS_FAILURE:
      return {
        ...state,
        strengths: initialState.strengths,
        requesting: false,
        error: "A solicitação falhou"
      };
    // STRENGTHS GROUPED BY TOTAL VOTES
    case profileTypes.GET_PROFILE_STRENGTHSTOTALVOTES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_STRENGTHSTOTALVOTES_SUCCESS:
      return {
        ...state,
        strengthsTotalVotes: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_STRENGTHSTOTALVOTES_FAILURE:
      return {
        ...state,
        strengthsTotalVotes: initialState.strengthsTotalVotes,
        requesting: false,
        error: "A solicitação falhou"
      };
    // STRENGTHS RAW LIST
    case profileTypes.GET_PROFILE_STRENGTHS_RAW_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_STRENGTHS_RAW_SUCCESS:
      return {
        ...state,
        strengthsRaw: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_STRENGTHS_RAW_FAILURE:
      return {
        ...state,
        strengthsRaw: initialState.strengthsRaw,
        requesting: false,
        error: "A solicitação falhou"
      };
    // TESTIMONIALS
    case profileTypes.GET_PROFILE_TESTIMONIALS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case profileTypes.GET_PROFILE_TESTIMONIALS_SUCCESS:
      return {
        ...state,
        testimonials: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_TESTIMONIALS_FAILURE:
      return {
        ...state,
        testimonials: initialState.testimonials,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}