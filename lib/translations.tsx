"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "am";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.jobs": "Browse Jobs",
    "nav.mentors": "Alumni Mentors",
    "nav.login": "Sign In",
    "nav.register": "Get Started",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Sign Out",
    
    // Landing
    "hero.title": "Your Future Starts Here",
    "hero.subtitle": "Connect with top employers and discover internships & jobs tailored to your academic background at St. Mary's University.",
    "hero.cta.student": "Register as Student",
    "hero.cta.employer": "Register as Employer",
    "hero.cta.browse": "Browse Jobs",
    
    // Stats
    "stats.students": "Active Students",
    "stats.employers": "Partner Employers",
    "stats.jobs": "Open Positions",
    "stats.placements": "Successful Placements",
    
    // Features
    "features.title": "Why SMU Career Connect?",
    "features.matching.title": "Smart Matching",
    "features.matching.desc": "AI-powered match scores help you find jobs that align with your skills and department.",
    "features.verified.title": "Verified Students",
    "features.verified.desc": "Only genuine SMU students can register using their university ID.",
    "features.bilingual.title": "Bilingual Support",
    "features.bilingual.desc": "Full Amharic language support for all platform features.",
    "features.free.title": "Always Free",
    "features.free.desc": "100% free for all SMU students and graduates. No hidden fees.",
    
    // Departments
    "dept.cs": "Computer Science",
    "dept.marketing": "Marketing",
    "dept.accounting": "Accounting",
    "dept.tourism": "Tourism",
    "dept.economics": "Economics",
    
    // Sectors
    "sector.banking": "Banking & Finance",
    "sector.ngo": "NGO",
    "sector.tech": "Technology",
    "sector.telecom": "Telecom",
    "sector.government": "Government",
    
    // Job Types
    "jobtype.internship": "Internship",
    "jobtype.full_time": "Full-Time",
    "jobtype.part_time": "Part-Time",
    
    // Status
    "status.pending": "Pending",
    "status.reviewed": "Reviewed",
    "status.accepted": "Accepted",
    "status.rejected": "Rejected",
    "status.approved": "Approved",
    
    // Match Score
    "match.strong": "Strong Match",
    "match.partial": "Partial Match",
    "match.low": "Low Match",
    "match.department": "Department",
    "match.skills": "Skills",
    "match.type": "Job Type",
    
    // Forms
    "form.email": "Email",
    "form.password": "Password",
    "form.name": "Full Name",
    "form.smu_id": "SMU Student ID",
    "form.gpa": "GPA",
    "form.skills": "Skills",
    "form.bio": "Bio",
    "form.graduation_year": "Expected Graduation Year",
    "form.company_name": "Company Name",
    "form.sector": "Sector",
    "form.company_desc": "Company Description",
    "form.website": "Website",
    "form.submit": "Submit",
    "form.login": "Sign In",
    "form.register": "Register",
    
    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.browse_jobs": "Browse Jobs",
    "dashboard.my_applications": "My Applications",
    "dashboard.my_profile": "My Profile",
    "dashboard.post_job": "Post a Job",
    "dashboard.my_jobs": "My Jobs",
    "dashboard.applicants": "Applicants",
    "dashboard.overview": "Overview",
    "dashboard.pending_students": "Pending Students",
    "dashboard.pending_employers": "Pending Employers",
    "dashboard.pending_jobs": "Pending Jobs",
    
    // Actions
    "action.apply": "Apply Now",
    "action.view": "View Details",
    "action.edit": "Edit",
    "action.delete": "Delete",
    "action.approve": "Approve",
    "action.reject": "Reject",
    "action.save": "Save Changes",
    "action.cancel": "Cancel",
    
    // Messages
    "msg.pending_approval": "Your account is pending admin approval.",
    "msg.invalid_credentials": "Invalid email or password.",
    "msg.registration_success": "Registration successful! Please wait for admin approval.",
    "msg.application_success": "Application submitted successfully!",
    "msg.no_jobs": "No jobs found matching your criteria.",
    "msg.no_applications": "You haven't applied to any jobs yet.",
    
    // Footer
    "footer.tagline": "Connecting SMU talent with opportunity.",
    "footer.contact": "Contact Us",
    "footer.about": "About",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
  },
  am: {
    // Navigation
    "nav.home": "መነሻ",
    "nav.jobs": "ስራዎችን ያስሱ",
    "nav.mentors": "የቀድሞ ተማሪ አማካሪዎች",
    "nav.login": "ግባ",
    "nav.register": "ጀምር",
    "nav.dashboard": "ዳሽቦርድ",
    "nav.logout": "ውጣ",
    
    // Landing
    "hero.title": "የእርስዎ የወደፊት ጊዜ እዚህ ይጀምራል",
    "hero.subtitle": "ከምርጥ አሰሪዎች ጋር ይገናኙ እና ከትምህርት ዳራዎ ጋር የሚስማሙ ስታጆችና ስራዎችን ያግኙ።",
    "hero.cta.student": "እንደ ተማሪ ይመዝገቡ",
    "hero.cta.employer": "እንደ አሰሪ ይመዝገቡ",
    "hero.cta.browse": "ስራዎችን ይመልከቱ",
    
    // Stats
    "stats.students": "ንቁ ተማሪዎች",
    "stats.employers": "አጋር አሰሪዎች",
    "stats.jobs": "ክፍት ቦታዎች",
    "stats.placements": "የተሳካ ምደባዎች",
    
    // Features
    "features.title": "ለምን SMU Career Connect?",
    "features.matching.title": "ብልጥ ማዛመድ",
    "features.matching.desc": "የ AI ማዛመጃ ነጥቦች ከክህሎትዎና ከዲፓርትመንትዎ ጋር የሚስማሙ ስራዎችን እንዲያገኙ ይረዳዎታል።",
    "features.verified.title": "የተረጋገጡ ተማሪዎች",
    "features.verified.desc": "እውነተኛ የ SMU ተማሪዎች ብቻ በዩኒቨርሲቲ መታወቂያቸው መመዝገብ ይችላሉ።",
    "features.bilingual.title": "ሁለት ቋንቋ ድጋፍ",
    "features.bilingual.desc": "ለሁሉም የመድረክ ባህሪያት ሙሉ የአማርኛ ቋንቋ ድጋፍ።",
    "features.free.title": "ሁልጊዜ ነጻ",
    "features.free.desc": "ለሁሉም የ SMU ተማሪዎችና ምሩቃን 100% ነጻ። ምንም ተደብቀው ክፍያዎች የሉም።",
    
    // Departments
    "dept.cs": "ኮምፒውተር ሳይንስ",
    "dept.marketing": "ግብይት",
    "dept.accounting": "የሂሳብ አያያዝ",
    "dept.tourism": "ቱሪዝም",
    "dept.economics": "ኢኮኖሚክስ",
    
    // Sectors
    "sector.banking": "ባንክና ፋይናንስ",
    "sector.ngo": "መንግስታዊ ያልሆነ ድርጅት",
    "sector.tech": "ቴክኖሎጂ",
    "sector.telecom": "ቴሌኮም",
    "sector.government": "መንግስት",
    
    // Job Types
    "jobtype.internship": "ስታጅ",
    "jobtype.full_time": "ሙሉ ጊዜ",
    "jobtype.part_time": "ከፊል ጊዜ",
    
    // Status
    "status.pending": "በመጠባበቅ ላይ",
    "status.reviewed": "ተገምግሟል",
    "status.accepted": "ተቀባይነት አግኝቷል",
    "status.rejected": "ውድቅ ተደርጓል",
    "status.approved": "ፀድቋል",
    
    // Match Score
    "match.strong": "ጠንካራ ተዛማጅነት",
    "match.partial": "ከፊል ተዛማጅነት",
    "match.low": "ዝቅተኛ ተዛማጅነት",
    "match.department": "ዲፓርትመንት",
    "match.skills": "ክህሎቶች",
    "match.type": "የስራ አይነት",
    
    // Forms
    "form.email": "ኢሜይል",
    "form.password": "የይለፍ ቃል",
    "form.name": "ሙሉ ስም",
    "form.smu_id": "የ SMU ተማሪ መታወቂያ",
    "form.gpa": "ጂፒኤ",
    "form.skills": "ክህሎቶች",
    "form.bio": "ስለራስዎ",
    "form.graduation_year": "የሚጠበቅ የምረቃ ዓመት",
    "form.company_name": "የኩባንያ ስም",
    "form.sector": "ዘርፍ",
    "form.company_desc": "የኩባንያ መግለጫ",
    "form.website": "ድረ-ገጽ",
    "form.submit": "አስገባ",
    "form.login": "ግባ",
    "form.register": "ተመዝገብ",
    
    // Dashboard
    "dashboard.welcome": "እንኳን ደህና መጡ",
    "dashboard.browse_jobs": "ስራዎችን ያስሱ",
    "dashboard.my_applications": "የእኔ ማመልከቻዎች",
    "dashboard.my_profile": "የእኔ መገለጫ",
    "dashboard.post_job": "ስራ ያስገቡ",
    "dashboard.my_jobs": "የእኔ ስራዎች",
    "dashboard.applicants": "አመልካቾች",
    "dashboard.overview": "አጠቃላይ እይታ",
    "dashboard.pending_students": "በመጠባበቅ ላይ ያሉ ተማሪዎች",
    "dashboard.pending_employers": "በመጠባበቅ ላይ ያሉ አሰሪዎች",
    "dashboard.pending_jobs": "በመጠባበቅ ላይ ያሉ ስራዎች",
    
    // Actions
    "action.apply": "አሁን ያመልክቱ",
    "action.view": "ዝርዝሮችን ይመልከቱ",
    "action.edit": "አርም",
    "action.delete": "ሰርዝ",
    "action.approve": "አጽድቅ",
    "action.reject": "ውድቅ አድርግ",
    "action.save": "ለውጦችን አስቀምጥ",
    "action.cancel": "ሰርዝ",
    
    // Messages
    "msg.pending_approval": "መለያዎ የአስተዳዳሪ ፈቃድ በመጠባበቅ ላይ ነው።",
    "msg.invalid_credentials": "ልክ ያልሆነ ኢሜይል ወይም የይለፍ ቃል።",
    "msg.registration_success": "ምዝገባ ተሳክቷል! እባክዎ የአስተዳዳሪ ፈቃድ ይጠብቁ።",
    "msg.application_success": "ማመልከቻ በተሳካ ሁኔታ ገብቷል!",
    "msg.no_jobs": "ከመስፈርትዎ ጋር የሚዛመድ ስራ አልተገኘም።",
    "msg.no_applications": "ገና ለምንም ስራ አላመለከቱም።",
    
    // Footer
    "footer.tagline": "የ SMU ችሎታን ከዕድል ጋር ማገናኘት።",
    "footer.contact": "ያግኙን",
    "footer.about": "ስለ እኛ",
    "footer.privacy": "የግላዊነት ፖሊሲ",
    "footer.terms": "የአገልግሎት ውሎች",
  },
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("smu-lang") as Language;
    if (saved && (saved === "en" || saved === "am")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("smu-lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
