import { Credentials } from "./testData";

export const loginTestCases = [
    {
        description: 'Login with valid credentials',
        email: Credentials.username,
        password: Credentials.password,
        expectedUrl: `projects`,
        expectedTokens: true,
        expectedStatus: 200,
        isValidUsername: true,
    },
    {
        description: 'Login with Uppercase Email',
        email: Credentials.username.toUpperCase(),
        password: Credentials.password,
        expectedUrl: `projects`,
        expectedTokens: true,
        expectedStatus: 200,
        isValidUsername: true,
    },
    {
        description: 'Login with Invalid username',
        email: 'invalidUsername',
        password: Credentials.password,
        expectedUrl: `login`,
        expectedTokens: false,
        expectedStatus: 400,
        isValidUsername: false,
    },
    {
        description: 'Login with Invalid password',
        email: Credentials.username,
        password: 'invalidPassword',
        expectedUrl: `login`,
        expectedTokens: false,
        expectedStatus: 400,
        isValidUsername: true,
    },
    {
        description: 'Login with Invalid username and password',
        email: 'invalidUsername',
        password: 'invalidPassword',
        expectedUrl: `login`,
        expectedTokens: false,
        expectedStatus: 400,
        isValidUsername: false,
    },
];

export const publishProjectData = [
    {
        description: 'project Details',
        action: 'projectDetails',
        uploadFile: true,
    },
    {
        description: 'project Approach',
        action: 'projectApproach',
        uploadFile: true
    },
    {
        description: 'location Details',
        action: 'locationDetails',
        uploadFile: true
    },
    {
        description: 'disclosures',
        action: 'disclosures',
        uploadFile: false
    },
    {
        description: 'organization Overview',
        action: 'organizationOverview',
        uploadFile: true
    },
    {
        description: 'Involuntary displacement',
        action: 'Involuntarydisplacement',
        uploadFile: true
    },
    {
        description: 'Stakeholder Identification',
        action: 'StakeholderIdentification',
        uploadFile: true
    },
    {
        description: 'Stakeholder Consultation',
        action: 'StakeholderConsultation',
        uploadFile: false
    },
    {
        description: 'Stakeholder Engagement',
        action: 'StakeholderEngagement',
        uploadFile: true
    },
    {
        description: 'Benefit Sharing',
        action: 'BenefitSharing',
        uploadFile: true
    },
    {
        description: 'Equity And social Inclusion',
        action: 'EquityAndsocialInclusion',
        uploadFile: false
    },
    {
        description: 'Air',
        action: 'Air',
        uploadFile: false
    },
    {
        description: 'Biodiversity and soil',
        action: 'Biodiversityandsoil',
        uploadFile: false
    },
    {
        description: 'water',
        action: 'water',
        uploadFile: true
    }
];

export const forecastData = [
    {
        description: 'Project eligibility requirements',
        action: 'projectEligibilityRequirements',
        uploadFile: true
    },
    {
        description: 'Baseline scenario',
        action: 'baselineScenario',
        uploadFile: false
    },
    {
        description: 'Net Present Value',
        action: 'netPresentValue',
        uploadFile: false
    },
    {
        description: 'Project Design',
        action: 'projectDesign',
        uploadFile: false
    },
    {
        description: 'Spatial Boundaries',
        action: 'spatialBoundaries',
        uploadFile: true
    },
    {
        description: 'System Boundaries',
        action: 'systemBoundaries',
        uploadFile: false
    },
    {
        description: 'carbon Stock Summary',
        action: 'carbonStockSummary',
        uploadFile: false
    },
    {
        description: 'leakage Estimates',
        action: 'leakageEstimates',
        uploadFile: true
    },
    {
        description: 'uncertainty Deduction Estimates',
        action: 'uncertaintyDeductionEstimates',
        uploadFile: true
    },
    {
        description: 'buffer Estimates',
        action: 'bufferEstimates',
        uploadFile: true
    },
    {
        description: 'forecasted Credits',
        action: 'forecastedCredits',
        uploadFile: false
    },
    {
        description: 'monitoring Approach',
        action: 'monitoringApproach',
        uploadFile: true
    },
    {
        description: 'durability',
        action: 'durability',
        uploadFile: false
    },
    {
        description: 'Additionality',
        action: 'Additionality',
        uploadFile: false
    },
    {
        description: 'Validation',
        action: 'Validation',
        uploadFile: true
    },
]

export const actualsData = [
    {
        description: 'ProjectandMRUpdates',
        action: 'ProjectandMRUpdates',
        uploadFile: false
    },
    {
        description: 'actualsDurability',
        action: 'actualsDurability',
        uploadFile: false
    },
    // {
    //     description: 'actuals carbon Stock Summary',
    //     action: 'actualscarbonStockSummary',
    //     uploadFile: true,
    // },
    {
        description: 'Leakage actuals',
        action: 'actualsLeakageactuals',
        uploadFile: false,
    },
    {
        description: 'Uncertainty actuals',
        action: 'actualsUncertaintyactuals',
        uploadFile: false
    },
    {
        description: 'Bufferactuals',
        action: 'Bufferactuals',
        uploadFile: false,
    },
    // {
    //     description: 'actuals',
    //     action: 'actuals',
    //     uploadFile: true,
    // },
    {
        description: 'actuals Verification',
        action: 'actualsVerification',
        uploadFile: true,
    },
    {
        description: 'actuals Creditsales',
        action: 'actualsCreditsales',
        uploadFile: false,
    },
]

export const EnhancementsData =[
    {
        description: 'Key differentiators',
        action: 'Keydifferentiators',
        uploadFile: false,
    },
    {
        description: 'Sustainable development goals',
        action: 'Sustainabledevelopmentgoals',
        uploadFile: false,
    },
]
