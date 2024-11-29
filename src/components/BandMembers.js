import React, { useState } from 'react';

const BandMembers = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      <div onClick={toggleExpanded}>
        Band Members
        {isExpanded ? '🔽' : '🔼'}
      </div>
      {isExpanded && (
        <div>
          {/* List of band members */}
          {!isMobile && <button>Add Member</button>}
        </div>
      )}
      {isMobile && isExpanded && <button>Add Member</button>}
    </div>
  );
};

export default BandMembers; 