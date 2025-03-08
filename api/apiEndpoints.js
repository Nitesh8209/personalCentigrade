import { API_BASE_URL } from "../tests/data/testData";

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
  getMethodologies: `${API_BASE_URL}/methodologies`
}

export default API_ENDPOINTS;
