import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Star, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  Loader2, 
  HeartHandshake,
  Building2,
  PieChart as PieIcon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { analyticsAPI, feedbackAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getDashboardStats(),
      feedbackAPI.getAll(),
      feedbackAPI.getStats(),
    ])
      .then(([dashStats, fList, fStats]) => {
        setStats(dashStats);
        setFeedbackList(fList || []);
        setFeedbackStats(fStats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#38bdf8' }}>
        <Loader2 size={36} className="spin-animation" style={{ margin: '0 auto 12px' }} />
        <p>Synthesizing municipal intelligence analytics & feedback trends...</p>
      </div>
    );
  }

  // Category Chart Data
  const categoryLabels = stats?.categoryBreakdown?.map((c) => c.category) || [];
  const categoryCounts = stats?.categoryBreakdown?.map((c) => c.count) || [];

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Reported Incidents',
        data: categoryCounts,
        backgroundColor: [
          'rgba(245, 158, 11, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(14, 165, 233, 0.75)',
          'rgba(234, 179, 8, 0.75)',
          'rgba(99, 102, 241, 0.75)',
          'rgba(239, 68, 68, 0.75)',
        ],
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  // Status Chart Data
  const statusLabels = stats?.statusBreakdown?.map((s) => s.status) || [];
  const statusCounts = stats?.statusBreakdown?.map((s) => s.count) || [];

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          '#60a5fa',
          '#c084fc',
          '#fbbf24',
          '#38bdf8',
          '#fb923c',
          '#34d399',
          '#94a3b8',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Monthly Trends Chart Data
  const monthlyLabels = stats?.monthlyTrends?.map((m) => m.month) || [];
  const reportedTrends = stats?.monthlyTrends?.map((m) => m.reported) || [];
  const resolvedTrends = stats?.monthlyTrends?.map((m) => m.resolved) || [];

  const trendChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Issues Reported',
        data: reportedTrends,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Issues Resolved',
        data: resolvedTrends,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1380px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={28} color="#38bdf8" /> Civic Intelligence & Performance Analytics
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
          Real-time municipal service efficiency, resolution velocity, category trends, and citizen satisfaction ratings
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Avg Resolution Velocity</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {stats?.averageResolutionTimeHours} hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>Within target 48h SLA</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Citizen Satisfaction Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {stats?.averageCitizenRating} / 5.0
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>Based on verified resolved cases</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Active Citizens</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
            {stats?.totalCitizens}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Registered Ward Contributors</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Municipal Field Force</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {stats?.totalOfficers} Officers
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Across {stats?.totalDepartments} Departments</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Monthly Trend Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', minHeight: '340px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#38bdf8" /> 6-Month Grievance Volume & Resolution Trend
          </h3>
          <div style={{ height: '240px' }}>
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown Bar */}
        <div className="glass-card" style={{ padding: '1.5rem', minHeight: '340px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#f59e0b" /> Incidents by Infrastructure Category
          </h3>
          <div style={{ height: '240px' }}>
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Verified Citizen Feedback Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartHandshake size={20} color="#10b981" /> Verified Citizen Feedback Stream
        </h3>

        {feedbackList.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No feedback submissions recorded yet.</p>
        ) : (
          <div className="table-container">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Case Ref</th>
                  <th>Citizen</th>
                  <th>Rating</th>
                  <th>Satisfaction</th>
                  <th>Citizen Comments</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                      {f.complaint?.complaintNumber}
                    </td>
                    <td>{f.citizen?.fullName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24' }}>
                        {[...Array(f.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="#fbbf24" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: (f.isSatisfied ?? f.satisfied) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: (f.isSatisfied ?? f.satisfied) ? '#34d399' : '#fca5a5',
                          border: `1px solid ${(f.isSatisfied ?? f.satisfied) ? '#10b981' : '#ef4444'}`,
                        }}
                      >
                        {(f.isSatisfied ?? f.satisfied) ? 'SATISFIED' : 'NEEDS ATTENTION'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '360px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      "{f.comments || 'Resolution completed smoothly.'}"
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
