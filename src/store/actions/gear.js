import { gearTypes } from '../types/gear';
import { gearService } from '../../api/gear';

export const gearInfos = {
  getProductInfo: getProductInfo,
  getProductOwners: getProductOwners,
};

function getProductInfo(productId) {
  return dispatch => {
    dispatch(request(productId));

    gearService.getProductInfo(productId)
      .then(
        info => dispatch(success(info)),
        error => dispatch(failure(productId, error.toString()))
      );
  };

  function request(productId) { return { type: gearTypes.GET_PRODUCT_INFO_REQUEST, productId } }
  function success(info) { return { type: gearTypes.GET_PRODUCT_INFO_SUCCESS, info } }
  function failure(productId, error) { return { type: gearTypes.GET_PRODUCT_INFO_FAILURE, productId, error } }
}

function getProductOwners(productId) {
  return dispatch => {
    dispatch(request(productId));
  
    gearService.getProductOwners(productId)
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(productId, error.toString()))
      );
  };
  
  function request(productId) { return { type: gearTypes.GET_PRODUCT_OWNERS_REQUEST, productId } }
  function success(list) { return { type: gearTypes.GET_PRODUCT_OWNERS_SUCCESS, list } }
  function failure(productId, error) { return { type: gearTypes.GET_PRODUCT_OWNERS_FAILURE, productId, error } }
}