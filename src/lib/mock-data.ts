import type { Student, Subject, Score, FeeRecord, Transaction, KPI, Diary, FixPack, TeacherCompliance, CBTTopic, CBTQuestion } from "./types";

/* ─── Topic Content (for Cognitive Fix Packs) ───────── */
export const TOPIC_CONTENT: Record<string, {
  refresherPoints: string[];
  visual: string;
  auditory: string;
  kinesthetic: string;
}> = {
  t1: {
    refresherPoints: [
      "A fraction = part of a whole: numerator ÷ denominator",
      "To add fractions: find a common denominator first",
      "½ = 0.5 = 50% — fractions, decimals and percentages are the same value",
      "Multiplying fractions: multiply tops × tops and bottoms × bottoms",
    ],
    visual: "Picture a pizza cut into 4 equal slices. Eating 1 slice = ¼ eaten. Now two pizzas cut differently — to compare them, cut both into the same number of slices (common denominator). On a number line from 0 to 1, all fractions sit between the whole numbers in order: 0, ¼, ½, ¾, 1. This picture locks the concept in memory.",
    auditory: "Rule: to add ½ and ¼, the bottom numbers must match. Since 4 is a multiple of 2, rewrite ½ as 2⁄4. Now: 2⁄4 + 1⁄4 = 3⁄4. For subtraction, same rule. Multiplication: tops × tops, bottoms × bottoms — no common denominator needed. Division: flip the second fraction and multiply. Say each step out loud as you solve.",
    kinesthetic: "Pick up 8 coins. Call them 'the whole'. Count out ½ (4 coins). Count out ¼ (2 coins). Count out ⅛ (1 coin). Now physically add ¼ + ⅛ using the coins — you get 3 coins = 3⁄8. Try 3⁄4 − ½ the same way. Handle the objects until the answer appears automatically before you calculate.",
  },
  t2: {
    refresherPoints: [
      "Quadratic form: ax² + bx + c = 0",
      "Factorization: find two numbers that multiply to ac and add to b",
      "Quadratic formula: x = (−b ± √(b²−4ac)) / 2a",
      "Equal roots when discriminant b²−4ac = 0",
    ],
    visual: "Draw a U-shaped curve (parabola). Where it crosses the x-axis are the roots. If it touches at one point, roots are equal. If it misses the x-axis entirely, no real roots. The lowest point of the curve sits at x = −b/2a. This shape is the visual signature of every quadratic equation — draw it before solving.",
    auditory: "Factorization step-by-step: x² − 5x + 6 = 0. Find two numbers that multiply to 6 and add to −5. Those are −2 and −3. Write (x−2)(x−3) = 0. Set each to zero: x = 2 or x = 3. Always verify: plug both back in. If the equation equals zero both times, you are correct. Say each step aloud to build the pattern.",
    kinesthetic: "Write x² + x − 6 = 0 on paper. Test pairs: 3×2=6, 3−2=1 ✓. So (x+3)(x−2) = 0, giving x = −3 or x = 2. Now try x² − 7x + 12 = 0 on your own — write the factor pairs, circle the match, write the brackets. Do 3 equations without stopping to confirm the method is automatic.",
  },
  t3: {
    refresherPoints: [
      "Angles in a triangle always sum to 180°",
      "Angles on a straight line sum to 180°; at a point sum to 360°",
      "Area of rectangle = length × width",
      "Area of triangle = ½ × base × height",
    ],
    visual: "Draw any triangle. Tear off all three corners. Place them side by side — they form a straight line (180°). For parallel lines, mark matching (corresponding) angles with the same symbol. For a rectangle, every corner is 90° and the total is 360°. Labelling diagrams before calculating forces you to see the relationships first.",
    auditory: "Three memory anchors: 1) Triangle = 180°, so if two angles are 60° and 70°, the third is 50°. 2) Vertically opposite angles are always equal. 3) Supplementary = adds to 180°; complementary = adds to 90°. Before calculating any angle, name the rule that applies — say it out loud — then compute.",
    kinesthetic: "Draw 5 triangles: acute, right, obtuse, equilateral, isosceles. Measure or estimate all angles. Verify each sums to 180°. Now calculate one area each using ½ × base × height. Notice how different base and height pairs give the same area for the same triangle — rotate it and confirm.",
  },
  t4: {
    refresherPoints: [
      "Present simple: I walk. Present continuous: I am walking.",
      "Past simple: I walked. Past continuous: I was walking.",
      "Singular subject → singular verb (The teacher is here)",
      "Neither…nor / Either…or: verb agrees with the nearest subject",
    ],
    visual: "Draw a horizontal timeline. Past ← | → Future, Present in the middle. Plot tenses: simple = a dot on the line (one moment). Continuous = a segment (duration). Perfect = an arrow from past to present. Each tense has a visual position on this line. Before writing any tense, mentally place it on the timeline first.",
    auditory: "Say these aloud and feel the difference: 'I eat rice every day' (habit). 'I am eating rice now' (right now). 'I ate rice yesterday' (done and finished). 'I was eating rice when the phone rang' (was in progress when interrupted). Repetition out loud builds the tense pattern — your ear recognises the right form before your brain analyses it.",
    kinesthetic: "Fill the blank: 'She ___ (go) to school every day.' Rewrite the sentence in: past simple, past continuous, future simple, present perfect. Repeat with 5 verbs (eat, write, run, sing, study). Read each version aloud. Stop only when each tense feels natural for each verb.",
  },
  t5: {
    refresherPoints: [
      "Read the passage twice — once for gist, once for detail",
      "Underline key words in each question before searching the text",
      "Inference questions ask for conclusions not directly stated",
      "Figures of speech: simile (like/as), metaphor, personification",
    ],
    visual: "Draw three labelled boxes from a passage: 'Stated Facts' (written directly), 'Inferred Facts' (reasoned from clues), 'Author's Tone' (feeling behind the words). Before answering each question, decide which box it belongs to — this separates factual recall from reasoning questions and prevents confusion.",
    auditory: "Two-pass technique: first pass — what is this about? Second pass — for 'What does the author mean…' questions, rephrase the word in your own language that still fits the surrounding sentences. For 'Why did the character…' questions, find the cause in the paragraph immediately before the action.",
    kinesthetic: "Take any short story or article. Write 5 questions yourself: 2 factual (answer is directly in the text), 2 inference (answer must be reasoned), 1 vocabulary (what a word means from context). Then answer your own questions. Writing questions forces you to understand both sides — the question setter and the answerer.",
  },
  t6: {
    refresherPoints: [
      "Antonym = opposite meaning (brave ↔ cowardly)",
      "Synonym = same meaning (brave = courageous)",
      "Prefix changes meaning: un- (not), pre- (before), mis- (wrongly)",
      "Suffix changes word class: teach→teacher, happy→happiness",
    ],
    visual: "Word map: write 'BRAVE' in the centre. Branch out: Synonyms (courageous, bold, fearless), Antonyms (cowardly, timid), Related words (bravery, bravely, brave-hearted). Repeat for 5 vocabulary words you find difficult. The branching structure makes connections visual and easier to recall than a list of definitions.",
    auditory: "When you learn a new word, immediately use it in two sentences — one serious, one funny. 'Pedagogy' → 'The teacher's pedagogy inspired the whole class.' Then: 'The alien's pedagogy confused every student on Earth.' Funny sentences activate emotion, and emotional memory outlasts dry repetition.",
    kinesthetic: "Open any text. Find 10 unfamiliar words. For each: write the word, its meaning, one synonym, one antonym, and use it in a sentence. One week later, write all 10 words again from memory. Count how many stuck. Track your score weekly — vocabulary acquisition becomes measurable, not guesswork.",
  },
  t7: {
    refresherPoints: [
      "MRS GREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition",
      "Mammals: warm-blooded, give birth to live young, have hair/fur",
      "Mitochondria = powerhouse of the cell (produces ATP energy)",
      "Photosynthesis: CO₂ + water + sunlight → glucose + oxygen",
    ],
    visual: "Draw a plant cell: chloroplasts (green solar panels), cell wall (rigid outer box), large vacuole (water tank), nucleus (control centre). Draw an animal cell beside it: no cell wall, no chloroplasts, smaller vacuoles. The differences ARE the functions — a plant cell's extra parts explain why plants can photosynthesise and animals cannot.",
    auditory: "Photosynthesis in plain language: leaves are solar panels. Sunlight charges a chemical reaction inside chloroplasts. CO₂ enters through tiny pores (stomata). Water comes up from roots. The reaction produces glucose (plant's food) and releases oxygen (what we breathe). Reverse it — respiration uses glucose and oxygen to release energy and CO₂.",
    kinesthetic: "Go outside. Find 3 organisms (a plant, an insect, a fungus if possible). For each, confirm all 7 MRS GREN characteristics. Note which is most obvious and which is hardest to observe. Then classify: Is it a producer (makes its own food) or consumer (eats other organisms)? This connects textbook biology to real observation.",
  },
  t8: {
    refresherPoints: [
      "Newton's 1st: objects stay at rest or in motion unless a force acts",
      "Gravity pulls objects toward Earth's centre (downward force)",
      "Friction opposes motion between two surfaces in contact",
      "Pressure = Force ÷ Area",
    ],
    visual: "Draw a ball on a surface. Label ALL forces with arrows: gravity (↓ down), normal force from ground (↑ up). If rolling, add friction (← opposing motion), applied force (→). When arrows balance, the ball is in equilibrium. A net force (unbalanced arrows) causes acceleration. Force diagrams before calculation — every time.",
    auditory: "Newton's 3 Laws in real life: 1st — your body lurches forward when the car brakes because your body 'wants' to keep moving. 2nd — the harder you kick a ball, the faster it accelerates. 3rd — push against a wall; the wall pushes back equally. Every single force in the universe has a partner force pushing the other way.",
    kinesthetic: "Hold a textbook flat on your palm. Feel the upward push (normal force). Now tilt your hand slowly — feel friction resisting the book sliding. Remove friction (imagine ice): the book would slide instantly. Find 3 more force pairs in your classroom today. Name the action force and its reaction force for each.",
  },
  t9: {
    refresherPoints: [
      "Atom = smallest unit of an element; made of protons, neutrons, electrons",
      "Water = H₂O (2 hydrogen + 1 oxygen)",
      "Acid + Carbonate → Salt + Water + CO₂ (gas bubbles = CO₂ test)",
      "pH scale: 0–6 acid, 7 neutral, 8–14 alkaline",
    ],
    visual: "Draw the pH scale as a colour strip: red (0 = very acidic) → orange → yellow → green (7 = neutral) → blue → purple (14 = very alkaline). Label: lemon juice=2, vinegar=3, water=7, soap=9, bleach=12. Draw an atom beside it: nucleus in the centre (protons+neutrons), electrons orbiting in shells. Both diagrams fit on one page.",
    auditory: "Acid + carbonate reaction: picture the acid 'attacking' the carbonate structure. The carbonate breaks apart. CO₂ gas escapes as visible bubbles. Salt and water remain behind. The bubbling is your proof. Example: hydrochloric acid + calcium carbonate → calcium chloride + water + CO₂. Say it as a narrative — attack, escape, remainder.",
    kinesthetic: "Use red/blue litmus paper (or natural indicators like red cabbage juice). Test: lemon juice, soap water, bicarbonate solution, plain water. Record in a table: Liquid | Indicator colour | Acid/Alkali/Neutral. This is real lab chemistry. Predict the result before testing each one — then check if your prediction was correct.",
  },
  t10: {
    refresherPoints: [
      "Nigeria's independence: October 1, 1960",
      "First Prime Minister: Sir Abubakar Tafawa Balewa",
      "ECOWAS founded 1975 to promote West African economic cooperation",
      "Nigeria has 36 states + 1 FCT (Federal Capital Territory, Abuja)",
    ],
    visual: "Draw a horizontal timeline: 1914 (Amalgamation) → 1960 (Independence) → 1963 (Republic) → 1966 (First coup) → 1967–70 (Civil War) → 1979 (Democracy returns) → 1983 (Coup) → 1999 (Current democracy begins). Each point is a pivot — understand WHY it happened and the next event becomes predictable.",
    auditory: "Anchor dates to vivid stories: 1960 — the first time Nigeria's own flag flew in front of the world at the UN. Tafawa Balewa — the man who spoke on Nigeria's behalf for the first time. 1975 — ECOWAS was born because West African leaders realised their countries could grow faster by trading with neighbours. Stories beat rote memorisation every time.",
    kinesthetic: "Draw a blank West Africa map. Mark Nigeria, its 6 geopolitical zones, Lagos (former capital), and Abuja (current capital). Write one historical fact beside each zone. This one-page map becomes your visual cheat sheet — refer to it when answering history and geography questions.",
  },
  t11: {
    refresherPoints: [
      "Nigeria is a Federal Republic: 3 tiers — Federal, State, Local Government",
      "3 arms: Executive (President), Legislature (NASS), Judiciary (Courts)",
      "Separation of powers prevents any branch from dominating",
      "Current 1999 Constitution: Nigeria's democratic foundation",
    ],
    visual: "Draw three columns: Executive | Legislature | Judiciary. Below each, list powers. Then draw horizontal arrows between them labelled 'checks and balances'. The President cannot make laws alone — NASS votes. Courts can nullify laws that violate the constitution. This triangle of power is the entire structure of Nigerian government in one diagram.",
    auditory: "Three-legged stool: remove one leg, it collapses. Executive makes decisions. Legislature creates the rules (laws) that govern decisions. Judiciary checks if rules obey the constitution. Nigeria's federalism means central and state governments SHARE power — states control education and roads; the federal government controls defence and currency.",
    kinesthetic: "Roleplay: three people as President, Senate, and Supreme Court Judge. The President wants a law allowing forest logging. Senate votes yes. The Judge checks if it violates environmental rights in the constitution. What is the outcome if it does violate? Act the process. Who has final say? This sequence IS the separation of powers.",
  },
  t12: {
    refresherPoints: [
      "Citizens' rights are in Chapter IV of Nigeria's 1999 Constitution",
      "Rights include: life, fair hearing, privacy, freedom of expression",
      "CRC (UN Convention on the Rights of the Child) protects under-18s",
      "Ombudsman investigates citizens' complaints against government officials",
    ],
    visual: "Draw a shield with 4 quadrants: Civil Rights (expression, fair trial) | Political Rights (vote, run for office) | Social Rights (education, healthcare) | Economic Rights (work, own property). The constitution guarantees all four. The shield blocks the state from violating any. When a right is broken, courts and ombudsmen are the repair mechanism.",
    auditory: "Rights carry matching duties. Right to education = duty to attend and study. Right to vote = duty to participate. Right to free speech = duty not to harm others with speech. When a right is violated, the legal remedy is court action or a complaint to the ombudsman — no need for violence. Rights and duties are always a pair.",
    kinesthetic: "Pick one right from Chapter IV of the constitution. Write: 1) What it means in plain language. 2) A real situation where someone's right was denied. 3) What the legal remedy is. Do this for three different rights. After this exercise, you understand constitutional rights as living tools — not abstract text.",
  },
  t13: {
    refresherPoints: [
      "Democracy = government of the people, by the people, for the people",
      "Key features: free elections, rule of law, majority rule, minority protection",
      "Montesquieu (French, 1700s) developed the theory of separation of powers",
      "Franchise = the right to vote in elections",
    ],
    visual: "Draw the democracy cycle: Citizens vote → Leaders elected → Leaders make laws → Laws benefit citizens → Citizens evaluate performance → Citizens vote again. This circle shows that power starts AND returns to the people. Contrast with dictatorship: power starts and stays at the top — no feedback loop. The cycle diagram makes democracy's logic self-evident.",
    auditory: "Key phrase to anchor everything: 'Government by consent.' People agree to be governed by giving their vote. When leaders betray that trust, elections replace them peacefully. Montesquieu argued that concentrated power always corrupts — split it into three branches so no single branch can dominate. Say 'separation of powers' and immediately name the three branches.",
    kinesthetic: "Simulate an election: two candidates, 60-second speeches, secret ballot vote, public count, result announcement. Then discuss: Was it free and fair? Did the minority accept the result? What would make it unfair? Acting out the process builds intuitive understanding of what 'democratic' actually means in practice.",
  },
  t14: {
    refresherPoints: [
      "Photosynthesis needs: sunlight, CO₂, water, chlorophyll (in leaves)",
      "Compost = decomposed organic matter; improves soil fertility",
      "Leguminous crops (groundnut, cowpea) fix nitrogen in soil",
      "NPK: N=leaf growth, P=root development, K=fruit & disease resistance",
    ],
    visual: "Draw a cross-section of farm soil — humus (dark top layer), topsoil (where roots go), subsoil (less nutrients), rock. Draw a crop beside it: roots in topsoil, leaves receiving sunlight, stomata absorbing CO₂. Label arrows: water from soil, CO₂ from air, sunlight from sun → glucose + oxygen produced. The drawing shows why crops need exactly what they need.",
    auditory: "Nitrogen cycle in 4 steps: 1) Bacteria in soil convert atmospheric nitrogen into a form plants can absorb. 2) Leguminous plants take it up. 3) Animals eat plants and store the nitrogen. 4) Decomposers break dead matter back into the soil. That is why rotating groundnut with other crops improves the next harvest — the soil gains free nitrogen without fertiliser.",
    kinesthetic: "Plant two bean seeds in separate pots. Add compost to one, plain soil to the other. Water equally. After two weeks, measure height and leaf colour. Record observations in a table: height, leaf colour, root density (at end). This experiment shows exactly what compost does — you see the effect rather than read it.",
  },
  t15: {
    refresherPoints: [
      "Ruminants (cow, goat, sheep): 4-chambered stomach to digest grass",
      "Broiler chickens raised for meat; layers for eggs",
      "Prolactin hormone controls milk production in cattle",
      "Good husbandry = proper feeding, housing, hygiene, and disease prevention",
    ],
    visual: "Draw a farm with three zones: Poultry house | Cattle pen | Fish pond. For each, label: animal, feed, product, one disease. Chicken: grain feed / eggs+meat / Newcastle disease. Cattle: hay+grass / milk+beef / foot-and-mouth. Fish: pellets / protein / bacterial infections. One diagram captures three systems at once.",
    auditory: "Ruminants 'ruminate' — chew cud twice. They swallow grass to the rumen (first chamber), regurgitate it, chew again, then send it through three more chambers for full digestion. This is why they can extract nutrition from tough grass that non-ruminants cannot. Non-ruminants (pigs, chickens) need easier-to-digest feed because they lack this mechanism.",
    kinesthetic: "Calculate a broiler enterprise: 10 chickens × 2kg feed/week × 8 weeks = 160kg total feed. At ₦800/kg, feed cost = ₦128,000. Each chicken sells for ₦20,000 → revenue = ₦200,000. Profit = ₦72,000. Now calculate the break-even point (how many chickens you'd need to sell to cover costs). Real maths applied to animal husbandry.",
  },
};
import { getGrade } from "./constants";

