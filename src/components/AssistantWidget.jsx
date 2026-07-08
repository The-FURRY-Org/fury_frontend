import { useEffect, useState } from "react";
import { assistantService } from "../services/assistantService";
import { collectionAssignmentService } from "../services/collectionAssignmentService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const AssistantWidget = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    if (!visible) return;
    loadConversations();
  }, [visible]);

  useEffect(() => {
    if (user?.role === "collector") {
      collectionAssignmentService.myAssignments()
        .then((res) => {
          setAssignments(res.data || []);
          if (res.data && res.data.length && !selectedAssignment) {
            setSelectedAssignment(res.data[0].id);
          }
        })
        .catch(() => {});
    }
  }, [user, selectedAssignment]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await assistantService.listConversations();
      const convos = res.data || [];
      setConversations(convos);
      if (!currentConv && convos.length) {
        await openConv(convos[0]);
      }
    } catch (e) {
      console.error("Could not load assistant conversations", e);
    } finally {
      setLoading(false);
    }
  };

  const openConv = async (conv) => {
    setCurrentConv(conv);
    setMessages([]);
    setLoading(true);
    try {
      const res = await assistantService.getMessages(conv.id);
      setMessages(res.data || []);
    } catch (e) {
      console.error("Could not load conversation messages", e);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { sender: "user", message_text: input };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    setInput("");

    try {
      const res = await assistantService.sendMessage({ conversation_id: currentConv?.id, message: input });
      setMessages((m) => [...m, { sender: "assistant", message_text: res.data.reply }]);
      if (!currentConv) {
        loadConversations();
      }
    } catch (err) {
      setMessages((m) => [...m, { sender: "assistant", message_text: "Sorry, the assistant is unavailable right now." }]);
    } finally {
      setSending(false);
    }
  };

  const markSelectedCompleted = async () => {
    if (!selectedAssignment) return;
    try {
      await collectionAssignmentService.updateStatus(selectedAssignment, "completed");
      setAssignments((a) => a.map((item) => (item.id === selectedAssignment ? { ...item, status: "completed" } : item)));
      setMessages((m) => [...m, { sender: "assistant", message_text: "Marked assignment as completed." }]);
    } catch (e) {
      setMessages((m) => [...m, { sender: "assistant", message_text: "Could not mark assignment as completed." }]);
    }
  };

  const quickRequestPickup = () => {
    setInput("I would like to request a pickup.");
  };

  return (
    <>
      <button className="assistant-float-button" onClick={() => setVisible((v) => !v)} aria-label="Open EcoCollect Assistant">
        <span className="assistant-bot-icon">🤖</span>
      </button>

      {visible && (
        <div className="assistant-panel shadow">
          <div className="assistant-panel-header d-flex align-items-start justify-content-between">
            <div>
              <div className="h6 mb-1">EcoCollect Assistant</div>
              <div className="small text-muted">Ask about pickups, payments, and using the app.</div>
            </div>
            <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setVisible(false)} aria-label="Close assistant panel">
              ×
            </button>
          </div>

          <div className="assistant-panel-body">
            <div className="assistant-panel-content">
              <div className="assistant-panel-sidebar">
                <div className="assistant-sidebar-title">Conversations</div>
                {loading && !messages.length ? (
                  <div className="p-3 text-center">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="assistant-conversation-list">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        className={`assistant-conversation-item ${currentConv?.id === conv.id ? "active" : ""}`}
                        onClick={() => openConv(conv)}
                      >
                        <div>{conv.title || `Conversation ${conv.id}`}</div>
                        <div className="small text-muted">{new Date(conv.created_at).toLocaleString()}</div>
                      </button>
                    ))}
                    {!conversations.length && !loading && <div className="text-muted p-3">No conversations yet.</div>}
                  </div>
                )}
              </div>

              <div className="assistant-chat-column">
                {user?.role === "collector" && (
                  <div className="assistant-quick-actions mb-3">
                    <select className="form-select form-select-sm w-100 mb-2" value={selectedAssignment || ""} onChange={(e) => setSelectedAssignment(Number(e.target.value))}>
                      {assignments.map((a) => (
                        <option key={a.id} value={a.id}>{`#${a.id} · ${a.location_name || a.address_details || "Unknown"} · ${a.status}`}</option>
                      ))}
                    </select>
                    <button className="btn btn-sm btn-ecocollect w-100" onClick={markSelectedCompleted} type="button">
                      Mark selected completed
                    </button>
                  </div>
                )}
                {user?.role === "client" && (
                  <div className="assistant-quick-actions mb-3">
                    <button className="btn btn-sm btn-ecocollect w-100" type="button" onClick={quickRequestPickup}>
                      Quick: Request pickup
                    </button>
                  </div>
                )}

                <div className="assistant-messages-container">
                  {messages.map((message, idx) => (
                    <div key={idx} className={`assistant-message ${message.sender === "assistant" ? "assistant-message-assistant" : "assistant-message-user"}`}>
                      {message.message_text}
                    </div>
                  ))}
                  {sending && <div className="assistant-message assistant-message-assistant">Assistant is typing...</div>}
                </div>

                <form className="assistant-input-form" onSubmit={sendMessage}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask the EcoCollect assistant"
                      aria-label="Assistant message"
                    />
                    <button className="btn btn-ecocollect" type="submit" disabled={!input || sending}>
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantWidget;
