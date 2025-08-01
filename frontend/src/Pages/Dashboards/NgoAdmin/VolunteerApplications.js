// AdminVolunteerApplications.js
import React, { useState } from 'react';
import './VolunteerApplications.css';

const mockApplications = [
  {
    name: 'Aisha Mehra',
    email: 'aisha@example.com',
    contact: '+91-9876543210',
    id: 'GRACE1023',
    skills: ['First Aid', 'Cooking'],
    interests: ['Community Health', 'Nutrition'],
    opportunity: 'Community Kitchen Drive'
  },
  {
    name: 'Ravi Patel',
    email: 'ravi@example.com',
    contact: '+91-9988776655',
    id: 'GRACE1044',
    skills: ['Teaching', 'Public Speaking'],
    interests: ['Education', 'Youth Mentorship'],
    opportunity: 'After-School Tutoring'
  },
  {
    name: 'Neha Sharma',
    email: 'neha@example.com',
    contact: '+91-9123456789',
    id: 'GRACE1005',
    skills: ['Organizing', 'Team Leadership'],
    interests: ['Women Empowerment', 'Event Planning'],
    opportunity: 'Women Wellness Camp'
  }
];

const VolunteerApplications = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpportunity, setFilterOpportunity] = useState('All');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterOpportunity(e.target.value);
  };

  const markContacted = (id) => {
    alert(`📩 Marked ${id} as contacted`);
  };

  const shortlist = (id) => {
    alert(`⭐ Shortlisted ${id}`);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.interests.some((int) => int.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOpportunity =
      filterOpportunity === 'All' || app.opportunity === filterOpportunity;

    return matchesSearch && matchesOpportunity;
  });

  const allOpportunities = ['All', ...new Set(applications.map((app) => app.opportunity))];

  return (
    <div className="application-log-wrapper">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, skill, or interest"
          value={searchTerm}
          onChange={handleSearch}
        />

        <select value={filterOpportunity} onChange={handleFilter}>
          {allOpportunities.map((opp, idx) => (
            <option key={idx} value={opp}>
              {opp}
            </option>
          ))}
        </select>
      </div>

      <div className="application-list">
        {filteredApplications.map((app, index) => (
          <div className="application-card" key={index}>
            <h3>{app.name} <span className="grace-id">({app.id})</span></h3>
            <p><strong>Email:</strong> {app.email}</p>
            <p><strong>Contact:</strong> {app.contact}</p>
            <p><strong>Opportunity:</strong> {app.opportunity}</p>
            <p><strong>Skills:</strong> {app.skills.join(', ')}</p>
            <p><strong>Interests:</strong> {app.interests.join(', ')}</p>
            <div className="action-buttons">
              <button onClick={() => markContacted(app.id)}>📩 Mark as Contacted</button>
              <button onClick={() => shortlist(app.id)}>⭐ Shortlist</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerApplications;
