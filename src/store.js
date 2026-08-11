import { attributes, combatSkills } from './data.js';
import { buildNutritionWeek, buildTrainingPlan, calculateNutritionTargets, generateMissions } from './engines.js';

const KEY = 'facu-owner-v1';
const VERSION = 3;
const defaultAnswers = {
  sex: 'male', activity: 'light', goal: 'performance', routineType: 'full-body',
  trainingDays: ['Lunes', 'Miércoles', 'Viernes'], weeklyFrequency: '3', duration: '50',
  equipment: 'full', experience: 'novice', mealCount: '4', dietStyle: 'simple',
  proteins: ['Pollo', 'Huevos'], carbs: ['Arroz', 'Avena'], produce: ['Tomate', 'Zanahoria'], intellect: 'logic',
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
  const profile = { name: 'FACU', title: 'Monarca en Ascenso', age: '', height: '', weight: '', goal: 'Rendimiento integral', context: '' };
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
    coins: 240,
    streak: 6,
    g30: { day: 9, goal: 'Construir una versión más fuerte, enfocada y consistente' },
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
    arena: { rating: 1000, wins: 0, losses: 0, deck: [1, 2, 3, 4, 5], skills: combatSkills, history: [] },
    history: [],
    checkin: { sleep: 7, energy: 4, mood: 4, note: '' },
    ui: { route: 'general', more: 'g30' },
  };
  state.missions = generateMissions(state);
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
    training: { ...fresh.training, ...saved.training, settings: { ...fresh.training.settings, ...saved.training?.settings } },
    nutrition: { ...fresh.nutrition, ...saved.nutrition, settings: { ...fresh.nutrition.settings, ...saved.nutrition?.settings }, preferences: { ...fresh.nutrition.preferences, ...saved.nutrition?.preferences } },
    academy: { ...fresh.academy, ...saved.academy },
    arena: { ...fresh.arena, ...saved.arena },
    checkin: { ...fresh.checkin, ...saved.checkin },
    ui: { ...fresh.ui, ...saved.ui },
  };
  for (const key of ['tasks', 'habits', 'skills', 'missions', 'history', 'notes']) if (!Array.isArray(merged[key])) merged[key] = fresh[key];
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
export function reset() { state = initialState(); localStorage.removeItem(KEY); location.reload(); }
export function exportBackup() { return JSON.stringify(state, null, 2); }
export function importBackup(raw) {
  const parsed = JSON.parse(raw);
  if (!parsed.version || !parsed.profile) throw new Error('Backup inválido');
  state = migrateState(parsed);
  localStorage.setItem(KEY, JSON.stringify(state));
  location.reload();
}
