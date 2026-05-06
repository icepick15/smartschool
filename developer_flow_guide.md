# SmartSchool Developer Flow Guide
## Complete Reference for All State & Logic Flows

> **For Developers**: Use these diagrams + this guide together. Each flow shows decision logic, state transitions, and event triggers needed for implementation.

---

## 📋 Quick Navigation

| Flow | Purpose | Key Files | TTI Impact |
|------|---------|-----------|-----------|
| **Main App Flow** | Auth → Role → Dashboard | auth.ts, routes.ts | Initial load |
| **Score → Alert Event** | Score <40% → Push to parent | scoring.ts, events.ts | **<10min (Critical)** |
| **Card Display Logic** | When to show each card | dashboards/ | Conditional UI |
| **Offline/Sync** | Queue & TanStack Query | useOfflineQueue.ts | Persistence |
| **Teacher Class** | Start → Attendance → Diary | teacher/useClass.ts | Session mgmt |

---

## 🔄 FLOW 1: Main Application Flow

**What it shows**: User login → role selection → dashboard routing

**Developer tasks**:
```
□ Auth middleware: Check localStorage token
□ Role guard: If NOT authenticated → /login
□ OTP verification: WhatsApp OTP API integration
□ School code validation: Ensure parent-school relationship
□ Role-based routing: admin | teacher | parent
□ Sync pull on mount: Fetch user data, cards, metrics
```

**Key files**:
- `pages/login.tsx` - Phone/OTP/school code screens
- `middleware/roleGuard.ts` - Redirect on auth failure
- `hooks/useUser.ts` - Fetch role + profile
- `routes.tsx` - Route guards per role

**State to manage**:
```typescript
{
  isAuthenticated: bool,
  user: { id, phone, role, schoolId, children? },
  loading: bool,
  syncStatus: 'online' | 'syncing' | 'offline'
}
```

---

## 🎯 FLOW 2: Score → Alert Event (CRITICAL REVENUE PATH)

**What it shows**: When a teacher enters a score, what happens next?

**Developer tasks**:
```
□ Teacher enters score on /teacher/analytics
□ POST /scores { studentId, subject, score, timestamp }
□ Trigger: CA_SCORE_SYNCED (emit on EventBus immediately)
□ Check: if score < 40% → emit CA_SCORE_RISK
□ TTI Monitor: Log timestamp NOW(), check TTI every 30s
□ If TTI > 10min → Slack alert (log to admin dashboard)
□ Parent notification: Firebase push with deep link
□ Parent sees red card on /parent dashboard
```

**Key files**:
- `teacher/services/scoring.ts` - POST score, emit event
- `services/events.ts` - Event bus (emit/subscribe)
- `services/tti-monitor.ts` - TTI logging & alerts
- `services/push-notifications.ts` - Firebase/OneSignal
- `parent/hooks/useRiskCards.ts` - Listen to CA_SCORE_RISK

**Metrics to log**:
```typescript
{
  timestamp: NOW(),
  event: 'CA_SCORE_SYNCED',
  studentId, score, subject,
  tti_start: timestamp,
  // Later:
  tti_parent_notified: <timestamp when push sent>,
  tti_parent_clicked: <timestamp if parent opened push>,
  tti_parent_paid: <timestamp if Fix Pack bought>
}
```

**Critical SLA**:
- ⏱️ TTI <10 min from score entry to parent notification
- If >10min, log Slack alert: `#tti-alerts [student] score < 40%, TTI: 12min`
- Target: 90% of parents notified within 10min

---

## 🎨 FLOW 3: Card Display Logic (Conditional Rendering)

**What it shows**: When to render each card based on state

### ADMIN Dashboard (/admin)
```typescript
// Card 1: Cashflow (RED)
if (state.totalOwing > 0) {
  show: {
    title: `₦${state.totalOwing.toLocaleString()} Behind`,
    badge: 'Urgent',
    cta: 'WhatsApp All Debtors',
    social: '31 of 32 schools do this weekly'
  }
}

// Card 2: At-Risk (AMBER)
const atRiskCount = state.students.filter(s => s.score < 40).length
if (atRiskCount > 0) {
  show: {
    title: `${atRiskCount} Kids At Risk`,
    badge: 'Fix Now',
    cta: 'Blast Parents Now',
    stat: 'TTI avg: 62 days. Target: 2 days'
  }
}

// Card 3: Compliance (Orange, loop per teacher)
state.teachers.forEach(teacher => {
  if (teacher.onTimePercent < 80) {
    show: {
      title: `${teacher.name} ${teacher.onTimePercent}%`,
      badge: teacher.onTimePercent < 50 ? 'Bottom 10%' : '',
      cta: 'Call Teacher'
    }
  }
})

// Card 4: Fee Ledger (Always show)
return <FeeLedger students={state.students} />

// Card 5: Metrics (Always show)
return <MetricsCard data={state.metrics} />
```

