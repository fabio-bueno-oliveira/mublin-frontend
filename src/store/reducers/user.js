import { userTypes } from '../types/users';

const initialState = {
  requesting: false,
  success: false,
  id: '',
  name: '',
  lastname: '',
  email: '',
  username: '',
  previously_registered: '',
  gender: '',
  verified: false,
  bio: '',
  country: '',
  region: '',
  regionName: '',
  city: '',
  cityName: '',
  picture: '',
  picture_cover: '',
  plan: '',
  public: '',
  instagram: '',
  tiktok: '',
  phone: '',
  phoneIsPublic: '',
  status: '',
  legend: '',
  website: '',
  openToWork: '',
  openToWorkText: '',
  roles: [
    { id: '', idRole: '', name: '', description: '', mainActivity: '', icon: '' }
  ],
  genres: [
    { id: '', idGenre:'', name: '', mainGenre: '' }
  ],
  genresLoadingSuccess: false,
  gear: [
    {
      brandId: '',
      brandName: '',
      brandLogo: '',
      productId: '',
      productName: '',
      is_subproduct: '',
      parent_product_id: '',
      category: '',
      macroCategory: '',
      picture: '',
      currentlyUsing: '',
      featured: '',
      forSale: '',
      price: '',
      tuningId: '',
      tuningName: '',
      tuningDescription: '',
    }
  ],
  gearLoaded: false,
  gearRequesting: false,
  gearSetups: {
    total: 0,
    success: '',
    result: [
      {
        id: '',
        name: '',
        image: '',
        description: '',
        totalItems: '',
        created: '',
      }
    ]
  },
  gearSetupItemsRequesting: false,
  gearSetupItems: {
    total: 0,
    success: true,
    items: [
      {
        setupItemId: '',
        id: '',
        name: '',
        picture: '',
        selectedColorPicture: '',
        rare: '',
        brandId: '',
        brandSlug: '',
        brandLogo: '',
        brandName: '',
        forSale: '',
        price: '',
        productComments: '',
        colorName: '',
        colorRgb: '',
        colorSample: '',
        orderShow: '',
        itemSetupComments: '',
        tuning: '',
        category: '',
        setupId: ''
      }
    ]
  },
  partners: {
    total: 0,
    success: false,
    result: [
      {
        keyId: '',
        id: '',
        name: '',
        slug: '',
        logo: '',
        cover: '',
        featured: '',
        type: '',
        sinceYear: '',
        active: '',
        created: '',
      },
    ],
  },
  availabilityStatus: '',
  availabilityItems: [
    { id: '', idItem: '', name: '' }
  ],
  availabilityItemsLoaded: false,
  availabilityFocus: '',
  level: '',
  lastConnectedFriends: [
    {
      name: '',
      lastname: '',
      username: '',
      picture: '',
      lastLogin: ''
    }
  ]
}

const updateUserInfoInLocalStorage = (values) => {
  localStorage.setItem('userInfo', JSON.stringify(values));
}

