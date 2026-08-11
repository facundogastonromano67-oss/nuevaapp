import { attributes, combatSkills } from './data.js';
import { buildHabitSchedule, buildNutritionWeek, buildTrainingPlan, calculateHardcorePenalty, calculateNutritionTargets, createDailyAssignment, generateDailyHabits, localDateKey, stageForDay, transactXp } from './engines.js';
import { catalogById, exerciseCatalog, mealPresetCatalog } from './catalogs.js';

const KEY = 'facu-owner-v1';
const VERSION = 8;
const defaultAnswers = {
  sex: 'male', activity: 'light', goal: 'performance', routineType: 'full-body',
  planMode: 'normal',
  trainingDays: ['Lunes', 'Miércoles', 'Viernes'], weeklyFrequency: '3', duration: '50',
  equipment: 'full', experience: 'novice', mealCount: '4', dietStyle: 'simple',
  proteins: ['Pollo', 'Huevos'], carbs: ['Arroz', 'Avena'], produce: ['Tomate', 'Zanahoria'], intellect: 'logic',
  dailyHabits: ['sleep','water','steps','focus','reading','vegetables'],
};

const skillSeed = () => Object.entries(attributes).flatMap(([attr, names]) => names.map((name, index) => ({
  attr, name, score: 34 + (index * 7) % 28, evidence: 0, confidence: 'Inicial', updated: 'Sin evaluar',
})));

const habitSeed = [
  ['Sueño', '7,5 h'], ['Agua', '2,5 L'], ['Movimiento', '8.000 pasos'],
  ['Alimentación estructurada', 'Plan del día'], ['Foco', '50 min'],
  ['Aprendizaje', '20 min'], ['Comunicación intencional', '1 conversación'],
].map((item, index) => ({ id: `h${index}`, name: item[0], target: item[1], baseline: 'Semana 1', active: true, done: false, custom: false }));

export const initialState = () => {
  const profile = { name: 'FACU', title: 'Monarca en Ascenso', age: '', height: '', weight: '', goal: 'Rendimiento integral', context: '', avatarPreset: 'shadow', avatarImage: '' };
  const targets = calculateNutritionTargets(profile, defaultAnswers);
  const weeklyPlan = buildTrainingPlan(defaultAnswers);
  const nutritionWeek = buildNutritionWeek(targets, defaultAnswers);
  const state = {
    version: VERSION,
    assessmentVersion: 3,
    onboarded: false,
    profile,
    onboardingAnswers: {},
    baseline: {},
    recommendations: { nutrition: targets, routineType: 'full-body', intellect: 'logic' },
    xp: 860,
    xpLedger: [],
    plan: {
      mode: 'normal', status: 'draft', locked: false, generatedAt: 0, acceptedAt: 0,
      rewards: { habit: 25, meal: 20, training: 180 },
      penaltyHistory: [], habitSchedule: [], habitScheduleStage: '',
    },
    coins: 240,
    streak: 6,
    g30: { day: 1, goal: 'Construir una versión más fuerte, enfocada y consistente' },
    notepad: { content: '', updatedAt: 0 },
    notes: [{ id: 'n1', title: 'Primera nota', body: 'Usá este cuaderno para guardar ideas, sensaciones, proyectos o cosas que no querés olvidar.', updatedAt: Date.now(), pinned: true }],
    tasks: [],
    habits: habitSeed,
    skills: skillSeed(),
    missions: [],
    training: {
      started: null, current: 0, selectedDay: weeklyPlan.findIndex(day => day.enabled), weeklyPlan,
      exercises: weeklyPlan.find(day => day.enabled)?.exercises || [], history: [],
      settings: { type: 'full-body', days: 3, duration: 50, equipment: 'Gimnasio completo', limitations: 'Ninguna' },
    },
    nutrition: {
      selectedDay: 0, weeklyPlan: nutritionWeek, meals: nutritionWeek[0].meals, done: [], favorites: [],
      weight: '', hunger: 3, energy: 4, adherence: 0,
      preferences: { likes: [], dislikes: [], exclusions: [] },
      settings: { calories: targets.calories, protein: targets.protein, carbs: targets.carbs, fat: targets.fat, count: 4, budget: 'Medio' },
    },
    academy: { completed: [], quizScores: {} },
    arena: { rating: 1000, wins: 0, losses: 0, deck: [1, 2, 3, 4, 5], skills: combatSkills, history: [], battle: null, selectedMode: null },
    history: [],
    daily: { dateKey: '', dayName: '', assignedAt: 0, welcomeSeenDate: '', noticeSeenDate: '', recalibrations: 0, hasTraining: false, trainingTitle: '' },
    ui: { route: 'general', more: 'g30' },
  };
  state.plan.habitSchedule = buildHabitSchedule(state);
  state.plan.habitScheduleStage = stageForDay(state.g30.day);
  const assignment = createDailyAssignment(state, new Date());
  state.missions = assignment.missions;
  state.habits = assignment.habits;
  state.daily = { ...state.daily, dateKey: assignment.dateKey, dayName: assignment.dayName, assignedAt: Date.now(), hasTraining: assignment.hasTraining, trainingTitle: assignment.trainingTitle };
  return state;
};

