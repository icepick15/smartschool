# AI-Driven Cognitive Architecture: Developer Implementation Guide

**Mission**: Transform SmartSchool from a Content Provider to a Cognitive Architect.

Instead of serving the same Math video to all students, serve a **personalized, neurologically-optimized learning experience** unique to each learner's brain and needs.

---

## Part 1: Architecture Overview

### High-Level System Flow

```
Student Score Enters
        ↓
Academic Heatmap Updated (Sub-Subject level)
        ↓
AI Diagnosis: Synthesize Academic + Neurological Data
        ↓
Generate Fix Pack (Personalized content sequence)
        ↓
Delivery: Time-optimized, format-personalized, dopamine-driven
        ↓
Student Completes Fix Pack
        ↓
Validation: Application Challenge
        ↓
Recalibrate: Update all models + WAEC Readiness Meter
        ↓
Parent Notification: Success metrics + next steps
```

### Three Core Data Models

**1. Sub-Subject Heatmap** (Academic Anatomy)
- Not "Math weakness" but "Variable Substitution 32% mastery"
- Granular: Each topic has mastery %, error rate, time-on-task
- Updated real-time after every assessment
- Storage: PostgreSQL table `academic_heatmap`

**2. Brain Map** (Neurological Profile)
- Learning style: Visual-Spatial | Auditory-Sequential | Kinesthetic
- Attention Pulse: Peak times (4PM?) vs. low times (8AM?)
- Processing speed: Optimal sprint length (3 min vs. 10 min)
- Stored once, referenced for all content delivery
- Storage: PostgreSQL table `brain_map`

**3. WAEC Readiness Meter** (Projection Model)
- Current score: 58/100
- Projected WAEC: 48/100 (if no improvement)
- Subject scores: Math 42, English 68, Physics 52
- Impact model: "Fix Variable Sub → +4 points → 52 score"
- Updated after each Fix Pack completion
- Storage: PostgreSQL table `waec_readiness`

---

## Part 2: Data Schema

### Database Tables

```sql
-- Core Academic Data
CREATE TABLE academic_heatmap (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  subject VARCHAR(50), -- 'Math', 'English', 'Physics'
  sub_subject VARCHAR(100), -- 'Algebra', 'Variable Substitution', etc.
  mastery_percent INT, -- 0-100
  error_rate INT, -- 0-100 (% of attempts that are wrong)
  time_on_task_minutes INT,
  last_attempt TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  -- Derived status
  status VARCHAR(20), -- 'red' (<40%), 'amber' (40-70%), 'green' (>70%)
  confidence_level FLOAT, -- How confident is AI? (0.6-0.99)
  
  FOREIGN KEY (student_id) REFERENCES users(id),
  INDEX (student_id, subject, status)
);

-- Neurological Profiling
CREATE TABLE brain_map (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  
  -- Learning Style
  learning_style_primary VARCHAR(50), -- 'visual', 'auditory', 'kinesthetic'
  learning_style_secondary VARCHAR(50),
  learning_style_confidence FLOAT, -- 0.0-1.0
  
  -- Attention Pattern (daily)
  peak_hours_start INT, -- 16 = 4PM
  peak_hours_end INT, -- 18 = 6PM
  moderate_hours TEXT, -- JSON: [14-15, 19-20]
  low_hours TEXT, -- JSON: [8-11]
  
  -- Processing
  optimal_sprint_minutes INT, -- 3 min vs. 10 min
  attention_drop_threshold_minutes INT,
  cognitive_load_capacity INT, -- 1-3 concepts per session
  
  -- Historical optimization
  preferred_modalities TEXT, -- JSON: ['infographic', 'interactive', 'video']
  video_skip_rate FLOAT, -- If >70%, avoid videos
  completion_rate_by_modality TEXT, -- JSON metrics
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE (student_id)
);

-- WAEC Readiness Projection
CREATE TABLE waec_readiness_meter (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  
  -- Current snapshot
  current_score INT, -- 0-100
  current_subject_scores TEXT, -- JSON: { math: 42, english: 68, physics: 52 }
  
  -- Projection
  projected_waec_score INT, -- If no change
  
  -- Fix Pack impact model
  impact_model TEXT, -- JSON:
    -- {
    --   "Variable Substitution": { "gain_points": 4, "confidence": 0.85 },
    --   "Quadratic Formulas": { "gain_points": 6, "confidence": 0.78 }
    -- }
  
  -- History
  score_history TEXT, -- JSON: array of {date, score} snapshots
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE (student_id)
);

-- Fix Pack Deliveries (Log)
CREATE TABLE fix_pack_deliveries (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  
  -- What was fixed
  target_topic VARCHAR(100), -- 'Variable Substitution'
  target_subject VARCHAR(50), -- 'Algebra'
  
  -- Content served
  content_sequence TEXT, -- JSON: [
    -- { sprint: 1, type: 'refresher', duration_sec: 60, modality: 'text' },
    -- { sprint: 2, type: 'infographic', duration_sec: 120, modality: 'visual' },
    -- { sprint: 3, type: 'puzzle', duration_sec: 180, modality: 'interactive' }
  -- ]
  
  -- Personalization applied
  difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
  learning_style_matched VARCHAR(50), -- 'visual-spatial'
  delivery_time TIMESTAMP, -- When was it served?
  
  -- Student interaction
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  completion_status VARCHAR(20), -- 'started', 'in_progress', 'completed', 'abandoned'
  time_spent_minutes INT,
  
  -- Performance
  pre_mastery INT, -- Before fix
  post_mastery INT, -- After fix
  error_rate_pre INT,
  error_rate_post INT,
  
  -- Validation
  application_challenge_passed BOOLEAN,
  
  created_at TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES users(id),
  INDEX (student_id, completed_at)
);

-- Learner Persona (Synthesized)
CREATE TABLE learner_personas (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  
  -- AI-generated persona
  persona_name VARCHAR(255), -- "Tolu: Visual-Spatial, Peak at 4PM, Algebra Struggle"
  persona_summary TEXT,
  
  -- Key insights
  top_weaknesses TEXT, -- JSON array of {subject, mastery, why}
  learning_strengths TEXT, -- JSON array
  optimal_learning_window TEXT, -- JSON: { start: 16, end: 18 }
  
  -- Recommendations
  recommended_fix_packs TEXT, -- JSON: [
    // { topic: 'Variable Substitution', urgency: 'critical', gain_points: 4 }
  // ]
  
  last_updated TIMESTAMP,
  created_at TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE (student_id)
);
```

