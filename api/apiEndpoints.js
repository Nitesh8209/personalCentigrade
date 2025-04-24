import { API_BASE_URL } from "../tests/data/testData";
import { getData } from "../tests/utils/apiHelper";

const {  projectId, draftProjectId } = getData('Api');

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
  getMethodologies: `${API_BASE_URL}/methodologies`,
  getPublic:`${API_BASE_URL}/public/project`,
  fileUpload: `${API_BASE_URL}/project/${draftProjectId}/file`,
  dataRoom: `${API_BASE_URL}/project/${draftProjectId}/room`,
  dataRooms: `${API_BASE_URL}/project/${draftProjectId}/rooms`,
  dataTable: `${API_BASE_URL}/project/${draftProjectId}/table`

}

export default API_ENDPOINTS;
