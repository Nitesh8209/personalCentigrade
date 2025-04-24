export const project = {
  projectName: "Automation Api Project",
  uiProjectName: "Automation new Ui Project",
  buyerProject: 'Automation Buyer Project'
};

export const authStates = [
    { isAuthenticated: false, name: "Unauthenticated" },
    { isAuthenticated: true, name: "Authenticated" }
  ];

export const methodologyOptions = [
    'ACR Improved Forest Management (IFM) on Non-Federal U.S. Forestlands v1.3',
    'ACR Improved Forest Management (IFM) on Non-Federal U.S. Forestlands v2.0',
    'Biochar methodology agnostic',
    'CLEAR Methodology for Cooking Energy Transitions',
    'DAC methodology agnostic',
    'Gold standard Methodology for Metered and Measured Energy Cooking Devices v1.2',
    'Gold standard Technologies and Practices to Displace Decentralized Thermal Energy Consumption (TPDDTEC)',
    'Leak detection and repair in gas production, processing, transmission, storage and distribution systems and in refinery facilities Version 4.0.0',
    'Puro Geologically Stored Carbon Edition 2024',
    'Puro Standard Biochar Methodology Edition 2022 v3',
    'Puro Standard Enhanced Rock Weathering v2',
    'QA use only frozen ACR 1.3 test methodology',
    'VM0045 Methodology for Improved Forest Management v1.1',
    'VM0047 Afforestation, Reforestation, and Revegetation, v1.0',
    'Other methodology agnostic'
  ];

  export const projectScaleOptions = [
    'Micro (less than 1000 tCO2e)',
    'Small (1000 - 10000 tCO2e)',
    'Medium (10000 - 100000 tCO2e)',
    'Large (100000+ tCO2e)',
    'Unknown'
  ];

  export const classificationCategoryOptions = [
    'Carbon avoidance',
    'Carbon reduction',
    'Carbon removal',
    'Undefined'
  ];

  export const classificationMethodOptions = [
    'Natural - The activity claim uses natural methods (e.g. IFM)',
    'Technological - The activity claim uses technology (e.g. DAC)',
    'Both: Natural and Technological - The activity claim uses both natural and technology methods (e.g. BECCS)'
  ];

export const projectApproach = {
    items: [
        { keyName: "projectMission", value: "test" },
        { keyName: "projectSummary", value: "test" },
        { keyName: "projectActivities", value: "Test project Activities"},
        { keyName: "projectStartYear", value: "2012" },
        { keyName: "projectEndYear", value: "2020" },
        { keyName: "creditStart", value: "2013" },
        { keyName: "creditEnd", value: "2021" },
        { keyName: "projectStatus", value: "Under development" },
        { keyName: "creditIssuer", value: "Gold Standard" },
        { keyName: "countries", value: '["GB","IN"]' },
        { keyName: "conflictAreas", value: "Yes" },
        { keyName: "laborChildren", value: "Yes" },
        { keyName: "laborChildDevelopment", value: '["National laws"]' },
        { keyName: "laborWorkersRights", value: "Yes" },
        { keyName: "nationalLawsCompliance", value: "Yes" },
        { keyName: "carbonIssuing", value: "Yes" },
        { keyName: "carbonRegistration", value: "Yes" },
        { keyName: "carbonRejection", value: "Yes" }
    ]
};

