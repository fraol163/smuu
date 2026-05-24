"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, CheckCircle, Briefcase, Users, Building2,
  TrendingUp, Clock, XCircle, Loader2, Star, FileText, GraduationCap,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    Promise.all([
      fetch("/api/jobs?all=true").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/applications?all=true").then((r) => r.json()),
    ]).then(([jobsData, usersData, appsData]) => {
      setJobs(jobsData);
      setUsersList(usersData);
      setApplications(appsData);
      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, [user]);

  if (isLoading || loadingData) {
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

  const students = usersList.filter((u: any) => u.role === "student");
  const employers = usersList.filter((u: any) => u.role === "employer");
  const pendingJobs = jobs.filter((j: any) => !j.is_approved);
  const pendingStudents = students.filter((s: any) => !s.is_approved);
  const pendingEmployers = employers.filter((e: any) => !e.is_approved);

  const handleApprove = async (type: string, id: number) => {
    setApprovingId(id);
    if (type === "Job") {
      await fetch("/api/jobs", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "approve" }) });
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, is_approved: true } : j));
    } else {
      await fetch("/api/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "approve" }) });
      setUsersList((prev) => prev.map((u: any) => u.id === id ? { ...u, is_approved: true } : u));
    }
    setApprovingId(null);
  };

  const handleReject = async (type: string, id: number) => {
    setApprovingId(id);
    if (type === "Job") {
      await fetch("/api/jobs", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "reject" }) });
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } else {
      await fetch("/api/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "reject" }) });
      setUsersList((prev) => prev.filter((u: any) => u.id !== id));
    }
    setApprovingId(null);
  };

  const handleToggleFeatured = async (jobId: number) => {
    setApprovingId(jobId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, is_featured: !j.is_featured } : j));
    setApprovingId(null);
  };

  const handleUpdateAppStatus = async (appId: number, status: string) => {
    await fetch("/api/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: appId, status }) });
    setApplications((prev) => prev.map((a: any) => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 bg-grid-subtle">
        <div className="mb-12 border-l-4 border-primary pl-8 py-2">
          <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight">Administrative Oversight</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            System Governance • Academic Standards • Institutional Quality
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, value: jobs.length, label: "Total Postings" },
            { icon: GraduationCap, value: students.length, label: "Students" },
            { icon: Building2, value: employers.length, label: "Employers" },
            { icon: FileText, value: applications.length, label: "Applications" },
          ].map((stat) => (
            <Card key={stat.label} className="border-2 border-border bg-card shadow-sm rounded-sm">
              <CardContent className="flex items-center gap-6 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="jobs" className="space-y-10">
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border flex-wrap">
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" /> Jobs
              {pendingJobs.length > 0 && <Badge variant="destructive" className="ml-1">{pendingJobs.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <GraduationCap className="h-4 w-4" /> Students
              {pendingStudents.length > 0 && <Badge variant="destructive" className="ml-1">{pendingStudents.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Building2 className="h-4 w-4" /> Employers
              {pendingEmployers.length > 0 && <Badge variant="destructive" className="ml-1">{pendingEmployers.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <FileText className="h-4 w-4" /> Applications
            </TabsTrigger>
          </TabsList>

          {/* JOBS TAB */}
          <TabsContent value="jobs" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Pending Review</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {pendingJobs.length === 0 ? (
              <Card className="border-2 border-border bg-card p-12 text-center rounded-sm">
                <CheckCircle className="mx-auto h-12 w-12 text-primary/20 mb-4" />
                <p className="text-muted-foreground font-serif italic">No jobs pending review.</p>
              </Card>
            ) : pendingJobs.map((job: any) => (
              <Card key={job.id} className="border-2 border-border bg-card p-6 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif font-bold text-foreground">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-2">{job.company_name}</Badge>
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge variant="secondary">{job.job_type?.replace("_", "-")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.description?.slice(0, 100)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove("Job", job.id)} disabled={approvingId === job.id} className="bg-success hover:bg-success/90">
                      {approvingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-1 h-4 w-4" /> Approve</>}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject("Job", job.id)} disabled={approvingId === job.id}>
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex items-center gap-4 mt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Live Listings</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {jobs.filter((j: any) => j.is_approved).map((job: any) => (
              <Card key={job.id} className="border-2 border-border bg-card p-4 rounded-sm group">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                    {job.is_featured && <Badge className="bg-accent text-accent-foreground"><Star className="mr-1 h-3 w-3 fill-current" /> Featured</Badge>}
                    <span className="text-xs text-muted-foreground">{job.company_name} • {job.application_count || 0} apps</span>
                  </div>
                  <Button size="sm" variant={job.is_featured ? "outline" : "secondary"} onClick={() => handleToggleFeatured(job.id)} className="text-[10px] uppercase tracking-widest">
                    <Star className={`mr-1 h-3 w-3 ${job.is_featured ? "fill-accent text-accent" : ""}`} />
                    {job.is_featured ? "Demote" : "Promote"}
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* STUDENTS TAB */}
          <TabsContent value="students" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Pending Verification</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {pendingStudents.length === 0 ? (
              <Card className="border-2 border-border bg-card p-12 text-center rounded-sm">
                <CheckCircle className="mx-auto h-12 w-12 text-primary/20 mb-4" />
                <p className="text-muted-foreground font-serif italic">No students pending verification.</p>
              </Card>
            ) : pendingStudents.map((s: any) => (
              <Card key={s.id} className="border-2 border-border bg-card p-6 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif font-bold text-foreground">{s.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline" className="font-mono">{s.smu_id}</Badge>
                      <Badge variant="secondary">{s.department}</Badge>
                      <span className="text-muted-foreground">GPA {s.gpa?.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove("Student", s.id)} disabled={approvingId === s.id} className="bg-success hover:bg-success/90">
                      {approvingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-1 h-4 w-4" /> Verify</>}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject("Student", s.id)} disabled={approvingId === s.id}>
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex items-center gap-4 mt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Verified Students</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {students.filter((s: any) => s.is_approved).map((s: any) => (
                <Card key={s.id} className="border-2 border-border bg-card p-4 rounded-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-foreground">{s.name}</h4>
                    <Badge variant="outline" className="font-mono text-[10px]">{s.smu_id}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{s.department} • GPA {s.gpa?.toFixed(2)}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EMPLOYERS TAB */}
          <TabsContent value="employers" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Pending Verification</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {pendingEmployers.length === 0 ? (
              <Card className="border-2 border-border bg-card p-12 text-center rounded-sm">
                <CheckCircle className="mx-auto h-12 w-12 text-primary/20 mb-4" />
                <p className="text-muted-foreground font-serif italic">No employers pending verification.</p>
              </Card>
            ) : pendingEmployers.map((e: any) => (
              <Card key={e.id} className="border-2 border-border bg-card p-6 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif font-bold text-foreground">{e.company_name}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary">{e.company_sector}</Badge>
                      <span className="text-muted-foreground">Rep: {e.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{e.email}</p>
                    <p className="text-xs text-muted-foreground italic">{e.company_description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove("Employer", e.id)} disabled={approvingId === e.id} className="bg-success hover:bg-success/90">
                      {approvingId === e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-1 h-4 w-4" /> Authorize</>}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject("Employer", e.id)} disabled={approvingId === e.id}>
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex items-center gap-4 mt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Verified Employers</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {employers.filter((e: any) => e.is_approved).map((e: any) => (
                <Card key={e.id} className="border-2 border-border bg-card p-4 rounded-sm">
                  <h4 className="font-serif font-bold text-foreground">{e.company_name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">{e.company_sector} • {e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.email}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications" className="space-y-6 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">All Applications ({applications.length})</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {applications.length === 0 ? (
              <Card className="border-2 border-border bg-card p-12 text-center rounded-sm">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground font-serif italic">No applications submitted yet.</p>
              </Card>
            ) : applications.map((app: any) => (
              <Card key={app.id} className="border-2 border-border bg-card p-6 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-serif font-bold text-foreground">{app.student_name}</h4>
                      <span className="text-xs text-muted-foreground">→</span>
                      <h4 className="font-serif font-bold text-primary">{app.job_title}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline">{app.student_department}</Badge>
                      <Badge variant="secondary">{app.company_name}</Badge>
                      <span className="text-muted-foreground">GPA {app.student_gpa}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{app.student_email}</span>
                    </div>
                    {app.cover_letter && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-accent pl-3">{app.cover_letter.slice(0, 120)}...</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                    {app.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleUpdateAppStatus(app.id, "accepted")} className="h-7 px-2 text-[10px] bg-success hover:bg-success/90">Accept</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateAppStatus(app.id, "rejected")} className="h-7 px-2 text-[10px]">Reject</Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
