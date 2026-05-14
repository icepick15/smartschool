# AI Cognitive Architecture: Complete Development Checklist

**Project**: Build SmartSchool's Cognitive Architect System
**Duration**: 8 weeks (phased rollout)
**Success Criteria**: 70%+ Fix Pack completion rate, +3-5 WAEC point improvement per Fix Pack

---

## WEEK 1: Foundation & Data Infrastructure

### Database Design
- [ ] Create table: `academic_heatmap`
  - Fields: id, student_id, subject, sub_subject, mastery_percent, error_rate, status, confidence_level
  - Indexes: (student_id, subject), (student_id, status)
  - Test: INSERT 1000 rows, SELECT queries <100ms
  
- [ ] Create table: `brain_map`
  - Fields: id, student_id, learning_style_primary, peak_hours_start/end, optimal_sprint_minutes
  - Unique constraint: (student_id)
  - Test: SELECT by student_id <10ms

- [ ] Create table: `waec_readiness_meter`
  - Fields: id, student_id, current_score, subject_scores (JSON), impact_model (JSON)
  - Unique constraint: (student_id)
  - Test: UPDATE current_score <50ms

- [ ] Create table: `learner_personas`
  - Fields: id, student_id, persona_name, top_weaknesses (JSON), recommended_fix_packs (JSON)
  - Unique constraint: (student_id)

- [ ] Create table: `fix_pack_deliveries`
  - Fields: id, student_id, target_topic, content_sequence, difficulty_level, started_at, completed_at, status
  - Indexes: (student_id, completed_at), (status)

- [ ] Create table: `challenges`
  - Fields: id, student_id, fix_pack_topic, problems (JSON), passed, time_spent

### API Contracts
- [ ] Define: POST /api/academic-heatmap/update
  ```json
  Request: {
    studentId: string,
    subject: string,
    subSubject: string,
    score: number,
    maxScore: number,
    timestamp: ISO8601
  }
  Response: { success: boolean, newMastery: number, status: string }
  ```

- [ ] Define: POST /api/personas/synthesize
  ```json
  Request: { studentId: string }
  Response: { personaId, personaName, weaknesses[], strengthTime: string }
  ```

- [ ] Define: POST /api/fix-packs/generate
  ```json
  Request: { studentId: string, targetTopic: string }
  Response: { fixPackId, sprints[], totalMinutes: number }
  ```

### Initial Schema Review
- [ ] Draw ER diagram (ERDPlus or Lucidchart)
- [ ] Present to 1-2 engineers for feedback
- [ ] Adjust for performance (indexing, denormalization)
- [ ] Create database migration scripts

---

## WEEK 2: Core Services (Academic + Neurological)

### AcademicHeatmapService
- [ ] Implement `updateHeatmap()`
  - [ ] Fetch current heatmap entry
  - [ ] Calculate exponential moving average: `0.3 * new + 0.7 * old`
  - [ ] Determine status: RED (<40%), AMBER (40-70%), GREEN (>70%)
  - [ ] Save to DB
  - [ ] Emit HEATMAP_UPDATED event

- [ ] Write unit tests
  - [ ] Score 4/20 → 20% mastery → RED status
  - [ ] Score 15/20 → 75% mastery → GREEN status
  - [ ] Multiple updates: mastery averages correctly
  - [ ] Status change: RED → AMBER → GREEN

- [ ] Implement error handling
  - [ ] Student not found → 404
  - [ ] Invalid score → 400
  - [ ] Database error → 500 + retry logic

### BrainMapInitializer
- [ ] Implement `assessLearningStyle()`
  - [ ] Create 10-question questionnaire (in UI or backend)
  - [ ] Present to student once (on first login)
  - [ ] Score responses: count visual/auditory/kinesthetic preferences
  - [ ] Return primary + secondary style

- [ ] Implement `analyzeActivityPattern()`
  - [ ] Fetch last 7 days of app usage from activity log
  - [ ] Group by hour of day
  - [ ] Find peak hour (most usage)
  - [ ] Define peak window: peakHour ± 2 hours

- [ ] Implement `measureProcessingSpeed()`
  - [ ] Present 3-problem timed puzzle (1-3 min)
  - [ ] Measure completion time
  - [ ] Calculate optimal sprint duration: 3-5 minutes
  - [ ] Store cognitive load capacity: 1-3 concepts/session

