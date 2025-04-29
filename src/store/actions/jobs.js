import { jobsTypes } from '../types/jobs';
import { jobsService } from '../../api/jobs';

export const jobsActions = {
  getJobs: getJobs
};

function getJobs() {
  return dispatch => {
    dispatch(request());

    jobsService.getJobs()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: jobsTypes.GET_JOBS_REQUEST } }
  function success(results) { return { type: jobsTypes.GET_JOBS_SUCCESS, results } }
  function failure(error) { return { type: jobsTypes.GET_JOBS_FAILURE, error } }
}
