import { gearTypes } from '../types/gear';

const initialState = {
  requesting: false,
  success: false,
  error: "",
  id: '',
  name: '',
  name_for_url: '',
  description: '',
  website: '',
  logo: '',
  cover: '',
  relatedBrandId: '',
  relatedBrandName: '',
  relatedBrandUrl: '',
  relatedBrandLogo: '',
  products: [
    { 
      id: '',
      totalOwners: 0,
      name: '',
      picture: '',
      brandId: '',
      brandName: '',
      brandLogo: '',
      categoryId: '',
      categoryName: '',
      colorName: '',
      colorNamePTBR: ''
    }
  ]
}

export function brand(state = initialState, action) {
  switch (action.type) {
    case gearTypes.GET_BRAND_INFO_REQUEST:
      return {
        ...state,
        requesting: true,
        success: false,
        error: "",
        id: '',
        name: '',
        name_for_url: '',
        description: '',
        website: '',
        logo: '',
        cover: '',
        relatedBrandId: '',
        relatedBrandName: '',
        relatedBrandUrl: '',
        relatedBrandLogo: '',
        products: initialState.products
      };
    case gearTypes.GET_BRAND_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: "",
        id: action.info.id,
        name: action.info.name,
        name_for_url: action.info.name_for_url,
        description: action.info.description,
        website: action.info.website,
        logo: action.info.logo,
        cover: action.info.cover,
        relatedBrandId: action.info.relatedBrandId,
        relatedBrandName: action.info.relatedBrandName,
        relatedBrandUrl: action.info.relatedBrandUrl,
        relatedBrandLogo: action.info.relatedBrandLogo
      };
    case gearTypes.GET_BRAND_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        id: '',
        name: '',
        name_for_url: '',
        description: '',
        website: '',
        logo: '',
        relatedBrandId: '',
        relatedBrandName: '',
        relatedBrandUrl: '',
        relatedBrandLogo: '',
        products: initialState.products
      };
    case gearTypes.GET_BRAND_PRODUCTS_REQUEST:
      return {
        ...state,
        requesting: true,
        success: false,
        products: initialState.products
      };
    case gearTypes.GET_BRAND_PRODUCTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: "",
        products: action.list,
      };
    case gearTypes.GET_BRAND_PRODUCTS_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        products: initialState.products
      };
    default:
      return state
  }
}