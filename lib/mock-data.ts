import { Job, Student } from "./smu-utils";

// Mock jobs data
export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    employer_id: 4,
    title: "Junior Software Developer",
    description:
      "We are looking for a passionate junior developer to join our growing team. You will work on exciting projects using modern web technologies, collaborate with senior developers, and contribute to our innovative software solutions.",
    requirements: ["JavaScript", "React", "Node.js", "Git"],
    department: "Computer Science",
    sector: "Technology",
    job_type: "full_time",
    salary_min: 15000,
    salary_max: 25000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: true,
    created_at: "2024-01-15",
    company_name: "TechCo Ethiopia",
    application_count: 12,
  },
  {
    id: 2,
    employer_id: 4,
    title: "Software Engineering Intern",
    description:
      "Join our internship program and gain hands-on experience in software development. Learn from industry experts and work on real projects that impact thousands of users.",
    requirements: ["Python", "SQL", "Problem Solving"],
    department: "Computer Science",
    sector: "Technology",
    job_type: "internship",
    salary_min: 5000,
    salary_max: 8000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: false,
    created_at: "2024-01-20",
    company_name: "TechCo Ethiopia",
    application_count: 28,
  },
  {
    id: 3,
    employer_id: 5,
    title: "Banking Associate",
    description:
      "Join the Commercial Bank of Ethiopia as a Banking Associate. You will assist customers with their banking needs, process transactions, and learn about various banking products and services.",
    requirements: ["Customer Service", "Financial Analysis", "Excel", "Communication"],
    department: "Accounting",
    sector: "Banking & Finance",
    job_type: "full_time",
    salary_min: 18000,
    salary_max: 28000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: true,
    created_at: "2024-01-18",
    company_name: "Commercial Bank of Ethiopia",
    application_count: 35,
  },
  {
    id: 4,
    employer_id: 5,
    title: "Finance Intern",
    description:
      "Excellent opportunity for accounting and economics students to gain practical experience in banking and finance. You will work alongside experienced professionals and learn industry best practices.",
    requirements: ["Excel", "Financial Analysis", "Attention to Detail"],
    department: "Accounting",
    sector: "Banking & Finance",
    job_type: "internship",
    salary_min: 4000,
    salary_max: 6000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: false,
    created_at: "2024-01-22",
    company_name: "Commercial Bank of Ethiopia",
    application_count: 42,
  },
  {
    id: 5,
    employer_id: 4,
    title: "Digital Marketing Specialist",
    description:
      "We need a creative digital marketer to help grow our online presence. You will manage social media campaigns, create engaging content, and analyze marketing metrics.",
    requirements: ["Social Media", "Content Strategy", "Analytics", "SEO"],
    department: "Marketing",
    sector: "Technology",
    job_type: "full_time",
    salary_min: 12000,
    salary_max: 20000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: false,
    created_at: "2024-01-25",
    company_name: "TechCo Ethiopia",
    application_count: 18,
  },
  {
    id: 6,
    employer_id: 5,
    title: "Data Analyst",
    description:
      "Join our analytics team to help drive data-driven decisions. You will analyze large datasets, create reports, and provide insights that shape our business strategies.",
    requirements: ["SQL", "Python", "Excel", "Statistics", "Data Visualization"],
    department: "Economics",
    sector: "Banking & Finance",
    job_type: "full_time",
    salary_min: 20000,
    salary_max: 35000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: true,
    created_at: "2024-01-28",
    company_name: "Commercial Bank of Ethiopia",
    application_count: 23,
  },
  {
    id: 7,
    employer_id: 7,
    title: "Program Coordinator",
    description:
      "Help coordinate our community development programs across Ethiopia. You will work with local communities, manage project timelines, and ensure program objectives are met.",
    requirements: ["Project Management", "Communication", "Community Outreach", "Report Writing"],
    department: "Tourism",
    sector: "NGO",
    job_type: "full_time",
    salary_min: 15000,
    salary_max: 22000,
    location: "Addis Ababa",
    is_approved: false,
    is_featured: false,
    created_at: "2024-01-30",
    company_name: "Save the Children Ethiopia",
    application_count: 0,
  },
  {
    id: 8,
    employer_id: 4,
    title: "UI/UX Designer",
    description:
      "Design beautiful and intuitive user interfaces for our web and mobile applications. You will conduct user research, create wireframes, and collaborate with developers.",
    requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
    department: "Computer Science",
    sector: "Technology",
    job_type: "full_time",
    salary_min: 18000,
    salary_max: 30000,
    location: "Addis Ababa",
    is_approved: true,
    is_featured: false,
    created_at: "2024-02-01",
    company_name: "TechCo Ethiopia",
    application_count: 15,
  },
];

