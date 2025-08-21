'use client';

import { useState, useEffect } from 'react';
import { getBillingReport } from '@/lib/api';

export default function BillingReports({ projectId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await getBillingReport(
          projectId,
          dateRange.start.toISOString(),
          dateRange.end.toISOString()
        );
        setReport(data);
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [projectId, dateRange]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Billing Report</h2>
        <div className="flex space-x-4">
          <input
            type="date"
            value={dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({...dateRange, start: new Date(e.target.value)})}
            className="rounded-md border-gray-300 shadow-sm"
          />
          <span className="self-center">to</span>
          <input
            type="date"
            value={dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({...dateRange, end: new Date(e.target.value)})}
            className="rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading report...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Hours</p>
              <p className="text-2xl font-bold">{report?.totalHours || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Total Cost</p>
              <p className="text-2xl font-bold">
                ${report?.totalCost?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Unbilled Hours</p>
              <p className="text-2xl font-bold">{report?.unbilledHours || 0}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              By Team Member
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report?.byUser?.map((user) => (
                    <tr key={user.userId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${user.rate.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${user.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}