---

## Part 3: Core Components

### 1. Academic Heatmap Builder

**Responsibility**: Track granular performance data and update status in real-time.

```typescript
// services/academic-heatmap.ts

interface AcademicHeatmapInput {
  studentId: string
  subject: string
  subSubject: string
  score: number // e.g., 4/20
  timestamp: Date
  difficulty: 'easy' | 'medium' | 'hard'
}

export class AcademicHeatmapService {
  async updateHeatmap(input: AcademicHeatmapInput): Promise<void> {
    // 1. Fetch current heatmap entry
    const current = await db.academicHeatmap.findOne({
      student_id: input.studentId,
      subject: input.subject,
      sub_subject: input.subSubject
    })

    // 2. Calculate new mastery %
    // Exponential moving average: new_mastery = 0.3 * new_score + 0.7 * old_mastery
    const scorePercent = (input.score / 20) * 100 // 4/20 = 20%
    const newMastery = current 
      ? 0.3 * scorePercent + 0.7 * current.mastery_percent
      : scorePercent

    // 3. Track error rate (inverse of correct %)
    const newErrorRate = 100 - newMastery

    // 4. Determine status
    const status = newMastery >= 70 ? 'green' 
                 : newMastery >= 40 ? 'amber'
                 : 'red'

    // 5. Save to DB
    await db.academicHeatmap.upsert({
      student_id: input.studentId,
      subject: input.subject,
      sub_subject: input.subSubject,
      mastery_percent: Math.round(newMastery),
      error_rate: Math.round(newErrorRate),
      status,
      time_on_task_minutes: calculateEngagementTime(),
      updated_at: new Date()
    })

    // 6. Emit event
    eventBus.emit('HEATMAP_UPDATED', {
      studentId: input.studentId,
      subSubject: input.subSubject,
      newMastery,
      status,
      changed: status !== current?.status
    })

    // 7. Trigger cascade
    if (status !== current?.status) {
      await this.triggerDiagnosis(input.studentId)
    }
  }

  private async triggerDiagnosis(studentId: string): Promise<void> {
    // When status changes (e.g., red → amber), run full diagnosis
    const cognitiveDiagnoser = new CognitiveDiagnosis()
    await cognitiveDiagnoser.synthesize(studentId)
  }
}
```

**Testing**:
```typescript
test('Score 4/20 updates heatmap to red status', async () => {
  const service = new AcademicHeatmapService()
  
  await service.updateHeatmap({
    studentId: 'tolu-123',
    subject: 'Math',
    subSubject: 'Variable Substitution',
    score: 4,
    timestamp: new Date(),
    difficulty: 'medium'
  })

  const heatmap = await db.academicHeatmap.findOne({
    student_id: 'tolu-123',
    sub_subject: 'Variable Substitution'
  })

  expect(heatmap.mastery_percent).toBeLessThan(40)
  expect(heatmap.status).toBe('red')
  expect(eventBus.emit).toHaveBeenCalledWith('HEATMAP_UPDATED', expect.any(Object))
})
```

---

### 2. Cognitive Diagnosis Engine

**Responsibility**: Synthesize Academic + Neurological data into a Learner Persona.

