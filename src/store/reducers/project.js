import { projectTypes } from '../types/project';

const initialState = {
  requesting: false,
  adminAccess: 0,
  confirmed: '',
  active: '',
  leader: '',
  id: '',
  name: '',
  oldName: '',
  username: '',
  picture: '',
  created: '',
  foundationYear: '',
  endDate: '',
  bio: '',
  purpose: '',
  spotifyUri: '',
  typeId: '',
  typeName: '',
  adminNote: null,
  currentlyOnTour: '',
  kind: '',
  genre1: '',
  genre2: '',
  genre3: '',
  country: '',
  region: '',
  city: '',
  labelShow: '',
  labelText: '',
  labelColor: '',
  public: '',
  members: [
    {
      id: '',
      joinedIn: '',
      leftIn: '',
      name: '',
      lastname: '',
      username: '',
      picture: '',
      bio: '',
      role1: '',
      role2: '',
      role3: '',
      projectId: '',
      projectName: '',
      projectUsername: '',
      statusId: '',
      statusName: '',
      statusIcon: '',
      admin: '',
      active: '',
      leader: '',
      touring: '',
      confirmed: ''
    }
  ],
  opportunities: [
    {
      created: '',
      rolename: '',
      info: '',
      experienceLevel: '',
      experienceName: ''
    }
  ],
  notes: [
    {
      id: '',
      note: '',
      created: '',
      authorUsername: '',
      authorName: '',
      authorLastname: '',
      authorPicture: ''
    }
  ],
  events: [
    {
      id: '',
      title: '',
      description: '',
      dateOpening: '',
      eventHourStart: '',
      dateEnd: '',
      eventHourEnd: '',
      picture: '',
      authorName: '',
      authorLastname: '',
      authorUsername: '',
      authorPicture: '',
      city: '',
      region: '',
      typeId: '',
      type: '',
      placeId: '',
      placeName: '',
      purpose: '',
      method: '',
      price: ''
    }
  ],
  relatedProjects: [
    {
      id: '',
      name: '',
      username: '',
      picture: ''
    }
  ]
}

export function project(state = initialState, action) {
  switch (action.type) {
    case projectTypes.GET_PROJECT_INFO_REQUEST:
      return {
        ...state,
        requesting: true,
        confirmed: '',
        active: '',
        leader: '',
        id: '',
        name: '',
        oldName: '',
        username: '',
        picture: '',
        created: '',
        foundationYear: '',
        endDate: '',
        bio: '',
        purpose: '',
        spotifyUri: '',
        typeId: '',
        typeName: '',
        adminNote: null,
        currentlyOnTour: '',
        kind: '',
        genre1: '',
        genre2: '',
        genre3: '',
        country: '',
        region: '',
        city: '',
        labelShow: '',
        labelText: '',
        labelColor: '',
        public: '',
      };
    case projectTypes.GET_PROJECT_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        id: action.info.id,
        name: action.info.name,
        oldName: action.info.oldName,
        username: action.info.username,
        picture: action.info.picture,
        created: action.info.created,
        foundationYear: action.info.foundationYear,
        endDate: action.info.endDate,
        bio: action.info.bio,
        purpose: action.info.purpose,
        spotifyUri: action.info.spotifyUri,
        typeId: action.info.typeId,
        typeName: action.info.typeName,
        adminNote: action.info.adminNote,
        currentlyOnTour: action.info.currentlyOnTour,
        kind: action.info.kind,
        genre1: action.info.genre1,
        genre2: action.info.genre2,
        genre3: action.info.genre3,
        country: action.info.country,
        region: action.info.region,
        city: action.info.city,
        labelShow: action.info.labelShow,
        labelText: action.info.labelText,
        labelColor: action.info.labelColor,
        public: action.info.public
      };
    case projectTypes.GET_PROJECT_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou",
        confirmed: '',
        active: '',
        leader: '',
        id: '',
        name: '',
        oldName: '',
        username: '',
        picture: '',
        created: '',
        foundationYear: '',
        endDate: '',
        bio: '',
        purpose: '',
        spotifyUri: '',
        typeId: '',
        typeName: '',
        adminNote: '',
        currentlyOnTour: '',
        kind: '',
        genre1: '',
        genre2: '',
        genre3: '',
        country: '',
        region: '',
        city: '',
        labelShow: '',
        labelText: '',
        labelColor: '',
        public: ''
      };
    case projectTypes.GET_PROJECT_ADMINACCESS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_ADMINACCESS_SUCCESS:
      return {
        ...state,
        requesting: false,
        adminAccess: action.info.admin,
        confirmed: action.info.confirmed,
        active: action.info.active,
        leader: action.info.leader
      };
    case projectTypes.GET_PROJECT_ADMINACCESS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou",
        adminAccess: 0
      };
    case projectTypes.GET_PROJECT_MEMBERS_REQUEST:
      return {
        ...state,
        requesting: true,
        error: '',
        members: initialState.members
      };
    case projectTypes.GET_PROJECT_MEMBERS_SUCCESS:
      return {
        ...state,
        requesting: false,
        members: action.list,
      };
    case projectTypes.GET_PROJECT_MEMBERS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou",
        members: initialState.members
      };
    case projectTypes.RESET_PROJECT_MEMBERS:
      return {
        ...state,
        requesting: false,
        error: "",
        members: initialState.members
      };
    case projectTypes.GET_PROJECT_OPPORTUNITIES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_OPPORTUNITIES_SUCCESS:
      return {
        ...state,
        requesting: false,
        opportunities: action.list,
      };
    case projectTypes.GET_PROJECT_OPPORTUNITIES_FAILURE:
      return {
        ...state,
        requesting: false,
        opportunities: [
          {
            created: '',
            rolename: '',
            info: '',
            experienceLevel: '',
            experienceName: ''
          }
        ],
        //error: "A solicitação falhou"
      };
    case projectTypes.GET_PROJECT_NOTES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_NOTES_SUCCESS:
      return {
        ...state,
        requesting: false,
        notes: action.list,
      };
    case projectTypes.GET_PROJECT_NOTES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou",
        notes: initialState.notes
      };
    case projectTypes.GET_PROJECT_EVENTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_EVENTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        events: action.list,
      };
    case projectTypes.GET_PROJECT_EVENTS_FAILURE:
      return {
        ...state,
        requesting: false,
        events: initialState.events,
        error: "A solicitação falhou"
      };
    case projectTypes.GET_PROJECT_RELATED_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_RELATED_SUCCESS:
      return {
        ...state,
        requesting: false,
        relatedProjects: action.list,
      };
    case projectTypes.GET_PROJECT_RELATED_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou",
        relatedProjects: [
          {
            id: '',
            name: '',
            username: '',
            picture: ''
          }
        ]
      };
    default:
      return state
  }
}