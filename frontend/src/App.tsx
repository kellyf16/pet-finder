import { useState, useEffect, useCallback } from 'react';
import { fetchReports } from './api';
import type { AnimalReport } from './models/models';
import { ReportsMap, ReportDetail, ReportForm, ReportsList } from './components/Report';
import './App.css';

function App() {
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AnimalReport | null>(null);
  const [view, setView] = useState<'browse' | 'create'>('browse');

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🐶 TailBlazer 🐱</h1>
        </div>
        <div className="navbar-tabs">
          <button 
            className={view === 'browse' ? 'active' : ''} 
            onClick={() => { setView('browse'); setSelectedReport(null); }}
          >Browse Reports</button>
          <button 
            className={view === 'create' ? 'active' : ''} 
            onClick={() => { setView('create'); setSelectedReport(null); }}
          >Report Missing Pet</button>
        </div>
      </nav>

      <main>
        {loading ? (
          <p>Loading reports...</p>
        ) : selectedReport ? (
          <ReportDetail 
            report={selectedReport} 
            onBack={() => setSelectedReport(null)} 
            onUpdate={() => { loadReports(); setSelectedReport(null); }}
          />
        ) : view === 'create' ? (
          <ReportForm onComplete={() => { setView('browse'); loadReports(); }} />
        ) : (
          <div className="browse-layout">
            <div className="map-section">
              <ReportsMap reports={reports} onSelectReport={setSelectedReport} />
            </div>
            <div className="list-section">
              <ReportsList reports={reports} onSelectReport={setSelectedReport} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;