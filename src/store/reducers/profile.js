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
  roles: [
    { 
      id: '', 
      name: '',
      description: '',
      main: '',
      icon: ''
    }
  ],
  availabilityId: '',
  availabilityTitle: '',
  availabilityColor: '',
  availabilityFocus: '',
  projects: [
    {
      confirme: '',
      joined_in: '',
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
  strengths: [
    { 
      strengthId: '',
      strengthTitle: '',
      idUserTo: '',
      percent: '',
      icon: ''
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
      price: ''
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
  partners: [
    {
      featured: '',
      type: '',
      brandName: '',
      brandLogo: ''
    }
  ],
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
  ],
  plan: '',
  legend: '',
  verified: '',
  instagram: '',
  website: '',
  public: ''
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
        instagram: '',
        website: '',
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
            price: ''
          }
        ],
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
        gearSetups: [
          {
            id: '',
            name: '',
            created: '',
            image: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
    };
    // PARTNERS
    case profileTypes.GET_PROFILE_PARTNERS_REQUEST:
      return {
        ...state,
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
        partners: [
          {
            featured: '',
            type: '',
            brandName: '',
            brandLogo: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    // AVAILABILITY ITEMS (SHOWS, REHEARSALS, ETC)
    case profileTypes.GET_PROFILE_AVAILABILITYITEMS_REQUEST:
      return {
        ...state,
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
        availabilityItems: [
          {
            id: '',
            itemId: '',
            itemName: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    // STRENGTHS GROUPED BY PERCENTAGE
    case profileTypes.GET_PROFILE_STRENGTHS_REQUEST:
      return {
        ...state,
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
        strengths: [
          { 
            idUserTo: '',
            strengthId: '',
            strengthTitle: '',
            percent: '',
            icon: ''
          }
        ],
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
        testimonials: [
          { 
            id: '',
            created: '',
            title: '',
            testimonial: '',
            friendId: '',
            friendName: '',
            friendUsername: '',
            friendPicture: ''
          }
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}