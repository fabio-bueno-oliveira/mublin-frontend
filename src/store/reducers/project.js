import { projectTypes } from '../types/project';

const initialState = {
  requesting: false,
  requestingMembers: false,
  success: false,
  loggedUserIsAdmin: 0,
  loggedUserIsLeader: '',
  loggedUserIsConfirmed: '',
  loggedUserIsActive: '',
  id: '',
  name: '',
  oldName: '',
  username: '',
  picture: '',
  cover_image: '',
  created: '',
  foundationYear: '',
  endDate: '',
  bio: '',
  purpose: '',
  email: '',
  phone: '',
  instagram: '',
  spotifyId: '',
  soundcloud: '',
  typeId: '',
  typeName: '',
  adminNote: null,
  currentlyOnTour: '',
  kind: '',
  genre1: '',
  genre1Id: '',
  genre2: '',
  genre2Id: '',
  genre3: '',
  genre3Id: '',
  country: '',
  countryId: '',
  region: '',
  regionId: '',
  city: '',
  cityId: '',
  labelShow: '',
  labelText: '',
  labelColor: '',
  public: '',
  activityStatus: '',
  activityStatusId: '',
  activityStatusColor: '',
  website: '',
  members: [
    {
      idFk: '',
      id: '',
      joinedIn: '',
      leftIn: '',
      name: '',
      lastname: '',
      username: '',
      gender: '',
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
      founder: '',
      leader: '',
      touring: '',
      confirmed: ''
    }
  ],
  opportunities: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        created: '',
        rolename: '',
        info: '',
        experienceLevel: '',
        experienceName: ''
      }
    ]
  },
  notes: {
    total: 0,
    success: false,
    result: [
      {
        id: '',
        note: '',
        created: '',
        authorUsername: '',
        authorName: '',
        authorLastname: '',
        authorPicture: ''
      }
    ]
  },
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
        success: false,
        id: '',
        name: '',
        oldName: '',
        username: '',
        picture: '',
        cover_image: '',
        created: '',
        foundationYear: '',
        endDate: '',
        bio: '',
        purpose: '',
        email: '',
        phone: '',
        instagram: '',
        spotifyId: '',
        soundcloud: '',
        typeId: '',
        typeName: '',
        adminNote: null,
        currentlyOnTour: '',
        kind: '',
        genre1: '',
        genre1Id: '',
        genre2: '',
        genre2Id: '',
        genre3: '',
        genre3Id: '',
        country: '',
        countryId: '',
        region: '',
        regionId: '',
        city: '',
        cityId: '',
        labelShow: '',
        labelText: '',
        labelColor: '',
        public: '',
        activityStatus: '',
        activityStatusId: '',
        activityStatusColor: '',
        website: ''
      };
    case projectTypes.GET_PROJECT_INFO_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        id: action.info.id,
        name: action.info.name,
        oldName: action.info.oldName,
        username: action.info.username,
        picture: action.info.picture,
        cover_image: action.info.cover_image,
        created: action.info.created,
        foundationYear: action.info.foundationYear,
        endDate: action.info.endDate,
        bio: action.info.bio,
        purpose: action.info.purpose,
        email: action.info.email,
        phone: action.info.phone,
        instagram: action.info.instagram,
        spotifyId: action.info.spotifyId,
        soundcloud: action.info.soundcloud,
        typeId: action.info.typeId,
        typeName: action.info.typeName,
        adminNote: action.info.adminNote,
        currentlyOnTour: action.info.currentlyOnTour,
        kind: action.info.kind,
        genre1: action.info.genre1,
        genre1Id: action.info.genre1Id,
        genre2: action.info.genre2,
        genre2Id: action.info.genre2Id,
        genre3: action.info.genre3,
        genre3Id: action.info.genre3Id,
        country: action.info.country,
        countryId: action.info.countryId,
        region: action.info.region,
        regionId: action.info.regionId,
        city: action.info.city,
        cityId: action.info.cityId,
        labelShow: action.info.labelShow,
        labelText: action.info.labelText,
        labelColor: action.info.labelColor,
        public: action.info.public,
        activityStatus: action.info.activityStatus,
        activityStatusId: action.info.activityStatusId,
        activityStatusColor: action.info.activityStatusColor,
        website: action.info.website,
      };
    case projectTypes.GET_PROJECT_INFO_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        id: '',
        name: '',
        oldName: '',
        username: '',
        picture: '',
        cover_image: '',
        created: '',
        foundationYear: '',
        endDate: '',
        bio: '',
        purpose: '',
        email: '',
        phone: '',
        instagram: '',
        spotifyId: '',
        soundcloud: '',
        typeId: '',
        typeName: '',
        adminNote: '',
        currentlyOnTour: '',
        kind: '',
        genre1: '',
        genre1Id: '',
        genre2: '',
        genre2Id: '',
        genre3: '',
        genre3Id: '',
        country: '',
        countryId: '',
        region: '',
        regionId: '',
        city: '',
        cityId: '',
        labelShow: '',
        labelText: '',
        labelColor: '',
        public: '',
        activityStatus: '',
        activityStatusId: '',
        activityStatusColor: '',
        website: ''
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
        loggedUserIsAdmin: action.info.admin,
        loggedUserIsConfirmed: action.info.confirmed,
        loggedUserIsActive: action.info.active,
        loggedUserIsLeader: action.info.leader
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
        requestingMembers: true,
        error: '',
        members: initialState.members
      };
    case projectTypes.GET_PROJECT_MEMBERS_SUCCESS:
      return {
        ...state,
        requestingMembers: false,
        members: action.list,
      };
    case projectTypes.GET_PROJECT_MEMBERS_FAILURE:
      return {
        ...state,
        requestingMembers: false,
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
        requesting: true,
        opportunities: initialState.opportunities,
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
        opportunities: initialState.opportunities,
        //error: "A solicitação falhou"
      };
    case projectTypes.GET_PROJECT_NOTES_REQUEST:
      return {
        ...state,
        requesting: true,
        notes: initialState.notes
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
    case projectTypes.GET_PROJECT_ALLEVENTS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case projectTypes.GET_PROJECT_ALLEVENTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        events: action.list,
      };
    case projectTypes.GET_PROJECT_ALLEVENTS_FAILURE:
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