export function user(state = initialState, action) {
  switch (action.type) {
    case userTypes.GET_USER_INFO_REQUEST:
      return {
        ...state,
        success: false,
        requesting: true
      };
    case userTypes.GET_USER_INFO_SUCCESS:
      return updateUserInfoInLocalStorage(action.info), {
        ...state,
        success: true,
        requesting: false,
        id: action.info.id,
        name: action.info.name,
        lastname: action.info.lastname,
        email: action.info.email,
        username: action.info.username,
        previously_registered: action.info.previously_registered,
        first_access: action.info.first_access,
        gender: action.info.gender,
        verified: action.info.verified,
        bio: action.info.bio,
        country: action.info.country,
        region: action.info.region,
        regionName: action.info.regionName,
        city: action.info.city,
        cityName: action.info.cityName,
        picture: action.info.picture,
        picture_cover: action.info.picture_cover,
        plan: action.info.plan,
        public: action.info.public,
        instagram: action.info.instagram,
        tiktok: action.info.tiktok,
        phone: action.info.phone,
        phoneIsPublic: action.info.phoneIsPublic,
        status: action.info.status,
        legend: action.info.legend_badge,
        website: action.info.website,
        openToWork: action.info.openToWork,
        openToWorkText: action.info.openToWorkText,
        availabilityStatus: action.info.availability_status,
        availabilityFocus: action.info.availability_focus,
        level: action.info.level
      };
    case userTypes.GET_USER_INFO_FAILURE:
      return {
        ...state,
        success: false,
        requesting: false,
        error: "A solicitação falhou",
        id: '',
        name: '',
        lastname: '',
        email: '',
        username: '',
        previously_registered: '',
        gender: '',
        verified: false,
        bio: '',
        country: '',
        region: '',
        regionName: '',
        city: '',
        cityName: '',
        picture: '',
        picture_cover: '',
        plan: '',
        public: '',
        instagram: '',
        tiktok: '',
        phone: '',
        phoneIsPublic: '',
        status: '',
        legend: '',
        website: '',
        openToWork: '',
        openToWorkText: '',
      };
    // get user´s preferred music genres
    case userTypes.GET_USER_GENRES_INFO_REQUEST:
      return {
        ...state,
        genresLoadingSuccess: false,
        requesting: true
      };
    case userTypes.GET_USER_GENRES_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        genresLoadingSuccess: true,
        genres: action.list
      };
    case userTypes.GET_USER_GENRES_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        genresLoadingSuccess: false,
        error: "A solicitação falhou"
      };
    // get user´s roles musicwise
    case userTypes.GET_USER_ROLES_INFO_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_ROLES_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        roles: action.list
      };
    case userTypes.GET_USER_ROLES_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // get user´s gear
    case userTypes.GET_USER_GEAR_REQUEST:
      return {
        ...state,
        gearLoaded: false,
        gearRequesting: true
      };
    case userTypes.GET_USER_GEAR_SUCCESS:
      return {
        ...state,
        gear: action.list,
        gearLoaded: true,
        gearRequesting: false
      };
    case userTypes.GET_USER_GEAR_FAILURE:
      return {
        ...state,
        gearLoaded: false,
        gearRequesting: false,
        gear: initialState.gear,
        error: "A solicitação da lista dos equipamentos falhou"
      };
    // get user´s gear setups
    case userTypes.GET_USER_GEARSETUPS_REQUEST:
      return {
        ...state,
        requesting: false,
        gearSetups: initialState.gearSetups
      };
    case userTypes.GET_USER_GEARSETUPS_SUCCESS:
      return {
        ...state,
        gearSetups: action.list,
        requesting: false
      };
    case userTypes.GET_USER_GEARSETUPS_FAILURE:
      return {
        ...state,
        requesting: false,
        gearSetups: initialState.gearSetups,
        error: "A solicitação da lista de setups falhou"
      };
    // get user´s gear setup items
    case userTypes.GET_USER_GEARSETUPITEMS_REQUEST:
      return {
        ...state,
        gearSetupItemsRequesting: true,
        gearSetupItems: initialState.gearSetupItems
      };
    case userTypes.GET_USER_GEARSETUPITEMS_SUCCESS:
      return {
        ...state,
        gearSetupItemsRequesting: false,
        gearSetupItems: action.list,
      };
    case userTypes.GET_USER_GEARSETUPITEMS_FAILURE:
      return {
        ...state,
        gearSetupItemsRequesting: false,
        gearSetupItems: initialState.gearSetupItems,
        error: "A solicitação da lista de itens do setup falhou"
      };
    // get user´s brand partners
    case userTypes.GET_USER_PARTNERS_REQUEST:
      return {
        ...state,
        partners: initialState.partners,
        requesting: true
      };
    case userTypes.GET_USER_PARTNERS_SUCCESS:
      return {
        ...state,
        partners: action.list,
        requesting: false
      };
    case userTypes.GET_USER_PARTNERS_FAILURE:
      return {
        ...state,
        requesting: false,
        partners: initialState.partners
      };
    // get user´s availability items
    case userTypes.GET_USER_AVAILABILITY_ITEMS_REQUEST:
      return {
        ...state,
        requesting: true,
        availabilityItemsLoaded: false
      };
    case userTypes.GET_USER_AVAILABILITY_ITEMS_SUCCESS:
      return {
        ...state,
        requesting: false,
        availabilityItems: action.list,
        availabilityItemsLoaded: true
      };
    case userTypes.GET_USER_AVAILABILITY_ITEMS_FAILURE:
      return {
        ...state,
        requesting: false,
        availabilityItemsLoaded: false,
        error: "A solicitação falhou"
      };
    // get user´s last connected friends
    case userTypes.GET_USER_LAST_CONNECTED_FRIENDS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case userTypes.GET_USER_LAST_CONNECTED_FRIENDS_SUCCESS:
      return {
        ...state,
        requesting: false,
        lastConnectedFriends: action.list
      };
    case userTypes.GET_USER_LAST_CONNECTED_FRIENDS_FAILURE:
      return {
        ...state,
        requesting: false,
        lastConnectedFriends: [
          {
            name: '',
            lastname: '',
            username: '',
            picture: '',
            lastLogin: ''
          }
        ],
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}