export const remainingFields = {
    items: [
    { keyName: "testRichText", value: "Test Rich Test" },
    { keyName: "datePickerTest", value: "2024-09-12"},
    { keyName: "links", value: "Link" },
    { keyName: "projectTimeline", value: "No" },
    { keyName: "termLength", value: "5" },
    { keyName: "enhancementSelect", value: "[\"ICVCM CCP Label\"]" },
    { keyName: "standardVersion", value: "v6" },
    { keyName: "projectRegistryLink", value: "https://devfoundry.centigrade.earth/projects" },
    { keyName: "projectRegistryID", value: "ID567" },
    { keyName: "approachComments", value: "[\"ICVCM CCP Label\"]" },
        { keyName: "conflictMoreInfo", value: "test" },
        { keyName: "locationComments", value: "test" },
        { keyName: "organizationClassification", value: "501(c)(3)" },
        { keyName: "ownershipStructure", value: "No structure" },
        { keyName: "governanceStructure", value: "test" },
        { keyName: "organizationIncorporation", value: "kolkata" },
        { keyName: "organizationIncorporationCountry", value: '["IN"]' },
        { keyName: "organizationHeadquarters", value: "tests" },
        { keyName: "projectEmployees", value: "25" },
        { keyName: "projectLandowners", value: "2" },
        { keyName: "organizationFoundingYear", value: "2010" },
        { keyName: "organizationOperationYears", value: "2013" },
        { keyName: "organizationExperiencePathway", value: "1" },
        { keyName: "organizationExperienceProjects", value: "1" },
        { keyName: "organizationExperienceDetails", value: "test" },
        { keyName: "totalProjectsIssued", value: "Tests" },
        { keyName: "laborComments", value: "No comments" },
        { keyName: "communityFrameworks", value: "test" },
        { keyName: "parisCompliance", value: "Yes" },
        { keyName: "carbonAuthorization", value: "Yes, I have a government concession" },
        { keyName: "carbonConservationContract", value: "Yes" },
        { keyName: "timber", value: "Private industrial" },
        { keyName: "carbonIssuingYes", value: "test" },
        { keyName: "carbonRegistrationYes", value: "test" },
        { keyName: "carbonRejectionYes", value: "test" },
        { keyName: "economicDisplacementExplain", value: "test" },
        { keyName: "economicDisplacementPlan", value: "Yes" },
        { keyName: "economicDisplacementDetails", value: "test" },
        { keyName: "physicalDisplacementExplain", value: "test" },
        { keyName: "physicalMitigation", value: "Yes" },
        { keyName: "physicalMitigationDetails", value: "test" },
        { keyName: "communityDescription", value: "test" },
        { keyName: "stakeholderIdentificationProcess", value: "test" },
        { keyName: "communityImpactDetails", value: "test" },
        { keyName: "stakeholderConsultationActual", value: "Yes" },
        { keyName: "consultationDetails", value: "test" },
        { keyName: "deiConsult", value: "Yes" },
        { keyName: "deiGroup", value: "[\"Women\"]" },
        { keyName: "deiIConsultDetails", value: "test" },
        { keyName: "deiPositiveImpacts", value: "test" },
        { keyName: "deiRiskDetails", value: "test" },
        { keyName: "womenEmpowerment", value: "Yes" },
        { keyName: "exploitation", value: "Yes" },
        { keyName: "deiGenderConsultations", value: "Yes" },
        { keyName: "womenRights", value: "Yes" },
        { keyName: "deiMonitoringPlan", value: "test" },
        { keyName: "communityExists", value: "Yes" },
        { keyName: "communityConsultation", value: "Yes" },
        { keyName: "landRightsRec", value: "Yes" },
        { keyName: "carbonContractLength", value: "test" },
        { keyName: "contractPublic", value: "test" },
        { keyName: "contractPenalty", value: "test" },
        { keyName: "specialMeasureDetails", value: "test" },
        { keyName: "grievance", value: "Yes" },
        { keyName: "grievanceReport", value: "Yes" },
        { keyName: "grievanceDate", value: "2010" },
        { keyName: "grievanceDetails", value: "Yes" },
        { keyName: "benefitSharing", value: "Yes" },
        { keyName: "benefitSharingExplanation", value: "test" },
        { keyName: "benefitSharingCommunities", value: "Yes" },
        { keyName: "compensationType", value: '["Monetary incentives - Community funds"]' },
        { keyName: "iplcOwnershipPercent", value: "80" },
        { keyName: "compensationPercent", value: "90" },
        { keyName: "airMonitoringPlan", value: "Yes" },
        { keyName: "airMonitoringDomains", value: '["Indoor air pollution"]' },
        { keyName: "airMonitoringDescription", value: "test" },
        { keyName: "airMonitoringBaseline", value: "Yes" },
        { keyName: "airBaselineDescription", value: "test" },
        { keyName: "waterLocalDetails", value: "test" },
        { keyName: "waterImpact", value: "Yes" },
        { keyName: "waterStewardship", value: '["Land conservation and restoration - Land conservation (protection and preservation)"]' },
        { keyName: "expectedWaterImpacts", value: '["Project impacts water quality"]' },
        { keyName: "ecosystemBiome", value: "[\"Tropical-subtropical forests\"]" },
        { keyName: "biomeDescription", value: "test" },
        { keyName: "ecosystemCategorization", value: '["Collapsed"]' },
        { keyName: "biomeRiskCategory", value: "test" },
        { keyName: "biodiversityMonitoring", value: "Yes" },
        { keyName: "biodiversityImpactDrivers", value: "test" },
        { keyName: "baselineBiodiversity", value: "Yes" },
        { keyName: "biodiversityMonitoringProcess", value: "test" },
        { keyName: "threatenedSpecies", value: "test" },
        { keyName: "biodiversityLegal", value: "test" },
        { keyName: "soilEffects", value: "test" },
        { keyName: "stakeholderEngagementDetails", value: "test" },
        { keyName: "waterMonitoringPlan", value: "Yes" },
        { keyName: "waterMonitorIntention", value: "test" },
        { keyName: "waterMonitoringFrequency", value: "test" },
        { keyName: "waterBaselineCondition", value: "Yes" },
        { keyName: "waterBaselineDescription", value: "test" },
    { keyName: "locationDetailsType", value: "Address or city location" },
 { keyName: "addressLocation", value: "[\"Kolkata\"]" },
{ keyName: "projectLocationACR", value: "Single location or installation" },
{ keyName: "organizationHeadquartersCountry", value: "[\"IN\"]" },
{ keyName: "orgMission", value: "test" },
{ keyName: "parisCompliance", value: "Yes" },
    
        { keyName: "commercialHarvesting", value: "Yes" },
        { keyName: "nonCommercial", value: "Yes" },
        { keyName: "commercial", value: "[\"Be certified by FSC, SFI, or ATFS or become certified within one year of the project start date\"]" },
        { keyName: "updateProcedure", value: "test" },
        { keyName: "qaQc", value: "test" },
        { keyName: "inventoryAnalysis", value: "test" },
        { keyName: "stratification", value: "Yes" },
        { keyName: "stratificationProcedure", value: "test" },
        { keyName: "growthYield", value: "test" },
        { keyName: "ertCalculation", value: "test" },
        { keyName: "baselineHarvest", value: "test" },
        { keyName: "baselineLegal", value: "test" },
        { keyName: "baselineManagement", value: "test" },
        { keyName: "discountOnePointThree", value: "6%" },
        { keyName: "projectCostAssumptions", value: "test" },
        { keyName: "projectRevenueAssumptions", value: "test" },
        { keyName: "npvCalculationOverview", value: "test" },
        { keyName: "projectActivityVerra", value: "test" },
        { keyName: "projectHarvest", value: "test" },
        { keyName: "deviations", value: "test information about methodology deviations" },
        { keyName: "sensitiveInformation", value: "test about the commercially sensitive information" },
        { keyName: "acreage", value: "test" },
        { keyName: "descriptionGeo", value: "test" },
        { keyName: "climacticZoneACR", value: "test" },
        { keyName: "ecosystemACR", value: "test" },
        { keyName: "pestsACR", value: "test" },
        { keyName: "landUseACR", value: "test" },
        { keyName: "priorConditionsACR", value: "test" },
        { keyName: "baselineComments", value: "test Forecasted baseline and project carbon stocks overview" },
        { keyName: "biomassEstimation", value: "Generalized allometric regression" },
        { keyName: "leakageEstimatesConditional", value: "Yes" },
        { keyName: "leakageComments", value: "test" },
        { keyName: "uncertaintyEstimatesConditional", value: "Yes" },
        { keyName: "uncertaintyComments", value: "test" },
        { keyName: "bufferEstimatesConditional", value: "Yes" },
        { keyName: "nonPermanenceTool", value: "No" },
        { keyName: "bufferComments", value: "test" },
        { keyName: "forecastConditional", value: "Yes" },
        { keyName: "totalForecast", value: "5" },
        { keyName: "forecastComments", value: "test" },
        { keyName: "monitoringPlan", value: "test MRV protocol and monitoring plan overview" },
        { keyName: "dataParameters", value: "test Parameters monitored" },
        { keyName: "dataProcess", value: "test Data processing and storage procedures" },

        { keyName: "mrvEnv", value: "Environmental Factor"},
        { keyName: "permanenceNumber", value: "10-100 years" },
        { keyName: "carbonStorageDetails", value: "test" },
        { keyName: "reversalRiskOther", value: "test" },
        { keyName: "riskManagementPlan", value: "Yes" },
        { keyName: "riskPlan", value: "test" },
        { keyName: "durabilityInsurance", value: '["\Insurance\", "\None\"]' },
        { keyName: "insuranceOwner", value: "test" },
        { keyName: "additionalityApproachUsed", value: "[\"First-of-its-kind\",\"Financial additionality\"]" },
        { keyName: "validationAdditionality", value: "Yes" },
        { keyName: "validationAdditionalityThirdParty", value: "test" },
        { keyName: "firstOfItsKind", value: "Yes" },
        { keyName: "firstOfItsKindAnalysis", value: "test" },
        { keyName: "initialAdditionality", value: "Yes" },
        { keyName: "investmentMethod", value: "[\"Simple cost analysis\"]" },
        { keyName: "simpleCostAdditionality", value: "Yes" },
        { keyName: "simpleCostAnalysis", value: "2000 lac" },
        { keyName: "projectRevenues", value: "1000 lac" },
        { keyName: "costs", value: "100 lac" },
        { keyName: "projectValidation", value: "Yes" },
        { keyName: "validationPlanned", value: "Yes" },
        { keyName: "validationPlannedDate", value: "20-11-2020" },
        { keyName: "validationDate", value: "20-11-2024" },

        { keyName: "validationReportSummary", value: "test" },
        { keyName: "validationBody", value: "test Validation body" },
        { keyName: "removalProcess", value: "[\"Land-based biological\"]" },
        { keyName: "storageType", value: "[\"Terrestrial\"]" },
 { keyName: "validationBodySelection", value: "Carbon standard or registry approved" },
 { keyName: "validationBodyAccreditation", value: "[\"ANSI National Accreditation Board (ANAB)\"]" },
 { keyName: "validationBodySectoralScopes", value: "[\"2. Energy distribution\"]" },
 { keyName: "harvests", value: "Yes" },
 { keyName: "ifmHarvestEvidence", value: "Yes" },
 { keyName: "disturbances", value: "Yes" },
 { keyName: "stratificationUpdates", value: "test" },
 { keyName: "mrvProtocol", value: "Yes" },
 { keyName: "mrvProvider", value: "test" },
 { keyName: "mrvResultsLinks", value: "test" },
 { keyName: "reversalEvent", value: "Yes" },
 { keyName: "reversalEventType", value: "[\"Natural causes\"]" },
 { keyName: "reversalEventTypeOther", value: "test" },
 { keyName: "reversalEventStatus", value: "In process" },
 { keyName: "reversal", value: "Yes" },
 { keyName: "compensation", value: "Yes" },
 { keyName: "compensationMechanismDescription", value: "test" },
 { keyName: "leakageActualsConditional", value: "Yes" },
 { keyName: "marketLeakageOptions", value: "Default values" },
 { keyName: "leakageMonitor", value: "Yes" },
 { keyName: "activityLeakageAdditional", value: "test" },
 { keyName: "bufferActualsConditional", value: "Yes" },
 { keyName: "additionalCommentsBuffer", value: "test" },
 { keyName: "verification", value: "Yes" },
 { keyName: "verificationSame", value: "Yes" },
 { keyName: "verificationResampling", value: "Yes" },
 { keyName: "creditSalesStage", value: "[\"Spot\",\"Offtake agreement\"]" },
 { keyName: "verificationReportSummary", value: "test" },
 { keyName: "carbonCreditBuyer", value: "test" },
 { keyName: "creditSalesComments", value: "test" },
 { keyName: "estimatedPriceMin", value: "10000" },
 { keyName: "estimatedPriceMax", value: "400000" },
 
 { keyName: "kd1Title", value: "test1" },
        { keyName: "kd1Details", value: "test1 details" },
        { keyName: "kd2Title", value: "test2" },
        { keyName: "kd2Details", value: "test2 details" },
        { keyName: "kd3Title", value: "test3" },
        { keyName: "kd3Details", value: "test3 details" },
        { keyName: "sdgVerification", value: "Yes" },
        { keyName: "sdgVerificationBody", value: "test verification body" }
]}

