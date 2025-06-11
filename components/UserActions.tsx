"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw } from "lucide-react";

interface UserActionsProps {
  loading: boolean;
  onRefresh: () => void;
  onCreateUser: () => void;
}

export function UserActions({
  loading,
  onRefresh,
  onCreateUser,
}: UserActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw
          className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>
      <DialogTrigger asChild>
        <Button onClick={onCreateUser}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
    </div>
  );
}