```typescript
// services/cognitive-diagnosis.ts

export class CognitiveDiagnosis {
  async synthesize(studentId: string): Promise<void> {
    // 1. Fetch Academic Heatmap (what the student doesn't know)
    const heatmap = await db.academicHeatmap.findMany({
      student_id: studentId,
      status: 'red' // Only critical gaps
    })

    // 2. Fetch Brain Map (how the student learns)
    const brainMap = await db.brainMap.findOne({
      student_id: studentId
    })

    if (!brainMap) {
      // First time: Run initial learning style assessment
      await this.initializeBrainMap(studentId)
      return
    }

    // 3. Identify root causes
    const rootCauses = await this.identifyRootCauses(studentId, heatmap)
    
    // 4. Check for foundational gaps (JSS1 prerequisites)
    const foundationalGaps = await this.checkFoundationalGaps(rootCauses)

    // 5. Synthesize Learner Persona
    const persona = {
      studentId,
      personaName: `${studentId}: ${brainMap.learning_style_primary} learner, peak at ${brainMap.peak_hours_start}:00`,
      topWeaknesses: heatmap.map(h => ({
        subject: h.subject,
        subSubject: h.sub_subject,
        mastery: h.mastery_percent,
        rootCause: rootCauses[h.sub_subject] || 'unknown'
      })),
      optimalLearningWindow: {
        start: brainMap.peak_hours_start,
        end: brainMap.peak_hours_end,
        type: 'peak_attention'
      },
      foundationalGapsDetected: foundationalGaps.length > 0,
      recommendedFixPacks: await this.generateRecommendations(
        heatmap,
        brainMap,
        foundationalGaps
      )
    }

    // 6. Save persona
    await db.learnerPersonas.upsert({
      student_id: studentId,
      persona_name: persona.personaName,
      top_weaknesses: JSON.stringify(persona.topWeaknesses),
      optimal_learning_window: JSON.stringify(persona.optimalLearningWindow),
      recommended_fix_packs: JSON.stringify(persona.recommendedFixPacks),
      last_updated: new Date()
    })

    // 7. Emit event
    eventBus.emit('PERSONA_SYNTHESIZED', {
      studentId,
      persona
    })
  }

  private async identifyRootCauses(
    studentId: string,
    heatmap: AcademicHeatmap[]
  ): Promise<Record<string, string>> {
    const causes: Record<string, string> = {}

    for (const entry of heatmap) {
      // Check if prerequisite is also red
      const prerequisite = this.getPrerequisite(entry.sub_subject)
      
      if (prerequisite) {
        const prereqHeatmap = await db.academicHeatmap.findOne({
          student_id: studentId,
          sub_subject: prerequisite
        })

        if (prereqHeatmap?.status === 'red') {
          causes[entry.sub_subject] = `Gap in ${prerequisite}`
        } else {
          causes[entry.sub_subject] = 'Conceptual misunderstanding'
        }
      }
    }

    return causes
  }

  private getPrerequisite(subSubject: string): string | null {
    const prerequisites: Record<string, string> = {
      'Variable Substitution': 'Variables (JSS1)',
      'Quadratic Formulas': 'Variable Substitution',
      'Factoring Expressions': 'Variables (JSS1)',
      'Mechanics': 'Forces & Motion (JSS2)'
    }
    return prerequisites[subSubject] || null
  }

  private async generateRecommendations(
    heatmap: AcademicHeatmap[],
    brainMap: BrainMap,
    foundationalGaps: string[]
  ): Promise<Array<{
    topic: string
    urgency: 'critical' | 'high' | 'medium'
    gainPoints: number
    prerequisiteInjection: boolean
  }>> {
    // Sort by mastery (lowest first = highest urgency)
    const sorted = heatmap.sort((a, b) => a.mastery_percent - b.mastery_percent)

    return sorted.slice(0, 3).map((item, idx) => ({
      topic: item.sub_subject,
      urgency: idx === 0 ? 'critical' : idx === 1 ? 'high' : 'medium',
      gainPoints: this.estimateGainPoints(item.sub_subject),
      prerequisiteInjection: foundationalGaps.some(
        gap => gap.includes(item.sub_subject)
      )
    }))
  }

  private estimateGainPoints(subSubject: string): number {
    // WAEC impact model: How many points does fixing this subject gain?
    const impacts: Record<string, number> = {
      'Variable Substitution': 4,
      'Quadratic Formulas': 6,
      'Factoring Expressions': 3,
      'Mechanics': 5
    }
    return impacts[subSubject] || 2
  }
}
```

---

### 3. Fix Pack Synthesis Engine

**Responsibility**: Generate personalized content sequence based on Brain Map + Heatmap.

