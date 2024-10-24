export const ValidTestData = {
    firstName: "Nitesh",
    lastName: "Agarwal",
    organizationName: "SignupAutomation",
    Password: 'Centigrade@54321',
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