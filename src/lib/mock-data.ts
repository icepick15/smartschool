import type { Student, Subject, Score, FeeRecord, Transaction, KPI, Diary, FixPack, TeacherCompliance, CBTTopic, CBTQuestion } from "./types";
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
];
