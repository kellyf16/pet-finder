import { VANCOUVER_COORDS } from "../../constants";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import { type AnimalReport, AnimalType, ReportStatus } from "../../models/models";

// displays markers and a popup for each marker
export function ReportsMap({ reports, onSelectReport }: { reports: AnimalReport[], onSelectReport: (r: AnimalReport) => void }) {
  const lostPets = useMemo(() => 
    reports.filter(r => r.status === ReportStatus.Lost),
    [reports]
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer center={VANCOUVER_COORDS} zoom={12} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {lostPets.map(report => (
          <Marker key={report.id} position={[report.last_seen.lat, report.last_seen.long]}>
            <Popup>
              <div className="popup-content">
                <img src={report.photo_url} alt={report.name} />
                <div className="popup-header">
                  <h3>{report.name || "N/A"}</h3>
                  <span className="type-tag">{AnimalType[report.type]}</span>
                </div>
                <button className="view-button" onClick={() => onSelectReport(report)}>View Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}