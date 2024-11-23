import { userProjectsTypes } from '../types/userProjects';

const initialState = {
  requesting: false,
  success: false,
  error: '',
  list: [
    {
      id: '',
      id_user_fk: '',
      id_project_fk: '',
      confirmed: '',
      status: '',
      active: '',
      activityStatusId: '',
      activityStatus: '',
      activityStatusColor: '',
      founder: '',
      admin: '',
      joined_in: '',
      yearLeftTheProject: '',
      main_role_fk: '',
      portfolio: '',
      showOnProfile: '',
      touring: '',
      created: '',
      projectid: '',
      name: '',
      username:'',
      type: '',
      picture: '',
      ptid: '',
      ptname: '',
      pticon: '',
      workTitle: '',
      workIcon: '',
      role1: '',
      role1icon: '',
      role2: '',
      role2icon: '',
      role3: '',
      role3icon: '',
      genre1: '',
      genre2: '',
      genre3: '',
      yearFoundation: '',
      yearEnd: '',
      nextEventId: '',
      nextEventTitle: '',
      nextEventDateOpening: '',
      nextEventHourOpening: '',
      nextEventInvitationId: '',
      nextEventInvitationResponse: '',
      nextEventInvitationDate: '',
      nextEventInvitationNameWhoInvited: '',
      nextEventInvitationUsernameWhoInvited: '',
      nextEventInvitationPictureWhoInvited: '',
      nextEventInvitationUserIdWhoInvited: '',
      nextGoalDate: '',
      nextGoalDescription: '',
      nextGoalCompleted: '',
      nextUserGoalDate: '',
      nextUserGoalDescription: '',
      nextUserGoalCompleted: '',
      labelShow: '',
      labelColor: '',
      labelText: '',
      cityName: '',
      regionName: '',
      regionUf: '',
      countryName: '',
      leaderLastNote: '',
      leaderLastNoteDate: ''
    }
  ],
  summary: [
    {
      confirmed: '',
      joined_in: '',
      left_in: '',
      portfolio: '',
      projectid: '',
      name: '',
      username: ''
    }
  ],
  members: [
    {
      active: '',
      joinedIn: '',
      admin: '',
      leader: '',
      leftIn: '',
      projectId: '',
      projectUsername: '',
      role1: '',
      role1icon: '',
      role2: '',
      role2icon: '',
      role3: '',
      role3icon: '',
      userId: '',
      userLastname: '',
      userName: '',
      userPicture: '',
      userUsername: ''
    }
  ]
}

export function userProjects(state = initialState, action) {
  switch (action.type) {
    case userProjectsTypes.GET_USER_PROJECTS_REQUEST:
      return {
        ...state,
        requesting: true,
        success: true,
        list: initialState.list,
        summary: initialState.summary,
        members: initialState.members,
        error: ''
      };
    case userProjectsTypes.GET_USER_PROJECTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        error: '',
        list: action.list[0],
        summary: action.list[1],
        members: action.list[2],
      };
    case userProjectsTypes.GET_USER_PROJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: 'Erro na solicitação',
        list: initialState.list,
        summary: initialState.summary,
        members: initialState.members,
      };
    default:
      return state
  }
}