import { gearTypes } from '../types/gear';

const initialState = {
  requesting: false,
  error: "",
  id: '',
  name: '',
  subtitle: '',
  picture: '',
  largePicture: '',
  brandId: '',
  brandName: '',
  brandLogo: '',
  brandSlug: '',
  categoryId: '',
  categoryName: '',
  colorId: '',
  colorName: '',
  colorNamePTBR: '',
  colorRgb: '',
  colorSample: '',
  rare: '',
  owners: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        country: '',
        region: '',
        city: '',
        featured: '',
        currentlyUsing: '',
        forSale: '',
        price: '',
        photo: '',
        productId: '',
        created: '',
        ownerComments: '',
        tuning: '',
        tuningDescription: '',
      }
    ]
  },
  availableColors: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        productId: '',
        pictureFilename: '',
        picture: '',
        largePicture: '',
        colorId: '',
        colorName: '',
        colorNamePTBR: '',
        colorRgb: '',
        colorSample: '',
        colorType: '',
        mainColor: '',
      }
    ]
  },
  brands: [
    { id: '', name: '', logo: '' }
  ]
}

export function gear(state = initialState, action) {
  switch (action.type) {
    case gearTypes.GET_PRODUCT_INFO_REQUEST:
      return {
        ...state,
        requesting: true,
        name: '',
        picture: '',
        largePicture: '',
        brandName: '',
        error: '',
      };
    case gearTypes.GET_PRODUCT_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: '',
        id: action.info.id,
        name: action.info.name,
        subtitle: action.info.subtitle,
        picture: action.info.picture,
        largePicture: action.info.largePicture,
        brandId: action.info.brandId,
        brandName: action.info.brandName,
        brandLogo: action.info.brandLogo,
        brandSlug: action.info.brandSlug,
        categoryId: action.info.categoryId,
        categoryName: action.info.categoryName,
        colorId: action.info.colorId,
        colorName: action.info.colorName,
        colorNamePTBR: action.info.colorNamePTBR,
        colorRgb: action.info.colorRgb,
        colorSample: action.info.colorSample,
        rare: action.info.rare,
      };
    case gearTypes.GET_PRODUCT_INFO_FAILURE:
      return {
        ...state,
        name: '',
        subtitle: '',
        picture: '',
        largePicture: '',
        brandName: '',
        requesting: false,
        error: 'A solicitação falhou'
      };
    case gearTypes.GET_PRODUCT_OWNERS_REQUEST:
      return {
        ...state,
        requesting: true,
        owners: initialState.owners,
        error: ''
      };
    case gearTypes.GET_PRODUCT_OWNERS_SUCCESS:
      return {
        ...state,
        requesting: false,
        owners: action.list,
        error: '',
      };
    case gearTypes.GET_PRODUCT_OWNERS_FAILURE:
      return {
        ...state,
        requesting: false,
        owners: initialState.owners,
        error: 'A solicitação falhou'
      };
    case gearTypes.GET_PRODUCT_COLORS_REQUEST:
      return {
        ...state,
        requesting: true,
        availableColors: initialState.availableColors,
        error: ''
      };
    case gearTypes.GET_PRODUCT_COLORS_SUCCESS:
      return {
        ...state,
        requesting: false,
        availableColors: action.list,
        error: '',
      };
    case gearTypes.GET_PRODUCT_COLORS_FAILURE:
      return {
        ...state,
        requesting: false,
        availableColors: initialState.availableColors,
        error: 'A solicitação de cores disponíveis falhou'
      };
    case gearTypes.RESET_PRODUCT_COLORS:
      return {
        ...state,
        requesting: false,
        availableColors: initialState.availableColors,
        error: ''
      };
    case gearTypes.GET_GEAR_BRANDS_REQUEST:
      return {
        ...state,
        brands: initialState.brands,
        requesting: true
      };
    case gearTypes.GET_GEAR_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.list,
        requesting: false,
      };
    case gearTypes.GET_GEAR_BRANDS_FAILURE:
      return {
        ...state,
        requesting: false,
        brands: initialState.brands,
        error: 'A solicitação falhou'
      };
    default:
      return state
  }
}