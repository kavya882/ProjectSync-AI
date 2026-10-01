import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import API from '../api';
import { Sparkles, RefreshCw, AlertTriangle, Clock, CheckCircle2, Info, AlertOctagon } from 'lucide-react';

const AIInsightsPage = () => {
  const { activeProject } = useProject();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchAIInsights = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${activeProject._id}/ai-insights`);
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!activeProject) return;
    try {
      setAnalyzing(true);
      const { data } = await API.post(`/projects/${activeProject._id}/ai-analyze`);
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Error running AI re-analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <h3>No Active Project Selected</h3>
          <p style={{ margin: '0.5rem 0 1rem', color: '#94a3b8' }}>Select a project to view AI insights.</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'OVERDUE_ALERT': return <AlertOctagon size={20} color="#ef4444" />;
      case 'DEADLINE_WARNING': return <Clock size={20} color="#f59e0b" />;
      case 'WORKLOAD_OBSERVATION': return <AlertTriangle size={20} color="#f59e0b" />;
      case 'PROJECT_RISK': return <AlertOctagon size={20} color="#ef4444" />;
      case 'POSITIVE_PROGRESS': return <CheckCircle2 size={20} color="#10b981" />;
      default: return <Info size={20} color="#06b6d4" />;
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles color="#c084fc" /> AI-Based Project Assistance
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Project: <strong style={{ color: '#60a5fa' }}>{activeProject.title}</strong></p>
        </div>
        <button onClick={handleRunAnalysis} className="btn btn-primary btn-sm" disabled={analyzing}>
          <RefreshCw size={16} className={analyzing ? 'spin' : ''} /> {analyzing ? 'Analyzing Data...' : 'Re-Run AI Analysis'}
        </button>
      </div>

      {/* Mandatory AI Labeling Disclaimer */}
      <div className="disclaimer-banner" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)', color: '#c084fc' }}>
        <Sparkles size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>AI Assistance Disclaimer:</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.82rem', lineHeight: 1.5, color: '#e9d5ff' }}>
            "AI insights provide automated, rule-based analysis of recorded project data to assist team decision-making and identify possible delays. They serve as suggestions rather than automated grading decisions."
          </p>
        </div>
      </div>

      {/* Insights Stream */}
      {insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤖</div>
          <h3>No AI Insights Generated Yet</h3>
          <p style={{ margin: '0.5rem 0 1.25rem', color: '#94a3b8' }}>
            Click below to run the intelligent project analysis engine.
          </p>
          <button onClick={handleRunAnalysis} className="btn btn-primary" disabled={analyzing}>
            <Sparkles size={18} /> Trigger AI Analysis
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {insights.map(i => (
            <div key={i._id} className={`card ai-alert-card ${i.severity}`} style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ marginTop: '2px' }}>{getInsightIcon(i.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{i.title}</h3>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#cbd5e1', fontWeight: 600 }}>
                      {i.isRuleBased ? 'AI Rule Engine' : 'AI Assistant'}
                    </span>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.5 }}>
                    {i.message}
                  </p>
                  <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: '#64748b' }}>
                    Generated on {new Date(i.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsightsPage;