- [ ] Write unit tests
  - [ ] Learning style assessment: 10 questions → style classification
  - [ ] Activity pattern: 7 days usage → peak hours identified
  - [ ] Processing speed: timed puzzle → sprint duration

### CognitiveDiagnosis
- [ ] Implement `synthesize()`
  - [ ] Fetch academic heatmap (red entries only)
  - [ ] Fetch brain map
  - [ ] Call `identifyRootCauses()` for each red topic
  - [ ] Call `checkFoundationalGaps()` (prerequisites)
  - [ ] Call `generateRecommendations()`
  - [ ] Create learner persona
  - [ ] Save to DB
  - [ ] Emit PERSONA_SYNTHESIZED event

- [ ] Implement `identifyRootCauses()`
  - [ ] For each weak topic: check prerequisites
  - [ ] If prerequisite is also RED: "Gap in {prerequisite}"
  - [ ] Else: "Conceptual misunderstanding"
  - [ ] Store root cause for each topic

- [ ] Implement `checkFoundationalGaps()`
  - [ ] For Variable Substitution → Check JSS1 Variables
  - [ ] For Quadratic Formulas → Check Factoring
  - [ ] Return: foundational gaps that need JSS1 refreshers

- [ ] Implement `generateRecommendations()`
  - [ ] Sort topics by mastery (lowest first)
  - [ ] Top 3 = urgent recommendations
  - [ ] Estimate WAEC gain for each: Variable Sub = +4, etc.
  - [ ] Set urgency: critical (topic 1), high (topic 2), medium (topic 3)

- [ ] Write unit tests
  - [ ] Synthesize persona: heatmap + brain map → persona JSON
  - [ ] Root cause detection: RED prerequisites → "Gap" label
  - [ ] Recommendations: sort by mastery + gain points

### WAECReadinessMeter
- [ ] Implement `calculateProjection()`
  - [ ] Fetch all subject heatmaps
  - [ ] Average mastery per subject
  - [ ] Map mastery % → WAEC score (linear: 70% mastery = 60/100 WAEC)
  - [ ] Calculate overall WAEC score
  - [ ] Build impact model: each topic → points gained if fixed

- [ ] Implement `buildImpactModel()`
  - [ ] For each red/amber topic: estimate gain points
  - [ ] Example: Variable Sub (32% mastery) → fix to 70% → +4 points
  - [ ] Store confidence level (0.6-0.99)
  - [ ] Return impact JSON: { 'Variable Sub': { gain_points: 4, confidence: 0.85 } }

- [ ] Write unit tests
  - [ ] Subject mastery → WAEC score mapping
  - [ ] Impact model: estimate points gained
  - [ ] Projection update: after Fix Pack, score should increase

---

## WEEK 3: Fix Pack Engine & Content Personalization

### FixPackSynthesis
- [ ] Implement `generate()`
  - [ ] Fetch brain map (learning style)
  - [ ] Fetch heatmap (current mastery)
  - [ ] Check prerequisites: if gap exists → inject 60-sec refresher
  - [ ] Select content modality: Visual-Spatial → infographic
  - [ ] Build sprint sequence (3 sprints max)
  - [ ] Calculate total duration
  - [ ] Save delivery log
  - [ ] Return: fixPackId, sprints[], totalMinutes

- [ ] Implement `selectModality()`
  - [ ] Visual-Spatial → [infographic, interactive, video]
  - [ ] Auditory → [video, text, infographic]
  - [ ] Kinesthetic → [interactive, video, infographic]
  - [ ] Return first modality (primary)

- [ ] Implement `calculateDifficulty()`
  - [ ] Mastery <30%: EASY
  - [ ] Mastery 30-50%: MEDIUM
  - [ ] Mastery >50%: HARD
  - [ ] Persist difficulty level for future reference

- [ ] Content Repository Setup
  - [ ] Create database table: `content_library`
    - Fields: id, type (infographic | video | text | interactive), subject, topic, resourceId, url
  - [ ] Populate with at least 20 math topics (Algebra focus)
  - [ ] Each topic: 2-3 infographics, 1-2 videos, 1 interactive puzzle
  - [ ] Example:
    ```json
    {
      type: "infographic",
      subject: "Math",
      topic: "Variable Substitution",
      resourceId: "infographic-varsub-01",
      url: "https://cdn.smartschool.com/infographics/variable-sub.svg"
    }
    ```

