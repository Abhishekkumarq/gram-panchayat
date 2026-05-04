export const translations = {
  english: {
    // Auth
    welcome: 'Welcome', logout: 'Logout', login: 'Login', register: 'Register',
    email: 'Email', password: 'Password',
    dontHaveAccount: "Don't have an account?", alreadyHaveAccount: 'Already have an account?',
    fullName: 'Full Name', phone: 'Phone', address: 'Address', ward: 'Ward',
    aadharNumber: 'Aadhar Number', annualIncome: 'Annual Income',
    landHolding: 'Land Holding (acres)', familySize: 'Family Size',

    // Nav
    home: 'Home', certificates: 'Certificates', taxPayment: 'Tax Payment',
    grievances: 'Grievances', schemes: 'Schemes', funds: 'Funds', admin: 'Admin',
    backToDashboard: 'Back to Dashboard',

    // Dashboard — hero
    heroTag: 'Digital India Initiative',
    heroHindi1: 'डिजिटल भारत पहल', heroText1: 'Digital India Initiative',
    heroDesc1: 'Transforming Governance with Technology for Every Citizen',
    heroHindi2: 'भारतीय गाँवों का सशक्तिकरण', heroText2: 'Empowering Indian Villages',
    heroDesc2: 'Strengthening Rural Heritage Through E-Governance',
    heroHindi3: 'हमारे किसानों का समर्थन', heroText3: 'Supporting Our Farmers',
    heroDesc3: 'Agricultural Development & Welfare for Rural Communities',

    // Dashboard — stats
    statOnlineServices: 'Online Services', statActiveSchemes: 'Active Schemes',
    statCitizens: 'Registered Citizens', statSatisfaction: 'Satisfaction Rate',

    // Dashboard — services section
    onlineServices: 'Online Services', onlineServicesHindi: 'ऑनलाइन सेवाएं',
    onlineServicesDesc: 'Access all Panchayat government services online — fast, transparent, and paperless.',
    digitalCertificates: 'Digital Certificates',
    digitalCertDesc: 'Apply for birth, income, caste, and residence certificates',
    taxPaymentTitle: 'Tax Payment', taxPaymentDesc: 'Pay property and water taxes online',
    grievancesTitle: 'Grievances', grievancesDesc: 'Register and track complaints',
    schemesTitle: 'Government Schemes', schemesDesc: 'View personalized scheme recommendations',
    fundsTitle: 'Fund Transparency', fundsDesc: 'View budget allocation and expenditure',
    myApplicationsTitle: 'My Applications',
    myApplicationsDesc: 'Track submitted applications and check current status in real-time.',
    adminTitle: 'Admin Panel', adminDesc: 'Manage applications and services',

    // Service card actions
    accessService: 'Access Service', payNow: 'Pay Now', fileComplaint: 'File Complaint',
    viewSchemes: 'View Schemes', checkFunds: 'Check Funds',
    trackStatus: 'Track Status', adminPanel: 'Admin Panel',

    // Dashboard — badges
    badgeAvailable: 'Available', badge24x7: '24×7', badgePayOnline: 'Pay Online',
    badgeApplyNow: 'Apply Now', badgeTransparent: 'Transparent',
    badgeTrack: 'Track', badgeAdmin: 'Admin',

    // Dashboard — news
    latestNews: 'Latest News & Updates', latestNewsHindi: 'ताज़ा समाचार',
    viewAllUpdates: 'View All Updates →',
    quickLinks: 'Quick Links', quickLinksHindi: 'त्वरित लिंक',
    helpdesk: 'Helpdesk & Contact',

    // Quick links
    qlPMAwas: 'PM Awas Yojana', qlMNREGA: 'MNREGA Portal',
    qlKisan: 'Kisan Samman Nidhi', qlPropertyTax: 'Pay Property Tax',
    qlBirthCert: 'Birth Certificate', qlCasteCert: 'Caste Certificate',
    qlGrievance: 'File Grievance', qlFund: 'Village Fund Status',
    qlApplications: 'My Applications', qlDocuments: 'Document Locker',

    // Contact
    tollfree: 'Toll Free', officeHours: 'Mon–Friday, 9:00 AM – 6:00 PM',

    // Certificates
    applyForCertificate: 'Apply for Certificate', cancel: 'Cancel',
    submitApplication: 'Submit Application', myApplications: 'My Applications',
    status: 'Status', applied: 'Applied', certificateNo: 'Certificate No',
    remarks: 'Remarks', birthCertificate: 'Birth Certificate',
    incomeCertificate: 'Income Certificate', casteCertificate: 'Caste Certificate',
    residenceCertificate: 'Residence Certificate', domicileCertificate: 'Domicile Certificate',

    // Tax
    taxCalculator: 'Tax Calculator', calculateTax: 'Calculate Tax',
    propertyTax: 'Property Tax', waterTax: 'Water Tax',
    propertyArea: 'Property Area (sq ft)', residential: 'Residential',
    commercial: 'Commercial', industrial: 'Industrial',
    calculate: 'Calculate', calculatedTax: 'Calculated Tax',
    myTaxRecords: 'My Tax Records', amount: 'Amount', receipt: 'Receipt',

    // Complaints
    registerComplaint: 'Register Complaint', title: 'Title', description: 'Description',
    category: 'Category', location: 'Location', submitComplaint: 'Submit Complaint',
    myComplaints: 'My Complaints', department: 'Department', priority: 'Priority',
    registered: 'Registered', resolution: 'Resolution',
    waterSupply: 'Water Supply', electricity: 'Electricity',
    roadInfrastructure: 'Road & Infrastructure', sanitation: 'Sanitation',
    healthServices: 'Health Services', education: 'Education', other: 'Other',

    // Schemes
    recommendedForYou: 'Recommended for You', allSchemes: 'All Schemes',
    personalizedRecommendations: 'Personalized Scheme Recommendations',
    benefits: 'Benefits', applicationProcess: 'Application Process',
    requiredDocuments: 'Required Documents',

    // Funds
    fundTransparency: 'Fund Transparency & Social Audit', selectYear: 'Select Year',
    totalAllocated: 'Total Allocated', totalSpent: 'Total Spent',
    utilizationRate: 'Utilization Rate', budgetByCategory: 'Budget by Category',
    wardWiseAllocation: 'Ward-wise Allocation',
    detailedFundAllocation: 'Detailed Fund Allocation',
    allocated: 'Allocated', spent: 'Spent', remaining: 'Remaining', utilization: 'Utilization',

    // Common empty states & labels
    noApplicationsYet: 'No applications yet', noRecords: 'No records found',
    applicant: 'Applicant', citizenLabel: 'Citizen',

    // Certificates
    allCertApplications: 'All Certificate Applications',

    // Complaints filters & states
    searchComplaints: 'Search complaints by title or description…',
    allStatus: 'All Status', allPriority: 'All Priority',
    statusPending: 'Pending', statusUnderReview: 'Under Review',
    statusInProgress: 'In Progress', statusResolved: 'Resolved', statusClosed: 'Closed',
    priorityLow: 'Low', priorityMedium: 'Medium', priorityHigh: 'High', priorityUrgent: 'Urgent',
    resetFilters: 'Reset Filters',
    noComplaints: 'No complaints registered',
    noMatchingComplaints: 'No complaints match your filters',
    allComplaints: 'All Complaints & Grievances',

    // Taxes
    allTaxRecords: 'All Tax Records', noTaxRecords: 'No tax records',

    // Schemes
    allGovtSchemes: 'All Government Schemes', noSchemes: 'No schemes available',
    schemesEligText: 'Based on your profile, you are eligible for the following schemes:',
    noPersonalRec: 'No personalized recommendations available. Complete your profile for better recommendations.',
    viewApplicationsHint: 'Click to view applications →',

    // Funds
    noFundData: 'No fund data available for',

    // Language names
    langEnglish: 'English', langHindi: 'Hindi', langPunjabi: 'Punjabi',
  },

  hindi: {
    // Auth
    welcome: 'स्वागत', logout: 'लॉग आउट', login: 'लॉगिन', register: 'रजिस्टर',
    email: 'ईमेल', password: 'पासवर्ड',
    dontHaveAccount: 'खाता नहीं है?', alreadyHaveAccount: 'पहले से खाता है?',
    fullName: 'पूरा नाम', phone: 'फोन', address: 'पता', ward: 'वार्ड',
    aadharNumber: 'आधार नंबर', annualIncome: 'वार्षिक आय',
    landHolding: 'भूमि धारण (एकड़)', familySize: 'परिवार का आकार',

    // Nav
    home: 'होम', certificates: 'प्रमाणपत्र', taxPayment: 'कर भुगतान',
    grievances: 'शिकायतें', schemes: 'योजनाएं', funds: 'फंड', admin: 'एडमिन',
    backToDashboard: 'डैशबोर्ड पर वापस',

    // Dashboard — hero
    heroHindi1: 'डिजिटल भारत पहल', heroText1: 'डिजिटल भारत पहल',
    heroDesc1: 'हर नागरिक के लिए प्रौद्योगिकी से शासन को बदलना',
    heroHindi2: 'भारतीय गाँवों का सशक्तिकरण', heroText2: 'भारतीय गाँवों का सशक्तिकरण',
    heroDesc2: 'ई-गवर्नेंस के माध्यम से ग्रामीण विरासत को मजबूत करना',
    heroHindi3: 'हमारे किसानों का समर्थन', heroText3: 'हमारे किसानों का समर्थन',
    heroDesc3: 'ग्रामीण समुदायों के लिए कृषि विकास और कल्याण',

    // Dashboard — stats
    statOnlineServices: 'ऑनलाइन सेवाएं', statActiveSchemes: 'सक्रिय योजनाएं',
    statCitizens: 'पंजीकृत नागरिक', statSatisfaction: 'संतुष्टि दर',

    // Dashboard — services section
    onlineServices: 'ऑनलाइन सेवाएं', onlineServicesHindi: 'ऑनलाइन सेवाएं',
    onlineServicesDesc: 'सभी पंचायत सरकारी सेवाएं ऑनलाइन प्राप्त करें — तेज़, पारदर्शी और कागज़ रहित।',
    digitalCertificates: 'डिजिटल प्रमाणपत्र',
    digitalCertDesc: 'जन्म, आय, जाति और निवास प्रमाणपत्र के लिए आवेदन करें',
    taxPaymentTitle: 'कर भुगतान', taxPaymentDesc: 'संपत्ति और पानी कर ऑनलाइन भुगतान करें',
    grievancesTitle: 'शिकायतें', grievancesDesc: 'शिकायत दर्ज करें और ट्रैक करें',
    schemesTitle: 'सरकारी योजनाएं', schemesDesc: 'व्यक्तिगत योजना सिफारिशें देखें',
    fundsTitle: 'फंड पारदर्शिता', fundsDesc: 'बजट आवंटन और व्यय देखें',
    myApplicationsTitle: 'मेरे आवेदन',
    myApplicationsDesc: 'जमा किए गए आवेदनों को ट्रैक करें और वर्तमान स्थिति देखें।',
    adminTitle: 'एडमिन पैनल', adminDesc: 'आवेदन और सेवाओं का प्रबंधन करें',

    // Service card actions
    accessService: 'सेवा प्राप्त करें', payNow: 'अभी भुगतान करें',
    fileComplaint: 'शिकायत दर्ज करें', viewSchemes: 'योजनाएं देखें',
    checkFunds: 'फंड देखें', trackStatus: 'स्थिति देखें', adminPanel: 'एडमिन पैनल',

    // Dashboard — badges
    badgeAvailable: 'उपलब्ध', badge24x7: '24×7', badgePayOnline: 'ऑनलाइन भुगतान',
    badgeApplyNow: 'अभी आवेदन करें', badgeTransparent: 'पारदर्शी',
    badgeTrack: 'ट्रैक करें', badgeAdmin: 'एडमिन',

    // Dashboard — news
    latestNews: 'ताज़ा समाचार और अपडेट', latestNewsHindi: 'ताज़ा समाचार',
    viewAllUpdates: 'सभी अपडेट देखें →',
    quickLinks: 'त्वरित लिंक', quickLinksHindi: 'त्वरित लिंक',
    helpdesk: 'हेल्पडेस्क और संपर्क',

    // Quick links
    qlPMAwas: 'पीएम आवास योजना', qlMNREGA: 'मनरेगा पोर्टल',
    qlKisan: 'किसान सम्मान निधि', qlPropertyTax: 'संपत्ति कर भुगतान',
    qlBirthCert: 'जन्म प्रमाणपत्र', qlCasteCert: 'जाति प्रमाणपत्र',
    qlGrievance: 'शिकायत दर्ज करें', qlFund: 'गाँव फंड स्थिति',
    qlApplications: 'मेरे आवेदन', qlDocuments: 'दस्तावेज़ लॉकर',

    // Contact
    tollfree: 'टोल फ्री', officeHours: 'सोम–शुक्र, 9:00 AM – 6:00 PM',

    // Certificates
    applyForCertificate: 'प्रमाणपत्र के लिए आवेदन करें', cancel: 'रद्द करें',
    submitApplication: 'आवेदन जमा करें', myApplications: 'मेरे आवेदन',
    status: 'स्थिति', applied: 'आवेदन किया', certificateNo: 'प्रमाणपत्र संख्या',
    remarks: 'टिप्पणी', birthCertificate: 'जन्म प्रमाणपत्र',
    incomeCertificate: 'आय प्रमाणपत्र', casteCertificate: 'जाति प्रमाणपत्र',
    residenceCertificate: 'निवास प्रमाणपत्र', domicileCertificate: 'अधिवास प्रमाणपत्र',

    // Tax
    taxCalculator: 'कर कैलकुलेटर', calculateTax: 'कर की गणना करें',
    propertyTax: 'संपत्ति कर', waterTax: 'जल कर',
    propertyArea: 'संपत्ति क्षेत्र (वर्ग फुट)', residential: 'आवासीय',
    commercial: 'व्यावसायिक', industrial: 'औद्योगिक',
    calculate: 'गणना करें', calculatedTax: 'गणना किया गया कर',
    myTaxRecords: 'मेरे कर रिकॉर्ड', amount: 'राशि', receipt: 'रसीद',

    // Complaints
    registerComplaint: 'शिकायत दर्ज करें', title: 'शीर्षक', description: 'विवरण',
    category: 'श्रेणी', location: 'स्थान', submitComplaint: 'शिकायत जमा करें',
    myComplaints: 'मेरी शिकायतें', department: 'विभाग', priority: 'प्राथमिकता',
    registered: 'पंजीकृत', resolution: 'समाधान',
    waterSupply: 'जल आपूर्ति', electricity: 'बिजली',
    roadInfrastructure: 'सड़क और बुनियादी ढांचा', sanitation: 'स्वच्छता',
    healthServices: 'स्वास्थ्य सेवाएं', education: 'शिक्षा', other: 'अन्य',

    // Schemes
    recommendedForYou: 'आपके लिए अनुशंसित', allSchemes: 'सभी योजनाएं',
    personalizedRecommendations: 'व्यक्तिगत योजना सिफारिशें',
    benefits: 'लाभ', applicationProcess: 'आवेदन प्रक्रिया',
    requiredDocuments: 'आवश्यक दस्तावेज',

    // Funds
    fundTransparency: 'फंड पारदर्शिता और सामाजिक लेखा परीक्षा', selectYear: 'वर्ष चुनें',
    totalAllocated: 'कुल आवंटित', totalSpent: 'कुल खर्च',
    utilizationRate: 'उपयोग दर', budgetByCategory: 'श्रेणी के अनुसार बजट',
    wardWiseAllocation: 'वार्ड-वार आवंटन',
    detailedFundAllocation: 'विस्तृत फंड आवंटन',
    allocated: 'आवंटित', spent: 'खर्च', remaining: 'शेष', utilization: 'उपयोग',

    // Common empty states & labels
    noApplicationsYet: 'अभी कोई आवेदन नहीं', noRecords: 'कोई रिकॉर्ड नहीं',
    applicant: 'आवेदक', citizenLabel: 'नागरिक',

    // Certificates
    allCertApplications: 'सभी प्रमाणपत्र आवेदन',

    // Complaints filters & states
    searchComplaints: 'शिकायतें शीर्षक या विवरण से खोजें…',
    allStatus: 'सभी स्थिति', allPriority: 'सभी प्राथमिकता',
    statusPending: 'लंबित', statusUnderReview: 'समीक्षाधीन',
    statusInProgress: 'प्रगतिशील', statusResolved: 'हल किया गया', statusClosed: 'बंद',
    priorityLow: 'कम', priorityMedium: 'मध्यम', priorityHigh: 'उच्च', priorityUrgent: 'अत्यंत जरूरी',
    resetFilters: 'फ़िल्टर हटाएं',
    noComplaints: 'कोई शिकायत पंजीकृत नहीं',
    noMatchingComplaints: 'आपके फ़िल्टर से कोई शिकायत नहीं मिली',
    allComplaints: 'सभी शिकायतें',

    // Taxes
    allTaxRecords: 'सभी कर रिकॉर्ड', noTaxRecords: 'कोई कर रिकॉर्ड नहीं',

    // Schemes
    allGovtSchemes: 'सभी सरकारी योजनाएं', noSchemes: 'कोई योजना उपलब्ध नहीं',
    schemesEligText: 'आपकी प्रोफ़ाइल के आधार पर आप निम्नलिखित योजनाओं के लिए पात्र हैं:',
    noPersonalRec: 'कोई व्यक्तिगत सिफारिश उपलब्ध नहीं। बेहतर सिफारिशों के लिए अपनी प्रोफ़ाइल पूरी करें।',
    viewApplicationsHint: 'आवेदन देखने के लिए क्लिक करें →',

    // Funds
    noFundData: 'के लिए कोई फंड डेटा उपलब्ध नहीं',

    // Language names
    langEnglish: 'अंग्रेज़ी', langHindi: 'हिन्दी', langPunjabi: 'ਪੰਜਾਬੀ',
  },

  punjabi: {
    // Auth
    welcome: 'ਸੁਆਗਤ', logout: 'ਲਾੱਗ ਆਊਟ', login: 'ਲਾੱਗਇਨ', register: 'ਰਜਿਸਟਰ',
    email: 'ਈਮੇਲ', password: 'ਪਾਸਵਰਡ',
    dontHaveAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?', alreadyHaveAccount: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?',
    fullName: 'ਪੂਰਾ ਨਾਮ', phone: 'ਫੋਨ', address: 'ਪਤਾ', ward: 'ਵਾਰਡ',
    aadharNumber: 'ਆਧਾਰ ਨੰਬਰ', annualIncome: 'ਸਾਲਾਨਾ ਆਮਦਨ',
    landHolding: 'ਜ਼ਮੀਨ ਧਾਰਨ (ਏਕੜ)', familySize: 'ਪਰਿਵਾਰ ਦਾ ਆਕਾਰ',

    // Nav
    home: 'ਹੋਮ', certificates: 'ਸਰਟੀਫਿਕੇਟ', taxPayment: 'ਟੈਕਸ ਭੁਗਤਾਨ',
    grievances: 'ਸ਼ਿਕਾਇਤਾਂ', schemes: 'ਯੋਜਨਾਵਾਂ', funds: 'ਫੰਡ', admin: 'ਐਡਮਿਨ',
    backToDashboard: 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ',

    // Dashboard — hero
    heroHindi1: 'ਡਿਜੀਟਲ ਭਾਰਤ ਪਹਿਲ', heroText1: 'ਡਿਜੀਟਲ ਭਾਰਤ ਪਹਿਲ',
    heroDesc1: 'ਹਰ ਨਾਗਰਿਕ ਲਈ ਤਕਨਾਲੋਜੀ ਨਾਲ ਸ਼ਾਸਨ ਬਦਲਣਾ',
    heroHindi2: 'ਭਾਰਤੀ ਪਿੰਡਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ', heroText2: 'ਭਾਰਤੀ ਪਿੰਡਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ',
    heroDesc2: 'ਈ-ਗਵਰਨੈਂਸ ਰਾਹੀਂ ਪੇਂਡੂ ਵਿਰਾਸਤ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨਾ',
    heroHindi3: 'ਸਾਡੇ ਕਿਸਾਨਾਂ ਦਾ ਸਮਰਥਨ', heroText3: 'ਸਾਡੇ ਕਿਸਾਨਾਂ ਦਾ ਸਮਰਥਨ',
    heroDesc3: 'ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਲਈ ਖੇਤੀਬਾੜੀ ਵਿਕਾਸ ਅਤੇ ਭਲਾਈ',

    // Dashboard — stats
    statOnlineServices: 'ਔਨਲਾਈਨ ਸੇਵਾਵਾਂ', statActiveSchemes: 'ਸਰਗਰਮ ਯੋਜਨਾਵਾਂ',
    statCitizens: 'ਰਜਿਸਟਰਡ ਨਾਗਰਿਕ', statSatisfaction: 'ਸੰਤੁਸ਼ਟੀ ਦਰ',

    // Dashboard — services section
    onlineServices: 'ਔਨਲਾਈਨ ਸੇਵਾਵਾਂ', onlineServicesHindi: 'ਔਨਲਾਈਨ ਸੇਵਾਵਾਂ',
    onlineServicesDesc: 'ਸਾਰੀਆਂ ਪੰਚਾਇਤ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਔਨਲਾਈਨ ਪ੍ਰਾਪਤ ਕਰੋ — ਤੇਜ਼, ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਕਾਗਜ਼ ਰਹਿਤ।',
    digitalCertificates: 'ਡਿਜੀਟਲ ਸਰਟੀਫਿਕੇਟ',
    digitalCertDesc: 'ਜਨਮ, ਆਮਦਨ, ਜਾਤੀ ਅਤੇ ਨਿਵਾਸ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ',
    taxPaymentTitle: 'ਟੈਕਸ ਭੁਗਤਾਨ', taxPaymentDesc: 'ਜਾਇਦਾਦ ਅਤੇ ਪਾਣੀ ਟੈਕਸ ਔਨਲਾਈਨ ਭੁਗਤਾਨ ਕਰੋ',
    grievancesTitle: 'ਸ਼ਿਕਾਇਤਾਂ', grievancesDesc: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ ਅਤੇ ਟਰੈਕ ਕਰੋ',
    schemesTitle: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', schemesDesc: 'ਨਿੱਜੀ ਯੋਜਨਾ ਸਿਫਾਰਸ਼ਾਂ ਦੇਖੋ',
    fundsTitle: 'ਫੰਡ ਪਾਰਦਰਸ਼ਤਾ', fundsDesc: 'ਬਜਟ ਵੰਡ ਅਤੇ ਖਰਚ ਦੇਖੋ',
    myApplicationsTitle: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ',
    myApplicationsDesc: 'ਜਮ੍ਹਾਂ ਕੀਤੀਆਂ ਅਰਜ਼ੀਆਂ ਨੂੰ ਟਰੈਕ ਕਰੋ ਅਤੇ ਮੌਜੂਦਾ ਸਥਿਤੀ ਦੇਖੋ।',
    adminTitle: 'ਐਡਮਿਨ ਪੈਨਲ', adminDesc: 'ਅਰਜ਼ੀਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',

    // Service card actions
    accessService: 'ਸੇਵਾ ਪ੍ਰਾਪਤ ਕਰੋ', payNow: 'ਹੁਣ ਭੁਗਤਾਨ ਕਰੋ',
    fileComplaint: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ', viewSchemes: 'ਯੋਜਨਾਵਾਂ ਦੇਖੋ',
    checkFunds: 'ਫੰਡ ਦੇਖੋ', trackStatus: 'ਸਥਿਤੀ ਦੇਖੋ', adminPanel: 'ਐਡਮਿਨ ਪੈਨਲ',

    // Dashboard — badges
    badgeAvailable: 'ਉਪਲਬਧ', badge24x7: '24×7', badgePayOnline: 'ਔਨਲਾਈਨ ਭੁਗਤਾਨ',
    badgeApplyNow: 'ਹੁਣ ਅਰਜ਼ੀ ਦਿਓ', badgeTransparent: 'ਪਾਰਦਰਸ਼ੀ',
    badgeTrack: 'ਟਰੈਕ ਕਰੋ', badgeAdmin: 'ਐਡਮਿਨ',

    // Dashboard — news
    latestNews: 'ਤਾਜ਼ਾ ਖਬਰਾਂ ਅਤੇ ਅਪਡੇਟ', latestNewsHindi: 'ਤਾਜ਼ਾ ਸਮਾਚਾਰ',
    viewAllUpdates: 'ਸਾਰੇ ਅਪਡੇਟ ਦੇਖੋ →',
    quickLinks: 'ਤੇਜ਼ ਲਿੰਕ', quickLinksHindi: 'ਤੇਜ਼ ਲਿੰਕ',
    helpdesk: 'ਹੈਲਪਡੈਸਕ ਅਤੇ ਸੰਪਰਕ',

    // Quick links
    qlPMAwas: 'ਪੀਐਮ ਆਵਾਸ ਯੋਜਨਾ', qlMNREGA: 'ਮਨਰੇਗਾ ਪੋਰਟਲ',
    qlKisan: 'ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ', qlPropertyTax: 'ਜਾਇਦਾਦ ਟੈਕਸ ਭੁਗਤਾਨ',
    qlBirthCert: 'ਜਨਮ ਸਰਟੀਫਿਕੇਟ', qlCasteCert: 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ',
    qlGrievance: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ', qlFund: 'ਪਿੰਡ ਫੰਡ ਸਥਿਤੀ',
    qlApplications: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ', qlDocuments: 'ਦਸਤਾਵੇਜ਼ ਲਾਕਰ',

    // Contact
    tollfree: 'ਟੋਲ ਫ੍ਰੀ', officeHours: 'ਸੋਮ–ਸ਼ੁੱਕਰ, 9:00 AM – 6:00 PM',

    // Certificates
    applyForCertificate: 'ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ', cancel: 'ਰੱਦ ਕਰੋ',
    submitApplication: 'ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਕਰੋ', myApplications: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ',
    status: 'ਸਥਿਤੀ', applied: 'ਅਰਜ਼ੀ ਦਿੱਤੀ', certificateNo: 'ਸਰਟੀਫਿਕੇਟ ਨੰਬਰ',
    remarks: 'ਟਿੱਪਣੀਆਂ', birthCertificate: 'ਜਨਮ ਸਰਟੀਫਿਕੇਟ',
    incomeCertificate: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ', casteCertificate: 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ',
    residenceCertificate: 'ਨਿਵਾਸ ਸਰਟੀਫਿਕੇਟ', domicileCertificate: 'ਡੋਮੀਸਾਈਲ ਸਰਟੀਫਿਕੇਟ',

    // Tax
    taxCalculator: 'ਟੈਕਸ ਕੈਲਕੁਲੇਟਰ', calculateTax: 'ਟੈਕਸ ਦੀ ਗਣਨਾ ਕਰੋ',
    propertyTax: 'ਜਾਇਦਾਦ ਟੈਕਸ', waterTax: 'ਪਾਣੀ ਟੈਕਸ',
    propertyArea: 'ਜਾਇਦਾਦ ਖੇਤਰ (ਵਰਗ ਫੁੱਟ)', residential: 'ਰਿਹਾਇਸ਼ੀ',
    commercial: 'ਵਪਾਰਕ', industrial: 'ਉਦਯੋਗਿਕ',
    calculate: 'ਗਣਨਾ ਕਰੋ', calculatedTax: 'ਗਣਨਾ ਕੀਤਾ ਟੈਕਸ',
    myTaxRecords: 'ਮੇਰੇ ਟੈਕਸ ਰਿਕਾਰਡ', amount: 'ਰਕਮ', receipt: 'ਰਸੀਦ',

    // Complaints
    registerComplaint: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ', title: 'ਸਿਰਲੇਖ', description: 'ਵੇਰਵਾ',
    category: 'ਸ਼੍ਰੇਣੀ', location: 'ਸਥਾਨ', submitComplaint: 'ਸ਼ਿਕਾਇਤ ਜਮ੍ਹਾਂ ਕਰੋ',
    myComplaints: 'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ', department: 'ਵਿਭਾਗ', priority: 'ਤਰਜੀਹ',
    registered: 'ਰਜਿਸਟਰਡ', resolution: 'ਹੱਲ',
    waterSupply: 'ਪਾਣੀ ਸਪਲਾਈ', electricity: 'ਬਿਜਲੀ',
    roadInfrastructure: 'ਸੜਕ ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚਾ', sanitation: 'ਸਫਾਈ',
    healthServices: 'ਸਿਹਤ ਸੇਵਾਵਾਂ', education: 'ਸਿੱਖਿਆ', other: 'ਹੋਰ',

    // Schemes
    recommendedForYou: 'ਤੁਹਾਡੇ ਲਈ ਸਿਫਾਰਸ਼', allSchemes: 'ਸਾਰੀਆਂ ਯੋਜਨਾਵਾਂ',
    personalizedRecommendations: 'ਨਿੱਜੀ ਯੋਜਨਾ ਸਿਫਾਰਸ਼ਾਂ',
    benefits: 'ਲਾਭ', applicationProcess: 'ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ',
    requiredDocuments: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',

    // Funds
    fundTransparency: 'ਫੰਡ ਪਾਰਦਰਸ਼ਤਾ ਅਤੇ ਸਮਾਜਿਕ ਆਡਿਟ', selectYear: 'ਸਾਲ ਚੁਣੋ',
    totalAllocated: 'ਕੁੱਲ ਵੰਡਿਆ', totalSpent: 'ਕੁੱਲ ਖਰਚ',
    utilizationRate: 'ਵਰਤੋਂ ਦਰ', budgetByCategory: 'ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਬਜਟ',
    wardWiseAllocation: 'ਵਾਰਡ-ਅਨੁਸਾਰ ਵੰਡ',
    detailedFundAllocation: 'ਵਿਸਤ੍ਰਿਤ ਫੰਡ ਵੰਡ',
    allocated: 'ਵੰਡਿਆ', spent: 'ਖਰਚ', remaining: 'ਬਾਕੀ', utilization: 'ਵਰਤੋਂ',

    // Common empty states & labels
    noApplicationsYet: 'ਅਜੇ ਕੋਈ ਅਰਜ਼ੀ ਨਹੀਂ', noRecords: 'ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ',
    applicant: 'ਅਰਜ਼ੀਕਰਤਾ', citizenLabel: 'ਨਾਗਰਿਕ',

    // Certificates
    allCertApplications: 'ਸਾਰੀਆਂ ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ',

    // Complaints filters & states
    searchComplaints: 'ਸ਼ਿਕਾਇਤਾਂ ਸਿਰਲੇਖ ਜਾਂ ਵੇਰਵੇ ਨਾਲ ਖੋਜੋ…',
    allStatus: 'ਸਾਰੀਆਂ ਸਥਿਤੀਆਂ', allPriority: 'ਸਾਰੀਆਂ ਤਰਜੀਹਾਂ',
    statusPending: 'ਬਕਾਇਆ', statusUnderReview: 'ਸਮੀਖਿਆ ਅਧੀਨ',
    statusInProgress: 'ਜਾਰੀ ਹੈ', statusResolved: 'ਹੱਲ ਹੋ ਗਿਆ', statusClosed: 'ਬੰਦ',
    priorityLow: 'ਘੱਟ', priorityMedium: 'ਦਰਮਿਆਨੀ', priorityHigh: 'ਉੱਚ', priorityUrgent: 'ਤੁਰੰਤ',
    resetFilters: 'ਫਿਲਟਰ ਹਟਾਓ',
    noComplaints: 'ਕੋਈ ਸ਼ਿਕਾਇਤ ਦਰਜ ਨਹੀਂ',
    noMatchingComplaints: 'ਤੁਹਾਡੇ ਫਿਲਟਰ ਨਾਲ ਕੋਈ ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ',
    allComplaints: 'ਸਾਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ',

    // Taxes
    allTaxRecords: 'ਸਾਰੇ ਟੈਕਸ ਰਿਕਾਰਡ', noTaxRecords: 'ਕੋਈ ਟੈਕਸ ਰਿਕਾਰਡ ਨਹੀਂ',

    // Schemes
    allGovtSchemes: 'ਸਾਰੀਆਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', noSchemes: 'ਕੋਈ ਯੋਜਨਾ ਉਪਲਬਧ ਨਹੀਂ',
    schemesEligText: 'ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਦੇ ਆਧਾਰ ਤੇ ਤੁਸੀਂ ਹੇਠ ਲਿਖੀਆਂ ਯੋਜਨਾਵਾਂ ਲਈ ਯੋਗ ਹੋ:',
    noPersonalRec: 'ਕੋਈ ਨਿੱਜੀ ਸਿਫਾਰਸ਼ ਉਪਲਬਧ ਨਹੀਂ। ਬਿਹਤਰ ਸਿਫਾਰਸ਼ਾਂ ਲਈ ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਪੂਰੀ ਕਰੋ।',
    viewApplicationsHint: 'ਅਰਜ਼ੀਆਂ ਦੇਖਣ ਲਈ ਕਲਿੱਕ ਕਰੋ →',

    // Funds
    noFundData: 'ਲਈ ਕੋਈ ਫੰਡ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ',

    // Language names
    langEnglish: 'English', langHindi: 'ਹਿੰਦੀ', langPunjabi: 'ਪੰਜਾਬੀ',
  }
};

export const languages = [
  { code: 'english', name: 'English', native: 'English' },
  { code: 'hindi',   name: 'Hindi',   native: 'हिन्दी' },
  { code: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
];