export const FileType = [
    { configFieldId: 1854 , projectFileType: "displayImage"},
    { configFieldId: 7 , projectFileType: "projectMedia"},
    { configFieldId: 1840 , projectFileType: "additionalCertificationUpload"},
    { configFieldId: 586 , projectFileType: "pdd"},
    { configFieldId: 790 , projectFileType: "organizationStructureUpload"},
    { configFieldId: 28 , projectFileType: "laborUpload"},
    { configFieldId: 35 , projectFileType: "parisLetter"},
    { configFieldId: 613 , projectFileType: "carbonCreditOwnership"},   
    { configFieldId: 33 , projectFileType: "carbonUpload"},
    { configFieldId: 30 , projectFileType: "economicDisplacementPlanEvidence"},
    { configFieldId: 595 , projectFileType: "physicalUpload"},
    { configFieldId: 668 , projectFileType: "expectedImpactsDocument"},
    { configFieldId: 669 , projectFileType: "consultationDocuments"},
    { configFieldId: 608 , projectFileType: "grievanceSupport"},
    { configFieldId: 591 , projectFileType: "benefitUpload"},
    { configFieldId: 1335 , projectFileType: "ownershipSummaryDocumentation"},
    { configFieldId: 509 , projectFileType: "forestManagement"},
    { configFieldId: 520 , projectFileType: "harvestsUpload"},
    { configFieldId: 1793 , projectFileType: "stratificationDoc"},
    { configFieldId: 576 , projectFileType: "previousOwnership"},
    { configFieldId: 474 , projectFileType: "sop"},
    { configFieldId: 574 , projectFileType: "silviculturalDocuments"},
    { configFieldId: 560 , projectFileType: "npvWorkbook"},
    { configFieldId: 614 , projectFileType: "generalDocumentUploac"},
    { configFieldId: 481 , projectFileType: "uploadGeo"},
    { configFieldId: 74 , projectFileType: "baselineForecastWorkbook"},
    { configFieldId: 640 , projectFileType: "projectForecastWorkbook"},
    { projectFileType: 80 , projectFileType: "leakageForecastWorkbook"},
    { configFieldId: 88 , projectFileType: "uncertaintyForecastWorkbook"},
    { configFieldId: 85 , projectFileType: "forecastWorkbook"},
    { configFieldId: 641 , projectFileType: "monitoringWorkbook"},
    { configFieldId: 1228 , projectFileType: "riskSummaryUpload"},
    { configFieldId: 164 , projectFileType: "riskManagementPlanUpload"},
    { configFieldId: 758 , projectFileType: "insuranceEvidence"},
    { configFieldId: 814 , projectFileType: "firstOfItsKindUpload"},
    { configFieldId: 135 , projectFileType: "additionalityDemonstration"},
    { configFieldId: 819 , projectFileType: "simpleCostUpload"},
    { configFieldId: 512 , projectFileType: "validationUpload"},
    { configFieldId: 1017 , projectFileType: "ifmHarvestEvidence"},
    { configFieldId: 523 , projectFileType: "disturbancesUpload"},
    { configFieldId: 479 , projectFileType: "stratificationUpdatesDoc"},
    { configFieldId: 619 , projectFileType: "mrvResultsDocs"},
    { configFieldId: 156 , projectFileType: "reversalEventTypeLink"},
    { configFieldId: 158 , projectFileType: "reversalEventStatusLink"},
    { configFieldId: 162 , projectFileType: "compensationDetails"},
    { configFieldId: 643 , projectFileType: "projectWorkbook"},
    { configFieldId: 536 , projectFileType: "marketLeakageUpload"},
    { configFieldId: 665 , projectFileType: "projectActualsACR"},
    { configFieldId: 528 , projectFileType: "verificationUpload"},
    { configFieldId: 740 , projectFileType: "kd1Media"},
    { configFieldId: 743 , projectFileType: "kd2Media"},
    { configFieldId: 746 , projectFileType: "kd3Media"},
    { configFieldId: 639 , projectFileType: "sdgUpload"},
    { configFieldId: 1001 , projectFileType: "sdgVerificationEvidence"},
]