// Mock applications data
export interface Application {
  id: number;
  student_id: number;
  job_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter: string;
  created_at: string;
  // Populated fields
  student_name?: string;
  student_email?: string;
  student_department?: string;
  student_gpa?: number;
  student_skills?: string[];
  student_bio?: string;
  student_smu_id?: string;
  job_title?: string;
  company_name?: string;
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    student_id: 1,
    job_id: 1,
    status: "reviewed",
    cover_letter:
      "I am excited to apply for the Junior Software Developer position at TechCo Ethiopia. With my strong foundation in JavaScript and React, I believe I would be a valuable addition to your team.",
    created_at: "2024-01-20",
    student_name: "Abebe Kebede",
    student_email: "abebe@smu.edu.et",
    student_department: "Computer Science",
    student_gpa: 3.75,
    student_skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    student_bio: "Passionate software developer interested in web technologies and AI.",
    student_smu_id: "RCD/0045/2020",
    job_title: "Junior Software Developer",
    company_name: "TechCo Ethiopia",
  },
  {
    id: 2,
    student_id: 1,
    job_id: 6,
    status: "pending",
    cover_letter:
      "I am applying for the Data Analyst position. My programming skills in Python and SQL, combined with my analytical mindset, make me a strong candidate for this role.",
    created_at: "2024-01-28",
    student_name: "Abebe Kebede",
    student_email: "abebe@smu.edu.et",
    student_department: "Computer Science",
    student_gpa: 3.75,
    student_skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    student_bio: "Passionate software developer interested in web technologies and AI.",
    student_smu_id: "RCD/0045/2020",
    job_title: "Data Analyst",
    company_name: "Commercial Bank of Ethiopia",
  },
  {
    id: 3,
    student_id: 2,
    job_id: 5,
    status: "accepted",
    cover_letter:
      "I am thrilled to apply for the Digital Marketing Specialist role. My experience in social media management and content creation aligns perfectly with this position.",
    created_at: "2024-01-26",
    student_name: "Sara Hailu",
    student_email: "sara@smu.edu.et",
    student_department: "Marketing",
    student_gpa: 3.5,
    student_skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"],
    student_bio: "Creative marketer with a focus on digital campaigns.",
    student_smu_id: "RMD/0023/2021",
    job_title: "Digital Marketing Specialist",
    company_name: "TechCo Ethiopia",
  },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Abebe Kebede",
    email: "abebe@smu.edu.et",
    smu_id: "RCD/0045/2020",
    department: "Computer Science",
    gpa: 3.75,
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    bio: "Passionate software developer interested in web technologies and AI.",
    graduation_year: 2024,
    is_approved: true,
  },
  {
    id: 2,
    name: "Sara Hailu",
    email: "sara@smu.edu.et",
    smu_id: "RMD/0023/2021",
    department: "Marketing",
    gpa: 3.5,
    skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"],
    bio: "Creative marketer with a focus on digital campaigns.",
    graduation_year: 2025,
    is_approved: true,
  },
  {
    id: 3,
    name: "Dawit Tesfaye",
    email: "dawit@smu.edu.et",
    smu_id: "RAD/0012/2022",
    department: "Accounting",
    gpa: 3.8,
    skills: ["QuickBooks", "Excel", "Financial Analysis", "Taxation"],
    bio: "Detail-oriented accounting student with internship experience.",
    graduation_year: 2026,
    is_approved: false,
  },
];

export interface Employer {
  id: number;
  name: string;
  email: string;
  company_name: string;
  company_sector: string;
  company_description: string;
  company_website: string;
  is_approved: boolean;
  created_at?: string;
}

export const MOCK_EMPLOYERS: Employer[] = [
  {
    id: 4,
    name: "Hirut Berhane",
    email: "hirut@techco.com",
    company_name: "TechCo Ethiopia",
    company_sector: "Technology",
    company_description: "Leading software development company in Addis Ababa.",
    company_website: "https://techco.et",
    is_approved: true,
  },
  {
    id: 5,
    name: "Yonas Assefa",
    email: "yonas@cbe.com.et",
    company_name: "Commercial Bank of Ethiopia",
    company_sector: "Banking & Finance",
    company_description: "The largest bank in Ethiopia with nationwide presence.",
    company_website: "https://cbe.com.et",
    is_approved: true,
  },
  {
    id: 7,
    name: "Mekdes Girma",
    email: "mekdes@savechildren.org",
    company_name: "Save the Children Ethiopia",
    company_sector: "NGO",
    company_description: "International NGO focused on children's rights and welfare.",
    company_website: "https://savethechildren.org",
    is_approved: false,
    created_at: "2024-02-02",
  },
];

