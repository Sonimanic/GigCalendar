import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { parseGigsCsv } from '../utils/csvParser';
import { Gig } from '../types';

interface CsvUploaderProps {
  onGigsUploaded: (gigs: Omit<Gig, 'id'>[]) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onGigsUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const gigs = parseGigsCsv(text);
        onGigsUploaded(gigs);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  const downloadExample = () => {
    const exampleContent = `title,date,venue,description,payment,requirements
Rock Night,2024-04-15T20:00,The Blue Room,High-energy rock performance,500,Full PA system required
Jazz Evening,2024-04-22T19:30,Jazz Club Downtown,Smooth jazz set,450,Stage monitors needed
Wedding Gig,2024-05-01T18:00,Grand Hotel,Wedding ceremony and reception,800,2 hour setup time required`;

    const blob = new Blob([exampleContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example-gigs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label
          htmlFor="csv-upload"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap w-[160px]"
        >
          <Upload className="w-4 h-4" />
          Upload CSV
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={downloadExample}
          className="text-blue-400 hover:text-blue-300 text-sm whitespace-nowrap"
        >
          Download Example
        </button>
      </div>
      <p className="text-xs text-gray-400">
        CSV format: title, date, venue, description, payment, requirements
      </p>
    </div>
  );
};