/* ─── Students ──────────────────────────────────────── */
export const STUDENTS: Student[] = [
  { id: "s1", name: "Amara Okafor",   class: "JSS 3 Alpha", level: "JSS", avatarInitials: "AO" },
  { id: "s2", name: "Chidi Nwosu",    class: "JSS 3 Alpha", level: "JSS", avatarInitials: "CN" },
  { id: "s3", name: "Fatima Bello",   class: "JSS 3 Alpha", level: "JSS", avatarInitials: "FB" },
  { id: "s4", name: "Kolade Adeyemi", class: "JSS 3 Alpha", level: "JSS", avatarInitials: "KA" },
  { id: "s5", name: "Ngozi Eze",      class: "JSS 3 Alpha", level: "JSS", avatarInitials: "NE" },
  { id: "s6", name: "Tunde Fashola",  class: "JSS 3 Alpha", level: "JSS", avatarInitials: "TF" },
];

/* ─── Subjects ──────────────────────────────────────── */
export const SUBJECTS: Subject[] = [
  { id: "sub1", name: "Mathematics",        shortCode: "MTH" },
  { id: "sub2", name: "English Language",   shortCode: "ENG" },
  { id: "sub3", name: "Basic Science",      shortCode: "BSC" },
  { id: "sub4", name: "Social Studies",     shortCode: "SST" },
  { id: "sub5", name: "Civic Education",    shortCode: "CIV" },
  { id: "sub6", name: "Agricultural Sci.", shortCode: "AGR" },
];

