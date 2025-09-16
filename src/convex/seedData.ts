import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingCourses = await ctx.db.query("courses").take(1);
    if (existingCourses.length > 0) {
      return "Database already seeded";
    }

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
    ];

    const courseIds = [];
    for (const course of courses) {
      const courseId = await ctx.db.insert("courses", course);
      courseIds.push(courseId);
    }

    // Seed colleges
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
    ];

    const collegeIds = [];
    for (const college of colleges) {
      const collegeId = await ctx.db.insert("colleges", college);
      collegeIds.push(collegeId);
    }

    // Seed career paths
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
    ];

    for (const careerPath of careerPaths) {
      await ctx.db.insert("careerPaths", careerPath);
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
