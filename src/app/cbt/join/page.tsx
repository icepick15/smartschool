"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, AlertTriangle } from "lucide-react";
import { STUDENTS } from "@/lib/mock-data";
import { getCBTSessionByCode } from "@/lib/store";
import { SmartSchoolMark } from "@/components/brand/SmartSchoolMark";

export default function CBTJoinPage() {
  const router = useRouter();
  const [code,      setCode]      = useState("");
  const [studentId, setStudentId] = useState(STUDENTS[0].id);
  const [error,     setError]     = useState("");
  const [checking,  setChecking]  = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("cbt_student");
  }, []);

  async function handleJoin() {
    setError("");
    if (!code.trim()) { setError("Enter a session code"); return; }
    setChecking(true);
    await new Promise(r => setTimeout(r, 400));
    const session = getCBTSessionByCode(code.trim());
    setChecking(false);
    if (!session) {
      setError("Invalid or expired code. Ask your teacher.");
      return;
    }
    const student = STUDENTS.find(s => s.id === studentId)!;
    sessionStorage.setItem("cbt_student", JSON.stringify({ id: student.id, name: student.name }));
    router.push(`/cbt/${session.id}`);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--color-base)" }}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl border p-8 flex flex-col gap-6"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <SmartSchoolMark size={40} />
          <div className="text-center">
            <p
              className="text-ink text-[20px] font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Join CBT
            </p>
            <p className="text-ink-4 text-[13px] mt-0.5">
              Enter the code your teacher wrote on the board
            </p>
          </div>
        </div>

        {/* Session code */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-ink-4 text-[11px] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Session Code
          </label>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
            placeholder="e.g. MTH-4821"
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl text-[18px] font-bold border outline-none tracking-widest text-center"
            style={{
              background:   "var(--color-elevated)",
              borderColor:  error ? "#EF4444" : "var(--color-border)",
              color:        "var(--color-ink)",
              fontFamily:   "var(--font-dm-mono)",
            }}
          />
        </div>

        {/* Student name */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-ink-4 text-[11px] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Your Name
          </label>
          <div className="relative">
            <select
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-[14px] border outline-none appearance-none"
              style={{
                background:  "var(--color-elevated)",
                borderColor: "var(--color-border)",
                color:       "var(--color-ink)",
                fontFamily:  "var(--font-dm-sans)",
              }}
            >
              {STUDENTS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px]"
            style={{ background: "#EF444412", color: "#EF4444" }}
          >
            <AlertTriangle size={13} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Join */}
        <button
          onClick={handleJoin}
          disabled={checking}
          className="w-full py-3.5 rounded-xl text-white text-[14px] font-bold transition-opacity flex items-center justify-center gap-2"
          style={{ background: "#7C3AED", opacity: checking ? 0.7 : 1 }}
        >
          <BrainCircuit size={16} />
          {checking ? "Checking…" : "Start Test"}
        </button>

        <p className="text-ink-5 text-[11px] text-center">
          Once you start, the timer runs. Don&apos;t refresh unnecessarily — your progress is saved.
        </p>
      </div>
    </div>
  );
}