```typescript
// services/fix-pack-synthesis.ts

interface FixPackRequest {
  studentId: string
  targetTopic: string
  targetSubject: string
  urgency: 'critical' | 'high' | 'medium'
}

interface FixPackOutput {
  id: string
  sprints: Sprint[]
  totalMinutes: number
  contentSequence: string // JSON
}

interface Sprint {
  sprintNumber: number
  type: 'refresher' | 'core' | 'application'
  content: Content
  durationSeconds: number
}

interface Content {
  modality: 'infographic' | 'video' | 'text' | 'interactive'
  title: string
  resourceId: string
}

export class FixPackSynthesis {
  async generate(request: FixPackRequest): Promise<FixPackOutput> {
    // 1. Fetch Brain Map
    const brainMap = await db.brainMap.findOne({
      student_id: request.studentId
    })

    // 2. Fetch Heatmap
    const heatmap = await db.academicHeatmap.findOne({
      student_id: request.studentId,
      sub_subject: request.targetTopic
    })

    // 3. Check for foundational gaps
    const prerequisite = this.getPrerequisite(request.targetTopic)
    let sprints: Sprint[] = []

    if (prerequisite) {
      const prereqHeatmap = await db.academicHeatmap.findOne({
        student_id: request.studentId,
        sub_subject: prerequisite
      })

      if (prereqHeatmap?.status === 'red') {
        // Inject 60-second refresher
        sprints.push({
          sprintNumber: 1,
          type: 'refresher',
          content: {
            modality: 'text',
            title: `Quick recap: ${prerequisite}`,
            resourceId: `refresher-${prerequisite}`
          },
          durationSeconds: 60
        })
      }
    }

    // 4. Select content based on learning style
    const selectedModality = this.selectModality(brainMap.learning_style_primary)

    sprints.push({
      sprintNumber: sprints.length + 1,
      type: 'core',
      content: {
        modality: selectedModality,
        title: `Lesson: ${request.targetTopic}`,
        resourceId: `lesson-${request.targetTopic}-${selectedModality}`
      },
      durationSeconds: brainMap.optimal_sprint_minutes * 60
    })

    // 5. Add interactive application
    sprints.push({
      sprintNumber: sprints.length + 1,
      type: 'application',
      content: {
        modality: 'interactive',
        title: `Practice: ${request.targetTopic}`,
        resourceId: `practice-${request.targetTopic}`
      },
      durationSeconds: (brainMap.optimal_sprint_minutes + 1) * 60
    })

    // 6. Assemble Fix Pack
    const fixPack: FixPackOutput = {
      id: generateId(),
      sprints,
      totalMinutes: sprints.reduce((sum, s) => sum + s.durationSeconds, 0) / 60,
      contentSequence: JSON.stringify(sprints)
    }

    // 7. Log delivery
    await db.fixPackDeliveries.create({
      student_id: request.studentId,
      target_topic: request.targetTopic,
      target_subject: request.targetSubject,
      content_sequence: fixPack.contentSequence,
      difficulty_level: this.calculateDifficulty(heatmap.mastery_percent),
      learning_style_matched: brainMap.learning_style_primary,
      delivery_time: new Date(),
      completion_status: 'started'
    })

    return fixPack
  }

  private selectModality(learningStyle: string): 'infographic' | 'video' | 'interactive' {
    const modalityMap: Record<string, any> = {
      'visual-spatial': ['infographic', 'interactive', 'video'],
      'auditory-sequential': ['video', 'text', 'infographic'],
      'kinesthetic': ['interactive', 'video', 'infographic']
    }

    const options = modalityMap[learningStyle] || ['infographic', 'video']
    return options[0] as any
  }

  private calculateDifficulty(masteryPercent: number): 'easy' | 'medium' | 'hard' {
    if (masteryPercent < 30) return 'easy'
    if (masteryPercent < 50) return 'medium'
    return 'hard'
  }

  private getPrerequisite(topic: string): string | null {
    const map: Record<string, string> = {
      'Variable Substitution': 'Variables (JSS1)',
      'Quadratic Formulas': 'Variable Substitution',
      'Mechanics': 'Forces & Motion'
    }
    return map[topic] || null
  }
}
```

---

### 4. Brain Map Initializer

**Responsibility**: One-time setup to detect learning style, attention pattern, and processing speed.

