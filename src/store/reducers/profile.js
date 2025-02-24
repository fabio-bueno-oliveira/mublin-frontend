import { profileTypes } from '../types/profile';

const initialState = {
  requesting: false,
  requested: false,
  requestingFollowingActions: false,
  requestingStrengthHistory: false,
  success: false,
  activeModal: null,
  id: '',
  name: '',
  lastname: '',
  email: '',
  phone: '',
  picture: '',
  pictureLarge: '',
  pictureCover: '',
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
  tiktok: '',
  website: '',
  public: '',
  openToWork: '',
  openToWorkText: '',
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
  recentActivity: {
    total: 0,
    success: '',
    result: [
      {
        id: '',
        typeId: '',
        created: '',
        created_date: '',
        action: '',
        extraText: '',
        image: '',
      }
    ]
  },
  projects: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        confirmed: '',
        joined_in: '',
        left_in: '',
        show_on_profile: '',
        portfolio: '',
        created: '',
        name: '',
        username: '',
        picture: '',
        endYear: '',
        featured: '',
        type: '',
        workTitle: '',
        workIcon: '',
        role1: '',
        role2: '',
        role3: '',
      },
    ],
  },
  followers: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        followerId: '',
        followedId: '',
        userId: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        verified: '',
        legend_badge: '',
        openToWork: '',
        openToWorkText: ''
      }
    ]
  },
  following: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        followerId: '',
        followedId: '',
        userId: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        verified: '',
        legend_badge: '',
        openToWork: '',
        openToWorkText: ''
      }
    ]
  },
  relatedUsers: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        verified: '',
        legendBadge: ''
      }
    ]
  },
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
  strengthsVotesHistory: {
    total: 0,
    success: false,
    result: [
      { 
        strengthId: '',
        strength: '',
        icon: '',
        userId: '',
        name: '',
        lastname: '',
        verified: 0,
        legend: 0,
        username: '',
        picture: '',
        created: '',
      }
    ]
  },
  gear: {
    total: 0,
    list: [
      {
        user_gear_id: '',
        brandId: '',
        brandName: '',
        brandLogo: '',
        productId: '',
        productName: '',
        is_subproduct: '',
        parent_product_id: '',
        category: '',
        picture: '',
        pictureFilename: '',
        currentlyUsing: '',
        featured: '',
        forSale: '',
        price: '',
        tuning: '',
        tuningDescription: '',
        ownerComments: ''
      }
    ]
  },
  gearCategories: {
    total: 0,
    list: [
      {
        category: '',
        macro_category: '',
        total: '',
      }
    ]
  },
  gearSetups: {
    total: 0,
    success: true,
    setups: [
      { 
        id: '',
        name: ''
      }
    ],
    products: [
      { 
        id: '',
        setupId: ''
      }
    ],
  },
  partners: {
    total: 0,
    success: false,
    result: [
      { 
        featured: '',
        type: '',
        brandName: '',
        brandSlug: '',
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
        phone: "",
        picture: '',
        pictureLarge: '',
        pictureCover: '',
        bio: '',
        country: '',
        region: '',
        city: '.',
        availabilityId: '',
        availabilityTitle: '',
        availabilityColor: '',
        availabilityFocusId: '',
        availabilityFocus: '',
        plan: '',
        legend: '',
        verified: '',
        instagram: '',
        tiktok: '',
        website: '',
        public: '',
        openToWork: '',
        openToWorkText: '',
        roles: initialState.roles,
        genres: initialState.genres,
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
        phone: action.info.phone,
        picture: action.info.picture,
        pictureLarge: action.info.pictureLarge,
        pictureCover: action.info.picture_cover,
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
        tiktok: action.info.tiktok,
        website: action.info.website,
        public: action.info.public,
        openToWork: action.info.openToWork,
        openToWorkText: action.info.openToWorkText
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
        requesting: true,
        projects: initialState.projects
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
        projects: initialState.projects,
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
        genres: initialState.genres,
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
        genres: initialState.genres,
        requesting: false,
        error: "A solicitação falhou"
      };
    // FOLLOWERS
    case profileTypes.GET_PROFILE_FOLLOWERS_REQUEST:
      return {
        ...state,
        followers: initialState.followers,
        requestingFollowingActions: true
      };
    case profileTypes.GET_PROFILE_FOLLOWERS_SUCCESS:
      return {
        ...state,
        followers: action.list,
        requestingFollowingActions: false,
      };
    case profileTypes.GET_PROFILE_FOLLOWERS_FAILURE:
      return {
        ...state,
        followers: initialState.followers,
        requestingFollowingActions: false,
        error: "A solicitação falhou"
      };
    // FOLLOWING
    case profileTypes.GET_PROFILE_FOLLOWING_REQUEST:
      return {
        ...state,
        following: initialState.following,
        requestingFollowingActions: true
      };
    case profileTypes.GET_PROFILE_FOLLOWING_SUCCESS:
      return {
        ...state,
        following: action.list,
        requestingFollowingActions: false,
      };
    case profileTypes.GET_PROFILE_FOLLOWING_FAILURE:
      return {
        ...state,
        following: initialState.following,
        requestingFollowingActions: false,
        error: "A solicitação falhou"
      };
    // RELATED USERS
    case profileTypes.GET_PROFILE_RELATED_USERS_REQUEST:
      return {
        ...state,
        relatedUsers: initialState.relatedUsers,
        requesting: true
      };
    case profileTypes.GET_PROFILE_RELATED_USERS_SUCCESS:
      return {
        ...state,
        relatedUsers: action.list,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_RELATED_USERS_FAILURE:
      return {
        ...state,
        relatedUsers: initialState.relatedUsers,
        requesting: false,
        error: "A solicitação falhou"
      };
    // POSTS (RECENT ACTIVITY)
    case profileTypes.GET_PROFILE_POSTS_REQUEST:
      return {
        ...state,
        recentActivity: initialState.recentActivity,
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
        recentActivity: initialState.recentActivity,
        requesting: false,
        error: "A solicitação falhou"
      };
    // GEAR
    case profileTypes.GET_PROFILE_GEAR_REQUEST:
      return {
        ...state,
        gear: initialState.gear,
        gearCategories: initialState.gearCategories,
        requesting: true
      };
    case profileTypes.GET_PROFILE_GEAR_SUCCESS:
      return { 
        ...state,
        gear: action.list.products,
        gearCategories: action.list.categories,
        requesting: false,
      };
    case profileTypes.GET_PROFILE_GEAR_FAILURE:
      return {
        ...state,
        gear: initialState.gear,
        gearCategories: initialState.gearCategories,
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
    // STRENGTHS VOTES HISTORY
    case profileTypes.GET_PROFILE_STRENGTHS_VOTES_INFO_REQUEST:
      return {
        ...state,
        requestingStrengthHistory: true
      };
    case profileTypes.GET_PROFILE_STRENGTHS_VOTES_INFO_SUCCESS:
      return {
        ...state,
        requestingStrengthHistory: false,
        strengthsVotesHistory: action.list
      };
    case profileTypes.GET_PROFILE_STRENGTHS_VOTES_INFO_FAILURE:
      return {
        ...state,
        strengthsVotesHistory: initialState.strengthsVotesHistory,
        requestingStrengthHistory: false,
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
    case profileTypes.SET_ACTIVE_MODAL:
      return {
        ...state,
        activeModal: action.modalName
      };
    default:
      return state
  }
}