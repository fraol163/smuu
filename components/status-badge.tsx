"use client";

import { Badge } from "@/components/ui/badge";

type StatusType = "pending" | "reviewed" | "accepted" | "rejected" | "approved";

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending Review",
    className: "bg-white/5 text-white/40 border-white/10 rounded-sm font-bold uppercase text-[9px] tracking-widest",
  },
  reviewed: {
    label: "Institutional Review",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20 rounded-sm font-bold uppercase text-[9px] tracking-widest",
  },
  accepted: {
    label: "Offer Extended",
    className: "bg-primary/20 text-primary border-primary/30 rounded-sm font-bold uppercase text-[9px] tracking-widest",
  },
  rejected: {
    label: "Declined",
    className: "bg-destructive/10 text-destructive border-destructive/20 rounded-sm font-bold uppercase text-[9px] tracking-widest",
  },
  approved: {
    label: "Verified",
    className: "bg-success/20 text-success border-success/30 rounded-sm font-bold uppercase text-[9px] tracking-widest",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