```typescript
// services/brain-map-initializer.ts

export class BrainMapInitializer {
  async initialize(studentId: string): Promise<void> {
    // Step 1: Present Learning Style Assessment (2-3 min questionnaire)
    const learningStyleResult = await this.assessLearningStyle(studentId)

    // Step 2: Analyze Activity Pattern (from past 7 days)
    const activityPattern = await this.analyzeActivityPattern(studentId)

    // Step 3: Test Processing Speed (via simple timed puzzle)
    const processingMetrics = await this.measureProcessingSpeed(studentId)

    // Step 4: Save Brain Map
    const brainMap: BrainMap = {
      student_id: studentId,
      learning_style_primary: learningStyleResult.primary,
      learning_style_secondary: learningStyleResult.secondary,
      peak_hours_start: activityPattern.peakStart,
      peak_hours_end: activityPattern.peakEnd,
      optimal_sprint_minutes: processingMetrics.optimalDuration,
      cognitive_load_capacity: processingMetrics.conceptsPerSession
    }

    await db.brainMap.create(brainMap)
  }

  private async assessLearningStyle(studentId: string): Promise<any> {
    // Present questionnaire (in UI)
    // Example: "Do you prefer: (A) Diagrams (B) Listening (C) Hands-on"
    // Score responses and return primary/secondary style

    // For now, return mock data
    return {
      primary: 'visual-spatial',
      secondary: 'kinesthetic'
    }
  }

  private async analyzeActivityPattern(studentId: string): Promise<any> {
    // Fetch last 7 days of app usage
    const activities = await db.activities.findMany({
      student_id: studentId,
      created_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })

    // Group by hour and find peak
    const hourlyUsage = new Map<number, number>()
    activities.forEach(a => {
      const hour = new Date(a.created_at).getHours()
      hourlyUsage.set(hour, (hourlyUsage.get(hour) || 0) + 1)
    })

    const sorted = Array.from(hourlyUsage.entries()).sort((a, b) => b[1] - a[1])
    const [peakHour] = sorted[0] || [16]

    return {
      peakStart: peakHour,
      peakEnd: peakHour + 2
    }
  }

  private async measureProcessingSpeed(studentId: string): Promise<any> {
    // Simple: Present a timed 3-question puzzle
    // Measure: How long to complete? How many errors?
    // If <1min, learner is fast → use longer sprints
    // If >5min, learner is slow → use 3-min sprints

    return {
      optimalDuration: 3, // 3-minute sprints
      conceptsPerSession: 2
    }
  }
}
```

---

### 5. WAEC Readiness Meter

**Responsibility**: Project WAEC score and estimate Fix Pack impact.

```typescript
// services/waec-readiness.ts

export class WAECReadinessMeter {
  async calculateProjection(studentId: string): Promise<void> {
    // 1. Fetch all subject heatmaps
    const heatmaps = await db.academicHeatmap.findMany({
      student_id: studentId
    })

    // 2. Group by subject and calculate average
    const subjectScores: Record<string, number> = {}
    heatmaps.forEach(h => {
      const scores = subjectScores[h.subject] || []
      scores.push(h.mastery_percent)
      subjectScores[h.subject] = 
        scores.reduce((a, b) => a + b, 0) / scores.length
    })

    // 3. Map mastery to WAEC score (assumed linear)
    // 70% mastery = ~60/100 WAEC
    // 50% mastery = ~40/100 WAEC
    const waecSubjectScores = Object.entries(subjectScores).reduce((acc, [subject, mastery]) => {
      acc[subject] = Math.round((mastery / 100) * 100 * 0.85) // 85% correlation
      return acc
    }, {} as Record<string, number>)

    // 4. Calculate overall WAEC score (average)
    const overallWAEC = Object.values(waecSubjectScores)
      .reduce((a, b) => a + b, 0) / Object.values(waecSubjectScores).length

    // 5. Build impact model
    const impactModel = await this.buildImpactModel(studentId, heatmaps)

    // 6. Save
    await db.waecReadinessMeter.upsert({
      student_id: studentId,
      current_score: Math.round(overallWAEC),
      current_subject_scores: JSON.stringify(waecSubjectScores),
      projected_waec_score: Math.round(overallWAEC),
      impact_model: JSON.stringify(impactModel),
      score_history: JSON.stringify([
        { date: new Date(), score: Math.round(overallWAEC) }
      ])
    })

    eventBus.emit('WAEC_METER_UPDATED', {
      studentId,
      currentScore: Math.round(overallWAEC),
      impactModel
    })
  }

  private async buildImpactModel(
    studentId: string,
    heatmaps: AcademicHeatmap[]
  ): Promise<Record<string, any>> {
    // For each red/amber topic, estimate how many WAEC points it's worth
    const model: Record<string, any> = {}

    heatmaps
      .filter(h => h.status !== 'green')
      .forEach(h => {
        const gainsPerMastery = 0.15 // 1% mastery improvement = 0.15 WAEC points
        const gainToMastery70 = (70 - h.mastery_percent) * gainsPerMastery
        
        model[h.sub_subject] = {
          current_mastery: h.mastery_percent,
          target_mastery: 70,
          gain_points: Math.round(gainToMastery70),
          confidence: 0.8 // Default confidence
        }
      })

    return model
  }
}
```

---

## Part 4: Real-Time Delivery & Dopamine Loops

### Delivery Pipeline

