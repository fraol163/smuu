"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Briefcase, PlusCircle, Building2, Users, Clock, Eye,
  Loader2, Globe, FileText, CheckCircle, XCircle,
} from "lucide-react";

const DEPARTMENTS = ["Computer Science", "Marketing", "Accounting", "Tourism", "Economics"];
const JOB_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
];

export default function EmployerDashboardPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [jobForm, setJobForm] = useState({
    title: "", description: "", requirements: "", department: "",
    sector: "", job_type: "", salary_min: "", salary_max: "", location: "Addis Ababa",
  });

  useEffect(() => {
    if (!user || user.role !== "employer") return;
    Promise.all([
      fetch("/api/jobs?all=true").then((r) => r.json()),
      fetch("/api/applications?all=true").then((r) => r.json()),
    ]).then(([jobsData, appsData]) => {
      setJobs(jobsData);
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

  if (!user || user.role !== "employer") {
    router.push("/login");
    return null;
  }

  // Filter jobs belonging to this employer
  const employerJobs = jobs.filter((job: any) => job.employer_id === user.id);
  const employerJobIds = employerJobs.map((j: any) => j.id);

  // Filter applications for this employer's jobs
  const employerApplications = applications.filter((app: any) => employerJobIds.includes(app.job_id));

  // Stats
  const pendingJobs = employerJobs.filter((j: any) => !j.is_approved);
  const totalApplicants = employerApplications.length;
  const pendingApplicants = employerApplications.filter((a: any) => a.status === "pending").length;
  const acceptedApplicants = employerApplications.filter((a: any) => a.status === "accepted").length;

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employer_id: user.id,
          title: jobForm.title,
          description: jobForm.description,
          requirements: jobForm.requirements.split(",").map((r) => r.trim()).filter(Boolean),
          department: jobForm.department,
          sector: jobForm.sector || user.company_sector || "Other",
          job_type: jobForm.job_type,
          salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : undefined,
          salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : undefined,
          location: jobForm.location,
          company_name: user.company_name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs((prev) => [data.job, ...prev]);
        setJobForm({ title: "", description: "", requirements: "", department: "", sector: "", job_type: "", salary_min: "", salary_max: "", location: "Addis Ababa" });
      }
    } catch {}
    setIsPostingJob(false);
  };

  const handleUpdateAppStatus = async (appId: number, status: string) => {
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appId, status }),
    });
    setApplications((prev) => prev.map((a: any) => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 bg-grid-subtle">
        {/* Header */}
        <div className="mb-12 border-l-4 border-accent pl-8 py-2">
          <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight">
            {t("dashboard.welcome")}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            {user.company_name} • {user.company_sector} • Institutional Partner
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, value: employerJobs.length, label: "My Postings" },
            { icon: FileText, value: totalApplicants, label: "Total Applicants" },
            { icon: Clock, value: pendingApplicants, label: "Pending Review" },
            { icon: CheckCircle, value: acceptedApplicants, label: "Accepted" },
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

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-10">
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border flex-wrap">
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" /> My Jobs
              {pendingJobs.length > 0 && <Badge variant="destructive" className="ml-1">{pendingJobs.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="applicants" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Users className="h-4 w-4" /> Applicants
              {pendingApplicants > 0 && <Badge variant="destructive" className="ml-1">{pendingApplicants}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <PlusCircle className="h-4 w-4" /> Post Job
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2 px-4 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Building2 className="h-4 w-4" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* MY JOBS TAB */}
          <TabsContent value="jobs" className="space-y-6 outline-none">
            {employerJobs.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">No opportunities published yet.</p>
                <Button className="mt-6 btn-editorial" onClick={() => document.querySelector('[data-tab="post"]')?.click?.()}>
                  Post Your First Job
                </Button>
              </Card>
            ) : employerJobs.map((job: any) => {
              const jobApps = employerApplications.filter((a: any) => a.job_id === job.id);
              return (
                <Card key={job.id} className="border-2 border-border bg-card p-6 rounded-sm group hover:border-primary/30 transition-all">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                        {!job.is_approved && <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">Pending Review</Badge>}
                        {job.is_approved && <Badge className="bg-success/10 text-success border-success/30">Live</Badge>}
                        {job.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="border-2">{job.department}</Badge>
                        <Badge variant="secondary">{job.job_type?.replace("_", "-")}</Badge>
                        <span>{job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()} ETB</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center px-4 py-2 bg-primary/5 border border-primary/10 rounded-sm">
                        <p className="text-2xl font-serif font-bold text-primary">{jobApps.length}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Applicants</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="h-10 px-4 border-2">
                        <Link href={`/jobs/${job.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>

                  {/* Show applicants for this job inline */}
                  {jobApps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Applicants</p>
                      {jobApps.slice(0, 3).map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {app.student_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{app.student_name}</p>
                              <p className="text-[10px] text-muted-foreground">{app.student_department} • GPA {app.student_gpa}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={app.status} />
                            {app.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" onClick={() => handleUpdateAppStatus(app.id, "accepted")} className="h-7 px-2 text-[10px] bg-success hover:bg-success/90">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Accept
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateAppStatus(app.id, "rejected")} className="h-7 px-2 text-[10px]">
                                  <XCircle className="h-3 w-3 mr-1" /> Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {jobApps.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">+{jobApps.length - 3} more applicants</p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* APPLICANTS TAB (all applicants across all jobs) */}
          <TabsContent value="applicants" className="space-y-6 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">All Applicants ({employerApplications.length})</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {employerApplications.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <Users className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">No applicants yet. Post a job to attract candidates.</p>
              </Card>
            ) : employerApplications.map((app: any) => {
              const job = jobs.find((j: any) => j.id === app.job_id);
              return (
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
                        <span className="text-muted-foreground">GPA {app.student_gpa}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{app.student_email}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">SMU: {app.student_smu_id}</span>
                      </div>
                      {app.student_skills && (
                        <div className="flex flex-wrap gap-1">
                          {app.student_skills.map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                          ))}
                        </div>
                      )}
                      {app.cover_letter && (
                        <p className="text-sm text-muted-foreground italic border-l-2 border-accent pl-3 mt-2">{app.cover_letter}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} />
                      {app.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleUpdateAppStatus(app.id, "accepted")} className="h-8 px-3 text-[10px] bg-success hover:bg-success/90">
                            <CheckCircle className="h-3 w-3 mr-1" /> Accept
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateAppStatus(app.id, "rejected")} className="h-8 px-3 text-[10px]">
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          {/* POST JOB TAB */}
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
                      <Label className="text-xs font-bold uppercase tracking-widest">Position Title</Label>
                      <Input value={jobForm.title} onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))} required className="bg-background border-2 h-12" placeholder="e.g., Junior Developer" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Target Department</Label>
                      <Select value={jobForm.department} onValueChange={(v) => setJobForm((p) => ({ ...p, department: v }))}>
                        <SelectTrigger className="bg-background border-2 h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest">Description</Label>
                    <Textarea value={jobForm.description} onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))} required rows={6} className="bg-background border-2" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest">Requirements (comma-separated)</Label>
                    <Input value={jobForm.requirements} onChange={(e) => setJobForm((p) => ({ ...p, requirements: e.target.value }))} className="bg-background border-2 h-12" placeholder="JavaScript, React, Python..." />
                  </div>
                  <div className="grid gap-8 sm:grid-cols-3">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Job Type</Label>
                      <Select value={jobForm.job_type} onValueChange={(v) => setJobForm((p) => ({ ...p, job_type: v }))}>
                        <SelectTrigger className="bg-background border-2 h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{JOB_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Min Salary (ETB)</Label>
                      <Input type="number" value={jobForm.salary_min} onChange={(e) => setJobForm((p) => ({ ...p, salary_min: e.target.value }))} className="bg-background border-2 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest">Max Salary (ETB)</Label>
                      <Input type="number" value={jobForm.salary_max} onChange={(e) => setJobForm((p) => ({ ...p, salary_max: e.target.value }))} className="bg-background border-2 h-12" />
                    </div>
                  </div>
                  <Button type="submit" disabled={isPostingJob} className="btn-editorial h-14 px-10 font-bold">
                    {isPostingJob ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : <><PlusCircle className="mr-2 h-5 w-5" /> Publish Opportunity</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPANY PROFILE TAB */}
          <TabsContent value="company" className="outline-none">
            <Card className="border-2 border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="h-2 bg-accent w-full" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">Institutional Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-10 rounded-sm border-2 border-border bg-secondary/30 p-10 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Entity Name</Label>
                    <p className="text-2xl font-serif font-bold text-foreground">{user.company_name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sector</Label>
                    <p className="text-lg font-bold text-primary">{user.company_sector}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mission</Label>
                    <p className="text-sm text-foreground/80 leading-relaxed font-serif italic border-l-2 border-accent pl-8 py-2">&quot;{user.company_description}&quot;</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Website</Label>
                    <a href={user.company_website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                      <Globe className="h-4 w-4" />{user.company_website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
