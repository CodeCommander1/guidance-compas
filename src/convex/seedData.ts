import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Load existing to avoid duplicates (removed early return)
    const existingCourses = await ctx.db.query("courses").collect();
    const courseNameToId = new Map<string, any>();
    for (const c of existingCourses) courseNameToId.set(c.name, c._id);

    // Seed courses
    const courses = [
      {
        name: "Bachelor of Arts",
        shortName: "B.A.",
        description: "A comprehensive undergraduate program in humanities and liberal arts",
        category: "arts" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream",
        subjects: ["English", "History", "Political Science", "Psychology", "Sociology", "Philosophy"],
        careerOpportunities: ["Civil Services", "Teaching", "Journalism", "Content Writing", "Social Work", "Research"],
        governmentExams: ["UPSC", "SSC", "Banking", "Railway", "State PSC"],
        averageSalary: "₹3-8 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Science",
        shortName: "B.Sc.",
        description: "Scientific education with specialization in various science subjects",
        category: "science" as const,
        duration: "3 years",
        eligibility: "Class 12 pass with Science (PCM/PCB)",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Statistics"],
        careerOpportunities: ["Research Scientist", "Lab Technician", "Data Analyst", "Software Developer", "Teacher"],
        governmentExams: ["CSIR NET", "GATE", "SSC", "Railway", "Defense"],
        averageSalary: "₹4-12 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Commerce",
        shortName: "B.Com",
        description: "Business and commerce education with accounting and finance focus",
        category: "commerce" as const,
        duration: "3 years",
        eligibility: "Class 12 pass preferably with Commerce",
        subjects: ["Accounting", "Business Studies", "Economics", "Statistics", "Taxation", "Banking"],
        careerOpportunities: ["Chartered Accountant", "Banking", "Finance Manager", "Tax Consultant", "Auditor"],
        governmentExams: ["Banking", "SSC", "Railway", "Insurance", "CA/CS/CMA"],
        averageSalary: "₹3-10 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Business Administration",
        shortName: "BBA",
        description: "Management and business administration undergraduate program",
        category: "management" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream",
        subjects: ["Management", "Marketing", "Finance", "Human Resources", "Operations", "Strategy"],
        careerOpportunities: ["Business Analyst", "Marketing Manager", "HR Executive", "Operations Manager", "Entrepreneur"],
        governmentExams: ["Banking", "SSC", "Management Trainee", "PSU"],
        averageSalary: "₹4-15 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Computer Applications",
        shortName: "BCA",
        description: "Computer applications and software development program",
        category: "science" as const,
        duration: "3 years",
        eligibility: "Class 12 pass with Mathematics",
        subjects: ["Programming", "Database", "Web Development", "Software Engineering", "Networking", "Data Structures"],
        careerOpportunities: ["Software Developer", "Web Developer", "System Analyst", "Database Administrator", "IT Consultant"],
        governmentExams: ["GATE", "PSU IT", "Banking IT", "Railway IT"],
        averageSalary: "₹5-20 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Education",
        shortName: "B.Ed",
        description: "Teacher training and education methodology program",
        category: "arts" as const,
        duration: "2 years",
        eligibility: "Graduation in any discipline",
        subjects: ["Educational Psychology", "Teaching Methods", "Curriculum Development", "Assessment", "Child Development"],
        careerOpportunities: ["School Teacher", "Educational Consultant", "Curriculum Designer", "Education Officer"],
        governmentExams: ["TET", "CTET", "KVS", "NVS", "State Teacher Exams"],
        averageSalary: "₹3-8 LPA",
        isActive: true,
      },
      {
        name: "B.Tech (Engineering)",
        shortName: "B.Tech",
        description: "Undergraduate engineering degree across multiple specializations",
        category: "science" as const,
        duration: "4 years",
        eligibility: "Class 12 pass with PCM",
        subjects: ["Mathematics", "Physics", "Chemistry", "Programming", "Electronics"],
        careerOpportunities: ["Software Engineer", "Electrical Engineer", "Mechanical Engineer", "Civil Engineer"],
        governmentExams: ["JEE Main", "JEE Advanced", "GATE", "PSU"],
        averageSalary: "₹6-20 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Pharmacy",
        shortName: "B.Pharm",
        description: "Pharmaceutical sciences with focus on drug research and healthcare",
        category: "science" as const,
        duration: "4 years",
        eligibility: "Class 12 pass with PCB",
        subjects: ["Pharmacology", "Pharmaceutics", "Chemistry", "Biochemistry", "Anatomy"],
        careerOpportunities: ["Pharmacist", "Drug Analyst", "Clinical Research Associate"],
        governmentExams: ["GPAT", "State Pharmacist Exams"],
        averageSalary: "₹3-10 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Economics",
        shortName: "B.Econ",
        description: "Economics fundamentals with quantitative analysis and policy",
        category: "commerce" as const,
        duration: "3 years",
        eligibility: "Class 12 pass (preferably with Mathematics)",
        subjects: ["Microeconomics", "Macroeconomics", "Statistics", "Econometrics", "Finance"],
        careerOpportunities: ["Economic Analyst", "Policy Researcher", "Data Analyst"],
        governmentExams: ["UPSC", "RBI Grade B", "Bank PO"],
        averageSalary: "₹4-12 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Management Studies",
        shortName: "BMS",
        description: "Management education with focus on leadership and strategy",
        category: "management" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream",
        subjects: ["Management", "Marketing", "Finance", "HR", "Quantitative Methods"],
        careerOpportunities: ["Management Trainee", "Marketing Executive", "Business Analyst"],
        governmentExams: ["Banking", "SSC", "PSU"],
        averageSalary: "₹3-10 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Journalism and Mass Communication",
        shortName: "BJMC",
        description: "Media, journalism, and communication studies",
        category: "arts" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream",
        subjects: ["Journalism", "Mass Communication", "Media Ethics", "Reporting", "Editing"],
        careerOpportunities: ["Journalist", "Content Strategist", "Public Relations Officer"],
        governmentExams: ["UPSC", "State PSC", "SSC"],
        averageSalary: "₹3-12 LPA",
        isActive: true,
      },
      {
        name: "Bachelor of Social Work",
        shortName: "BSW",
        description: "Social welfare, community development, and public services",
        category: "arts" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream",
        subjects: ["Social Policy", "Community Work", "Counseling", "Research Methods"],
        careerOpportunities: ["Social Worker", "NGO Coordinator", "Community Officer"],
        governmentExams: ["SSC", "State Social Welfare Dept Exams"],
        averageSalary: "₹3-8 LPA",
        isActive: true,
      },
      {
        name: "B.Voc (Software Development)",
        shortName: "B.Voc SD",
        description: "Industry-focused vocational program in software development",
        category: "vocational" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream (preferably with Mathematics)",
        subjects: ["Programming", "Web Development", "Database", "DevOps Basics"],
        careerOpportunities: ["Web Developer", "Software Technician", "QA Engineer"],
        governmentExams: ["PSU IT", "Banking IT"],
        averageSalary: "₹3-8 LPA",
        isActive: true,
      },
      {
        name: "B.Voc (Healthcare Management)",
        shortName: "B.Voc HM",
        description: "Vocational program in healthcare administration and services",
        category: "vocational" as const,
        duration: "3 years",
        eligibility: "Class 12 pass in any stream",
        subjects: ["Healthcare Systems", "Hospital Admin", "Medical Records", "Operations"],
        careerOpportunities: ["Hospital Administrator", "Healthcare Coordinator"],
        governmentExams: ["State Health Dept Exams"],
        averageSalary: "₹3-7 LPA",
        isActive: true,
      },
    ];

    const courseIds: any[] = [];
    for (const course of courses) {
      let id = courseNameToId.get(course.name);
      if (!id) {
        id = await ctx.db.insert("courses", course);
        courseNameToId.set(course.name, id);
      }
      courseIds.push(id);
    }

    // Seed colleges
    const existingColleges = await ctx.db.query("colleges").collect();
    const collegeNameToId = new Map<string, any>();
    for (const c of existingColleges) collegeNameToId.set(c.name, c._id);

    const colleges = [
      {
        name: "Delhi University",
        type: "Government",
        address: "University Enclave, Delhi",
        city: "Delhi",
        state: "Delhi",
        pincode: "110007",
        latitude: 28.6869,
        longitude: 77.2090,
        website: "https://du.ac.in",
        phone: "011-27666666",
        email: "info@du.ac.in",
        establishedYear: 1922,
        affiliation: "UGC",
        accreditation: "NAAC A++",
        facilities: ["Hostel", "Library", "Labs", "WiFi", "Sports", "Canteen"],
        coursesOffered: courseIds.slice(0, 4),
        cutoffs: { general: 95, obc: 93, sc: 85, st: 80 },
        fees: { tuition: 15000, hostel: 25000, other: 5000 },
        isActive: true,
      },
      {
        name: "Jawaharlal Nehru University",
        type: "Government",
        address: "New Mehrauli Road, Delhi",
        city: "Delhi",
        state: "Delhi",
        pincode: "110067",
        latitude: 28.5383,
        longitude: 77.1641,
        website: "https://jnu.ac.in",
        phone: "011-26704000",
        email: "info@jnu.ac.in",
        establishedYear: 1969,
        affiliation: "UGC",
        accreditation: "NAAC A++",
        facilities: ["Hostel", "Library", "Labs", "WiFi", "Sports", "Medical"],
        coursesOffered: courseIds.slice(0, 3),
        cutoffs: { general: 90, obc: 88, sc: 80, st: 75 },
        fees: { tuition: 12000, hostel: 20000, other: 3000 },
        isActive: true,
      },
      {
        name: "Banaras Hindu University",
        type: "Government",
        address: "Varanasi, Uttar Pradesh",
        city: "Varanasi",
        state: "Uttar Pradesh",
        pincode: "221005",
        latitude: 25.2677,
        longitude: 82.9913,
        website: "https://bhu.ac.in",
        phone: "0542-2307000",
        email: "info@bhu.ac.in",
        establishedYear: 1916,
        affiliation: "UGC",
        accreditation: "NAAC A++",
        facilities: ["Hostel", "Library", "Labs", "WiFi", "Hospital", "Temple"],
        coursesOffered: courseIds,
        cutoffs: { general: 85, obc: 83, sc: 75, st: 70 },
        fees: { tuition: 10000, hostel: 18000, other: 4000 },
        isActive: true,
      },
      {
        name: "Delhi Technological University",
        type: "Government",
        address: "Bawana Road, Delhi",
        city: "Delhi",
        state: "Delhi",
        pincode: "110042",
        latitude: 28.7499,
        longitude: 77.1170,
        website: "https://www.dtu.ac.in/",
        phone: "011-27871018",
        email: "info@dtu.ac.in",
        establishedYear: 1941,
        affiliation: "UGC",
        accreditation: "NAAC A",
        facilities: ["Hostel", "Library", "Labs", "WiFi", "Sports", "Incubation"],
        coursesOffered: courseIds.slice(0, 5),
        cutoffs: { general: 95, obc: 92, sc: 80, st: 75 },
        fees: { tuition: 190000, hostel: 60000, other: 15000 },
        isActive: true,
      },
      {
        name: "Hindu College, University of Delhi",
        type: "Government",
        address: "University of Delhi, Delhi",
        city: "Delhi",
        state: "Delhi",
        pincode: "110007",
        latitude: 28.6887,
        longitude: 77.2100,
        website: "https://hinducollege.ac.in/",
        phone: "011-27667184",
        email: "principal@hinducollege.ac.in",
        establishedYear: 1899,
        affiliation: "UGC",
        accreditation: "NAAC A++",
        facilities: ["Library", "Labs", "WiFi", "Sports", "Canteen"],
        coursesOffered: courseIds.slice(0, 4),
        cutoffs: { general: 96, obc: 94, sc: 86, st: 81 },
        fees: { tuition: 15000, hostel: 30000, other: 5000 },
        isActive: true,
      },
      {
        name: "University of Kashmir",
        type: "Government",
        address: "Hazratbal, Srinagar",
        city: "Srinagar",
        state: "Jammu and Kashmir",
        pincode: "190006",
        latitude: 34.1258,
        longitude: 74.8374,
        website: "https://www.kashmiruniversity.net/",
        phone: "0194-2272004",
        email: "info@kashmiruniversity.ac.in",
        establishedYear: 1948,
        affiliation: "UGC",
        accreditation: "NAAC A+",
        facilities: ["Hostel", "Library", "Labs", "WiFi", "Sports"],
        coursesOffered: courseIds.slice(0, 6),
        cutoffs: { general: 75, obc: 72, sc: 65, st: 60 },
        fees: { tuition: 12000, hostel: 20000, other: 4000 },
        isActive: true,
      },
      {
        name: "National Institute of Technology Srinagar",
        type: "Government",
        address: "Hazratbal, Srinagar",
        city: "Srinagar",
        state: "Jammu and Kashmir",
        pincode: "190006",
        latitude: 34.1278,
        longitude: 74.8391,
        website: "https://nitsri.ac.in/",
        phone: "0194-2424792",
        email: "registrar@nitsri.ac.in",
        establishedYear: 1960,
        affiliation: "MHRD",
        accreditation: "NAAC",
        facilities: ["Hostel", "Library", "Labs", "WiFi", "Sports"],
        coursesOffered: courseIds.slice(0, 5),
        cutoffs: { general: 90, obc: 87, sc: 75, st: 70 },
        fees: { tuition: 125000, hostel: 40000, other: 10000 },
        isActive: true,
      },
      {
        name: "Sher-e-Kashmir University of Agricultural Sciences and Technology",
        type: "Government",
        address: "Shalimar, Srinagar",
        city: "Srinagar",
        state: "Jammu and Kashmir",
        pincode: "190025",
        latitude: 34.1650,
        longitude: 74.8765,
        website: "https://skuastkashmir.ac.in/",
        phone: "0194-2461271",
        email: "info@skuastkashmir.ac.in",
        establishedYear: 1982,
        affiliation: "ICAR",
        accreditation: "ICAR",
        facilities: ["Research Labs", "Library", "WiFi", "Hostel", "Farm"],
        coursesOffered: courseIds.slice(0, 4),
        cutoffs: { general: 70, obc: 68, sc: 60, st: 55 },
        fees: { tuition: 30000, hostel: 20000, other: 8000 },
        isActive: true,
      },
    ];

    const collegeIds: any[] = [];
    for (const college of colleges) {
      let id = collegeNameToId.get(college.name);
      if (!id) {
        id = await ctx.db.insert("colleges", college);
        collegeNameToId.set(college.name, id);
      }
      collegeIds.push(id);
    }

    // Seed career paths (enhanced job domains)
    const existingCareerPaths = await ctx.db.query("careerPaths").collect();
    const careerTitleToId = new Map<string, any>();
    for (const c of existingCareerPaths) careerTitleToId.set(c.title, c._id);

    const careerPaths = [
      {
        title: "Civil Services Officer",
        description: "Administrative roles in government departments and public service",
        courseId: courseIds[0], // B.A.
        requiredSkills: ["Leadership", "Communication", "Analytical Thinking", "Public Policy"],
        jobRoles: ["IAS Officer", "IPS Officer", "IFS Officer", "State Civil Services"],
        salaryRange: "₹8-25 LPA",
        growthProspects: "Excellent with promotions and postings",
        industryDemand: "High",
        workEnvironment: "Government offices, field work, policy making",
        isActive: true,
      },
      {
        title: "Software Developer",
        description: "Design and develop software applications and systems",
        courseId: courseIds[4], // BCA
        requiredSkills: ["Programming", "Problem Solving", "Database Management", "Software Design"],
        jobRoles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer"],
        salaryRange: "₹5-30 LPA",
        growthProspects: "Excellent with rapid technology advancement",
        industryDemand: "Very High",
        workEnvironment: "IT companies, startups, remote work options",
        isActive: true,
      },
      {
        title: "Financial Analyst",
        description: "Analyze financial data and provide investment recommendations",
        courseId: courseIds[2], // B.Com
        requiredSkills: ["Financial Analysis", "Excel", "Market Research", "Risk Assessment"],
        jobRoles: ["Investment Analyst", "Credit Analyst", "Budget Analyst", "Portfolio Manager"],
        salaryRange: "₹4-18 LPA",
        growthProspects: "Good with experience and certifications",
        industryDemand: "High",
        workEnvironment: "Banks, investment firms, corporate finance departments",
        isActive: true,
      },
      {
        title: "Research Scientist",
        description: "Conduct experiments, analyze data, and publish scientific findings.",
        courseId: courseIds[1], // B.Sc.
        requiredSkills: ["Research Methods", "Statistics", "Lab Skills", "Critical Thinking"],
        jobRoles: ["Research Associate", "Lab Scientist", "Data Scientist", "Biotech Analyst"],
        salaryRange: "₹5-20 LPA",
        growthProspects: "High with advanced degrees and publications",
        industryDemand: "High",
        workEnvironment: "Research labs, universities, R&D centers",
        isActive: true,
      },
      {
        title: "Pharmacist & Clinical Research",
        description: "Pharmaceutical care and clinical research operations.",
        courseId: courseNameToId.get("Bachelor of Pharmacy") || courseIds[1], // B.Pharm
        requiredSkills: ["Pharmacology", "Regulatory", "Clinical Ops", "Documentation"],
        jobRoles: ["Pharmacist", "Clinical Research Associate", "Drug Safety Associate"],
        salaryRange: "₹4-12 LPA",
        growthProspects: "Good with certifications",
        industryDemand: "High",
        workEnvironment: "Hospitals, CROs, Pharma companies",
        isActive: true,
      },
      {
        title: "Chartered Accountant & Auditing",
        description: "Accounting, taxation, auditing, and financial compliance.",
        courseId: courseIds[2], // B.Com
        requiredSkills: ["Accounting", "Taxation", "Audit", "Excel", "Law Basics"],
        jobRoles: ["Auditor", "Tax Consultant", "Forensic Accountant", "Finance Controller"],
        salaryRange: "₹5-25 LPA",
        growthProspects: "Excellent with CA qualification",
        industryDemand: "Very High",
        workEnvironment: "Audit firms, corporates, consultancy",
        isActive: true,
      },
      {
        title: "Economics & Policy Analysis",
        description: "Economic research, market analysis, and public policy.",
        courseId: courseNameToId.get("Bachelor of Economics") || courseIds[2], // B.Econ
        requiredSkills: ["Econometrics", "Data Analysis", "Research", "Communication"],
        jobRoles: ["Policy Analyst", "Economist", "Business Analyst", "Risk Analyst"],
        salaryRange: "₹4-15 LPA",
        growthProspects: "Strong in public and private sector",
        industryDemand: "High",
        workEnvironment: "Think tanks, govt departments, corporates",
        isActive: true,
      },
      {
        title: "Journalism & Media",
        description: "News reporting, editing, content production, and broadcasting.",
        courseId: courseNameToId.get("Bachelor of Journalism and Mass Communication") || courseIds[0], // BJMC
        requiredSkills: ["Writing", "Editing", "Research", "Communication"],
        jobRoles: ["Journalist", "TV Reporter", "Editor", "Content Strategist", "PR Officer"],
        salaryRange: "₹3-12 LPA",
        growthProspects: "Good with portfolio and experience",
        industryDemand: "Moderate to High",
        workEnvironment: "Newsrooms, digital media, PR firms",
        isActive: true,
      },
      {
        title: "Social Sector & Development",
        description: "Community development, policy implementation, and social services.",
        courseId: courseIds[0], // B.A.
        requiredSkills: ["Advocacy", "Project Management", "Counseling", "Research"],
        jobRoles: ["Social Worker", "NGO Program Officer", "Community Coordinator"],
        salaryRange: "₹3-10 LPA",
        growthProspects: "Good with master's and field experience",
        industryDemand: "High in public sector",
        workEnvironment: "NGOs, govt agencies, international orgs",
        isActive: true,
      },
      {
        title: "Marketing & Growth",
        description: "Brand management, market research, and digital marketing.",
        courseId: courseIds[3], // BBA
        requiredSkills: ["Marketing", "Analytics", "Communication", "Creativity"],
        jobRoles: ["Marketing Executive", "Brand Manager", "Growth Marketer", "Product Marketer"],
        salaryRange: "₹4-18 LPA",
        growthProspects: "Excellent in tech and FMCG",
        industryDemand: "High",
        workEnvironment: "Startups, corporates, agencies",
        isActive: true,
      },
    ];

    for (const careerPath of careerPaths) {
      if (!careerTitleToId.has(careerPath.title)) {
        await ctx.db.insert("careerPaths", careerPath);
      }
    }

    // Seed important dates
    const now = Date.now();
    const importantDates = [
      {
        title: "DU Admission Registration",
        description: "Delhi University undergraduate admission registration opens",
        date: now + (30 * 24 * 60 * 60 * 1000), // 30 days from now
        type: "admission",
        courseIds: courseIds.slice(0, 4),
        collegeIds: [collegeIds[0]],
        state: "Delhi",
        isActive: true,
      },
      {
        title: "JEE Main Registration",
        description: "Joint Entrance Examination Main registration for engineering admissions",
        date: now + (45 * 24 * 60 * 60 * 1000), // 45 days from now
        type: "exam",
        state: "All India",
        isActive: true,
      },
      {
        title: "NEET Registration",
        description: "National Eligibility cum Entrance Test for medical admissions",
        date: now + (60 * 24 * 60 * 60 * 1000), // 60 days from now
        type: "exam",
        state: "All India",
        isActive: true,
      },
    ];

    for (const date of importantDates) {
      await ctx.db.insert("importantDates", date);
    }

    // Seed resources
    const resources = [
      {
        title: "Complete Guide to Career Planning",
        description: "Comprehensive guide for students to plan their career after Class 12",
        type: "ebook",
        url: "https://example.com/career-guide.pdf",
        category: "arts" as const,
        tags: ["career", "planning", "guidance", "students"],
        isActive: true,
      },
      {
        title: "Science Stream Career Options",
        description: "Detailed overview of career opportunities in science field",
        type: "article",
        url: "https://example.com/science-careers",
        category: "science" as const,
        tags: ["science", "career", "opportunities", "research"],
        isActive: true,
      },
      {
        title: "Commerce and Business Fundamentals",
        description: "Basic concepts of commerce and business for beginners",
        type: "video",
        url: "https://example.com/commerce-basics",
        category: "commerce" as const,
        tags: ["commerce", "business", "fundamentals", "basics"],
        isActive: true,
      },
    ];

    for (const resource of resources) {
      await ctx.db.insert("resources", resource);
    }

    return "Database seeded successfully";
  },
});