export function migrateState(saved) {
  const fresh = initialState();
  if (!saved || typeof saved !== 'object') return fresh;
  const oldVersion = Number(saved.version) || 0;
  const merged = {
    ...fresh, ...saved,
    profile: { ...fresh.profile, ...saved.profile },
    g30: { ...fresh.g30, ...saved.g30 },
    recommendations: { ...fresh.recommendations, ...saved.recommendations },
    plan: { ...fresh.plan, ...saved.plan, rewards: { ...fresh.plan.rewards, ...saved.plan?.rewards } },
    training: { ...fresh.training, ...saved.training, settings: { ...fresh.training.settings, ...saved.training?.settings } },
    nutrition: { ...fresh.nutrition, ...saved.nutrition, settings: { ...fresh.nutrition.settings, ...saved.nutrition?.settings }, preferences: { ...fresh.nutrition.preferences, ...saved.nutrition?.preferences } },
    academy: { ...fresh.academy, ...saved.academy },
    arena: { ...fresh.arena, ...saved.arena },
    notepad: { ...fresh.notepad, ...saved.notepad },
    daily: { ...fresh.daily, ...saved.daily },
    ui: { ...fresh.ui, ...saved.ui },
  };
  for (const key of ['tasks', 'habits', 'skills', 'missions', 'history', 'notes']) if (!Array.isArray(merged[key])) merged[key] = fresh[key];
  if (!Array.isArray(merged.xpLedger)) merged.xpLedger = [];
  if (!Array.isArray(merged.plan.penaltyHistory)) merged.plan.penaltyHistory = [];
  if (!merged.notepad || typeof merged.notepad !== 'object') merged.notepad = { ...fresh.notepad };
  if (oldVersion < 2) {
    const taskNotes = Array.isArray(saved.tasks) ? saved.tasks.map(task => ({ id: `legacy-${task.id}`, title: task.title || 'Nota importada', body: [task.category, task.date].filter(Boolean).join(' · '), updatedAt: Date.now(), pinned: false })) : [];
    merged.notes = [...taskNotes, ...fresh.notes];
    merged.habits = fresh.habits;
    merged.onboarded = false;
    merged.assessmentVersion = 2;
  }
  if ((Number(saved.assessmentVersion) || 0) < 3) {
    merged.onboarded = false;
    merged.assessmentVersion = 3;
  }
  if (oldVersion < 5) {
    const enabledDays = Array.isArray(saved.training?.weeklyPlan) ? saved.training.weeklyPlan.filter(day => day.enabled).map(day => day.day) : defaultAnswers.trainingDays;
    const routineType = merged.training.settings.type || saved.onboardingAnswers?.routineType || 'full-body';
    merged.training.weeklyPlan = buildTrainingPlan({ ...defaultAnswers, ...saved.onboardingAnswers, routineType, trainingDays: enabledDays, weeklyFrequency: String(Math.max(3, enabledDays.length)) });
    merged.training.selectedDay = Math.max(0, merged.training.weeklyPlan.findIndex(day => day.enabled));
    const nutritionTargets = { ...calculateNutritionTargets(merged.profile, { ...defaultAnswers, ...saved.onboardingAnswers }), ...merged.nutrition.settings };
    merged.nutrition.weeklyPlan = buildNutritionWeek(nutritionTargets, { ...defaultAnswers, ...saved.onboardingAnswers, mealCount: String(merged.nutrition.settings.count || 4) });
    merged.nutrition.selectedDay = Math.min(6, Math.max(0, Number(merged.nutrition.selectedDay) || 0));
  }
  if (oldVersion < 6) {
    merged.training.weeklyPlan?.forEach(day=>day.exercises?.forEach(exercise=>{const visual=catalogById(exerciseCatalog,exercise.id)||exerciseCatalog.find(item=>item.name===exercise.name);if(visual){exercise.img=visual.img;exercise.visualIndex=visual.visualIndex;exercise.fallbackImg=visual.fallbackImg;}}));
    merged.nutrition.weeklyPlan?.forEach(day=>day.meals?.forEach(meal=>{const preset=catalogById(mealPresetCatalog,meal.presetId)||mealPresetCatalog.find(item=>item.name===meal.name);if(preset){meal.img=preset.img;meal.visualIndex=preset.visualIndex;meal.presetId=preset.id;meal.mealGroup=preset.group;}}));
  }
  if (oldVersion < 7 && merged.onboarded) merged.plan = { ...merged.plan, mode: 'normal', status: 'active', locked: false, acceptedAt: Date.now() };
  if (oldVersion < 8) {
    const legacyNotes = Array.isArray(merged.notes) ? merged.notes.map(note => [note.title, note.body].filter(Boolean).join('\n')).filter(Boolean) : [];
    const legacyCheckin = saved.checkin?.note?.trim();
    if (!merged.notepad.content) merged.notepad = { content: [...legacyNotes, legacyCheckin].filter(Boolean).join('\n\n---\n\n'), updatedAt: Date.now() };
    merged.plan.habitSchedule = buildHabitSchedule(merged);
    merged.plan.habitScheduleStage = stageForDay(merged.g30.day);
    if (merged.onboarded) merged.habits = generateDailyHabits(merged, new Date());
  }
  delete merged.checkin;
  if (!Array.isArray(merged.plan.habitSchedule) || merged.plan.habitSchedule.length !== 7) {
    merged.plan.habitSchedule = buildHabitSchedule(merged);
    merged.plan.habitScheduleStage = stageForDay(merged.g30.day);
  }
  if (!Array.isArray(merged.training.weeklyPlan) || merged.training.weeklyPlan.length !== 7) merged.training.weeklyPlan = fresh.training.weeklyPlan;
  if (!Array.isArray(merged.training.history)) merged.training.history = [];
  if (!Array.isArray(merged.nutrition.weeklyPlan) || merged.nutrition.weeklyPlan.length !== 7) merged.nutrition.weeklyPlan = fresh.nutrition.weeklyPlan;
  if (!Array.isArray(merged.nutrition.done)) merged.nutrition.done = [];
  if (!Array.isArray(merged.nutrition.favorites)) merged.nutrition.favorites = [];
  if (!Array.isArray(merged.academy.completed)) merged.academy.completed = [];
  if (!merged.academy.quizScores || typeof merged.academy.quizScores !== 'object') merged.academy.quizScores = {};
  if (!Array.isArray(merged.arena.deck)) merged.arena.deck = fresh.arena.deck;
  if (!Array.isArray(merged.arena.skills)) merged.arena.skills = fresh.arena.skills;
  if (!Array.isArray(merged.arena.history)) merged.arena.history = [];
  if (merged.arena.battle && !['active', 'victory', 'defeat'].includes(merged.arena.battle.status)) merged.arena.battle = null;
  if (!saved.daily?.dateKey) merged.daily.dateKey = '';
  merged.version = VERSION;
  return merged;
}

