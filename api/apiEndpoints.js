export const API_BASE_URL = 'https://devapi.centigrade.earth';

export const API_ENDPOINTS = {
  authTOken: `${API_BASE_URL}/auth/token`,
  resetPassword: `${API_BASE_URL}/auth/reset/password`,
  onboardSignup: `${API_BASE_URL}/auth/onboard/signup`,
  onboardVerify: `${API_BASE_URL}/auth/onboard/verify`,
  onboardResend: `${API_BASE_URL}/auth/onboard/resend`,
  onboardInvite: `${API_BASE_URL}/auth/onboard/invite`,
  onboardApprove: `${API_BASE_URL}/auth/onboard/approve`,
  getMember: `${API_BASE_URL}/member`,
  getMemberOrganizationTypes: `${API_BASE_URL}/member-organization-types`,
  organization: `${API_BASE_URL}/organization`
}

export default API_ENDPOINTS;