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
  TrendingUp, Clock, XCircle, Loader2, Star,
} from "lucide-react";

function AdminDashboardContent() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    Promise.all([
      fetch("/api/jobs?all=true").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ]).then(([jobsData, usersData]) => {
      setJobs(jobsData);
      setUsersList(usersData);
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
      await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, is_approved: true } : j));
    } else {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });
      setUsersList((prev) => prev.map((u: any) => u.id === id ? { ...u, is_approved: true } : u));
    }
    setApprovingId(null);
  };

  const handleReject = async (type: string, id: number) => {
    setApprovingId(id);
    if (type === "Job") {
      await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject" }),
      });
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } else {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject" }),
      });
      setUsersList((prev) => prev.filter((u: any) => u.id !== id));
    }
    setApprovingId(null);
  };

  const handleToggleFeatured = async (jobId: number) => {
    setApprovingId(jobId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, is_featured: !j.is_featured } : j));
    setApprovingId(null);
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

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, value: jobs.length, label: "Total Postings" },
            { icon: Users, value: students.length, label: "Verified Students" },
            { icon: Building2, value: employers.length, label: "Entity Partners" },
            { icon: TrendingUp, value: "—", label: "Applications" },
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
          <TabsList className="bg-muted p-1 rounded-sm border-2 border-border">
            <TabsTrigger value="jobs" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Briefcase className="h-4 w-4" /> Jobs
              {pendingJobs.length > 0 && <Badge variant="destructive" className="ml-1">{pendingJobs.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Users className="h-4 w-4" /> Students
              {pendingStudents.length > 0 && <Badge variant="destructive" className="ml-1">{pendingStudents.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex items-center gap-2 px-6 py-2 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all">
              <Building2 className="h-4 w-4" /> Employers
              {pendingEmployers.length > 0 && <Badge variant="destructive" className="ml-1">{pendingEmployers.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-8 outline-none">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Publication Queue</h3>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            {pendingJobs.length === 0 ? (
              <Card className="border-2 border-border bg-card p-20 text-center rounded-sm">
                <CheckCircle className="mx-auto h-16 w-16 text-primary/20 mb-6" />
                <p className="text-xl font-serif text-muted-foreground italic">Verification queue is clear.</p>
              </Card>
            ) : (
              pendingJobs.map((job: any) => (
                <Card key={job.id} className="border-2 border-border bg-card p-8 rounded-sm">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif font-bold text-foreground">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="border-2">{job.company_name}</Badge>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                      <Button size="sm" onClick={() => handleApprove("Job", job.id)} disabled={approvingId === job.id} className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest bg-success hover:bg-success/90">
                        {approvingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-2 h-4 w-4" /> Approve</>}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject("Job", job.id)} disabled={approvingId === job.id} className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest">
                        <XCircle className="mr-2 h-4 w-4" /> Reject
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
              {jobs.filter((j: any) => j.is_approved).map((job: any) => (
                <Card key={job.id} className="border-2 border-border bg-card p-6 rounded-sm group">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                        {job.is_featured && <Badge className="bg-accent text-accent-foreground"><Star className="mr-1 h-3 w-3 fill-current" /> Featured</Badge>}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {job.company_name} • {job.department} • {job.application_count || 0} candidates
                      </p>
                    </div>
                    <Button size="sm" variant={job.is_featured ? "outline" : "secondary"} onClick={() => handleToggleFeatured(job.id)} disabled={approvingId === job.id} className="h-9 px-4 font-bold uppercase text-[10px] tracking-widest border-2">
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
              pendingStudents.map((student: any) => (
                <Card key={student.id} className="border-2 border-border bg-card p-8 rounded-sm">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif font-bold text-foreground">{student.name}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <Badge variant="outline" className="font-mono">{student.smu_id}</Badge>
                        <Badge variant="secondary">{student.department}</Badge>
                        <span className="text-muted-foreground">GPA {student.gpa?.toFixed(2)}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{student.email}</p>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                      <Button size="sm" onClick={() => handleApprove("Student", student.id)} disabled={approvingId === student.id} className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest bg-success hover:bg-success/90">
                        {approvingId === student.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-2 h-4 w-4" /> Verify</>}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject("Student", student.id)} disabled={approvingId === student.id} className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest">
                        <XCircle className="mr-2 h-4 w-4" /> Dismiss
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
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
              pendingEmployers.map((employer: any) => (
                <Card key={employer.id} className="border-2 border-border bg-card p-8 rounded-sm">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-serif font-bold text-foreground">{employer.company_name}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <Badge variant="secondary">{employer.company_sector}</Badge>
                        <span className="text-muted-foreground">Rep: {employer.name}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{employer.email}</p>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                      <Button size="sm" onClick={() => handleApprove("Employer", employer.id)} disabled={approvingId === employer.id} className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest bg-success hover:bg-success/90">
                        {approvingId === employer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-2 h-4 w-4" /> Authorize</>}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject("Employer", employer.id)} disabled={approvingId === employer.id} className="h-10 px-4 font-bold uppercase text-[10px] tracking-widest">
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