export const forcastData = {
    items: [
    ]
}

export const dataSeries = [
    {
        indexOrder: 0,
        name: "baselineNPV",
        notes: "Discounted cash flow in the baseline scenario (USD)s",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "900"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "projectNPV",
        notes: "Discounted cash flow in the baseline scenario (USD)s",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "900"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "estimatedBaseline",
        notes: "Estimated baseline carbon stocks",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "900"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "estimatedProjectStocks",
        notes: "Estimated project carbon stocks",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "800"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "1000"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "1000"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "1200"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "estimatedLeakage",
        notes: "Estimated leakage carbon quantities in tCO2e",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "40"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "50"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "40"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "10"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "estimatedLeakageFactor",
        notes: "Estimated leakage factor (%)",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "4"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "6"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "7"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "4"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "8"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "7"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "5"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "estimatedUncertanityCarbon",
        notes: "Estimated uncertainty carbon quantities in tCO2e",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "150"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "600"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "estimatedUncertanityTotal",
        notes: "Estimated total uncertainty (%)",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "8"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "18"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "28"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "30"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "acrBufferEstimated",
        notes: "Estimated buffer carbon quantities in tCO2e",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "150"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "600"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "acrBufferRiskEstimated",
        notes: "Overall estimated risk category %",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "8"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "18"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "28"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "30"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "actualProjectStocks",
        notes: "Actual project carbon stocks",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "400"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "actualLiveCarbonBsl",
        notes: "Actual live tree carbon",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "40"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "50"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "40"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "50"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "20"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "actualDeadCarbonBsl",
        notes: "Actual dead wood carbon",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "18"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "14"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "10"
            }
        ]
    },
    {
        indexOrder: 2,
        name: "actualHwpBsl",
        notes: "Actual harvested wood products",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "35"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "35"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "35"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "15"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "actualLeakageCarbonBiochar",
        notes: "Actual leakage carbon quantities in tCO2e",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "400"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "acrBufferActual",
        notes: "Actual buffer carbon quantities in tCO2e",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "400"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "acrBufferRiskActual",
        notes: "Overall actual risk category %",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "40"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "20"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "actualNetReductionsRemovals",
        notes: "Actual net reductions and removals in tCO2e",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "8"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "15"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "8"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "26"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "24"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "15"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "actualGrossReductions",
        notes: "Actual emissions reductions (pre-buffer deduction)",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "400"
            }
        ]
    },{
        indexOrder: 2,
        name: "actualGrossRemovals",
        notes: "Actual emissions removals (pre-buffer deduction)",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "400"
            }
        ]
    },{
        indexOrder: 1,
        name: "actualGrossRemovalsReductions",
        notes: "Actual emissions reductions and removals (pre-buffer deduction)",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "100"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "200"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "300"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "400"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "500"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "700"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "600"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "400"
            }
        ]
    },
    {
        indexOrder: 0,
        name: "creditsSold",
        notes: "Issued - sold",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "7"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "18"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "19"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "26"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "37"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "28"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "50"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "47"
            }
        ]
    },
    {
        indexOrder: 1,
        name: "creditsAvailable",
        notes: "Issued - available",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "29"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "27"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "16"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "30"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "39"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "38"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "35"
            }
        ]
    },
    {
        indexOrder: 2,
        name: "creditsForward",
        notes: "Forwards - sold",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "10"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "26"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "29"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "39"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "58"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "49"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "50"
            }
        ]
    },
    {
        indexOrder: 3,
        name: "exAnteAvailable",
        notes: "Forwards - available",
        seriesData: [
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2013",
                indexOrder: 2013,
                value: "9"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2014",
                indexOrder: 2014,
                value: "25"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2015",
                indexOrder: 2015,
                value: "23"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2016",
                indexOrder: 2016,
                value: "28"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2017",
                indexOrder: 2017,
                value: "20"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2018",
                indexOrder: 2018,
                value: "37"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2019",
                indexOrder: 2019,
                value: "34"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2020",
                indexOrder: 2020,
                value: "48"
            },
            {
                dataTypeName: "FLOAT_NUMBER",
                indexName: "2021",
                indexOrder: 2021,
                value: "58"
            }
        ]
    },
]

