"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  username: string;
  email: string;
  phone: string;
  address: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function UserCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (err) { // Changed from 'error' to 'err' to fix TypeScript error
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    if (formData.address.trim() && formData.address.trim().length < 5) {
      newErrors.address = "Address should be at least 5 characters if provided";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const url = editingUser ? `/api/user/${editingUser._id}` : "/api/user";
      const method = editingUser ? "PUT" : "POST";

      const trimmedData = Object.entries(formData).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: typeof value === "string" ? value.trim() : value,
        }),
        {}
      );

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `User ${editingUser ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchUsers();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch (err) { // Changed from 'error' to 'err' to fix TypeScript error
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user/${userToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User deleted successfully");
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err) { // Changed from 'error' to 'err' to fix TypeScript error
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({});
    setTouched({});
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setErrors({});
    setTouched({});
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-col gap-y-4 sm:flex-row sm:gap-0">
            <div>
              <CardTitle className="text-center mb-2">
                User Management
              </CardTitle>
              <CardDescription className="text-center">
                Manage users with full CRUD operations
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  if (!open) resetForm();
                  setIsDialogOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser ? "Edit User" : "Create New User"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingUser
                        ? "Update the user information below."
                        : "Fill in the details to create a new user."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label
                            htmlFor="username"
                            className={
                              errors.username && touched.username
                                ? "text-destructive"
                                : ""
                            }
                          >
                            Username
                          </Label>
                          {touched.username && errors.username && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.username}
                            </span>
                          )}
                        </div>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("username")}
                          className={
                            errors.username && touched.username
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label
                            htmlFor="email"
                            className={
                              errors.email && touched.email
                                ? "text-destructive"
                                : ""
                            }
                          >
                            Email
                          </Label>
                          {touched.email && errors.email && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.email}
                            </span>
                          )}
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("email")}
                          className={
                            errors.email && touched.email
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label
                            htmlFor="phone"
                            className={
                              errors.phone && touched.phone
                                ? "text-destructive"
                                : ""
                            }
                          >
                            Phone
                          </Label>
                          {touched.phone && errors.phone && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.phone}
                            </span>
                          )}
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("phone")}
                          className={
                            errors.phone && touched.phone
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label
                            htmlFor="address"
                            className={
                              errors.address && touched.address
                                ? "text-destructive"
                                : ""
                            }
                          >
                            Address
                          </Label>
                          {touched.address && errors.address && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.address}
                            </span>
                          )}
                        </div>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("address")}
                          className={
                            errors.address && touched.address
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading
                          ? "Saving..."
                          : editingUser
                          ? "Update"
                          : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users found. Create your first user!
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.address || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(user._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}