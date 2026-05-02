"use client";

import { useState } from "react";
import { Send, MessageSquare, Users, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { STUDENTS } from "@/lib/mock-data";
import { SCHOOL_NAME, CURRENT_TERM, CURRENT_SESSION } from "@/lib/constants";

interface Message {
  id: string;
  subject: string;
  body: string;
  recipient: string;
  sentAt: string;
  type: "broadcast" | "individual";
}

const SENT_MESSAGES: Message[] = [
  { id: "m1", subject: "Term 2 Exam Schedule",      body: "Dear Parents, please note that Term 2 exams begin May 11. Ensure your ward studies consistently.",     recipient: "All Parents",         sentAt: "2026-04-28", type: "broadcast"  },
  { id: "m2", subject: "Outstanding Fee Reminder",  body: "This is a reminder that school fees for Term 2 are due. Kindly settle your balance to avoid result delay.", recipient: "Parents with balance", sentAt: "2026-04-25", type: "broadcast"  },
  { id: "m3", subject: "Homework — Mathematics",    body: "Kolade has an outstanding mathematics assignment. Please encourage him to complete it before Friday.",    recipient: "Parent of K. Adeyemi", sentAt: "2026-04-22", type: "individual" },
  { id: "m4", subject: "Progress Update",           body: "Fatima has shown excellent improvement this term, particularly in Mathematics and Basic Science. Well done!", recipient: "Parent of F. Bello",    sentAt: "2026-04-18", type: "individual" },
];

export default function MessagesPage() {
  const [composing,  setComposing]  = useState(false);
  const [subject,    setSubject]    = useState("");
  const [body,       setBody]       = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "individual">("all");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sent,       setSent]       = useState(false);

  function handleSend() {
    if (!subject.trim() || !body.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setComposing(false);
      setSubject("");
      setBody("");
      setSelectedStudent("");
    }, 1500);
  }

  const recipientLabel = recipientType === "all"
    ? "All Parents"
    : selectedStudent
      ? `Parent of ${STUDENTS.find((s) => s.id === selectedStudent)?.name ?? ""}`
      : "Select student";

  return (
    <div className="px-8 py-8 max-w-[1280px] mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-ink text-[26px] font-extrabold leading-none" style={{ fontFamily: "var(--font-syne)" }}>
            Messages
          </h1>
          <p className="text-ink-4 text-[13px] mt-1">
            Parent communications · Term {CURRENT_TERM} {CURRENT_SESSION}
          </p>
        </div>
        {!composing && (
          <Button variant="primary" size="md" icon={<Send size={14} />} onClick={() => setComposing(true)}>
            Compose Message
          </Button>
        )}
      </div>

      {/* Compose panel */}
      {composing && (
        <div
          className="rounded-xl border border-border p-6 flex flex-col gap-4"
          style={{ background: "#111118" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-ink text-[15px] font-semibold" style={{ fontFamily: "var(--font-syne)" }}>
              New Message
            </p>
            <button
              onClick={() => setComposing(false)}
              className="text-ink-4 hover:text-ink transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Recipient toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-ink-4 text-[12px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Send to
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setRecipientType("all")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all border"
                style={{
                  background: recipientType === "all" ? "#7C3AED20" : "transparent",
                  borderColor: recipientType === "all" ? "#7C3AED" : "#2A2A3A",
                  color:       recipientType === "all" ? "#C4B5FD"  : "#5A5A7A",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <Users size={13} /> All Parents
              </button>
              <button
                onClick={() => setRecipientType("individual")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all border"
                style={{
                  background: recipientType === "individual" ? "#7C3AED20" : "transparent",
                  borderColor: recipientType === "individual" ? "#7C3AED" : "#2A2A3A",
                  color:       recipientType === "individual" ? "#C4B5FD"  : "#5A5A7A",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <User size={13} /> Individual
              </button>
            </div>

            {recipientType === "individual" && (
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[13px] text-ink border border-border outline-none focus:border-primary transition-colors"
                style={{ background: "#0D0D14", fontFamily: "var(--font-dm-sans)" }}
              >
                <option value="">Select a student…</option>
                {STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-ink-4 text-[12px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Subject
            </label>
            <input
              type="text"
              placeholder="Message subject…"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] text-ink border border-border outline-none focus:border-primary transition-colors placeholder:text-ink-5"
              style={{ background: "#0D0D14", fontFamily: "var(--font-dm-sans)" }}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-2">
            <label className="text-ink-4 text-[12px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Message
            </label>
            <textarea
              rows={5}
              placeholder={`Write your message to ${recipientLabel}…`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] text-ink border border-border outline-none focus:border-primary transition-colors placeholder:text-ink-5 resize-none"
              style={{ background: "#0D0D14", fontFamily: "var(--font-dm-sans)" }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
            <p className="text-ink-5 text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
              To: {recipientLabel}
            </p>
            <Button
              variant="primary"
              size="md"
              icon={<Send size={14} />}
              onClick={handleSend}
              loading={sent}
              disabled={!subject.trim() || !body.trim() || (recipientType === "individual" && !selectedStudent)}
            >
              {sent ? "Sent!" : "Send Message"}
            </Button>
          </div>
        </div>
      )}

      {/* Sent messages */}
      <div className="flex flex-col gap-3">
        <p className="text-ink-4 text-[12px] font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Sent ({SENT_MESSAGES.length})
        </p>
        {SENT_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className="rounded-xl border border-border p-5 flex flex-col gap-2 hover:bg-white/[0.015] transition-colors"
            style={{ background: "#111118" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-ink text-[14px] font-semibold">{msg.subject}</p>
                <p className="text-ink-4 text-[12px] leading-relaxed line-clamp-2">{msg.body}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <Badge variant={msg.type === "broadcast" ? "primary" : "default"} size="sm">
                  {msg.type === "broadcast" ? "Broadcast" : "Individual"}
                </Badge>
                <span className="text-ink-5 text-[10px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  {new Date(msg.sentAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MessageSquare size={11} className="text-ink-5" />
              <span className="text-ink-5 text-[11px]">{msg.recipient}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