export const actualsData = {
    items: [
      
    ]
}


export const EnhancementsData = {
    items: [

    ]
}

export const organizationtypeData = [
    {
        name: "FORM_BASIC",
        roleTypeId: 15,
        description: "The ability to form projects as a pro",
    },
    {
        name: "FORM_CREATOR",
        roleTypeId: 17,
        description: "The ability to create forms",
    }
]

export const dataTableData = [
  {
    id: 1809,
    name: "leakageSourceTable",
    data: {
      cells: [
        {
          rowIndex: 0,
          columnId: 1807,
          value: "Market Effects",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1808,
          value: "test",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1810,
          value: "Included",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1811,
          value: "test",
          isMutable: true,
        },
      ],
    },
  },
  {
    id: 1690,
    name: "validationBodyTeamTable",
    data: {
      cells: [
        {
          rowIndex: 0,
          columnId: 1691,
          value: "test",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1692,
          value: '["Company point of contact"]',
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1693,
          value: "test@gmail.com",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1694,
          value: '["Site visit"]',
          isMutable: true,
        },
      ],
    },
  },
  {
    id: 1880,
    name: "leakageBlockTable",
    data: {
      cells: [
        {
          rowIndex: 0,
          columnId: 1881,
          value: "test",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1882,
          value: '["Market"]',
          isMutable: true,
        },
      ],
    },
  },
];

export const updateDataTable = [
  {
    id: 1809,
    name: "leakageSourceTable",
    data: {
      cells: [
        {
          rowIndex: 0,
          columnId: 1807,
          value: "Activity-shifting",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1808,
          value: "updatetest",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1810,
          value: "Excluded",
          isMutable: true,
        },
        {
          rowIndex: 0,
          columnId: 1811,
          value: "updatetest",
          isMutable: true,
        },
      ],
    },
  },
];

export const dataRoomData = {
    name: "testData",
    updateName: "UpdateTestData"
}