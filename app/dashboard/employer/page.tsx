"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TranslationProvider, useTranslation } from "@/lib/translations";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { MOCK_JOBS, MOCK_APPLICATIONS, Application } from "@/lib/mock-data";
import { Job } from "@/lib/smu-utils";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  PlusCircle,
  Building2,
  Users,
  Clock,
  Eye,
  Loader2,
  GraduationCap,
  Mail,
  Globe,
} from "lucide-react";

const DEPARTMENTS = ["Computer Science", "Marketing", "Accounting", "Tourism", "Economics"];
const SECTORS = ["Technology", "Banking & Finance", "NGO", "Telecom", "Government"];
const JOB_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
];

function EmployerDashboardContent() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: "",
    department: "",
    sector: "",
    job_type: "",
    salary_min: "",
    salary_max: "",
    location: "Addis Ababa",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "employer") {
    router.push("/login");
    return null;
  }

  // Get employer's jobs
  const employerJobs = jobs.filter((job) => job.employer_id === user.id);

  // Get applicants for selected job
  const getJobApplicants = (jobId: number): Application[] => {
    return applications.filter((app) => app.job_id === jobId);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingJob(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newJob: Job = {
      id: Math.max(...jobs.map((job) => job.id)) + 1,
      employer_id: user.id,
      title: jobForm.title,
      description: jobForm.description,
      requirements: jobForm.requirements
        .split(",")
        .map((requirement) => requirement.trim())
        .filter(Boolean),
      department: jobForm.department,
      sector: jobForm.sector || user.company_sector || "Other",
      job_type: jobForm.job_type as Job["job_type"],
      salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : undefined,
      salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : undefined,
      location: jobForm.location,
      is_approved: false,
      is_featured: false,
      created_at: new Date().toISOString(),
      company_name: user.company_name,
      application_count: 0,
    };
    setJobs((currentJobs) => [newJob, ...currentJobs]);
    // Reset form
    setJobForm({
      title: "",
      description: "",
      requirements: "",
      department: "",
      sector: "",
      job_type: "",
      salary_min: "",
      salary_max: "",
      location: "Addis Ababa",
    });
    setIsPostingJob(false);
  };

  const openApplicantsDialog = (jobId: number) => {
    setSelectedJob(jobId);
    setApplicantsDialogOpen(true);
  };

  const selectedJobData = selectedJob ? jobs.find((j) => j.id === selectedJob) : null;
  const selectedJobApplicants = selectedJob ? getJobApplicants(selectedJob) : [];

  const updateApplicationStatus = (applicationId: number, status: Application["status"]) => {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId ? { ...application, status } : application
      )
    );
  };

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 bg-grid-subtle">
        {/* Welcome Header */}
        <div className="mb-12 border-l-4 border-accent pl-8 py-2">
          <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight">
            {t("dashboard.welcome")}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            {user.company_name} • {user.company_sector} • Institutional Partner
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">{employerJobs.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Active Postings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent/5 border border-accent/10">
                <Users className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">
                  {employerJobs.reduce((sum, job) => sum + (job.application_count || 0), 0)}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Talent Pool Reach</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">
                  {employerJobs.filter((j) => !j.is_approved).length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Registry Review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="jobs" className="space-y-10">
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border">
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.my_jobs")}</span>
              <span className="sm:hidden">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.post_job")}</span>
              <span className="sm:hidden">Post</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Institutional Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* My Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6 outline-none">
            {employerJobs.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">You haven&apos;t published any opportunities yet.</p>
              </Card>
            ) : (
              employerJobs.map((job) => (
                <Card key={job.id} className="border-2 border-border bg-card p-8 rounded-sm hover:border-primary/50 transition-all group">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{job.title}</h3>
                        {!job.is_approved && (
                          <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30 rounded-sm font-bold uppercase text-[10px] tracking-widest">
                            Pending Review
                          </Badge>
                        )}
                        {job.is_featured && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground rounded-sm font-bold uppercase text-[10px] tracking-widest">
                            Partner Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Badge variant="outline" className="border-2 border-border font-bold text-[10px] tracking-widest rounded-sm">{job.department}</Badge>
                        <Badge variant="secondary" className="font-bold text-[10px] tracking-widest rounded-sm">{job.job_type.replace("_", "-")}</Badge>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 opacity-50" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openApplicantsDialog(job.id)}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-[0.2em] border-2"
                      >
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        {job.application_count || 0} Candidates
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="h-10 w-10 border-2 border-transparent hover:border-border">
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Post Job Tab */}
          <TabsContent value="post" className="outline-none">
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="h-2 bg-primary w-full" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">{t("dashboard.post_job")}</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                  Opportunities will undergo academic review before publication.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePostJob} className="space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-foreground">Position Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Junior Software Developer"
                        value={jobForm.title}
                        onChange={(e) =>
                          setJobForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                        className="bg-background border-2 h-12 focus-visible:ring-offset-0"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="department" className="text-xs font-bold uppercase tracking-widest text-foreground">Target Academic Discipline</Label>
                      <Select
                        value={jobForm.department}
                        onValueChange={(value) =>
                          setJobForm((prev) => ({ ...prev, department: value }))
                        }
                      >
                        <SelectTrigger className="bg-background border-2 h-12 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-foreground">Role Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Define the role, responsibilities, and institutional impact..."
                      value={jobForm.description}
                      onChange={(e) =>
                        setJobForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      required
                      rows={6}
                      className="bg-background border-2 focus-visible:ring-offset-0 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="requirements" className="text-xs font-bold uppercase tracking-widest text-foreground">Competency Requirements</Label>
                    <Input
                      id="requirements"
                      placeholder="JavaScript, React, Python... (comma-separated)"
                      value={jobForm.requirements}
                      onChange={(e) =>
                        setJobForm((prev) => ({ ...prev, requirements: e.target.value }))
                      }
                      className="bg-background border-2 h-12 focus-visible:ring-offset-0"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
                      Used for academic matching and candidate alignment.
                    </p>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-3">
                    <div className="space-y-3">
                      <Label htmlFor="job_type" className="text-xs font-bold uppercase tracking-widest text-foreground">Engagement Model</Label>
                      <Select
                        value={jobForm.job_type}
                        onValueChange={(value) =>
                          setJobForm((prev) => ({ ...prev, job_type: value }))
                        }
                      >
                        <SelectTrigger className="bg-background border-2 h-12 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="salary_min" className="text-xs font-bold uppercase tracking-widest text-foreground">Base Salary (ETB)</Label>
                      <Input
                        id="salary_min"
                        type="number"
                        placeholder="15000"
                        value={jobForm.salary_min}
                        onChange={(e) =>
                          setJobForm((prev) => ({ ...prev, salary_min: e.target.value }))
                        }
                        className="bg-background border-2 h-12 focus-visible:ring-offset-0"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="salary_max" className="text-xs font-bold uppercase tracking-widest text-foreground">Max Salary (ETB)</Label>
                      <Input
                        id="salary_max"
                        type="number"
                        placeholder="25000"
                        value={jobForm.salary_max}
                        onChange={(e) =>
                          setJobForm((prev) => ({ ...prev, salary_max: e.target.value }))
                        }
                        className="bg-background border-2 h-12 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-foreground">Deployment Location</Label>
                    <Input
                      id="location"
                      placeholder="Addis Ababa"
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="bg-background border-2 h-12 focus-visible:ring-offset-0"
                    />
                  </div>

                  <Button type="submit" disabled={isPostingJob} className="btn-editorial h-14 px-10 font-bold">
                    {isPostingJob ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing Records...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Publish Opportunity
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Profile Tab */}
          <TabsContent value="company" className="outline-none">
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="h-2 bg-accent w-full" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">Institutional Profile</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                  Public identification for academic recruitment.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-10 rounded-sm border-2 border-border bg-secondary/30 p-10 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Entity Name</Label>
                    <p className="text-2xl font-serif font-bold text-foreground">{user.company_name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Economic Sector</Label>
                    <p className="text-lg font-bold text-primary">{user.company_sector}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Institutional Mission</Label>
                    <p className="text-sm text-foreground/80 leading-relaxed font-serif italic border-l-2 border-accent pl-8 py-2">&quot;{user.company_description}&quot;</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Official Website</Label>
                    <p className="mt-1">
                      <a
                        href={user.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-primary hover:underline flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        {user.company_website}
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Applicants Dialog */}
        <Dialog open={applicantsDialogOpen} onOpenChange={setApplicantsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJobData?.title}</DialogTitle>
              <DialogDescription>
                {selectedJobApplicants.length} total applicants
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedJobApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground">No applicants yet</p>
              ) : (
                selectedJobApplicants.map((app) => (
                  <Card key={app.id} className="border-border bg-secondary/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{app.student_name}</h4>
                          <StatusBadge status={app.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5" />
                            {app.student_department}
                          </span>
                          <span>GPA: {app.student_gpa?.toFixed(2)}</span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {app.student_email}
                          </span>
                        </div>
                        {app.student_skills && (
                          <div className="flex flex-wrap gap-1">
                            {app.student_skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {app.cover_letter && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {app.cover_letter.slice(0, 200)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(app.id, "reviewed")}>
                        Mark Reviewed
                      </Button>
                      <Button size="sm" className="bg-primary" onClick={() => updateApplicationStatus(app.id, "accepted")}>
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateApplicationStatus(app.id, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApplicantsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function EmployerDashboardPage() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <EmployerDashboardContent />
      </AuthProvider>
    </TranslationProvider>
  );
}
