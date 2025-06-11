"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { UserForm } from "./UseForm";
import { UserTable } from "./UserTable";
import { UserActions } from "./UserActions";
import { useUserApi } from "@/hooks/UserUserApi";
import type { User, UserFormData } from "@/types/user";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { loading, fetchUsers, createUser, updateUser, deleteUser } =
    useUserApi();

  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    let success = false;

    const validatedFormData: UserFormData = {
      ...formData,
      address: formData.address || "",
    };

    if (editingUser) {
      success = await updateUser(editingUser._id, validatedFormData);
    } else {
      success = await createUser(validatedFormData);
    }

    if (success) {
      await loadUsers();
    }

    return success;
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      await loadUsers();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users with full CRUD operations
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <UserActions
                loading={loading}
                onRefresh={loadUsers}
                onCreateUser={handleCreateUser}
              />
              <UserForm
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleFormSubmit}
                editingUser={editingUser}
                loading={loading}
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>
    </div>
  );
}
