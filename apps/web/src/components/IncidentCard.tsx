'use client';

import { useState } from 'react';
import { updateIncidentState } from '@/lib/api';

interface IncidentCardProps {
  incident: any;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    try {
      await updateIncidentState(incident.id, {
        state: 'ASSIGNED',
        note: 'Assigned by dispatcher',
      });
    } catch (error) {
      console.error('Failed to assign incident', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-100 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-green-100 border-green-300';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getUrgencyColor(incident.urgency)}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{incident.category}</h3>
          <p className="text-sm text-gray-600">{incident.state}</p>
        </div>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          #{incident.id.substring(0, 8)}
        </span>
      </div>
      
      <p className="text-sm mb-3">{incident.description}</p>
      
      <div className="text-xs text-gray-700 mb-3">
        <p>📍 {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</p>
        <p>🕐 {new Date(incident.createdAt).toLocaleString()}</p>
      </div>

      <button
        onClick={handleAssign}
        disabled={loading || incident.state !== 'REPORTED'}
        className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Assigning...' : 'Assign to Department'}
      </button>
    </div>
  );
}