/* ─── Scores ────────────────────────────────────────── */
const raw: [string, string, number | null, number | null, number | null][] = [
  ["s1", "sub1", 18, 17, 52], ["s1", "sub2", 19, 18, 55], ["s1", "sub3", 16, 15, 48],
  ["s1", "sub4", 20, 19, 58], ["s1", "sub5", 17, 16, 50], ["s1", "sub6", 15, 14, 45],
  ["s2", "sub1", 8, 7, 22], ["s2", "sub2", 16, 15, 49], ["s2", "sub3", 18, 17, 54],
  ["s2", "sub4", 15, 14, 44], ["s2", "sub5", 19, 18, 56], ["s2", "sub6", 13, 12, 38],
  ["s3", "sub1", 20, 19, 60], ["s3", "sub2", 20, 20, 58], ["s3", "sub3", 19, 18, 57],
  ["s3", "sub4", 18, 17, 53], ["s3", "sub5", 20, 19, 59], ["s3", "sub6", 17, 16, 51],
  ["s4", "sub1", 10, 9, 28],  ["s4", "sub2", 12, 11, 35], ["s4", "sub3", null, 10, 30],
  ["s4", "sub4", 11, 10, 32], ["s4", "sub5", 13, 12, 38], ["s4", "sub6", 9, 8, 25],
  ["s5", "sub1", 17, 16, 50], ["s5", "sub2", 18, 17, 53], ["s5", "sub3", 16, 15, 47],
  ["s5", "sub4", 19, 18, 55], ["s5", "sub5", 15, 14, 46], ["s5", "sub6", 16, 15, 48],
  ["s6", "sub1", 13, 12, 39], ["s6", "sub2", 14, 13, 40], ["s6", "sub3", 15, 14, 43],
  ["s6", "sub4", 12, 11, 36], ["s6", "sub5", 14, 13, 41], ["s6", "sub6", 11, 10, 32],
];

