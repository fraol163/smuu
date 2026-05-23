"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TranslationProvider, useTranslation } from "@/lib/translations";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { MOCK_JOBS, MOCK_STUDENTS, MOCK_EMPLOYERS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { Job, Student } from "@/lib/smu-utils";
import { Employer } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  CheckCircle,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Clock,
  XCircle,
  Loader2,
  Star,
} from "lucide-react";

function AdminDashboardContent() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [employers, setEmployers] = useState<Employer[]>(MOCK_EMPLOYERS);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    router.push("/login");
    return null;
  }

  // Get pending items
  const pendingJobs = jobs.filter((job) => !job.is_approved);
  const pendingStudents = students.filter((s) => !s.is_approved);
  const pendingEmployers = employers.filter((e) => !e.is_approved);

  // Stats
  const totalJobs = jobs.length;
  const totalStudents = students.length;
  const totalEmployers = employers.length;
  const totalApplications = MOCK_APPLICATIONS.length;

  const handleApprove = async (type: string, id: number) => {
    setApprovingId(id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (type === "Job") {
      setJobs((currentJobs) =>
        currentJobs.map((job) => (job.id === id ? { ...job, is_approved: true } : job))
      );
    }
    if (type === "Student") {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === id ? { ...student, is_approved: true } : student
        )
      );
    }
    if (type === "Employer") {
      setEmployers((currentEmployers) =>
        currentEmployers.map((employer) =>
          employer.id === id ? { ...employer, is_approved: true } : employer
        )
      );
    }
    setApprovingId(null);
  };

  const handleReject = async (type: string, id: number) => {
    setApprovingId(id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (type === "Job") {
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== id));
    }
    if (type === "Student") {
      setStudents((currentStudents) => currentStudents.filter((student) => student.id !== id));
    }
    if (type === "Employer") {
      setEmployers((currentEmployers) =>
        currentEmployers.filter((employer) => employer.id !== id)
      );
    }
    setApprovingId(null);
  };

  const handleToggleFeatured = async (jobId: number) => {
    setApprovingId(jobId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId ? { ...job, is_featured: !job.is_featured } : job
      )
    );
    setApprovingId(null);
  };

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 bg-grid-subtle">
        {/* Welcome Header */}
        <div className="mb-12 border-l-4 border-primary pl-8 py-2">
          <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight">Administrative Oversight</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            System Governance • Academic Standards • Institutional Quality
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">{totalJobs}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Total Postings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent/5 border border-accent/10">
                <Users className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">{totalStudents}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Verified Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">{totalEmployers}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Entity Partners</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border bg-card shadow-sm rounded-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-accent/5 border border-accent/10">
                <TrendingUp className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-foreground">{totalApplications}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Exchange Flow</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
              {pendingJobs.length > 0 && (
                <Badge variant="destructive" className="ml-1 bg-destructive/20 text-destructive-foreground border-destructive/30">
                  {pendingJobs.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
              {pendingStudents.length > 0 && (
                <Badge variant="destructive" className="ml-1 bg-destructive/20 text-destructive-foreground border-destructive/30">
                  {pendingStudents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Employers</span>
              {pendingEmployers.length > 0 && (
                <Badge variant="destructive" className="ml-1 bg-destructive/20 text-destructive-foreground border-destructive/30">
                  {pendingEmployers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-10 outline-none">
            {/* Pending Approvals Summary */}
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden">
              <div className="h-2 bg-warning w-full" />
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-serif font-bold">
                  <Clock className="h-6 w-6 text-warning" />
                  Governance Queue
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Pending institutional verification requests.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-sm border-2 border-border bg-secondary/30 p-6 text-center">
                    <p className="text-4xl font-serif font-bold text-primary">{pendingJobs.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-2">Job Postings</p>
                  </div>
                  <div className="rounded-sm border-2 border-border bg-secondary/30 p-6 text-center">
                    <p className="text-4xl font-serif font-bold text-primary">{pendingStudents.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-2">Student Profiles</p>
                  </div>
                  <div className="rounded-sm border-2 border-border bg-secondary/30 p-6 text-center">
                    <p className="text-4xl font-serif font-bold text-primary">{pendingEmployers.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-2">Partner Entities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-2 border-border bg-card rounded-sm shadow-sm">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-serif font-bold">Registry Activity Log</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Live audit of system exchanges.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {MOCK_APPLICATIONS.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between border-b-2 border-border pb-6 last:border-0 last:pb-0 group"
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {app.student_name} <span className="text-muted-foreground font-normal mx-2">submitted to</span> {app.job_title}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                          {app.company_name} • {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Publication Queue</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            
            {pendingJobs.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <CheckCircle className="mx-auto h-16 w-16 text-primary/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">Verification queue is currently clear.</p>
              </Card>
            ) : (
              pendingJobs.map((job) => (
                <Card key={job.id} className="border-2 border-border bg-card p-8 rounded-sm hover:border-warning/50 transition-colors">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif font-bold text-foreground">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="border-2 border-border font-bold text-[10px] tracking-widest rounded-sm uppercase">{job.company_name}</Badge>
                        <Badge variant="secondary" className="font-bold text-[10px] tracking-widest rounded-sm uppercase">{job.department}</Badge>
                        <Badge variant="secondary" className="font-bold text-[10px] tracking-widest rounded-sm uppercase">{job.job_type.replace("_", "-")}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-6 py-1">
                        {job.description.slice(0, 150)}...
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleApprove("Job", job.id)}
                        disabled={approvingId === job.id}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest bg-success hover:bg-success/90"
                      >
                        {approvingId === job.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject("Job", job.id)}
                        disabled={approvingId === job.id}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest border-2"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            <div className="flex items-center gap-4 mt-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Live Listings</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="space-y-6">
              {jobs.filter((j) => j.is_approved).map((job) => (
                <Card key={job.id} className="border-2 border-border bg-card p-6 rounded-sm hover:border-primary/30 transition-all group">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                        {job.is_featured && (
                          <Badge className="bg-accent text-accent-foreground rounded-sm font-bold uppercase text-[10px] tracking-widest">
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {job.company_name} • {job.department} • {job.application_count} candidates
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={job.is_featured ? "outline" : "secondary"}
                      onClick={() => handleToggleFeatured(job.id)}
                      disabled={approvingId === job.id}
                      className="h-9 px-4 font-bold uppercase text-[10px] tracking-widest border-2"
                    >
                      <Star className={`mr-2 h-4 w-4 ${job.is_featured ? "fill-accent text-accent" : ""}`} />
                      {job.is_featured ? "Demote" : "Promote"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Identity Verification</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            {pendingStudents.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <CheckCircle className="mx-auto h-16 w-16 text-primary/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">No student records awaiting validation.</p>
              </Card>
            ) : (
              pendingStudents.map((student) => (
                <Card key={student.id} className="border-2 border-border bg-card p-8 rounded-sm">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif font-bold text-foreground">{student.name}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <Badge variant="outline" className="font-mono border-2 border-border text-primary rounded-sm">
                          {student.smu_id}
                        </Badge>
                        <Badge variant="secondary" className="rounded-sm">{student.department}</Badge>
                        <span className="text-muted-foreground">GPA {student.gpa.toFixed(2)}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{student.email}</p>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleApprove("Student", student.id)}
                        disabled={approvingId === student.id}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest bg-success hover:bg-success/90"
                      >
                        {approvingId === student.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify Identity
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject("Student", student.id)}
                        disabled={approvingId === student.id}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest border-2"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            <div className="flex items-center gap-4 mt-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Active Directory</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {students.filter((s) => s.is_approved).map((student) => (
                <Card key={student.id} className="border-2 border-border bg-card p-6 rounded-sm hover:border-primary/30 transition-all group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</h4>
                      <Badge variant="outline" className="font-mono text-[10px] border-2 border-border rounded-sm">
                        {student.smu_id}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                      {student.department} • GPA {student.gpa.toFixed(2)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Employers Tab */}
          <TabsContent value="employers" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Partner Vetting</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            {pendingEmployers.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <CheckCircle className="mx-auto h-16 w-16 text-primary/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">No institutional partners awaiting review.</p>
              </Card>
            ) : (
              pendingEmployers.map((employer) => (
                <Card key={employer.id} className="border-2 border-border bg-card p-8 rounded-sm">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif font-bold text-foreground">{employer.company_name}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <Badge variant="secondary" className="rounded-sm border-2 border-border bg-accent/10 text-accent-foreground">{employer.company_sector}</Badge>
                        <span className="text-muted-foreground">Rep: {employer.name}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{employer.email}</p>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleApprove("Employer", employer.id)}
                        disabled={approvingId === employer.id}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest bg-success hover:bg-success/90"
                      >
                        {approvingId === employer.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Authorize Partner
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject("Employer", employer.id)}
                        disabled={approvingId === employer.id}
                        className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest border-2"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            <div className="flex items-center gap-4 mt-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Affiliated Entities</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {employers.filter((e) => e.is_approved).map((employer) => (
                <Card key={employer.id} className="border-2 border-border bg-card p-6 rounded-sm hover:border-accent/50 transition-all group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-bold text-foreground group-hover:text-accent-foreground transition-colors">{employer.company_name}</h4>
                      <Badge variant="secondary" className="text-[10px] rounded-sm uppercase tracking-widest">{employer.company_sector}</Badge>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed">
                      Liaison: {employer.name} <br/> {employer.email}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <AdminDashboardContent />
      </AuthProvider>
    </TranslationProvider>
  );
}
