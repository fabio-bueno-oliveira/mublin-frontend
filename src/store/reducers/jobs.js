import { jobsTypes } from '../types/jobs';

const initialState = {
  requesting: false,
  success: false,
  total: 0,
  list: [
    {
      id: '',
      info: '',
      oneTimeJob: '',
      isInOneSpecificLocation: '',
      venue: '',
      rehearsalInPerson: '',
      feePerRehearsal: '',
      feePerConcert: '',
      projectId: '',
      projectName: '',
      projectSlug: '',
      projectPicture: '',
      projectCover: '',
      projectCity: '',
      projectRegion: '',
      projectCountry: '',
      projectType: '',
      roleId: '',
      roleName: '',
      roleIcon: '',
      experienceId: '',
      experienceEN: '',
      experiencePTBR: '',
      relationshipId: '',
      relationshipEN: '',
      relationshipPTBR: '',
      authorId: '',
      authorName: '',
      authorLastname: '',
      authorUsername: '',
      authorPicture: '',
      opportunityCityName: '',
      opportunityCityId: '',
      opportunityRegionName: '',
      opportunityRegionId: '',
      opportunityCityCountry: '',
      opportunityCountryId: ''
    }
  ]
}

export function jobs(state = initialState, action) {
  switch (action.type) {
    case jobsTypes.GET_JOBS_REQUEST:
      return {
        ...state,
        requesting: true,
        list: initialState.list,
        success: false,
        total: 0
      };
    case jobsTypes.GET_JOBS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: action.results.success,
        total: action.results.total,
        list: action.results.result
      };
    case jobsTypes.GET_JOBS_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        list: initialState.list,
        error: action.results.error,
        total: 0
      };
    default:
      return state
  }
}