// Pending users for admin
export const PENDING_STUDENTS = [
  {
    id: 3,
    name: "Dawit Tesfaye",
    email: "dawit@smu.edu.et",
    smu_id: "RAD/0012/2022",
    department: "Accounting",
    gpa: 3.8,
    skills: ["QuickBooks", "Excel", "Financial Analysis", "Taxation"],
    bio: "Detail-oriented accounting student with internship experience.",
    graduation_year: 2026,
    created_at: "2024-02-01",
  },
];

export const PENDING_EMPLOYERS = [
  {
    id: 7,
    name: "Mekdes Girma",
    email: "mekdes@savechildren.org",
    company_name: "Save the Children Ethiopia",
    company_sector: "NGO",
    company_description: "International NGO focused on children's rights and welfare.",
    company_website: "https://savethechildren.org",
    created_at: "2024-02-02",
  },
];

export const PENDING_JOBS = [
  {
    id: 7,
    employer_id: 7,
    title: "Program Coordinator",
    description:
      "Help coordinate our community development programs across Ethiopia.",
    requirements: ["Project Management", "Communication", "Community Outreach", "Report Writing"],
    department: "Tourism",
    sector: "NGO",
    job_type: "full_time",
    salary_min: 15000,
    salary_max: 22000,
    location: "Addis Ababa",
    company_name: "Save the Children Ethiopia",
    created_at: "2024-01-30",
  },
];

// Alumni mentors data
export interface AlumniMentor {
  id: number;
  user_id: number;
  name: string;
  department: string;
  graduation_year: number;
  current_company: string;
  current_position: string;
  expertise: string[];
  contact_email: string;
  is_available: boolean;
}

export const ALUMNI_MENTORS: AlumniMentor[] = [
  {
    id: 1,
    user_id: 10,
    name: "Tigist Alemayehu",
    department: "Computer Science",
    graduation_year: 2018,
    current_company: "Google",
    current_position: "Senior Software Engineer",
    expertise: ["Backend Development", "System Design", "Career Growth"],
    contact_email: "tigist.alemayehu@gmail.com",
    is_available: true,
  },
  {
    id: 2,
    user_id: 11,
    name: "Solomon Bekele",
    department: "Marketing",
    graduation_year: 2019,
    current_company: "Unilever Ethiopia",
    current_position: "Brand Manager",
    expertise: ["Brand Strategy", "Market Research", "Leadership"],
    contact_email: "solomon.bekele@outlook.com",
    is_available: true,
  },
  {
    id: 3,
    user_id: 12,
    name: "Hana Tadesse",
    department: "Accounting",
    graduation_year: 2017,
    current_company: "Deloitte East Africa",
    current_position: "Audit Manager",
    expertise: ["Financial Audit", "Tax Planning", "Professional Certification"],
    contact_email: "hana.tadesse@deloitte.com",
    is_available: false,
  },
  {
    id: 4,
    user_id: 13,
    name: "Berhanu Mekonnen",
    department: "Economics",
    graduation_year: 2016,
    current_company: "World Bank",
    current_position: "Economic Analyst",
    expertise: ["Economic Policy", "Data Analysis", "International Development"],
    contact_email: "bmekonnen@worldbank.org",
    is_available: true,
  },
];

// Platform statistics
export const PLATFORM_STATS = {
  totalStudents: 1247,
  activeStudents: 892,
  pendingStudents: 45,
  totalEmployers: 67,
  activeEmployers: 52,
  pendingEmployers: 8,
  totalJobs: 156,
  activeJobs: 89,
  pendingJobs: 12,
  totalApplications: 2341,
  successfulPlacements: 312,
  departmentDistribution: {
    "Computer Science": 412,
    Marketing: 287,
    Accounting: 298,
    Tourism: 125,
    Economics: 125,
  },
  sectorDistribution: {
    Technology: 42,
    "Banking & Finance": 31,
    NGO: 18,
    Telecom: 15,
    Government: 12,
  },
};