```typescript
// services/fix-pack-delivery.ts

export class FixPackDeliveryService {
  async deliverToStudent(
    studentId: string,
    fixPackId: string
  ): Promise<void> {
    // 1. Fetch Fix Pack
    const fixPack = await db.fixPackDeliveries.findOne({
      id: fixPackId
    })

    // 2. Schedule delivery at optimal time
    const brainMap = await db.brainMap.findOne({
      student_id: studentId
    })

    const now = new Date()
    const deliveryTime = this.calculateDeliveryTime(now, brainMap)

    // 3. Create notification
    const notification = {
      type: 'fix_pack_invitation',
      title: `Risk Detected in ${fixPack.target_subject}`,
      body: `Unlock your ${Math.round(fixPack.content_sequence.length)}-minute Fix Pack. Master it → +${this.estimateGainPoints(fixPack.target_topic)} WAEC points`,
      deepLink: `smartschool://fix-pack/${fixPackId}`,
      scheduledFor: deliveryTime,
      priority: fixPack.target_mastery < 30 ? 'high' : 'normal'
    }

    // 4. Queue for delivery
    await notificationService.queue(studentId, notification)

    // 5. Track delivery attempt
    await db.fixPackDeliveries.update(fixPackId, {
      delivery_status: 'queued',
      delivery_scheduled_time: deliveryTime
    })
  }

  private calculateDeliveryTime(now: Date, brainMap: BrainMap): Date {
    const currentHour = now.getHours()
    const peakStart = brainMap.peak_hours_start
    const peakEnd = brainMap.peak_hours_end

    let targetHour: number

    if (currentHour >= peakStart && currentHour < peakEnd) {
      // Already in peak: deliver now
      targetHour = currentHour
    } else if (currentHour < peakStart) {
      // Before peak: deliver at peak start today
      targetHour = peakStart
    } else {
      // After peak: deliver at peak start tomorrow
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(peakStart, 0, 0, 0)
      return tomorrow
    }

    const deliveryTime = new Date(now)
    deliveryTime.setHours(targetHour, 0, 0, 0)
    return deliveryTime
  }

  private estimateGainPoints(topic: string): number {
    const gains: Record<string, number> = {
      'Variable Substitution': 4,
      'Quadratic Formulas': 6
    }
    return gains[topic] || 3
  }
}
```

### Dopamine Loop Implementation

```typescript
// ui/components/fix-pack-viewer.tsx

export const FixPackViewer = ({ fixPackId }: Props) => {
  const [currentSprint, setCurrentSprint] = useState(0)
  const [sprints, setSprints] = useState([])
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    // Load Fix Pack
    const fixPack = fetchFixPack(fixPackId)
    setSprints(fixPack.sprints)
  }, [])

  const handleSprintComplete = (sprintIndex: number) => {
    // Micro-reward
    const newProgress = ((sprintIndex + 1) / sprints.length) * 100
    setProgressPercent(newProgress)

    // Show celebration message
    const messages = [
      "Great! One more...",
      "Almost there!",
      "You got this!"
    ]
    showMicroReward(messages[sprintIndex])

    // Next sprint
    setCurrentSprint(sprintIndex + 1)

    // Haptic feedback
    navigator.vibrate(50)
  }

  const handleCompletion = async () => {
    // Full-screen celebration
    showConfetti({
      particleCount: 150,
      duration: 1200,
      colors: ['#10B981', '#F59E0B'] // Green + Amber
    })

    // Play success sound
    playSound('/success.mp3')

    // Update heatmap (immediate visual feedback)
    const response = await submitFixPack(fixPackId)
    
    // Show results
    showResultsCard({
      message: `Heatmap updated: Variable Substitution 32% → 78%`,
      newScore: 78,
      waecGain: '+4 points',
      shareButton: true // "Share with Mum"
    })
  }

  return (
    <div className="fix-pack-viewer">
      {/* Progress bar: fills in real-time */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Current sprint */}
      {sprints[currentSprint] && (
        <SprintComponent
          sprint={sprints[currentSprint]}
          onComplete={() => handleSprintComplete(currentSprint)}
        />
      )}

      {/* Completion screen */}
      {currentSprint >= sprints.length && (
        <CompletionScreen onShow={() => handleCompletion()} />
      )}
    </div>
  )
}
```

---

## Part 5: Validation & Recalibration

### Application Challenge (Validation)

```typescript
// services/application-challenge.ts

export class ApplicationChallenge {
  async generateAndDeliver(
    studentId: string,
    fixPackTopic: string
  ): Promise<void> {
    // 1. Generate challenge (3-5 problems at slightly higher difficulty)
    const challenge = {
      problems: [
        { problem: 'If x = 5, substitute into x² + 2x + 1', answer: 36 },
        { problem: 'Simplify: 3(y - 2) where y = 4', answer: 6 }
      ],
      timeLimit: 300, // 5 minutes
      passingScore: 80 // 80% correct
    }

    // 2. Present challenge immediately after Fix Pack
    const challengeId = generateId()
    await db.challenges.create({
      id: challengeId,
      student_id: studentId,
      fix_pack_topic: fixPackTopic,
      problems: JSON.stringify(challenge.problems),
      time_limit: challenge.timeLimit,
      passing_score: challenge.passingScore
    })

    // 3. Student solves it
    // (UI handles submission)

    // 4. Evaluate results
    await evaluateChallenge(challengeId)
  }

