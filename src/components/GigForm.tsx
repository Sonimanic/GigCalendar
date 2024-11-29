import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gig } from '../types';

const gigSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(1, 'Description is required'),
  payment: z.string().optional(),
  requirements: z.string().optional(),
});

interface GigFormProps {
  onSubmit: (data: Gig) => void;
  initialData?: Partial<Gig>;
}

export const GigForm: React.FC<GigFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(gigSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as Gig))} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Title</label>
        <input
          {...register('title')}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Date</label>
        <input
          type="datetime-local"
          {...register('date')}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Venue</label>
        <input
          {...register('venue')}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.venue && (
          <p className="mt-1 text-sm text-red-500">{errors.venue.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Address</label>
        <input
          {...register('address')}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="123 Main St, City, State ZIP"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Payment (optional)</label>
        <input
          type="number"
          {...register('payment')}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Requirements (optional)</label>
        <textarea
          {...register('requirements')}
          rows={2}
          className="mt-1 block w-full rounded-md border border-dark-600 bg-dark-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-dark-800"
      >
        Save Gig
      </button>
    </form>
  );
};