import React from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-lg p-6 max-w-2xl w-full border border-dark-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-100">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            How to Respond to Gigs
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="font-medium text-lg mb-2 text-gray-100">Responding to a Gig</h3>
            <p className="text-gray-300 mb-2">For each gig, you can:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Click "Gig confirmed" to confirm your availability</li>
              <li>Click "I'm a little bitch" to decline</li>
              <li>Add an optional note (e.g., "I'll need to leave by 10pm")</li>
            </ul>
          </section>

          <section>
            <h3 className="font-medium text-lg mb-2 text-gray-100">Changing Your Response</h3>
            <p className="text-gray-300 mb-2">You can always update your response:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Click "Change Response" on any gig you've already responded to</li>
              <li>Select your new status and add a new note if needed</li>
              <li>Your previous response will be replaced with the new one</li>
            </ul>
          </section>

          <section>
            <h3 className="font-medium text-lg mb-2 text-gray-100">Response Status Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-300">Green - Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-gray-300">Red - Declined</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-gray-300">Yellow - No response yet</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};