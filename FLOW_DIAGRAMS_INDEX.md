# SmartSchool Flow Diagrams - Developer Navigation Guide

## 📊 Visual Flow Diagrams (For Quick Reference)

You now have **5 comprehensive flow diagrams** that show the logic, algorithms, and state management needed for implementation. Use them together as your roadmap.

---

## 🗺️ Quick Navigation

### **Diagram 1: Main Application Flow**
**When to use**: You're building authentication, routing, and role selection
- Shows: Login → OTP → School code → Role selection → Dashboard
- Key decision: Is user authenticated? What's their role?
- Files to create: `auth.ts`, `routes.ts`, `middleware/roleGuard.ts`

**Questions it answers**:
- What happens after login?
- How do we route by role?
- When do we fetch user data?

---

### **Diagram 2: Score → Alert Event Flow** ⚡ **CRITICAL**
**When to use**: Building the teacher scoring feature and parent notifications
- Shows: Score entry → TTI timer → Event emission → Parent push
- **SLA**: <10 minutes from score entry to parent notification
- Files to create: `services/scoring.ts`, `services/tti-monitor.ts`, `services/push-notifications.ts`

**This is your revenue path**. If TTI > 10min, you're losing conversions.

**Questions it answers**:
- When exactly does TTI start? (When score is saved to DB)
- Who listens to the score event? (Admin dashboard, TTI monitor, push service)
- How do we log TTI for debugging?
- What triggers the parent push notification?

**Developer checklist**:
```
□ POST /scores saves timestamp as CA_SCORE_SYNCED
□ Check: if score < 40%, emit CA_SCORE_RISK immediately
□ TTI monitor polls every 30s, logs if > 10min
□ Firebase push sends within TTI threshold
□ Parent sees red card with "Rescue Tolu ₦5,000" CTA
□ Log every event for debugging
```

---

### **Diagram 3: Card Display Logic (Conditional Rendering)**
**When to use**: Building the dashboard components for each role
- Shows: When to render each card based on state
- Admin: 5 cards (Cashflow, At-Risk, Compliance, Ledger, Metrics)
- Teacher: Home card + Analytics (if at-risk students)
- Parent: 3 cards in priority order (Fees, Risk, Diary)

**Files to create**: `dashboards/admin/`, `dashboards/teacher/`, `dashboards/parent/`

**Questions it answers**:
- When do we show the Fees card? (if owing > 0)
- When do we show the At-Risk card? (if count > 0)
- What order do cards appear in? (Priority: Red → Yellow → White)
- Which card has priority on parent dashboard? (Fees, then Risk, then Diary)

**Implementation pattern**:
```typescript
const cards = []
if (state.owing > 0) cards.push(<FeesCard />)
if (state.atRiskCount > 0) cards.push(<RiskCard />)
if (state.diaries.length > 0) cards.push(<DiaryCard />)
return cards
```

---

### **Diagram 4: Offline Support & Sync**
**When to use**: Building mutation hooks and implementing offline-first architecture
- Shows: Optimistic update → Background sync → Queue management
- Tech: TanStack Query + localStorage
- Files to create: `hooks/useOfflineQueue.ts`, all mutations use TanStack

**Questions it answers**:
- What happens when user is offline?
- How do we queue actions?
- When do we retry?
- How long do we persist the queue? (8 hours, max 1000 actions)

**Key pattern**:
```typescript
useMutation({
  mutationFn: asyncApiCall,
  onMutate: optimisticUpdate, // Instant UI change
  onError: queueIfOffline, // Save to localStorage
  onSuccess: invalidateQueries // Refetch
})
```

---

### **Diagram 5: Teacher Class Workflow**
**When to use**: Building the teacher's START CLASS feature
- Shows: START CLASS → Attendance grid → End class modal → Diary → Events
- Files to create: `teacher/useClass.ts`, `pages/teacher/LiveClass.tsx`

**Questions it answers**:
- What happens when teacher clicks [START CLASS]?
- How do we handle attendance taps?
- What triggers the end-class modal?
- When is diary optional vs required?
- What events fire after class?

**Implementation pattern**:
```typescript
1. POST /classes/sessions → Create session
2. Tap attendance → Optimistic green + background sync
3. Click END CLASS → Show modal
4. Send diary → POST /diaries → Emit DIARY_SENT
5. Streak: If 9am-5pm, increment teacher.streak
```

---

### **Bonus: Complete Student Journey**
**When to use**: Understanding how all flows connect end-to-end
- Shows: 9am class → 2pm score → 2:08pm parent notification → Revenue
- This is the story you're shipping

---

## 🔀 How These Flows Connect

```
┌─ Main App Flow ──→ User logs in, role selected, dashboard loaded
├─ Card Logic ─────→ Right cards render based on state
├─ Teacher Class ──→ Teacher starts class, enters score
├─ Score Event ────→ TTI timer starts, parent gets push
├─ Offline Sync ───→ All actions queue locally, retry when online
└─ Result ────────→ Parent sees red card, clicks "Rescue Tolu", pays
```

**These flows are NOT separate — they overlap and trigger each other.**

---

## 🛠️ Implementation Order (7 Days)

### Day 1: Main App Flow
```
Goal: User can login and see correct dashboard by role
□ Build: /login, /otp, /school-code screens
□ Build: Role guard middleware
□ Build: Route to /admin, /teacher, /parent
□ Test: Each role sees their dashboard
```

### Day 2: Card Display Logic
```
Goal: Cards appear/disappear based on state
□ Build: Admin dashboard with 5 cards
□ Build: Teacher home card + analytics
□ Build: Parent card stack (ordered)
□ Test: Add dummy data, verify cards show/hide correctly
```