- [ ] Implement `getContentByModality()`
  - [ ] Query content_library by type + topic
  - [ ] Return best match (by rating/engagement)
  - [ ] Fallback: return any content for that topic

- [ ] Write unit tests
  - [ ] Generate Fix Pack: persona + heatmap → content sequence
  - [ ] Modality selection: learning style → correct modality
  - [ ] Difficulty calculation: mastery % → level
  - [ ] Content selection: topic → content from library

### FixPackDeliveryService
- [ ] Implement `deliverToStudent()`
  - [ ] Calculate optimal delivery time (peak hours from brain map)
  - [ ] Create notification: title, body, deep link
  - [ ] Queue notification for delivery
  - [ ] Update delivery status: "queued"

- [ ] Implement `calculateDeliveryTime()`
  - [ ] Current time within peak hours? Deliver now
  - [ ] Before peak? Schedule for peak start today
  - [ ] After peak? Schedule for peak start tomorrow
  - [ ] Account for timezone

- [ ] Write unit tests
  - [ ] Delivery scheduled for peak hours (brain map says 4-6 PM)
  - [ ] Notification includes: title + urgency + deep link

---

## WEEK 4: UI & Dopamine Loops

### FixPackViewer Component
- [ ] Layout
  - [ ] Header: "Variable Substitution Mastery Challenge"
  - [ ] Progress bar (fills 0% → 100% as sprints complete)
  - [ ] Current sprint content (infographic | video | interactive)
  - [ ] [Next Sprint] button (disabled until current sprint complete)

