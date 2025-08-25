import { API_BASE_URL } from "../tests/data/testData";
import { getData } from "../tests/utils/apiHelper";

const {  projectId, draftProjectId } = getData('Api');
const { BuyerprojectId } = getData('UI');

export const API_ENDPOINTS = {
  authTOken: `${API_BASE_URL}/auth/token`,
  resetEmail: `${API_BASE_URL}/auth/reset/email`,
  resetPassword: `${API_BASE_URL}/auth/reset/password`,
  onboardSignup: `${API_BASE_URL}/auth/onboard/signup`,
  onboardVerify: `${API_BASE_URL}/auth/onboard/verify`,
  onboardResend: `${API_BASE_URL}/auth/onboard/resend`,
  onboardInvite: `${API_BASE_URL}/auth/onboard/invite`,
  onboardApprove: `${API_BASE_URL}/auth/onboard/approve`,
  getMember: `${API_BASE_URL}/member`,
  getMemberOrganizationTypes: `${API_BASE_URL}/member-organization-types`,
  organization: `${API_BASE_URL}/organization`,
  createProject: `${API_BASE_URL}/project`,
  modularbenefitproject: `${API_BASE_URL}/modular-benefit-project`,
  organizationtype: `${API_BASE_URL}/organization-types`,
  publicProject: `${API_BASE_URL}/public/projects`,
  getMethodologies: `${API_BASE_URL}/v2/methodologies`,
  getPublic:`${API_BASE_URL}/public/project`,
  fileUpload: `${API_BASE_URL}/project/${draftProjectId}/file`,
  dataRoom: `${API_BASE_URL}/project/${draftProjectId}/room`,
  dataRooms: `${API_BASE_URL}/project/${draftProjectId}/rooms`,
  dataTable: `${API_BASE_URL}/project/${draftProjectId}/table`,
  dataRoomUI: `${API_BASE_URL}/project/${BuyerprojectId}/room`,
  fileUploadUI: `${API_BASE_URL}/project/${BuyerprojectId}/file`,
  modularbenefitprojectguid: (guid) => `${API_BASE_URL}/v2/project/${guid}/modular-benefit-project`,
  createProjectguid: (guid) =>  `${API_BASE_URL}/v2/project/${guid}`,
  dataTableGuid: (guid) =>  `${API_BASE_URL}/v2/project/${guid}/table`,
  dataTablesGuid: (guid) =>  `${API_BASE_URL}/v2/project/${guid}/tables`,
  dataRoomGuid: (guid) =>  `${API_BASE_URL}/v2/project/${guid}/room`,
  dataRoomsGuid: (guid) =>  `${API_BASE_URL}/v2/project/${guid}/rooms`,
  fileUploadGuid: (guid) =>  `${API_BASE_URL}/v2/project/${guid}/file`
}

export default API_ENDPOINTS;
