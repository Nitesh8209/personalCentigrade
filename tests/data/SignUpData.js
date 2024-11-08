export const ValidTestData = {
    firstName: "Nitesh",
    lastName: "Agarwal",
    organizationName: "SignupAutomation",
    Password: 'Centigrade@54321',
    newPassword: 'Centigrade@12345',
    InvalidPassword: '123456789',
    Invite: {
        firstName: "Nitesh10",
        lastName: "Agarwal",
        organizationName: "SignupAutomation",
        Password: 'Centigrade@54321',
    },
    Approve: [
        {
            description: 'Approve',
            reject: false,
            expectedSubject: 'Your account has been approved'
        },
        {
            description: 'Reject',
            reject: true,
            expectedSubject: 'Your account has not been approved'
        }
    ]
}

export const inValidTestData = {
    firstName: "Nitesh",
    lastName: "Agarwal",
    organizationName: 'Invalidorganization',
    existEmail: 'nitesh.agarwal@kreeti.com',
    InvalidEmail: 'invaliduser@gmail.com',
    NoMemberOrganizationEmail: 'nitesh.agarwalautomation+test13@gmail.com',
    // NoOrganizationId: 264,

    Verify: {
        verifiationCode: '658196',
        InvalidLengthPassword: 'Nit@5',
        UnverfiedEmail: 'nitesh.agarwal+test10@kreeti.com',
        InvalidPassword: '123456789',
        Password: 'Centigrade@54321',
        incorrectverifiationCode: '123456'
    },

    Password: 'Centigrade@54321',
    newfirstName: 'Nitesh',
    newlastName: "Agarwal",

}