### TEACHER Dashboard (/teacher)
```typescript
// Home Card (Always show)
show: {
  greeting: `Good morning ${teacher.firstName}`,
  social: `Your class is ${teacher.onTimePercent}% on-time. ${peer.name} is ${peer.onTimePercent}%.`,
  footer: teacher.streakDays > 1 ? `🔥 ${teacher.streakDays}-day streak. Don't break it.` : '',
  cta: 'START CLASS' // 48px, full-width, green
}

// Analytics Card (Show if at-risk students exist)
const atRiskStudents = state.classStudents.filter(s => s.score < 40)
if (atRiskStudents.length > 0) {
  show: {
    title: `${atRiskStudents.length} Students At Risk`,
    list: atRiskStudents.map(s => ({
      name: s.name,
      score: `${s.score}/20`,
      cta: 'SAVE {name} – Create Fix Pack'
    }))
  }
}
```

### PARENT Dashboard (/parent) - ORDERED STACK
```typescript
const cards = []

// Card 1: Fees (RED - TOP PRIORITY)
if (state.owingAmount > 0) {
  cards.push({
    order: 1,
    color: 'red',
    title: `FEES DUE ₦${state.owingAmount.toLocaleString()}`,
    badge: 'Report Locked',
    body: `${state.classmates_unlocked} classmates unlocked. ${child.name}'s waiting.`,
    cta: 'UNLOCK {CHILD}'S FUTURE',
    footer: 'Avoid the talk at pickup'
  })
}

// Card 2: Risk (RED - SECOND PRIORITY)
if (state.lowestScore < 40) {
  cards.push({
    order: 2,
    color: 'red',
    title: `${state.subject} RISK ${state.lowestScore}/20`,
    badge: 'Urgent',
    body: 'WAEC Data: 90% who ignore this fail SS3.',
    stat: `Only ${state.fixPackSlotsLeft} Fix Pack slots left today`,
    cta: 'RESCUE {CHILD} ₦5,000',
    footer: 'You promised to help them'
  })
}

// Card 3: Diary (WHITE/GREEN - MOST RECENT)
if (state.diaries.length > 0) {
  const latest = state.diaries[0] // newest first
  cards.push({
    order: 3,
    color: 'white',
    title: `NEW DIARY ${latest.time}`, // 3:12pm
    badge: 'New',
    body: `${latest.teacherName}: ${latest.message}`,
    cta: 'Thank {Teacher}',
    footer: `Other mums got this. You're caught up.`
  })
}

