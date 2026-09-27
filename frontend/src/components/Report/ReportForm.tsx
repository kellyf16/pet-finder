import { LocationPickerMap } from "../Map";
import { useState } from 'react';
import { type AnimalReport, type ReportDraft, AnimalType, ReportStatus } from "../../models/models";
import { coordsToAddress, uploadImg, writeReport } from "../../api";

//form for user to submit missing pet reports
export function ReportForm({ onComplete }: { onComplete: () => void }) {
  const [draft, setDraft] = useState<ReportDraft>({
    name: '',
    type: AnimalType.Dog,
    description: '',
    phone_number: '',
    password: '',
    image_file: null,
    last_seen: null,
  });
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelected = async (lat: number, long: number) => {
    setDraft(prev => ({ ...prev, last_seen: { lat, long } }));
    try {
      const addr = await coordsToAddress(lat, long);
      setAddress(addr);
    } catch (e) {
      console.error(e);
      setAddress(`Lat: ${lat.toFixed(4)}, Long: ${long.toFixed(4)}`);
    }
  };

  const handleAction = async () => {
    if (!draft.image_file) return alert("Photo required!");
    if (!draft.last_seen) return alert("Location required!");
    // check for 10-digit number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(draft.phone_number)) return alert("Please enter a valid 10-digit phone number.");

    setIsSubmitting(true);
    try {
      const photo_url = await uploadImg(draft.image_file);

      const newReport: AnimalReport = {
        id: crypto.randomUUID(),
        name: draft.name,
        type: draft.type,
        photo_url,
        description: draft.description,
        phone_number: draft.phone_number,
        last_seen: draft.last_seen!,
        address,
        password: draft.password,
        status: ReportStatus.Lost,
        date_posted: new Date().toLocaleDateString(),
      };
      await writeReport(newReport);
      alert("Reported!");
      onComplete();
    } catch (err) { alert("Cannot save report - " + err); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="report-form-container">
      <h2>Report a Missing Pet</h2>
      <form action={handleAction} className="report-form-layout">
        <div className="form-left">
          <div className="form-row">
            <label>Pet Name: 
              <input name="name" type="text" required value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} />
            </label>

            <label>Animal Type:
              <select name="type" value={draft.type} onChange={e => setDraft({...draft, type: Number(e.target.value)})}>
                {Object.values(AnimalType).filter(v => typeof v === 'number').map(t => (
                  <option key={t} value={t}>{AnimalType[t as number]}</option>
                ))}
              </select>
            </label>
          </div>

          <label>Description:
            <textarea name="description" required value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} />
          </label>

          <div className="form-row">
            <label>Phone Number:
              <input name="phone_number" type="tel" required value={draft.phone_number} onChange={e => setDraft({...draft, phone_number: e.target.value})} />
            </label>

            <label>Secret Password:
              <input name="password" type="password" required value={draft.password} onChange={e => setDraft({...draft, password: e.target.value})} />
            </label>
          </div>

          <label>Photo:
            <input name="photo" type="file" accept="image/*" required onChange={e => setDraft({...draft, image_file: e.target.files?.[0] || null})} />
          </label>

          <label>Last Seen Address:
            <input type="text" readOnly value={address} placeholder="Click map to set location" />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Submit Report"}
          </button>
        </div>

        <div className="form-right">
          <p>Click the map to set the last seen location:</p>
          <LocationPickerMap onLocationSelected={handleLocationSelected} />
        </div>
      </form>
    </div>
  );
}