let state;
try { state = migrateState(JSON.parse(localStorage.getItem(KEY))); } catch { state = initialState(); }

export const getState = () => state;
export function setState(update) {
  state = update(structuredClone(state)) || state;
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('statechange'));
}
export function ensureDailyRollover(now = new Date(), force = false) {
  const today = localDateKey(now);
  if (!force && state.daily?.dateKey === today) return false;
  setState(current => {
    const previousDateKey=current.daily?.dateKey;
    if(previousDateKey){
      const penalty=calculateHardcorePenalty(current,previousDateKey);
      if(penalty.total>0){
        const transaction=transactXp(current.xp,current.xpLedger,{key:`hardcore-penalty-${previousDateKey}`,amount:-penalty.total,at:now.getTime(),dateKey:previousDateKey,type:'penalty',label:`Penalización Hardcore · ${previousDateKey}`});
        current.xp=transaction.xp;current.xpLedger=transaction.ledger;
        current.plan.penaltyHistory.unshift({...penalty,xpLost:Math.abs(transaction.delta),at:now.getTime()});
        current.history.unshift({id:`penalty-${previousDateKey}`,at:now.getTime(),type:'penalty',label:'Penalización del plan Hardcore',detail:`${penalty.items.length} incumplimientos · ${penalty.total} XP evaluados`,xp:transaction.delta});
      }
    }
    if(previousDateKey!==today&&current.onboarded)current.g30.day=Math.min(30,(Number(current.g30.day)||1)+1);
    const habitStage=stageForDay(current.g30.day);
    if(!Array.isArray(current.plan.habitSchedule)||current.plan.habitSchedule.length!==7||current.plan.habitScheduleStage!==habitStage){
      current.plan.habitSchedule=buildHabitSchedule(current);
      current.plan.habitScheduleStage=habitStage;
    }
    const assignment = createDailyAssignment(current, now);
    current.missions = assignment.missions;
    current.habits = assignment.habits;
    current.daily = {
      ...current.daily, dateKey: assignment.dateKey, dayName: assignment.dayName, assignedAt: now.getTime(),
      welcomeSeenDate: '', noticeSeenDate: '', recalibrations: 0,
      hasTraining: assignment.hasTraining, trainingTitle: assignment.trainingTitle,
    };
    current.nutrition.done = [];
    return current;
  });
  return true;
}
export function reset() { state = initialState(); localStorage.removeItem(KEY); location.reload(); }
export function exportBackup() { return JSON.stringify(state, null, 2); }
export function importBackup(raw) {
  const parsed = JSON.parse(raw);
  if (!parsed.version || !parsed.profile) throw new Error('Backup inválido');
  state = migrateState(parsed);
  localStorage.setItem(KEY, JSON.stringify(state));
  location.reload();
}
