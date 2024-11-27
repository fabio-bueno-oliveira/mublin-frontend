import { gearTypes } from '../types/gear';

const initialState = {
  requesting: false,
  error: "",
  id: '',
  name: '',
  picture: '',
  largePicture: '',
  brandId: '',
  brandName: '',
  brandLogo: '',
  brandSlug: '',
  categoryId: '',
  categoryName: '',
  owners: [
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
      created: ''
    }
  ]
}

export function gear(state = initialState, action) {
  switch (action.type) {
    case gearTypes.GET_PRODUCT_INFO_REQUEST:
      return {
        ...state,
        requesting: true,
        error: ""
      };
    case gearTypes.GET_PRODUCT_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: "",
        id: action.info.id,
        name: action.info.name,
        picture: action.info.picture,
        largePicture: action.info.largePicture,
        brandId: action.info.brandId,
        brandName: action.info.brandName,
        brandLogo: action.info.brandLogo,
        brandSlug: action.info.brandSlug,
        categoryId: action.info.categoryId,
        categoryName: action.info.categoryName
      };
    case gearTypes.GET_PRODUCT_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    case gearTypes.GET_PRODUCT_OWNERS_REQUEST:
      return {
        ...state,
        requesting: true,
        error: ""
      };
    case gearTypes.GET_PRODUCT_OWNERS_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: "",
        owners: action.list,
      };
    case gearTypes.GET_PRODUCT_OWNERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}