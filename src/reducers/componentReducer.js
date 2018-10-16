import * as types from '../constants/actionTypes';
import { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
import exportFiles from '../utils/exportFiles.util.js';
import { pascalCase, maxDepth, findNewNode, updateNode, nodeExists, deleteNode, childrenLimitExceeded, countNodes } from '../utils/helperFunctions.util.js'
import saveProjectUtil from '../utils/saveProject.util.js';

const initialState = {
  treeData: [],
  addAsFirstChild: false,
  input: '',
  selectedComponent: {},
  initialTypeSelection: '',
  typeSelected: '',
  parentSelected: '',
  availableParents: [],
  changeNameInput: '',
  id: 0,
  statusPopupOpen: false, 
  statusPopupErrorOpen: false,
  saveProjectOpen: false,
  saveProjectErrorOpen: false,
  fileExportModalState: false,
  duplicateTitleErrorOpen: false,
  saveProjectSuccessOpen: false,
  drawerState: false,
  fileDownloadPath: '',
  phone: 'iphone-view',
  screen: 'iphone-screen column',
  logoSpin: true,
  userLoggedIn: false,
  displayName: '',
  uid: '',
  currentProject: {},
  modalStatus: false,
  modalAction: '',
  userProjects: [],
  projectNameInput: '',
  headerStatus: false,
  dropdownStatus: false,
  deleteTarget: '',
  deleteTargetUid: '',
  errMessage: ''
}
const componentReducer = (state = initialState, action) => {
  const copy = Object.assign({}, state);
  switch (action.type) {
    case types.SET_TREE:
        return {
          ...state,
          treeData: action.payload.length > 1 ? copy.treeData : action.payload
        }
    case types.SET_PARENT_NAME:
      return {
        ...state,
        input: action.payload
      }
    case types.ADD_PARENT:
      copy.treeData = state.treeData.slice()
      const parent = {
        title: pascalCase(copy.input) || "Untitled" + copy.id,
        subtitle: copy.initialTypeSelection || 'Switch',
        id: copy.id,
        headerStatus: false
      }
      copy.treeData.push(parent)
      const copyid = copy.id + 1;
    return {
      ...state,
      treeData: copy.treeData,
      input: '',
      id: copyid,
      selectedComponent: parent,
      headerStatus: false
    }
    case types.ADD_CHILD:
      const key1 = action.payload.key;
      const path1 = action.payload.path;
      const newTreeData = addNodeUnderParent({
        treeData: copy.treeData,
        parentKey: path1[path1.length - 1],
        expandParent: true,
        getNodeKey: key1,
        newNode: action.payload,
        addAsFirstChild: copy.addAsFirstChild,
      }).treeData;
      const newNode = findNewNode(copy.treeData, newTreeData);
      const isInvalidAdd = maxDepth(newTreeData) > 5
      || childrenLimitExceeded(newTreeData, "BottomTab", 5) 
      || childrenLimitExceeded(newTreeData, "Drawer", 10)

      return {
        ...state,
        treeData: isInvalidAdd ? copy.treeData : newTreeData,
        id: isInvalidAdd ? copy.id : copy.id + 1,
        selectedComponent: newNode,
        changeNameInput: newNode.title,
        typeSelected: newNode.subtitle,
      }
    case types.DELETE_COMPONENT:
      const node = action.payload
      const newTreeData2 = deleteNode(copy.treeData, node.id)
      if (!nodeExists(newTreeData2, copy.selectedComponent.id)) copy.selectedComponent = newTreeData2[0] || {title: null, subtitle: null, id: null}
      return {
        ...state,
        treeData: newTreeData2,
        selectedComponent: copy.selectedComponent,
        changeNameInput: copy.selectedComponent.title ? copy.selectedComponent.title : '',
        typeSelected: copy.selectedComponent.subtitle ? copy.selectedComponent.subtitle: ''
      }
    case types.SELECT_COMPONENT:
      return {
        ...state,
        selectedComponent: {...action.payload},
        changeNameInput: action.payload.title,
        typeSelected: action.payload.subtitle,
        headerStatus: action.payload.headerStatus
      }
      
    case types.SELECT_TYPE:
      return {
        ...state,
        typeSelected: action.payload
      }
    case types.SELECT_INITIAL_TYPE:
      return {
        ...state,
        initialTypeSelection: action.payload
      }
    case types.SELECT_PARENT:
      return {
        ...state,
        parentSelected: action.payload
      }
    case types.SET_NAME_TO_CHANGE:
      return {
        ...state,
        changeNameInput: action.payload
      }
    case types.UPDATE_NAME_AND_TYPE:
      const { title, subtitle, headerStatus, selectedComponent } = action.payload;
      copy.selectedComponent.headerStatus = headerStatus;
      copy.selectedComponent.subtitle = subtitle;
      copy.selectedComponent.title = title;
      const updated = updateNode(copy.treeData, title, subtitle, headerStatus, selectedComponent)
      return {
        ...state,
        treeData: updated,
        selectedComponent: copy.selectedComponent
      }
    case types.EXPORT_FILES:
      return state;
      
    case types.EXPORT_FILES_SUCCESS:
      return {
        ...state,
        statusPopupOpen: action.payload.status
      }
    case types.EXPORT_FILES_FAIL:
      return {
        ...state,
        statusPopupErrorOpen: action.payload.status,
        errMessage: action.payload.err.message
      }
    case types.CLOSE_STATUS_POPUP:
      
      return {
        ...state,
        statusPopupOpen: false, 
        statusPopupErrorOpen: false,
        saveProjectOpen: false,
        saveProjectErrorOpen: false,
        duplicateTitleErrorOpen: false,
        saveProjectSuccessOpen: false,
        errMessage: ''
      }
    case types.SAVE_PROJECT_SUCCESS:
      return {
        ...state,
        saveProjectOpen: action.payload.status,
      }
    case types.SAVE_PROJECT_FAIL:
      return {
        ...state,
        saveProjectErrorOpen: action.payload.status,
      }
    case types.TOGGLE_DUPS_ERROR_SNACKBAR:
      return {
        ...state,
        duplicateTitleErrorOpen: action.payload
      }
    case types.TOGGLE_SAVE_PROJECT_SNACKBAR:
      return {
        ...state,
        saveProjectSuccessOpen: action.payload
      }
    case types.OPEN_DRAWER:
      return {
        ...state,
        drawerState: !state.drawerState
      }

    case types.CLOSE_DRAWER:
      return {
        ...state,
        drawerState: false
      }

    case types.CHANGE_PHONE:
      return {
        ...state,
        phone: action.payload.phone,
        screen: action.payload.screen
      }
    
    case types.CHANGE_SCREEN:
      return {
        ...state,
        screen: action.payload
      }

    case types.TOGGLE_LOGO:
      return {
        ...state,
        logoSpin: copy.logoSpin? false: true
      }
    
    case types.SET_USER_DATA:
      return {
        ...state,
        displayName: action.payload.displayName,
        uid: action.payload.uid,
        userLoggedIn: true
      }

    case types.LOGOUT:
      return {
        ...state,
        userLoggedIn: copy.userLoggedIn? false: true,
        userProjects: [],
        treeData: []
      }

    case types.TOGGLE_MODAL:
      return {
        ...state,
        modalStatus: copy.modalStatus? false : true,
        modalAction: action.payload.use,
        deleteTarget: action.payload.project,
        deleteTargetUid: action.payload.uid
      }

    case types.RESET:
      return {
        ...initialState,
        userLoggedIn: copy.userLoggedIn? true: false,
        modalStatus: copy.modalStatus,
        userProjects: copy.userProjects,
        uid: copy.uid,
        displayName: copy.displayName
      }

    case types.SET_USER_PROJECTS:
      return {
        ...state,
        userProjects: [...action.payload]
      }
    
    case types.UPDATE_USER_PROJECTS:
      const updatedProjects = copy.userProjects
        .filter(project => project.projectName !== action.payload.projectName)
        .concat(action.payload);
      return {
        ...state,
        userProjects: updatedProjects
      }

    case types.CHANGE_PROJECT_NAME_INPUT:
      return {
        ...state,
        projectNameInput: action.payload
      }
    
    case types.ADD_USER_PROJECT:
      return {
        ...state,
        userProjects: [...copy.userProjects, action.payload],
        projectNameInput: '',
        currentProject: action.payload
      }

    case types.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload
      }

    case types.DELETE_PROJECT:
      const projectsAfterDeletion = copy.userProjects
      .filter(project => project.projectName !== action.payload)
      return {
        ...state,
        userProjects: projectsAfterDeletion,
        currentProject: copy.currentProject.projectName === action.payload ? '' : copy.currentProject,
        treeData: copy.currentProject.projectName === action.payload ? [] : copy.treeData
      }

    case types.TOGGLE_HEADER:
      copy.selectedComponent.headerStatus = !action.payload.headerStatus
      return {
        ...state,
        selectedComponent: copy.selectedComponent
      }
      
    case types.TOGGLE_DROPDOWN:
      return {
        ...state,
        dropdownStatus: copy.dropdownStatus? false : true
      }
    
    case types.SET_ID: 
      return {
        ...state,
        id: action.payload
      }
  
    default: 
      return state;
  }
}
export default componentReducer;