  async evaluateChallenge(challengeId: string): Promise<void> {
    const challenge = await db.challenges.findOne({ id: challengeId })
    const studentId = challenge.student_id
    const fixPackTopic = challenge.fix_pack_topic

    if (challenge.passed) {
      // Update heatmap: Red → Green (instant visual feedback)
      await db.academicHeatmap.update(
        { student_id: studentId, sub_subject: fixPackTopic },
        { mastery_percent: 80, status: 'green', updated_at: new Date() }
      )

      // Event: Success!
      eventBus.emit('CHALLENGE_PASSED', {
        studentId,
        topic: fixPackTopic,
        newStatus: 'green'
      })

      // Notify parent
      await notificationService.sendToParent(studentId, {
        type: 'fix_pack_success',
        message: `Tolu just mastered ${fixPackTopic}. WAEC readiness: 58 → 62 (+4 points)`
      })

      // Recalibrate WAEC Meter
      await waecReadinessMeter.calculateProjection(studentId)
    } else {
      // Challenge failed: Schedule another Fix Pack
      eventBus.emit('CHALLENGE_FAILED', {
        studentId,
        topic: fixPackTopic,
        nextAttempt: 'tomorrow'
      })
    }
  }
}
```

---

## Part 6: API Endpoints

```typescript
// api/routes.ts

// 1. Trigger Heatmap Update (called after every assessment)
POST /api/academic-heatmap/update
{
  studentId: string
  subject: string
  subSubject: string
  score: number
  maxScore: number
  timestamp: ISO8601
}

// 2. Get Learner Persona
GET /api/learner-personas/:studentId
Response: { personaName, topWeaknesses, recommendedFixPacks, ... }

// 3. Generate Fix Pack
POST /api/fix-packs/generate
{
  studentId: string
  targetTopic: string
  targetSubject: string
}
Response: { id, sprints, totalMinutes, contentSequence }

// 4. Start Fix Pack
POST /api/fix-packs/:id/start
{
  studentId: string
}
Response: { fixPackId, currentSprint, ... }

// 5. Complete Sprint
POST /api/fix-packs/:id/sprints/:sprintNumber/complete
{
  studentId: string
  timeSpent: number
  success: boolean
}

// 6. Submit Fix Pack
POST /api/fix-packs/:id/submit
{
  studentId: string
  completedAt: ISO8601
  totalTime: number
}
Response: { passed, nextChallenge, ... }

// 7. Submit Challenge
POST /api/challenges/:id/submit
{
  studentId: string
  answers: { problemId: string, answer: any }[]
  timeSpent: number
}
Response: { passed, score, heatmapUpdate, waecGain, ... }

// 8. Get WAEC Readiness
GET /api/waec-readiness/:studentId
Response: { currentScore, projectedScore, subjectScores, impactModel }