export const SCORES: Score[] = raw.map(([studentId, subjectId, ca1, ca2, exam]) => {
  const total = ca1 !== null && ca2 !== null && exam !== null ? ca1 + ca2 + exam : null;
  return { studentId, subjectId, ca1, ca2, exam, total, grade: getGrade(total) };
});

/* ─── Fee Records ───────────────────────────────────── */
export const FEE_RECORDS: FeeRecord[] = [
  { studentId: "s1", amount: 85000, paid: 85000, balance: 0,     status: "paid",    lastPaymentDate: "2026-01-15" },
  { studentId: "s2", amount: 85000, paid: 50000, balance: 35000, status: "partial", lastPaymentDate: "2026-02-01" },
  { studentId: "s3", amount: 85000, paid: 85000, balance: 0,     status: "paid",    lastPaymentDate: "2026-01-10" },
  { studentId: "s4", amount: 85000, paid: 0,     balance: 85000, status: "owing" },
  { studentId: "s5", amount: 85000, paid: 85000, balance: 0,     status: "paid",    lastPaymentDate: "2026-01-20" },
  { studentId: "s6", amount: 85000, paid: 30000, balance: 55000, status: "partial", lastPaymentDate: "2026-01-28" },
];

/* ─── Transactions ──────────────────────────────────── */
export const TRANSACTIONS: Transaction[] = [
  { id: "t1", description: "Term 2 school fees — JSS 3",   amount: 255000, type: "income",  category: "Fees",       date: "2026-01-15" },
  { id: "t2", description: "Staff salaries — January",     amount: 180000, type: "expense", category: "Payroll",    date: "2026-01-31" },
  { id: "t3", description: "Generator diesel refill",      amount: 45000,  type: "expense", category: "Utilities",  date: "2026-02-03" },
  { id: "t4", description: "Term 2 fees — Primary 5",      amount: 170000, type: "income",  category: "Fees",       date: "2026-02-05" },
  { id: "t5", description: "Textbooks & stationery",       amount: 62000,  type: "expense", category: "Supplies",   date: "2026-02-10" },
  { id: "t6", description: "UBEC grant disbursement",      amount: 500000, type: "income",  category: "Grant",      date: "2026-02-14" },
];

