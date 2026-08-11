'use client';

import { Incident } from '@sentinel/shared';
import IncidentCard from './IncidentCard';

interface IncidentListProps {
  incidents: any[];
}

export default function IncidentList({ incidents }: IncidentListProps) {
  const criticalIncidents = incidents.filter((i) => i.urgency === 'CRITICAL');
  const highIncidents = incidents.filter((i) => i.urgency === 'HIGH');
  const mediumIncidents = incidents.filter((i) => i.urgency === 'MEDIUM');

  return (
    <div className="space-y-8">
      {/* Critical */}
      <div>
        <h2 className="text-xl font-bold text-red-600 mb-4">
          🚨 Critical ({criticalIncidents.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>

      {/* High */}
      <div>
        <h2 className="text-xl font-bold text-orange-600 mb-4">
          🟠 High ({highIncidents.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>

      {/* Medium */}
      <div>
        <h2 className="text-xl font-bold text-yellow-600 mb-4">
          🟡 Medium ({mediumIncidents.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediumIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}