// 9. Deliver Fix Pack Notification
POST /api/notifications/fix-pack-delivery
{
  studentId: string
  fixPackId: string
  scheduledTime: ISO8601 (optional, defaults to peak time)
}
```

---

## Part 7: Development Checklist

### Phase 1: Data Infrastructure (Week 1)
- [ ] Create all database tables (heatmap, brain map, WAEC meter, personas, deliveries, challenges)
- [ ] Set up PostgreSQL indexes for fast queries
- [ ] Create ER diagram and validate schema
- [ ] Set up database migrations

### Phase 2: Core Services (Week 2)
- [ ] Implement AcademicHeatmapService
- [ ] Implement BrainMapInitializer (start with mock assessments)
- [ ] Implement CognitiveDiagnosis
- [ ] Implement WAECReadinessMeter
- [ ] Unit tests for each service

### Phase 3: Fix Pack Engine (Week 3)
- [ ] Implement FixPackSynthesis
- [ ] Content repository (infographics, videos, interactive puzzles)
- [ ] Implement FixPackDeliveryService
- [ ] Scheduling logic (optimal delivery time)
- [ ] Integration tests

### Phase 4: UI & Dopamine Loops (Week 4)
- [ ] Build FixPackViewer component
- [ ] Progress bar visualization
- [ ] Micro-reward messages
- [ ] Confetti animation on completion
- [ ] Results card with heatmap update

### Phase 5: Validation & Recalibration (Week 4-5)
- [ ] Implement ApplicationChallenge
- [ ] Challenge evaluation logic
- [ ] Heatmap auto-update on success
- [ ] Parent notifications
- [ ] WAEC Meter recalculation

### Phase 6: Real-Time Updates (Week 5)
- [ ] WebSocket for real-time heatmap updates
- [ ] Live WAEC score projection
- [ ] Admin dashboard showing heatmap + personas
- [ ] Parent notifications (Firebase)

### Phase 7: Testing & Optimization (Week 5-6)
- [ ] End-to-end tests (score → persona → fix pack → validation)
- [ ] Performance testing (latency <500ms for all endpoints)
- [ ] Load testing (1000 simultaneous students)
- [ ] Brain Map accuracy validation

### Phase 8: Deployment & Monitoring (Week 6)
- [ ] Set up monitoring (TTI, API latency, error rates)
- [ ] Logging (all diagnosis steps, fix pack generation, validation)
- [ ] Analytics (persona distribution, fix pack completion rate, WAEC improvement)
- [ ] Gradual rollout (1 school → 10 schools → 100 schools)

---

## Part 8: Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Persona Synthesis Time | <5 seconds | Users shouldn't wait for diagnosis |
| Fix Pack Generation Time | <3 seconds | Feels instant to users |
| Fix Pack Completion Rate | >75% | If <75%, content is too hard/long |
| Challenge Pass Rate | >70% | Validation should be achievable |
| WAEC Score Improvement | +3-5 points per Fix Pack | Prove it's working |
| Heatmap Color Change | Red → Amber in 2 attempts | Fast feedback loop |
| Time to Persona Update | <30 seconds after score submission | Real-time feeling |
| Brain Map Accuracy | 85%+ | Measured via Fix Pack completion rate by learning style |

---

## Part 9: Example: Tolu's Complete Journey

**Timeline: Tuesday 2:00 PM - Wednesday 4:30 PM**

**2:00 PM (Tues)**: Mrs Ayo enters Tolu's Math score: 4/20 on Variable Substitution
- Heatmap updates: 32% → 20% (score gets worse)
- Status: RED (critical)
- Event: HEATMAP_UPDATED emitted

**2:01 PM**: CognitiveDiagnosis runs
- Fetches heatmap + brain map
- Checks prerequisites: JSS1 Variables? Weak
- Synthesizes persona: "Tolu: Visual learner, peak 4PM, Variable Substitution crisis"
- Recommends Fix Pack with prerequisite injection

**2:02 PM**: FixPackSynthesis runs
- Selects infographic (visual style)
- Includes 60-sec JSS1 refresher
- Creates 3-sprint sequence:
  - Sprint 1 (2 min): Variable intro recap
  - Sprint 2 (3 min): Interactive infographic (x substitution)
  - Sprint 3 (2 min): Puzzle challenge (3 problems)
- Total: 7 minutes

**2:03 PM**: Notification queued
- Scheduled for 4:00 PM (Tolu's peak time)
- Message: "Risk Detected in Algebra: Variable Substitution (32%)"
- Deep link: smartschool://fix-pack/abc123

**4:00 PM (Tues)**: Push notification sent
- Tolu opens app
- Red notification: "Algebra Risk"
- Taps to start Fix Pack

**4:02-4:11 PM**: Tolu works through Fix Pack
- Sprint 1: Watches 60-sec refresher (variables recap)
- Sprint 2: Interacts with infographic (dragging x, seeing substitution)
- Progress bar fills: 1/3 → 2/3
- Sprint 3: Solves 3 puzzles (gets 2/3 correct)
- Progress bar fills: 3/3 ✓

**4:12 PM**: Confetti explodes
- Full-screen celebration
- "MASTERED!" message
- Heatmap shows: "Variable Substitution: 32% → 78%"
- "Top 10% Parent" badge (optional)
- Share button: "Tell Mum"

**4:13 PM**: Application Challenge
- 3 problems, 5-minute time limit
- Tolu solves 2/3 (67%) → Fails (needs 80%)
- Message: "Try again tomorrow!"

**4:15 PM**: Parent notification
- Mum gets notification: "Tolu just worked on his Algebra weakness!"
- Shows heatmap update + attempted challenge
- WAEC Meter updated: 58 → 61 (+3 points from attempt)

**Wednesday 4:00 PM**: Next Fix Pack
- Same topic, slightly harder difficulty
- Tolu completes with 90% accuracy
- Challenge passed! Heatmap Green
- WAEC update: 61 → 64 (+3 points)
- Success email sent to Mum

---

## Part 10: Technology Stack Recommendation

```
Frontend:
• React 18 + TypeScript
• TanStack Query (state + real-time updates)
• Zustand (global state for brain map + personas)
• Tailwind CSS
• Framer Motion (progress animations)
• canvas-confetti (celebration)

Backend:
• Node.js + Nestjs
• PostgreSQL (heatmap, personas, deliveries)
• Redis (event bus + caching)
• Bull (job queue for challenge evaluation)
• Socket.io (real-time heatmap updates)

AI/ML:
• Python + FastAPI (for diagnosis + synthesis microservice)
• Scikit-learn (prerequisite detection, impact modeling)
• Or: Just use decision trees + rule-based logic (WAEC models are static)
• LLM integration: Claude for generating challenge questions dynamically

Real-time:
• WebSocket for live heatmap updates to parent dashboard
• Firebase Cloud Messaging for push notifications
• Webhook from assessment system to trigger heatmap updates
```

---

**Go build this. Let me know when you need flows for Parent Dashboard or Admin Analytics.** 🚀
