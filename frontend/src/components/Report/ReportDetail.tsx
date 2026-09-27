import { useState } from 'react';
import { resolveReport } from "../../api";
import { type AnimalReport, AnimalType, ReportStatus } from "../../models/models";

//detail page for reports, accessed from marker popup or from list
export function ReportDetail({ report, onBack, onUpdate }: { report: AnimalReport, onBack: () => void, onUpdate: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyAndFound = async () => {
      if (!passwordInput) {
        alert("Please enter your password.");
        return;
      }

      setIsSubmitting(true);
      try {
        await resolveReport(report.id, passwordInput);
        alert("Report marked as found!");
        setShowModal(false);
        onUpdate();
      } catch (err) { 
        alert("Update failed - " + err); 
      } finally { 
        setIsSubmitting(false); 
        setPasswordInput("");
      }
  };

  return (
    <div className="detail-view">
      <button className="back-button" onClick={onBack}>&larr; Back to Browse</button>
      
      <div className="detail-content">
        <div className="detail-image">
          <img src={report.photo_url} alt={report.name} />
        </div>
        
        <div className="detail-info">
          <h1>{report.name || "Unnamed Pet"}</h1>
          <p><strong>Type:</strong> {AnimalType[report.type]}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${ReportStatus[report.status].toLowerCase()}`}>{ReportStatus[report.status]}</span></p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Contact:</strong> {report.phone_number}</p>
          <p><strong>Last Seen:</strong> {report.address}</p>
          <p><strong>Posted:</strong> {report.date_posted}</p>
          
          {report.status === ReportStatus.Lost && (
            <button className="found-button" onClick={() => setShowModal(true)}>Mark as Found</button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Mark as Found</h3>
            <p>Please enter the password you set when creating this report to mark <strong>{report.name}</strong> as found.</p>
            
            <label className="modal-label">
              Password
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="Enter password"
              />
            </label>

            <div className="modal-actions">
              <button className="back-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className="found-button" 
                onClick={handleVerifyAndFound}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Confirm Found"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