return cards.sort((a, b) => a.order - b.order).map(card => <Card {...card} />)
```

**Implementation pattern**:
```typescript
// dashboards/parent/useParentDashboard.ts
const useParentDashboard = (childId) => {
  const { data: child } = useQuery(['child', childId])
  const { data: payments } = useQuery(['payments', childId])
  const { data: scores } = useQuery(['scores', childId])
  const { data: diaries } = useQuery(['diaries', childId])
  
  const cards = useMemo(() => {
    const computed = []
    
    if (payments.total - payments.paid > 0) {
      computed.push({ type: 'fees', order: 1, ... })
    }
    
    if (Math.min(...scores.map(s => s.score)) < 40) {
      computed.push({ type: 'risk', order: 2, ... })
    }
    
    if (diaries.length > 0) {
      computed.push({ type: 'diary', order: 3, ... })
    }
    
    return computed.sort((a, b) => a.order - b.order)
  }, [child, payments, scores, diaries])
  
  return { cards, isLoading: !child }
}
```

---

## 📲 FLOW 4: Offline Support & Sync (TanStack Query)

**What it shows**: How actions persist when user is offline, and sync when back online

**Implementation pattern**:
```typescript
// hooks/useOfflineQueue.ts
export const useOfflineQueue = () => {
  const queryClient = useQueryClient()
  const [syncStatus, setSyncStatus] = useState('online') // 'online' | 'syncing' | 'offline'
  
  // Listen to network changes
  useEffect(() => {
    const handleOnline = () => setSyncStatus('syncing')
    const handleOffline = () => setSyncStatus('offline')
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // Dequeue and retry mutations when back online
  useEffect(() => {
    if (syncStatus !== 'syncing') return
    
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]')
    let completed = 0
    
    queue.forEach(async (action, idx) => {
      try {
        // Retry the mutation
        await apiClient.post(action.endpoint, action.payload)
        completed++
      } catch (err) {
        console.error('Retry failed:', action, err)
      }
    })
    
    if (completed === queue.length) {
      localStorage.removeItem('offlineQueue')
      setSyncStatus('online')
      // Invalidate and refetch
      queryClient.invalidateQueries()
    } else {
      // Keep retrying
      setTimeout(() => setSyncStatus('syncing'), 5000)
    }
  }, [syncStatus])
  
  return { syncStatus }
}

// In components: useMutation for every action
export const usePostScore = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ studentId, score }) => 
      apiClient.post('/scores', { studentId, score }),
    
    onMutate: ({ studentId, score }) => {
      // Optimistic update
      queryClient.setQueryData(['scores', studentId], old => [
        ...old,
        { score, timestamp: Date.now() }
      ])
    },
    
    onError: (err, { studentId, score }) => {
      // If offline, queue it
      if (err.message.includes('Network')) {
        const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]')
        queue.push({
          endpoint: '/scores',
          payload: { studentId, score }
        })
        localStorage.setItem('offlineQueue', JSON.stringify(queue))
        
        // Show: " Offline – Saved. Will send when Tolu needs it."
        toast.info('Saved offline. Will send when connected.')
      }
    },
    
    onSuccess: () => {
      // Event: Emit on EventBus
      eventBus.emit('CA_SCORE_SYNCED', { studentId, score })
    }
  })
}
```

**Key implementation**:
- ✅ Write local first (optimistic UI)
- ✅ Queue if offline (localStorage key: `offlineQueue`)
- ✅ Show sync status: Top-right pill `☑ Online | ⟳ Syncing | ☒ Offline`
- ✅ Retry on network restore (exponential backoff, max 8hrs)
- ✅ Persist: Max 1000 actions in queue
- ✅ Display: "Saved. Will send when Tolu needs it." (commitment language)

---

## 👨‍🏫 FLOW 5: Teacher Class Workflow

**What it shows**: START CLASS → Attendance → Diary → Event

**Step-by-step implementation**:

### Step 1: Create Class Session
```typescript
// pages/teacher/home.tsx
const handleStartClass = async () => {
  const session = await apiClient.post('/classes/sessions', {
    schoolId: user.schoolId,
    classId: 'SS2A',
    teacherId: user.id,
    startTime: new Date()
  })
  
  // Event: CLASS_STARTED
  eventBus.emit('CLASS_STARTED', { classSessionId: session.id })
  
  // Navigate to live class
  navigate(`/teacher/class/${session.id}`)
}
```

### Step 2: Live Class Screen (Attendance)
```typescript
// pages/teacher/LiveClass.tsx
const [attendance, setAttendance] = useState(
  students.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
)