/* ─── Diaries ───────────────────────────────────────── */
export const DIARIES: Diary[] = [
  {
    id: "d1",
    studentId: "s2",
    teacherName: "Mrs Adeleke",
    subject: "Mathematics",
    message: "Chidi was attentive in class today. We covered fractions — he participated well but needs more practice at home. I've sent exercises in his notebook.",
    date: "2026-05-06",
    time: "2:45pm",
  },
  {
    id: "d2",
    studentId: "s1",
    teacherName: "Mrs Adeleke",
    subject: "English Language",
    message: "Amara submitted an excellent essay today. Her vocabulary and structure are improving each week. Keep encouraging her reading habit.",
    date: "2026-05-05",
    time: "1:30pm",
  },
];

/* ─── Teacher Profile ──────────────────────────────── */
export const TEACHER_PROFILE = {
  name:           "Mr. Adeleke",
  subRole:        "subject_teacher" as "class_teacher" | "subject_teacher",
  assignedClass:  "JSS 3 Alpha",
  mySubjectIds:   ["sub1", "sub2", "sub3"], // Mathematics, English Language, Basic Science
};

/* ─── Today's Timetable (admin-set) ─────────────────── */
export type TimetableSlot = { period: number; time: string; subjectId: string; class: string };
export const TODAY_TIMETABLE: TimetableSlot[] = [
  { period: 1, time: "8:00–8:45",   subjectId: "sub1", class: "JSS 3 Alpha" },
  { period: 2, time: "9:00–9:45",   subjectId: "sub3", class: "JSS 3 Alpha" },
  { period: 3, time: "10:00–10:45", subjectId: "sub2", class: "JSS 3 Alpha" },
];

/* ─── Admin KPIs ────────────────────────────────────── */
export const ADMIN_KPIS: KPI[] = [
  { label: "Cash at Bank",      value: "₦24.3M",  subValue: "+₦1.2M this week", trend: "up",   trendPercent: 5 },
  { label: "Outstanding Fees",  value: "₦12.45M", subValue: "312 students",     trend: "down",  trendPercent: 8 },
  { label: "Total Students",    value: "1,248",   subValue: "Enrolled term 2",  trend: "flat" },
  { label: "Fee Recovery Rate", value: "78%",     subValue: "Target: 90%",      trend: "up",   trendPercent: 3 },
];

