import { useEffect, useState } from "react";
import { assistantService } from "../services/assistantService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { collectionAssignmentService } from "../services/collectionAssignmentService";

const Assistant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const loadConversations = () => assistantService.listConversations().then((res) => setConversations(res.data)).finally(() => setLoading(false));

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    // if collector, fetch their assignments for quick actions
    if (user?.role === 'collector') {
      collectionAssignmentService.myAssignments().then((res) => {
        setAssignments(res.data || []);
        if (res.data && res.data.length) setSelectedAssignment(res.data[0].id);
      }).catch(() => {});
    }
  }, [user]);

  const openConv = async (conv) => {
    setCurrentConv(conv);
    const res = await assistantService.getMessages(conv.id);
    setMessages(res.data);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input) return;
    // optimistic UI: show user message immediately and typing indicator
    const userMsg = { sender: 'user', message_text: input };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    setInput("");

    try {
      const res = await assistantService.sendMessage({ conversation_id: currentConv?.id, message: input });
      setMessages((m) => [...m, { sender: 'assistant', message_text: res.data.reply }]);
      if (!currentConv) loadConversations();
    } catch (err) {
      setMessages((m) => [...m, { sender: 'assistant', message_text: 'Sorry, the assistant is unavailable right now.' }]);
    } finally {
      setSending(false);
    }
  };

  const markSelectedCompleted = async () => {
    if (!selectedAssignment) return;
    try {
      await collectionAssignmentService.updateStatus(selectedAssignment, 'completed');
      // update assignments list locally
      setAssignments((a) => a.map(item => item.id === selectedAssignment ? { ...item, status: 'completed' } : item));
      setMessages((m) => [...m, { sender: 'assistant', message_text: 'Marked assignment as completed.' }]);
    } catch (e) {
      setMessages((m) => [...m, { sender: 'assistant', message_text: 'Could not mark assignment as completed.' }]);
    }
  };

  const quickRequestPickup = () => {
    setInput('I would like to request a pickup.');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="h3">EcoCollect Assistant</h1>
      <p className="text-muted">Ask questions about pickups, payments, and using the app.</p>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="list-group">
            {conversations.map((c) => (
              <button key={c.id} className={`list-group-item list-group-item-action ${currentConv?.id === c.id ? 'active' : ''}`} onClick={() => openConv(c)}>
                {c.title || `Conversation ${c.id}`}
                <div className="small text-muted">{new Date(c.created_at).toLocaleString()}</div>
              </button>
            ))}
            {!conversations.length && <div className="text-muted p-3">No conversations yet</div>}
          </div>
        </div>
        <div className="col-md-8">
            {user?.role === 'collector' && (
              <div className="mb-3 d-flex gap-2 align-items-center">
                <select className="form-select w-auto" value={selectedAssignment || ''} onChange={(e) => setSelectedAssignment(Number(e.target.value))}>
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>{`#${a.id} · ${a.location_name || a.address_details || 'Unknown'} · ${a.status}`}</option>
                  ))}
                </select>
                <button className="btn btn-sm btn-ecocollect" onClick={markSelectedCompleted}>Mark selected completed</button>
              </div>
            )}
            {user?.role === 'client' && (
              <div className="mb-3">
                <button className="btn btn-sm btn-ecocollect" onClick={quickRequestPickup}>Quick: Request pickup</button>
              </div>
            )}
          <div className="content-card d-flex flex-column" style={{height: '60vh'}}>
            <div className="flex-grow-1 overflow-auto p-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`mb-3 ${m.sender === 'assistant' ? 'text-start' : 'text-end'}`}>
                  <div className={`badge ${m.sender === 'assistant' ? 'bg-light text-dark' : 'bg-ecocollect'}`}>{m.message_text}</div>
                </div>
              ))}
              {sending && (
                <div className="mb-3 text-start">
                  <div className="badge bg-light text-dark">Assistant is typing...</div>
                </div>
              )}
            </div>
            <form className="p-3 border-top" onSubmit={send}>
              <div className="input-group">
                <input className="form-control" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the EcoCollect assistant" />
                <button className="btn btn-ecocollect">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
