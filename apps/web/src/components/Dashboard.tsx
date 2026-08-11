'use client';

import { useEffect, useState } from 'react';
import { getIncidents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import IncidentList from './IncidentList';
import Navigation from './Navigation';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => getIncidents(),
  });

  return (
    <div className="h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Operations</h1>
          
          {isLoading && <p>Loading incidents...</p>}
          {error && <p className="text-red-600">Error loading incidents</p>}
          {data?.data?.data && <IncidentList incidents={data.data.data} />}
        </div>
      </div>
    </div>
  );
}
