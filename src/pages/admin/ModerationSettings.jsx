import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { moderationSettingsService } from '../../services/moderationSettingsService';

const ModerationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ notify_enabled: true, severity_threshold: 1, notify_email: true, notify_sms: false });

  useEffect(() => {
    moderationSettingsService.get().then(res => setSettings(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const save = async () => {
    setLoading(true);
    try {
      const res = await moderationSettingsService.update(settings);
      setSettings(res.data);
    } catch (e) {
      console.error('Failed to save settings', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="h3">Moderation Alert Settings</h1>
      <p className="text-muted">Control real-time admin alerts for flagged AI messages.</p>

      <div className="mb-3 form-check">
        <input className="form-check-input" type="checkbox" id="notify_enabled" checked={Boolean(settings.notify_enabled)} onChange={(e) => setSettings(s => ({ ...s, notify_enabled: e.target.checked }))} />
        <label className="form-check-label" htmlFor="notify_enabled">Enable real-time notifications to admins</label>
      </div>

      <div className="mb-3">
        <label className="form-label">Severity threshold (number of categories flagged)</label>
        <input type="number" className="form-control w-auto" value={settings.severity_threshold || 1} onChange={(e) => setSettings(s => ({ ...s, severity_threshold: Number(e.target.value) }))} />
      </div>

      <div className="mb-3 form-check">
        <input className="form-check-input" type="checkbox" id="notify_email" checked={Boolean(settings.notify_email)} onChange={(e) => setSettings(s => ({ ...s, notify_email: e.target.checked }))} />
        <label className="form-check-label" htmlFor="notify_email">Send email alerts</label>
      </div>

      <div className="mb-3 form-check">
        <input className="form-check-input" type="checkbox" id="notify_sms" checked={Boolean(settings.notify_sms)} onChange={(e) => setSettings(s => ({ ...s, notify_sms: e.target.checked }))} />
        <label className="form-check-label" htmlFor="notify_sms">Send SMS alerts (requires Twilio)</label>
      </div>

      <div>
        <button className="btn btn-ecocollect" onClick={save}>Save</button>
      </div>
    </div>
  );
};

export default ModerationSettings;
