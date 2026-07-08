import { useEffect, useState } from 'react';
import { moderationService } from '../../services/moderationService';
import { assistantService } from '../../services/assistantService';
import LoadingSpinner from '../../components/LoadingSpinner';

const ModerationLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [flaggedFilter, setFlaggedFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: perPage };
      if (flaggedFilter === 'yes') params.flagged = 'true';
      if (flaggedFilter === 'no') params.flagged = 'false';
      if (q) params.q = q;

      const res = await moderationService.list(params);
      setLogs(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
    } catch (e) {
      console.error('Failed to load moderation logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, perPage, flaggedFilter]);

  if (loading) return <LoadingSpinner />;

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div>
      <h1 className="h3">Moderation Logs</h1>
      <p className="text-muted">Recent moderation events (admin only).</p>
      <div className="d-flex gap-2 align-items-center mb-3">
        <select className="form-select w-auto" value={flaggedFilter} onChange={(e) => { setFlaggedFilter(e.target.value); setPage(1); }}>
          <option value="all">All</option>
          <option value="yes">Flagged only</option>
          <option value="no">Not flagged</option>
        </select>
        <input className="form-control w-50" placeholder="Search input text" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-secondary" onClick={() => { setPage(1); load(); }}>Search</button>
        <div className="ms-auto d-flex gap-2 align-items-center">
          <label className="small text-muted">Per page</label>
          <select className="form-select w-auto" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Conversation</th>
              <th>Flagged</th>
              <th>Input (truncated)</th>
              <th>When</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.user_name || '—'}</td>
                <td>{l.conversation_title || l.conversation_id || '—'}</td>
                <td>{l.flagged ? 'Yes' : 'No'}</td>
                <td style={{maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{l.input_text}</td>
                <td>{new Date(l.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openAudit(l)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="small text-muted">{`Showing page ${page} of ${totalPages} · ${total} total`}</div>
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
      {/* Audit modal */}
      {selectedLog && (
        <div className="modal-backdrop d-flex justify-content-center align-items-start" style={{position: 'fixed', left:0, right:0, top:0, bottom:0, background: 'rgba(0,0,0,0.4)', paddingTop: '5vh', zIndex: 1050}}>
          <div className="card" style={{width: '80%', maxHeight: '80vh', overflow: 'auto'}}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>Audit — Moderation #{selectedLog.id}</strong>
                <div className="small text-muted">{selectedLog.user_name || '—'} · {new Date(selectedLog.created_at).toLocaleString()}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setSelectedLog(null); setConversationMessages([]); }}>Close</button>
              </div>
            </div>
            <div className="card-body">
              <h6>Input</h6>
              <div className="mb-3"><pre style={{whiteSpace:'pre-wrap'}}>{selectedLog.input_text}</pre></div>

              {loadingAudit ? <LoadingSpinner /> : (
                <>
                  {conversationMessages.length ? (
                    <>
                      <h6>Conversation</h6>
                      <div>
                        {conversationMessages.map((m, i) => (
                          <div key={i} className={`mb-2 ${m.sender === 'assistant' ? 'text-start' : 'text-end'}`}>
                            <div className={`badge ${m.sender === 'assistant' ? 'bg-light text-dark' : 'bg-ecocollect'}`}>{m.message_text}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-muted">No conversation messages (conversation id missing or empty)</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function openAudit(log) {
    setSelectedLog(log);
    setConversationMessages([]);
    setLoadingAudit(true);
    try {
      if (log.conversation_id) {
        const res = await assistantService.getMessages(log.conversation_id);
        setConversationMessages(res.data || []);
      }
    } catch (e) {
      console.error('Failed to load conversation for audit', e);
    } finally {
      setLoadingAudit(false);
    }
  }
};

export default ModerationLogs;
