// Shared in-memory database using global variable
// Persists across API route invocations within the same Vercel container
// For production: swap with PostgreSQL/Supabase/PlanetScale

declare global {
  var __db: {
    users: DBUser[];
    jobs: DBJob[];
    applications: DBApplication[];
    nextIds: { user: number; job: number; application: number };
  } | undefined;
}

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "employer" | "admin";
  is_approved: boolean;
  smu_id?: string;
  department?: string;
  gpa?: number;
  skills?: string[];
  bio?: string;
  graduation_year?: number;
  company_name?: string;
  company_sector?: string;
  company_description?: string;
  company_website?: string;
}

export interface DBJob {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  requirements: string[];
  department: string;
  sector: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  company_name?: string;
  application_count?: number;
}

export interface DBApplication {
  id: number;
  student_id: number;
  job_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter: string;
  created_at: string;
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

function getSeedData() {
  return {
    users: [
      { id: 1, name: "Abebe Kebede", email: "abebe@smu.edu.et", password: "password123", role: "student" as const, is_approved: true, smu_id: "RCD/0045/2020", department: "Computer Science", gpa: 3.75, skills: ["JavaScript", "React", "Node.js", "Python", "SQL"], bio: "Passionate software developer interested in web technologies and AI.", graduation_year: 2024 },
      { id: 2, name: "Sara Hailu", email: "sara@smu.edu.et", password: "password123", role: "student" as const, is_approved: true, smu_id: "RMD/0023/2021", department: "Marketing", gpa: 3.5, skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"], bio: "Creative marketer with a focus on digital campaigns.", graduation_year: 2025 },
      { id: 3, name: "Dawit Tesfaye", email: "dawit@smu.edu.et", password: "password123", role: "student" as const, is_approved: false, smu_id: "RAD/0012/2022", department: "Accounting", gpa: 3.8, skills: ["QuickBooks", "Excel", "Financial Analysis", "Taxation"], bio: "Detail-oriented accounting student with internship experience.", graduation_year: 2026 },
      { id: 4, name: "Hirut Berhane", email: "hirut@techco.com", password: "password123", role: "employer" as const, is_approved: true, company_name: "TechCo Ethiopia", company_sector: "Technology", company_description: "Leading software development company in Addis Ababa.", company_website: "https://techco.et" },
      { id: 5, name: "Yonas Assefa", email: "yonas@cbe.com.et", password: "password123", role: "employer" as const, is_approved: true, company_name: "Commercial Bank of Ethiopia", company_sector: "Banking & Finance", company_description: "The largest bank in Ethiopia with nationwide presence.", company_website: "https://cbe.com.et" },
      { id: 6, name: "Admin User", email: "admin@smu.edu.et", password: "admin123", role: "admin" as const, is_approved: true },
      { id: 7, name: "Mekdes Girma", email: "mekdes@savechildren.org", password: "password123", role: "employer" as const, is_approved: false, company_name: "Save the Children Ethiopia", company_sector: "NGO", company_description: "International NGO focused on children's rights and welfare.", company_website: "https://savethechildren.org" },
    ] as DBUser[],
    jobs: [
      { id: 1, employer_id: 4, title: "Junior Software Developer", description: "We are looking for a passionate junior developer to join our growing team.", requirements: ["JavaScript", "React", "Node.js", "Git"], department: "Computer Science", sector: "Technology", job_type: "full_time", salary_min: 15000, salary_max: 25000, location: "Addis Ababa", is_approved: true, is_featured: true, created_at: "2024-01-15", company_name: "TechCo Ethiopia", application_count: 12 },
      { id: 2, employer_id: 4, title: "Software Engineering Intern", description: "Join our internship program and gain hands-on experience.", requirements: ["Python", "SQL", "Problem Solving"], department: "Computer Science", sector: "Technology", job_type: "internship", salary_min: 5000, salary_max: 8000, location: "Addis Ababa", is_approved: true, is_featured: false, created_at: "2024-01-20", company_name: "TechCo Ethiopia", application_count: 28 },
      { id: 3, employer_id: 5, title: "Banking Associate", description: "Join the Commercial Bank of Ethiopia as a Banking Associate.", requirements: ["Customer Service", "Financial Analysis", "Excel", "Communication"], department: "Accounting", sector: "Banking & Finance", job_type: "full_time", salary_min: 18000, salary_max: 28000, location: "Addis Ababa", is_approved: true, is_featured: true, created_at: "2024-01-18", company_name: "Commercial Bank of Ethiopia", application_count: 35 },
      { id: 4, employer_id: 5, title: "Finance Intern", description: "Excellent opportunity for accounting and economics students.", requirements: ["Excel", "Financial Analysis", "Attention to Detail"], department: "Accounting", sector: "Banking & Finance", job_type: "internship", salary_min: 4000, salary_max: 6000, location: "Addis Ababa", is_approved: true, is_featured: false, created_at: "2024-01-22", company_name: "Commercial Bank of Ethiopia", application_count: 42 },
      { id: 5, employer_id: 4, title: "Digital Marketing Specialist", description: "We need a creative digital marketer to help grow our online presence.", requirements: ["Social Media", "Content Strategy", "Analytics", "SEO"], department: "Marketing", sector: "Technology", job_type: "full_time", salary_min: 12000, salary_max: 20000, location: "Addis Ababa", is_approved: true, is_featured: false, created_at: "2024-01-25", company_name: "TechCo Ethiopia", application_count: 18 },
      { id: 6, employer_id: 5, title: "Data Analyst", description: "Join our analytics team to help drive data-driven decisions.", requirements: ["SQL", "Python", "Excel", "Statistics", "Data Visualization"], department: "Economics", sector: "Banking & Finance", job_type: "full_time", salary_min: 20000, salary_max: 35000, location: "Addis Ababa", is_approved: true, is_featured: true, created_at: "2024-01-28", company_name: "Commercial Bank of Ethiopia", application_count: 23 },
      { id: 7, employer_id: 7, title: "Program Coordinator", description: "Help coordinate our community development programs across Ethiopia.", requirements: ["Project Management", "Communication", "Community Outreach", "Report Writing"], department: "Tourism", sector: "NGO", job_type: "full_time", salary_min: 15000, salary_max: 22000, location: "Addis Ababa", is_approved: false, is_featured: false, created_at: "2024-01-30", company_name: "Save the Children Ethiopia", application_count: 0 },
      { id: 8, employer_id: 4, title: "UI/UX Designer", description: "Design beautiful and intuitive user interfaces.", requirements: ["Figma", "User Research", "Prototyping", "Design Systems"], department: "Computer Science", sector: "Technology", job_type: "full_time", salary_min: 18000, salary_max: 30000, location: "Addis Ababa", is_approved: true, is_featured: false, created_at: "2024-02-01", company_name: "TechCo Ethiopia", application_count: 15 },
    ] as DBJob[],
    applications: [
      { id: 1, student_id: 1, job_id: 1, status: "reviewed" as const, cover_letter: "I am excited to apply for the Junior Software Developer position.", created_at: "2024-01-20", student_name: "Abebe Kebede", student_email: "abebe@smu.edu.et", student_department: "Computer Science", student_gpa: 3.75, student_skills: ["JavaScript", "React", "Node.js", "Python", "SQL"], student_bio: "Passionate software developer.", student_smu_id: "RCD/0045/2020", job_title: "Junior Software Developer", company_name: "TechCo Ethiopia" },
      { id: 2, student_id: 1, job_id: 6, status: "pending" as const, cover_letter: "I am applying for the Data Analyst position.", created_at: "2024-01-28", student_name: "Abebe Kebede", student_email: "abebe@smu.edu.et", student_department: "Computer Science", student_gpa: 3.75, student_skills: ["JavaScript", "React", "Node.js", "Python", "SQL"], student_bio: "Passionate software developer.", student_smu_id: "RCD/0045/2020", job_title: "Data Analyst", company_name: "Commercial Bank of Ethiopia" },
      { id: 3, student_id: 2, job_id: 5, status: "accepted" as const, cover_letter: "I am thrilled to apply for the Digital Marketing Specialist role.", created_at: "2024-01-26", student_name: "Sara Hailu", student_email: "sara@smu.edu.et", student_department: "Marketing", student_gpa: 3.5, student_skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"], student_bio: "Creative marketer.", student_smu_id: "RMD/0023/2021", job_title: "Digital Marketing Specialist", company_name: "TechCo Ethiopia" },
    ] as DBApplication[],
    nextIds: { user: 8, job: 9, application: 4 },
  };
}

// Use global variable to persist across serverless invocations
function getDB() {
  if (!global.__db) {
    global.__db = getSeedData();
  }
  return global.__db;
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function readDB() {
  return clone(getDB());
}

export function findUserByEmail(email: string): DBUser | undefined {
  return getDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<DBUser, "id">): DBUser {
  const db = getDB();
  const user: DBUser = { ...data, id: db.nextIds.user++ };
  db.users.push(user);
  return clone(user);
}

export function createApplication(data: Omit<DBApplication, "id">): DBApplication {
  const db = getDB();
  const app: DBApplication = { ...data, id: db.nextIds.application++ };
  db.applications.push(app);
  const job = db.jobs.find((j) => j.id === data.job_id);
  if (job) job.application_count = (job.application_count || 0) + 1;
  return clone(app);
}

export function getApplicationsByStudent(studentId: number): DBApplication[] {
  return getDB().applications.filter((a) => a.student_id === studentId).map(clone);
}

export function getApplicationsByJob(jobId: number): DBApplication[] {
  return getDB().applications.filter((a) => a.job_id === jobId).map(clone);
}

export function hasApplied(studentId: number, jobId: number): boolean {
  return getDB().applications.some((a) => a.student_id === studentId && a.job_id === jobId);
}

export function getApprovedJobs(): DBJob[] {
  return getDB().jobs.filter((j) => j.is_approved).map(clone);
}

export function getAllJobs(): DBJob[] {
  return getDB().jobs.map(clone);
}

export function getJobById(id: number): DBJob | undefined {
  return getDB().jobs.find((j) => j.id === id);
}

export function approveJob(id: number): void {
  const db = getDB();
  const job = db.jobs.find((j) => j.id === id);
  if (job) job.is_approved = true;
}

export function rejectJob(id: number): void {
  const db = getDB();
  db.jobs = db.jobs.filter((j) => j.id !== id);
}

export function approveUser(id: number): void {
  const db = getDB();
  const user = db.users.find((u) => u.id === id);
  if (user) user.is_approved = true;
}

export function rejectUser(id: number): void {
  const db = getDB();
  db.users = db.users.filter((u) => u.id !== id);
}

export function getAllUsers(): DBUser[] {
  return getDB().users.map(clone);
}

export function createJob(data: Omit<DBJob, "id">): DBJob {
  const db = getDB();
  const job: DBJob = { ...data, id: db.nextIds.job++ };
  db.jobs.push(job);
  return clone(job);
}

export function updateApplicationStatus(appId: number, status: DBApplication["status"]): void {
  const db = getDB();
  const app = db.applications.find((a) => a.id === appId);
  if (app) app.status = status;
}