/* ─── Teacher Compliance (seeded) ──────────────────── */
export const TEACHER_COMPLIANCE: TeacherCompliance[] = [
  { id: "tc1", name: "Mrs. Adeleke",  onTimePercent: 94, periodsLogged: 47, periodsExpected: 50, streakDays: 14, phone: "08012345678" },
  { id: "tc2", name: "Mr. Okonkwo",   onTimePercent: 78, periodsLogged: 39, periodsExpected: 50, streakDays: 5,  phone: "08023456789" },
  { id: "tc3", name: "Mrs. Fashola",  onTimePercent: 55, periodsLogged: 28, periodsExpected: 50, streakDays: 2,  phone: "08034567890" },
  { id: "tc4", name: "Mr. Babatunde", onTimePercent: 88, periodsLogged: 44, periodsExpected: 50, streakDays: 9,  phone: "08045678901" },
  { id: "tc5", name: "Mrs. Nwosu",    onTimePercent: 42, periodsLogged: 21, periodsExpected: 50, streakDays: 0,  phone: "08056789012" },
];

/* ─── Fix Packs (seeded) ────────────────────────────── */
export const FIX_PACKS: FixPack[] = [
  {
    id:          "fp1",
    studentId:   "s2",
    teacherName: "Mr. Adeleke",
    subject:     "Mathematics",
    title:       "Chidi Maths Fix Pack",
    items: [
      { id: "fp1-1", text: "Complete fractions worksheet pages 24–28",          completed: false },
      { id: "fp1-2", text: "Daily 20-min revision on fractions & decimals",     completed: false },
      { id: "fp1-3", text: "One-on-one session with Mr Adeleke on Thursday",    completed: false },
      { id: "fp1-4", text: "Parent to review Chidi's notes every evening",      completed: false },
      { id: "fp1-5", text: "Mini re-test on Friday — target 50+/100",           completed: false },
    ],
    createdAt: "2026-05-06",
    purchased: false,
    price:     5000,
  },
];

/* ─── CBT Topics ─────────────────────────────────────── */
export const CBT_TOPICS: CBTTopic[] = [
  { id: "t1",  subjectId: "sub1", name: "Fractions & Decimals"  },
  { id: "t2",  subjectId: "sub1", name: "Quadratic Equations"   },
  { id: "t3",  subjectId: "sub1", name: "Geometry & Angles"     },
  { id: "t4",  subjectId: "sub2", name: "Grammar & Tenses"      },
  { id: "t5",  subjectId: "sub2", name: "Comprehension"         },
  { id: "t6",  subjectId: "sub2", name: "Vocabulary"            },
  { id: "t7",  subjectId: "sub3", name: "Living Things"         },
  { id: "t8",  subjectId: "sub3", name: "Forces & Motion"       },
  { id: "t9",  subjectId: "sub3", name: "Basic Chemistry"       },
  { id: "t10", subjectId: "sub4", name: "Nigeria's History"     },
  { id: "t11", subjectId: "sub4", name: "Government & Civics"   },
  { id: "t12", subjectId: "sub5", name: "Citizens' Rights"      },
  { id: "t13", subjectId: "sub5", name: "Democratic Values"     },
  { id: "t14", subjectId: "sub6", name: "Crop Production"       },
  { id: "t15", subjectId: "sub6", name: "Animal Husbandry"      },
];