- [ ] Progress Bar
  - [ ] Width: 0% → 100% as sprints complete
  - [ ] Color: green (#10B981)
  - [ ] Smooth CSS transition (not jerky)
  - [ ] Show text: "2/3 sprints complete"

- [ ] Micro-Rewards
  - [ ] After Sprint 1: "Great! One more..."
  - [ ] After Sprint 2: "Almost there!"
  - [ ] After Sprint 3: "Final push!"
  - [ ] Haptic feedback: navigator.vibrate(50)

- [ ] Completion Screen
  - [ ] Confetti animation (canvas-confetti, 150 pieces, 1.2s duration)
  - [ ] Message: "MASTERED! Variable Substitution 32% → 78%"
  - [ ] WAEC gain: "+4 points"
  - [ ] Next steps: "Application Challenge" button
  - [ ] Share button: "Tell Mum" (WhatsApp share)

- [ ] Error Handling
  - [ ] Network error during sprint: "Saving..." + retry
  - [ ] User leaves app: resume from same sprint
  - [ ] Sprint timeout: auto-save progress

- [ ] Write tests
  - [ ] Progress bar width matches sprint count
  - [ ] Confetti plays on completion
  - [ ] Micro-rewards show after each sprint
  - [ ] Heatmap update shown in results card

### Notification Component
- [ ] Red Invitation Card
  - [ ] Title: "Risk Detected in Algebra"
  - [ ] Body: "Unlock your 5-minute Fix Pack. Master it → +4 WAEC points"
  - [ ] CTA button: [Start Fix Pack] (green, 48px)
  - [ ] Urgency badge: "Critical" (red)

---

## WEEK 5: Validation & Recalibration

### ApplicationChallenge
- [ ] Implement `generateAndDeliver()`
  - [ ] Generate 3-5 problems (similar topic, slightly harder)
  - [ ] Set time limit: 5 minutes
  - [ ] Passing score: 80% correct
  - [ ] Present immediately after Fix Pack completion

- [ ] Implement `evaluateChallenge()`
  - [ ] Check: score >= passing_score?
  - [ ] If YES: Heatmap status → GREEN, emit CHALLENGE_PASSED
  - [ ] If NO: Schedule next Fix Pack, emit CHALLENGE_FAILED

- [ ] Problem Generation
  - [ ] Use template library: "If x = ___, substitute into ___"
  - [ ] Vary difficulty: easy → medium → hard
  - [ ] Include common mistakes as decoys

- [ ] Write tests
  - [ ] Challenge generated after Fix Pack completion
  - [ ] Passing challenge: heatmap updates to GREEN
  - [ ] Failing challenge: next Fix Pack scheduled

### Heatmap Auto-Update (Real-time)
- [ ] On Challenge Pass
  - [ ] Update: mastery_percent = 80, status = 'green'
  - [ ] Animate: heatmap color change in UI (red → green)
  - [ ] Show: "Variable Substitution: 32% → 80%" (in results card)

### Parent Notification
- [ ] On Fix Pack Complete
  ```
  Title: "Tolu mastered Variable Substitution!"
  Body: "Heatmap updated: 32% → 80%
  WAEC readiness: 58 → 62 (+4 points)"
  CTA: [View Tolu's Progress]
  ```

- [ ] Implement `notifyParent()`
  - [ ] Fetch parent phone number
  - [ ] Send notification (Firebase or OneSignal)
  - [ ] Include: topic, mastery gain, WAEC projection
  - [ ] Deep link to parent dashboard

### WAEC Meter Recalculation
- [ ] On Challenge Pass
  - [ ] Update topic mastery to 80%
  - [ ] Recalculate subject average
  - [ ] Recalculate WAEC projection
  - [ ] Update impact model (which topics to fix next)
  - [ ] Save snapshot to history

- [ ] Write tests
  - [ ] Challenge pass → heatmap green + WAEC +4
  - [ ] Parent gets notification with new score
  - [ ] Persona updates with new recommendations

---

## WEEK 6: Real-Time Updates & Analytics

### WebSocket Setup
- [ ] Implement real-time heatmap updates
  - [ ] Parent/Admin dashboard subscribes to `student/:studentId/heatmap`
  - [ ] When heatmap updates: broadcast new status
  - [ ] Update visible in parent dashboard <500ms

- [ ] Implement real-time WAEC updates
  - [ ] Parent sees live WAEC score projection
  - [ ] Updates after each challenge pass
  - [ ] Shows: "Your child's WAEC readiness: 58 → 62 (+4)"

### Admin Analytics Dashboard
- [ ] Heatmap View: Grid of all students
  - Columns: Student Name, Subject, Mastery %, Status (color-coded)
  - Filter by: Subject, Status (red/amber/green)
  - Sort by: Mastery (ascending = most urgent)

- [ ] Persona Distribution
  - Bar chart: Visual vs. Auditory vs. Kinesthetic
  - Peak hours distribution (clock chart: most students peak at 4PM?)
  - Learning style vs. completion rate

- [ ] Fix Pack Metrics
  - Completion rate by learning style
  - Average Fix Pack duration
  - Challenge pass rate
  - WAEC improvement trend

- [ ] Real-time Activity
  - "Tolu just started Variable Substitution Fix Pack"
  - "Zainab passed Challenge! WAEC: 62 → 66"
  - "123 students online now"

---

## WEEK 7: Testing & Performance Optimization

### End-to-End Tests
- [ ] Scenario: "Tolu gets low score → Fix Pack → Challenge → WAEC update"
  - [ ] Step 1: POST /academic-heatmap/update { score: 4 }
  - [ ] Verify: Heatmap status = RED
  - [ ] Step 2: POST /personas/synthesize { studentId: tolu }
  - [ ] Verify: Persona created with recommendations
  - [ ] Step 3: POST /fix-packs/generate { targetTopic: 'Variable Substitution' }
  - [ ] Verify: Fix pack sprints generated, delivery scheduled
  - [ ] Step 4: Student completes Fix Pack + Challenge
  - [ ] Step 5: Verify heatmap GREEN, WAEC +4, parent notified

- [ ] Load test
  - [ ] 1000 students online simultaneously
  - [ ] 100 students submitting heatmap updates/second
  - [ ] Measure: API latency, database load, WebSocket bandwidth

### Performance Benchmarks
- [ ] Heatmap update: <100ms
- [ ] Persona synthesis: <5s
- [ ] Fix Pack generation: <3s
- [ ] Challenge evaluation: <1s
- [ ] WAEC recalculation: <2s
- [ ] WebSocket broadcast: <500ms

### Database Optimization
- [ ] Verify indexes exist for all queries
- [ ] Run EXPLAIN ANALYZE on heavy queries
- [ ] Test cache layer (Redis) for personas + WAEC models
- [ ] Connection pooling: 50+ concurrent connections

### Code Quality
- [ ] Unit test coverage: >80%
- [ ] ESLint: Zero errors
- [ ] TypeScript: Strict mode, no `any` types
- [ ] Code review: 2 engineers approve before merge

---

## WEEK 8: Deployment & Monitoring

### Staging Deployment
- [ ] Deploy to staging database + server
- [ ] Run full end-to-end test suite
- [ ] Manual testing: 1 school (10 students)
- [ ] Monitor for 24 hours: error rates, latency, DB load

### Production Deployment - Phase 1 (1 School)
- [ ] Deploy to production
- [ ] Monitor dashboard: error rate, TTI, WAEC improvements
- [ ] Collect user feedback (teachers + parents)
- [ ] Adjust: content modalities, difficulty levels, delivery times

### Logging & Monitoring
- [ ] Log all critical events:
  - [ ] `HEATMAP_UPDATED`: { studentId, oldMastery, newMastery, status }
  - [ ] `PERSONA_SYNTHESIZED`: { studentId, personaName, weaknesses }
  - [ ] `FIX_PACK_GENERATED`: { studentId, topic, modality, difficulty }
  - [ ] `FIX_PACK_STARTED`: { fixPackId, studentId, timestamp }
  - [ ] `CHALLENGE_PASSED`: { studentId, topic, score, timeSpent }
  - [ ] `CHALLENGE_FAILED`: { studentId, topic, score }
  - [ ] `WAEC_UPDATED`: { studentId, oldScore, newScore, gain }

- [ ] Set up alerts
  - [ ] Error rate > 1% → Slack alert
  - [ ] API latency p99 > 500ms → Slack alert
  - [ ] Challenge pass rate < 60% → Adjust difficulty
  - [ ] Heatmap update latency > 5s → Investigate

### Analytics & Reporting
- [ ] Daily report: Active students, Fix Packs created, WAEC improvements
- [ ] Weekly report: Persona distribution, learning style effectiveness, top weak topics
- [ ] Monthly report: Overall impact, revenue (Fix Packs sold), student testimonials

---

## Critical Success Metrics

| Metric | Target | By When |
|--------|--------|---------|
| Persona synthesis time | <5s | Week 2 |
| Fix Pack generation time | <3s | Week 3 |
| API latency (p99) | <500ms | Week 6 |
| Fix Pack completion rate | >75% | Week 4 |
| Challenge pass rate | >70% | Week 5 |
| WAEC improvement per Fix Pack | +3 points | Week 6 |
| Parent notification sent within | 10s of challenge pass | Week 5 |
| Heatmap color change visible to parent | <500ms | Week 6 |
| Load test: 1000 students | <2s latency | Week 7 |

---

## Risk Mitigation

### Risk: Persona synthesis takes >5 seconds
- **Mitigation**: Cache brain maps + use decision tree (not ML models)
- **Fallback**: Serve generic Fix Pack while diagnosis runs in background

### Risk: Fix Pack completion rate <50%
- **Mitigation**: Difficulty too hard → reduce sprint duration from 3min → 2min
- **Fallback**: Add more micro-rewards, simplify language, reduce cognitive load

### Risk: Database query latency high with large dataset
- **Mitigation**: Denormalize: store `current_mastery` + `status` in brain_map (copy from heatmap)
- **Fallback**: Implement caching layer (Redis) for heatmap queries

### Risk: Parents don't understand WAEC gain from Fix Packs
- **Mitigation**: Show impact model in parent dashboard: "Fix Variable Sub → +4 points"
- **Fallback**: A/B test messaging: "Helps with school exams" vs. "WAEC +4 points"

---

## Rollout Plan

**Week 1 (Launch)**: Greenville School
- [ ] 50 students (SS1 + SS2)
- [ ] Math focus (Algebra)
- [ ] Daily standups with school leadership
- [ ] Collect feedback: teacher + parent interviews

**Week 2-3**: Expand to 3 schools
- [ ] 200 students
- [ ] Refine: content modalities, difficulty curves, delivery times
- [ ] Monitor: WAEC improvements (mid-term exams)

**Week 4**: Expand to 10 schools
- [ ] 1000 students
- [ ] Add: Physics + English content
- [ ] Validate: persona accuracy (learning style effectiveness)

**Week 5+**: Nationwide
- [ ] 10,000+ students
- [ ] Monetize: Fix Pack bundles (₦2,000 / 5-pack)
- [ ] Recurring: "Fix Pack Subscription" (₦5,000 / month)

---

## Definition of Done (For Each Component)

- [ ] Code written + code reviewed
- [ ] Unit tests: >80% coverage
- [ ] Integration tests pass
- [ ] Database migrations run cleanly
- [ ] API documentation updated
- [ ] Error handling implemented
- [ ] Logging added (all critical paths)
- [ ] Performance benchmarks met
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Merged to main branch

---

**Ready? Let's build the Cognitive Architect.** 🧠🚀
