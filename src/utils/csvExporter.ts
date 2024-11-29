import { Gig } from '../types';

export const exportGigsToCSV = (gigs: Gig[]): void => {
  const headers = ['title', 'date', 'venue', 'address', 'description', 'payment', 'requirements'];
  
  const csvContent = [
    headers.join(','),
    ...gigs.map(gig => {
      return headers.map(header => {
        const value = gig[header as keyof Gig];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      }).join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gigs.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};