/* ─── CBT Question Bank ──────────────────────────────── */
export const CBT_QUESTIONS: CBTQuestion[] = [
  // ── Mathematics ──
  { id: "q-s1-e1", subjectId: "sub1", topicId: "t1", difficulty: "easy",   correctIndex: 0, text: "What is ½ + ¼?",                                                          options: ["¾", "½", "1", "⅔"]                                          },
  { id: "q-s1-e2", subjectId: "sub1", topicId: "t1", difficulty: "easy",   correctIndex: 1, text: "What is 25% of 200?",                                                     options: ["25", "50", "75", "100"]                                      },
  { id: "q-s1-e3", subjectId: "sub1", topicId: "t3", difficulty: "easy",   correctIndex: 1, text: "What is the sum of angles in a triangle?",                               options: ["90°", "180°", "270°", "360°"]                                },
  { id: "q-s1-m1", subjectId: "sub1", topicId: "t2", difficulty: "medium", correctIndex: 0, text: "Solve x² − 5x + 6 = 0. The roots are?",                                 options: ["2 and 3", "1 and 6", "−2 and −3", "2 and −3"]               },
  { id: "q-s1-m2", subjectId: "sub1", topicId: "t3", difficulty: "medium", correctIndex: 2, text: "Area of a rectangle with length 8 cm and width 5 cm?",                   options: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"]                       },
  { id: "q-s1-m3", subjectId: "sub1", topicId: "t1", difficulty: "medium", correctIndex: 1, text: "What is 2.5 × 1.4?",                                                     options: ["3.0", "3.5", "4.0", "3.45"]                                  },
  { id: "q-s1-h1", subjectId: "sub1", topicId: "t2", difficulty: "hard",   correctIndex: 1, text: "If x² + bx + 9 = 0 has equal roots, find b.",                            options: ["±3", "±6", "±9", "±18"]                                      },
  { id: "q-s1-h2", subjectId: "sub1", topicId: "t3", difficulty: "hard",   correctIndex: 1, text: "A right triangle has one acute angle of 37°. Find the other acute angle.", options: ["43°", "53°", "63°", "73°"]                                   },

  // ── English Language ──
  { id: "q-s2-e1", subjectId: "sub2", topicId: "t4", difficulty: "easy",   correctIndex: 2, text: "Which word is a noun?",                                                   options: ["run", "beautiful", "teacher", "quickly"]                     },
  { id: "q-s2-e2", subjectId: "sub2", topicId: "t6", difficulty: "easy",   correctIndex: 1, text: "Choose the correct spelling.",                                             options: ["recieve", "receive", "receve", "receeve"]                    },
  { id: "q-s2-e3", subjectId: "sub2", topicId: "t4", difficulty: "easy",   correctIndex: 1, text: "In 'The cat sat on the mat', what is the verb?",                          options: ["cat", "sat", "mat", "the"]                                   },
  { id: "q-s2-m1", subjectId: "sub2", topicId: "t4", difficulty: "medium", correctIndex: 1, text: "Which sentence is in the past continuous tense?",                         options: ["I eat rice", "I was eating rice", "I will eat rice", "I have eaten rice"] },
  { id: "q-s2-m2", subjectId: "sub2", topicId: "t6", difficulty: "medium", correctIndex: 1, text: "What is the antonym of 'brave'?",                                         options: ["strong", "cowardly", "kind", "careful"]                      },
  { id: "q-s2-m3", subjectId: "sub2", topicId: "t5", difficulty: "medium", correctIndex: 2, text: "Identify the figure of speech: 'The stars danced in the night sky.'",    options: ["Simile", "Metaphor", "Personification", "Alliteration"]      },
  { id: "q-s2-h1", subjectId: "sub2", topicId: "t4", difficulty: "hard",   correctIndex: 2, text: "Choose the correct form: 'Neither the students nor the teacher __ present.'", options: ["are", "were", "is", "being"]                           },
  { id: "q-s2-h2", subjectId: "sub2", topicId: "t6", difficulty: "hard",   correctIndex: 1, text: "The word 'pedagogy' means?",                                              options: ["Leadership", "Art of teaching", "Medical practice", "Legal argument"] },

  // ── Basic Science ──
  { id: "q-s3-e1", subjectId: "sub3", topicId: "t7", difficulty: "easy",   correctIndex: 2, text: "Which of these is a mammal?",                                             options: ["Snake", "Parrot", "Bat", "Frog"]                             },
  { id: "q-s3-e2", subjectId: "sub3", topicId: "t8", difficulty: "easy",   correctIndex: 2, text: "What force pulls objects toward Earth?",                                  options: ["Friction", "Tension", "Gravity", "Magnetism"]                },
  { id: "q-s3-e3", subjectId: "sub3", topicId: "t9", difficulty: "easy",   correctIndex: 1, text: "Water is composed of which elements?",                                    options: ["H and N", "H and O", "O and C", "Na and Cl"]                 },
  { id: "q-s3-m1", subjectId: "sub3", topicId: "t7", difficulty: "medium", correctIndex: 1, text: "What is the function of the mitochondria?",                               options: ["Stores water", "Produces energy", "Controls cell division", "Makes proteins"] },
  { id: "q-s3-m2", subjectId: "sub3", topicId: "t8", difficulty: "medium", correctIndex: 2, text: "A ball rolling on a rough surface slows due to?",                        options: ["Gravity", "Air resistance", "Friction", "Tension"]           },
  { id: "q-s3-m3", subjectId: "sub3", topicId: "t9", difficulty: "medium", correctIndex: 2, text: "Gas produced when acid reacts with a carbonate?",                         options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"]           },
  { id: "q-s3-h1", subjectId: "sub3", topicId: "t7", difficulty: "hard",   correctIndex: 2, text: "During photosynthesis, which gas is absorbed by the plant?",              options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"]           },
  { id: "q-s3-h2", subjectId: "sub3", topicId: "t9", difficulty: "hard",   correctIndex: 1, text: "What is the pH of pure water at 25°C?",                                  options: ["6", "7", "8", "9"]                                           },

  // ── Social Studies ──
  { id: "q-s4-e1", subjectId: "sub4", topicId: "t10", difficulty: "easy",   correctIndex: 0, text: "Nigeria gained independence in?",                                        options: ["1960", "1963", "1950", "1970"]                               },
  { id: "q-s4-e2", subjectId: "sub4", topicId: "t10", difficulty: "easy",   correctIndex: 2, text: "What is the capital of Nigeria?",                                        options: ["Lagos", "Kano", "Abuja", "Ibadan"]                           },
  { id: "q-s4-e3", subjectId: "sub4", topicId: "t11", difficulty: "easy",   correctIndex: 2, text: "How many states does Nigeria have?",                                     options: ["30", "35", "36", "40"]                                       },
  { id: "q-s4-m1", subjectId: "sub4", topicId: "t10", difficulty: "medium", correctIndex: 1, text: "Who was Nigeria's first Prime Minister?",                                options: ["Nnamdi Azikiwe", "Tafawa Balewa", "Aguiyi-Ironsi", "Yakubu Gowon"] },
  { id: "q-s4-m2", subjectId: "sub4", topicId: "t11", difficulty: "medium", correctIndex: 1, text: "What system of government does Nigeria practise?",                       options: ["Monarchy", "Federal", "Confederal", "Unitary"]               },
  { id: "q-s4-m3", subjectId: "sub4", topicId: "t10", difficulty: "medium", correctIndex: 1, text: "ECOWAS was established in?",                                             options: ["1970", "1975", "1980", "1985"]                               },
  { id: "q-s4-h1", subjectId: "sub4", topicId: "t11", difficulty: "hard",   correctIndex: 2, text: "Which tier of government manages local matters in Nigeria?",              options: ["Federal", "State", "Local Government", "National Assembly"]  },
  { id: "q-s4-h2", subjectId: "sub4", topicId: "t11", difficulty: "hard",   correctIndex: 0, text: "Nigeria's current constitution was enacted in?",                         options: ["1999", "2003", "2010", "2015"]                               },

  // ── Civic Education ──
  { id: "q-s5-e1", subjectId: "sub5", topicId: "t12", difficulty: "easy",   correctIndex: 1, text: "Which document guarantees citizens' rights in Nigeria?",                 options: ["EFCC Act", "The Constitution", "Land Use Act", "CAMA"]       },
  { id: "q-s5-e2", subjectId: "sub5", topicId: "t13", difficulty: "easy",   correctIndex: 1, text: "The right to vote is called?",                                           options: ["Civil right", "Franchise", "Citizenship", "Liberty"]         },
  { id: "q-s5-e3", subjectId: "sub5", topicId: "t13", difficulty: "easy",   correctIndex: 2, text: "Democracy means government by?",                                         options: ["the military", "one person", "the people", "the rich"]       },
  { id: "q-s5-m1", subjectId: "sub5", topicId: "t12", difficulty: "medium", correctIndex: 2, text: "Freedom of speech falls under which type of rights?",                    options: ["Economic rights", "Social rights", "Civil rights", "Cultural rights"] },
  { id: "q-s5-m2", subjectId: "sub5", topicId: "t13", difficulty: "medium", correctIndex: 1, text: "Which is NOT a feature of democracy?",                                   options: ["Rule of law", "Dictatorship", "Free elections", "Majority rule"] },
  { id: "q-s5-m3", subjectId: "sub5", topicId: "t12", difficulty: "medium", correctIndex: 1, text: "An ombudsman handles complaints about?",                                 options: ["school fees", "government officials", "private businesses", "religious matters"] },
  { id: "q-s5-h1", subjectId: "sub5", topicId: "t13", difficulty: "hard",   correctIndex: 1, text: "The doctrine of 'separation of powers' was developed by?",               options: ["Karl Marx", "Montesquieu", "Plato", "Aristotle"]             },
  { id: "q-s5-h2", subjectId: "sub5", topicId: "t12", difficulty: "hard",   correctIndex: 1, text: "Which UN convention specifically protects children's rights?",            options: ["UDHR", "CRC", "CEDAW", "CAT"]                                },

  // ── Agricultural Science ──
  { id: "q-s6-e1", subjectId: "sub6", topicId: "t14", difficulty: "easy",   correctIndex: 2, text: "Photosynthesis mainly takes place in?",                                  options: ["roots", "stem", "leaves", "seeds"]                           },
  { id: "q-s6-e2", subjectId: "sub6", topicId: "t15", difficulty: "easy",   correctIndex: 2, text: "Which animal is a ruminant?",                                            options: ["Dog", "Rabbit", "Cow", "Pig"]                                },
  { id: "q-s6-e3", subjectId: "sub6", topicId: "t14", difficulty: "easy",   correctIndex: 1, text: "Compost is used primarily to improve?",                                  options: ["water quality", "soil fertility", "seed germination", "climate"] },
  { id: "q-s6-m1", subjectId: "sub6", topicId: "t14", difficulty: "medium", correctIndex: 2, text: "Which of these is a leguminous crop?",                                   options: ["Maize", "Sorghum", "Groundnut", "Cassava"]                   },
  { id: "q-s6-m2", subjectId: "sub6", topicId: "t15", difficulty: "medium", correctIndex: 2, text: "A broiler is a type of?",                                                options: ["cow", "pig", "chicken", "fish"]                              },
  { id: "q-s6-m3", subjectId: "sub6", topicId: "t14", difficulty: "medium", correctIndex: 1, text: "The process of removing weeds from farmland is called?",                 options: ["pruning", "weeding", "tilling", "mulching"]                  },
  { id: "q-s6-h1", subjectId: "sub6", topicId: "t15", difficulty: "hard",   correctIndex: 1, text: "Which hormone controls milk production in cattle?",                      options: ["Insulin", "Prolactin", "Oxytocin", "Testosterone"]           },
  { id: "q-s6-h2", subjectId: "sub6", topicId: "t14", difficulty: "hard",   correctIndex: 2, text: "In NPK fertilizer, what does K stand for?",                              options: ["Carbon", "Calcium", "Potassium", "Iron"]                     },

  // ── Extra questions for topics with < 3 questions ──
  { id: "q-s1-m4", subjectId: "sub1", topicId: "t2", difficulty: "medium", correctIndex: 2, text: "Which of these is a quadratic equation?",                                   options: ["3x + 5 = 0", "2x + y = 1", "x² − 4 = 0", "x + x = 2x"]    },
  { id: "q-s2-e4", subjectId: "sub2", topicId: "t5", difficulty: "easy",   correctIndex: 1, text: "When answering comprehension questions, you should?",                       options: ["Make up details", "Use evidence from the passage", "Write very long answers", "Skip difficult parts"] },
  { id: "q-s2-m4", subjectId: "sub2", topicId: "t5", difficulty: "medium", correctIndex: 0, text: "A word in a passage with the same meaning as another is called a?",          options: ["Synonym", "Antonym", "Homophone", "Prefix"]                  },
  { id: "q-s3-m4", subjectId: "sub3", topicId: "t8", difficulty: "medium", correctIndex: 0, text: "What is the SI unit of force?",                                              options: ["Newton", "Joule", "Watt", "Pascal"]                          },
];
