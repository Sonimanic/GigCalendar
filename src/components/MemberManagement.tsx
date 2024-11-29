import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { Plus, Trash2, Users, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export const MemberManagement: React.FC = () => {
  const { getUsers, addMember, updateMember, removeMember, fetchUsers } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const members = getUsers().filter(user => user.role === 'member');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: editingMember ? {
      name: editingMember.name,
      email: editingMember.email,
      phone: editingMember.phone,
    } : undefined,
  });

  const onSubmit = (data: MemberFormData) => {
    if (editingMember) {
      updateMember(editingMember.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ...(data.password ? { password: data.password } : {}),
      });
    } else {
      addMember({
        id: uuidv4(),
        ...data,
        password: data.password!,
        role: 'member',
      });
    }
    setShowForm(false);
    setEditingMember(null);
    reset();
  };

  const handleEdit = (member: User) => {
    setEditingMember(member);
    setShowForm(true);
    reset({
      name: member.name,
      email: member.email,
      phone: member.phone,
    });
  };

  return (
    <div className="bg-dark-800 rounded-lg shadow-md p-6 border border-dark-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-100">Band Members ({members.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingMember(null);
              reset();
            }}
            className={`flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 ${isExpanded ? 'block' : 'hidden'}`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300 p-2"
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'mt-6' : 'h-0'}`}>
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 rounded-md border border-dark-600 bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 rounded-md border border-dark-600 bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-3 py-2 rounded-md border border-dark-600 bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {editingMember ? 'New Password (optional)' : 'Password'}
                </label>
                <input
                  type="password"
                  {...register('password', { 
                    required: !editingMember 
                  })}
                  className="w-full px-3 py-2 rounded-md border border-dark-600 bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMember(null);
                  reset();
                }}
                className="px-4 py-2 text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-dark-700 rounded-md"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-100">{member.name}</h3>
                <div className="text-sm text-gray-400">
                  <p>{member.email}</p>
                  <p>{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-blue-400 hover:text-blue-300 p-2"
                  title="Edit member"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Remove member"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};