const toggleAttendance = (studentId) => {
  // Optimistic update
  setAttendance(prev => ({
    ...prev,
    [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
  }))
  
  // Background mutation
  usePostAttendance().mutate({ classSessionId, studentId, attendance })
}

return (
  <div>
    <header>SS2A Math • 04:32 <button>END CLASS</button></header>
    <tabs>
      <tab name="Attendance">
        <grid>
          {students.map(s => (
            <face 
              key={s.id}
              onClick={() => toggleAttendance(s.id)}
              color={attendance[s.id] === 'present' ? 'green' : 'red'}
            >
              {s.name}
            </face>
          ))}
        </grid>
      </tab>
      ...
    </tabs>
  </div>
)
```

### Step 3: End Class Modal
```typescript
// After teacher clicks [END CLASS]
const handleEndClass = () => {
  showModal({
    title: 'Class Complete',
    body: 'Send diary or parents think you skipped.',
    cta1: 'SEND DIARY', // green
    cta2: 'Skip', // ghost
    
    onSendDiary: async () => {
      const diary = await showDiaryForm()
      
      await apiClient.post('/diaries', {
        classSessionId: session.id,
        content: diary.text,
        timestamp: new Date()
      })
      
      // Event: DIARY_SENT
      eventBus.emit('DIARY_SENT', { classSessionId: session.id })
      
      // Confetti for teacher? (optional dopamine)
      navigate('/teacher')
    },
    
    onSkip: () => {
      // Just close, no diary saved
      navigate('/teacher')
    }
  })
}
```

### Step 4: Complete Events
```typescript
// Events to emit:
eventBus.emit('CLASS_STARTED', { classSessionId, teacherId })
eventBus.emit('ATTENDANCE_RECORDED', { classSessionId, attendance })
eventBus.emit('DIARY_SENT', { classSessionId, diaryId })
eventBus.emit('CLASS_ENDED', { classSessionId, duration })

// Listeners:
eventBus.on('CLASS_STARTED', () => {
  // Admin: Update dashboard badge
  // Parent: Show teacher is live
})

eventBus.on('DIARY_SENT', () => {
  // Parent: Show new diary on dashboard
  // Admin: Track diary SLA (90% by 3:15pm)
})

eventBus.on('CLASS_ENDED', () => {
  // Teacher: Update streak if 9am-5pm
  if (isBusinessHours()) teacher.streak++
})
```

---

## 🚀 Implementation Checklist

Use these flows in this order:

- [ ] **Week 1: Main Flow + Auth**
  - Implement: Login → OTP → School code → Role selection
  - Test: All 3 roles can log in and see correct dashboard

- [ ] **Week 2: Card Logic + Offline**
  - Implement: Conditional card rendering per role
  - Implement: TanStack Query + offline queue
  - Test: Cards appear/disappear based on state

- [ ] **Week 3: Teacher Class (Feature)**
  - Implement: START CLASS → Attendance grid
  - Implement: End class modal → Diary form
  - Test: Session persists, events emit

- [ ] **Week 4: Score → Alert (Revenue)**
  - Implement: Teacher score entry → Event bus
  - Implement: TTI monitor <10min
  - Implement: Firebase push notification
  - Implement: Parent red card + "Rescue Tolu" CTA
  - **Test**: Score entry → Parent notification <10min ✓

- [ ] **Week 5: Payment + Confetti**
  - Implement: Payment modal (Paystack integration)
  - Implement: Success confetti (canvas-confetti)
  - Implement: "Top 10% Parent" badge + Share button
  - Test: Full revenue loop

---

## 🎓 Key Patterns for Developers

### 1. Event-Driven Architecture
Every action emits an event. Other systems listen.
```typescript
// Bad: Teacher saves score, directly calls parent notification
// Good: Teacher saves score, emits CA_SCORE_RISK, 
//       TTI monitor and push service both listen independently
```

### 2. Optimistic UI
Never wait for server. Update UI instantly, sync later.
```typescript
// User taps attendance → green checkmark shows immediately
// POST in background → if fails, revert
```

### 3. Offline-first with TanStack
Every mutation uses TanStack Query with offline queue.
```typescript
// Even if offline, action saved to localStorage
// When online, queue drains automatically
// Always show sync status
```

### 4. Conditional Rendering by State
Cards appear/disappear based on state, not hardcoded.
```typescript
// Don't: if (user.role === 'parent') show FeesCard
// Do: if (state.owing > 0) show FeesCard
```

---

## 📊 State Management Summary

```typescript
// Global state you'll need:
interface AppState {
  // Auth
  user: { id, role, schoolId, phone }
  isAuthenticated: bool
  
  // UI
  syncStatus: 'online' | 'syncing' | 'offline'
  
  // Role-specific (Admin)
  admin: {
    totalOwing: number
    atRiskCount: number
    teacherCompliance: Teacher[]
    students: Student[]
  }
  
  // Role-specific (Teacher)
  teacher: {
    classes: Class[]
    currentSession?: ClassSession
    streakDays: number
  }
  
  // Role-specific (Parent)
  parent: {
    children: Child[]
    owingByChild: { [childId]: number }
    riskScores: { [childId]: Score[] }
    diaries: Diary[]
  }
}
```

---

## 🔧 Technology Stack (Recommended)

```
Frontend:
• React 18 + TypeScript
• TanStack Query (React Query) - state + offline
• React Router - routing + role guards
• Zustand or Jotai - global state
• TailwindCSS - styling (Fixdesk colors)
• Lucide Icons - 20px icons only
• canvas-confetti - payment celebration
• Firebase Cloud Messaging - push notifications

Backend:
• Node.js + Express or Nestjs
• PostgreSQL - persistence
• Redis - event bus (or simple in-memory EventEmitter)
• Bull or similar - job queue (for TTI monitoring, push retry)

Real-time:
• Socket.io or WebSockets for TTI updates
• Or: Polling every 30s (simpler for MVP)
```

---

## 📞 Questions for Your Engineer

1. **How will you implement the event bus?** (Socket.io, Redis pub/sub, or simple EventEmitter?)
2. **What's your offline queue max size?** (Recommended: 1000 actions, 8-hour TTL)
3. **Who owns the TTI monitor?** (Backend cron job or frontend setTimeout?)
4. **Push notification provider?** (Firebase, OneSignal, AWS SNS?)
5. **Database for audit log?** (For "when was parent notified", "when did parent click push")

---

## ✅ Validation Before Ship

- [ ] All flows tested on Tecno 2G phone (slow network)
- [ ] All flows tested offline for 30 min
- [ ] TTI <10 min verified in staging
- [ ] Confetti plays smoothly (no jank)
- [ ] Sync pill shows correct status (never stuck "Syncing")
- [ ] No localStorage leaks (privacy)
- [ ] Refresh doesn't lose offline queue