### Day 3: Teacher Class Workflow
```
Goal: Teacher can START CLASS and record attendance
□ Build: START CLASS button flow
□ Build: Live class screen with attendance grid
□ Build: Optimistic attendance updates
□ Build: End class modal + diary form
□ Test: Full flow without payment
```

### Day 4: Offline Support
```
Goal: All actions work offline and sync when online
□ Build: useOfflineQueue hook
□ Build: TanStack Query setup
□ Build: localStorage queue management
□ Build: Sync status pill (Online | Syncing | Offline)
□ Test: Simulate offline, enter data, go online, verify sync
```

### Day 5: Score Event Flow (Critical)
```
Goal: Score <40% triggers parent notification within 10min
□ Build: Teacher score entry endpoint
□ Build: Event bus (EventEmitter or Socket.io)
□ Build: TTI monitor service
□ Build: Firebase push notification
□ Test: Enter score, verify parent gets push <10min ✓
```

### Day 6: Payment Flow
```
Goal: Parent can pay and see confetti
□ Build: Paystack integration
□ Build: Payment success/failure handling
□ Build: Confetti animation (canvas-confetti)
□ Build: "Top 10% Parent" badge
□ Build: Share button
□ Test: Full payment flow with success screen
```

### Day 7: QA & 2G Testing
```
Goal: App works on slow networks and Tecno phones
□ Test: All flows on 2G simulator
□ Test: Offline for 30min, then sync
□ Test: Rapid clicks (don't double-submit)
□ Test: TTI SLA on staging
□ Ship!
```

---

## 🎯 Key Metrics to Track (For Developers)

Insert logging at these points:

```typescript
// 1. TTI Tracking
logger.log('CA_SCORE_SYNCED', {
  studentId, score, timestamp: Date.now()
})

// 2. TTI Completion
logger.log('TTI_COMPLETE', {
  studentId, tti_minutes: (now - scoreTime) / 60000
})
if (tti_minutes > 10) {
  slack.alert(`TTI EXCEEDED: ${studentId} took ${tti_minutes}min`)
}

// 3. Parent Action
logger.log('PARENT_CLICKED_PUSH', { studentId, timestamp })
logger.log('PARENT_PAID', { studentId, amount, timestamp })

// 4. Offline Queue
logger.log('OFFLINE_ACTION_QUEUED', { endpoint, count: queue.length })
logger.log('OFFLINE_QUEUE_SYNCED', { endpoint, count, duration_ms })
```

Your ops team will want:
- TTI percentiles (p50, p90, p99)
- Offline queue max depth
- Sync failure rate
- Parent unlock rate (target: 62% within 48h)

---

## 🚀 Before You Ship

### Testing Checklist
```
□ All flows work offline for 30 minutes
□ TTI <10 min end-to-end (from score to parent notification)
□ Refresh doesn't break offline queue
□ Sync pill always shows correct status
□ No localStorage leaks
□ Tecno 2G phone loads in <5s
□ Payment succeeds with confetti
□ Confetti doesn't cause jank
```

### Code Review Checklist
```
□ Every mutation uses TanStack Query
□ Every action emits an event (event-driven)
□ No hardcoded role checks (use state instead)
□ TTI logging at entry point
□ Offline queue persists to localStorage
□ Sync status pill on every screen
□ All buttons: 48px minimum height
□ All CTAs: Verb + Outcome copy ("Save Tolu" not "Submit")
```

### Deployment Checklist
```
□ Firebase push credentials set
□ Paystack API key (prod, not sandbox)
□ Database migrations run
□ Event bus configured (local or Redis)
□ Monitoring/alerts set up (TTI, sync, payments)
□ Staging tested 24hrs
□ Rollback plan ready
```

---

## 📝 FAQ for Developers

**Q: When exactly does TTI start?**
A: When the score is saved to the database (after POST /scores succeeds). Log it: `logger.log('CA_SCORE_SYNCED', { timestamp: Date.now() })`

**Q: What if a teacher goes offline after entering a score?**
A: Queue the POST. When they come back online, TanStack Query retries automatically. TTI clock starts when you get DB confirmation.

**Q: Can a parent click "Rescue Tolu" multiple times?**
A: Disable button after first click. Show loading state. Paystack webhook confirms payment only once.

**Q: What if the event bus misses an event?**
A: Use a persistent event log (database table). On app load, check: "Have I processed this event before?" Prevent duplicate payments.

**Q: How do I debug a slow TTI?**
A: Add timing logs at each step:
```
1. score entry: log
2. POST request: log time
3. DB save: log time
4. Event emit: log time
5. TTI monitor receives: log time
6. Push sent: log time
Total = TTI
```

**Q: What's the max offline queue size?**
A: 1000 actions. If queue > 1000, drop the oldest action (it's been queuing for 8+ hours anyway).

---

## 🎓 Learning Resources (For Your Team)

- **TanStack Query** (offline + sync): https://tanstack.com/query
- **Event-driven architecture**: Understand pub/sub patterns
- **Optimistic UI**: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
- **Firebase Cloud Messaging**: https://firebase.google.com/docs/cloud-messaging
- **Fixdesk UI**: Study http://Fixdesk.ng for design patterns

---

## 📞 Next Steps

1. **Share these diagrams with your engineer**
2. **Use the developer flow guide** as your detailed spec
3. **Walk through Day-by-day sprint** together
4. **Set up logging at critical points** (TTI, events, payments)
5. **Test on 2G and offline regularly**
6. **Launch to 1 school**, collect ₦500k, iterate

---

**Questions?** Go back to each flow diagram and drill down. Every box has logic, every arrow has a decision, every color codes a state.

Good luck shipping! 🚀
