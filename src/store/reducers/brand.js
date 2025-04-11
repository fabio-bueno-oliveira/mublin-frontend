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
  logoFile: '',
  cover: '',
  relatedBrandId: '',
  relatedBrandName: '',
  relatedBrandUrl: '',
  relatedBrandLogo: '',
  category: '',
  products: [
    { 
      id: '',
      totalOwners: 0,
      name: '',
      subtitle: '',
      picture: '',
      rare: '',
      brandId: '',
      brandName: '',
      brandLogo: '',
      categoryId: '',
      categoryName: '',
      colorName: '',
      colorNamePTBR: ''
    }
  ],
  partners: {
    total: '',
    success: '',
    result: [
      {
        id: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        legend: '',
        verified: '',
      }
    ]
  },
  owners: {
    total: '',
    success: '',
    result: [
      {
        id: '',
        name: '',
        lastname: '',
        username: '',
        picture: '',
        verified: '',
        legend: '',
        productId: '',
        productName: ''
      }
    ]
  },
  colors: {
    total: 0,
    success: false,
    result: [
      {
        productId: '',
        name: '',
        rgb: '',
        sample: '',
        mainColor: '',
      }
    ]
  }
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
        logoFile: '',
        cover: '',
        relatedBrandId: '',
        relatedBrandName: '',
        relatedBrandUrl: '',
        relatedBrandLogo: '',
        category: '',
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
        logoFile: action.info.logoFile,
        cover: action.info.cover,
        relatedBrandId: action.info.relatedBrandId,
        relatedBrandName: action.info.relatedBrandName,
        relatedBrandUrl: action.info.relatedBrandUrl,
        relatedBrandLogo: action.info.relatedBrandLogo,
        category: action.info.category
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
        logoFile: '',
        relatedBrandId: '',
        relatedBrandName: '',
        relatedBrandUrl: '',
        relatedBrandLogo: '',
        category: '',
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
    case gearTypes.GET_BRAND_PARTNERS_REQUEST:
      return {
        ...state,
        requesting: true,
        success: false,
        partners: initialState.partners
      };
    case gearTypes.GET_BRAND_PARTNERS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: "",
        partners: action.list,
      };
    case gearTypes.GET_BRAND_PARTNERS_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        partners: initialState.partners
      };
    case gearTypes.GET_BRAND_OWNERS_REQUEST:
      return {
        ...state,
        requesting: true,
        success: false,
        owners: initialState.owners
      };
    case gearTypes.GET_BRAND_OWNERS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: "",
        owners: action.list,
      };
    case gearTypes.GET_BRAND_OWNERS_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        partners: initialState.owners
      };
    case gearTypes.GET_BRAND_COLORS_REQUEST:
      return {
        ...state,
        requesting: true,
        success: false,
        colors: initialState.colors
      };
    case gearTypes.GET_BRAND_COLORS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: "",
        colors: action.list,
      };
    case gearTypes.GET_BRAND_COLORS_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        colors: initialState.colors
      };
    default:
      return state
  }
}