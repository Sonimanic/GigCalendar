import { Gig } from '../types';

export const parseGigsCsv = (csvContent: string): Omit<Gig, 'id'>[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      const values = line.split(',').map(value => value.trim());
      const gig: any = {};
      
      headers.forEach((header, index) => {
        if (header === 'payment') {
          gig[header] = values[index] ? parseFloat(values[index]) : undefined;
        } else {
          gig[header] = values[index];
        }
      });
      
      return gig;
    });
};