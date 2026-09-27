import { useState, useMemo } from 'react';
import { type AnimalReport,  AnimalType, ReportStatus } from "../../models/models";

//displays list of all reports with filtering
export function ReportsList({ reports, onSelectReport }: { reports: AnimalReport[], onSelectReport: (r: AnimalReport) => void }) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesType = typeFilter === 'all' || report.type === Number(typeFilter);
      const matchesStatus = statusFilter === 'all' || report.status === Number(statusFilter);
      return matchesType && matchesStatus;
    });
  }, [reports, typeFilter, statusFilter]);

  return (
    <div className="reports-list-container">
      <div className="filters">
        <label>
          Type:
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Animals</option>
            {Object.values(AnimalType).filter(v => typeof v === 'number').map(t => (
              <option key={t} value={t}>{AnimalType[t as number]}</option>
            ))}
          </select>
        </label>

        <label>
          Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {Object.values(ReportStatus).filter(v => typeof v === 'number').map(s => (
              <option key={s} value={s}>{ReportStatus[s as number]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <p>No reports match your filters.</p>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="report-card" onClick={() => onSelectReport(report)}>
              <div className="card-image">
                <img src={report.photo_url} alt={report.name} />
              </div>
              <div className="card-content">
                <h3>{report.name || "Unnamed Pet"}</h3>
                <p className="card-meta">
                  <span className={`status-badge ${ReportStatus[report.status].toLowerCase()}`}>
                    {ReportStatus[report.status]}
                  </span>
                  <span className="type-tag">{AnimalType[report.type]}</span>
                </p>
                <p className="card-address">📍 {report.address}</p>
                <p className="card-date">📅 {report.date_posted}</p>
                <button className="view-button">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}