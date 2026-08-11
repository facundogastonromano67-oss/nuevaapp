import { exerciseCatalog, foodCatalog, habitCatalog, catalogById, mealPresetsForSlot } from './catalogs.js';
import { intellectAdaptiveQuestions, intellectCoreQuestions, intellectRoutes } from './data.js';

export function buildIntellectAssessment(preference = 'logic') {
  const selected = intellectRoutes[preference] ? preference : 'logic';
  return [
    ...intellectCoreQuestions.map(question => ({ ...question, tier: 'core' })),
    ...(intellectAdaptiveQuestions[selected] || []).map(question => ({ ...question, tier: 'adaptive' })),
  ];
}

export function scoreIntellectAssessment(answers = {}, preference = 'logic') {
  const route = intellectRoutes[preference] || intellectRoutes.logic;
  const questions = buildIntellectAssessment(preference);
  const results = {};
  for (const question of questions) {
    if (!results[question.skill]) results[question.skill] = { correct: 0, total: 0, score: 0 };
    const result = results[question.skill];
    result.total += 1;
    if (Number(answers[question.id]) === 1) result.correct += 1;
  }
  Object.values(results).forEach(result => result.score = Math.round(result.correct / Math.max(1, result.total) * 100));
  return {
    preference: intellectRoutes[preference] ? preference : 'logic',
    routeLabel: route.label,
    routeSkill: route.skill,
    totalCorrect: Object.values(results).reduce((sum, result) => sum + result.correct, 0),
    totalQuestions: questions.length,
    results,
  };
}

export const stageForDay = day => day <= 7 ? 'Diagnóstico y orden' : day <= 15 ? 'Construcción' : day <= 23 ? 'Intensificación' : 'Consolidación';

export function levelFromXp(xp) {
  let level = 1, need = 500, left = xp;
  while (left >= need) { left -= need; level++; need = Math.round(need * 1.18); }
  return { level, current: left, need, percent: Math.round(left / need * 100) };
}

export function transactXp(xp, ledger = [], transaction = {}) {
  const entries = Array.isArray(ledger) ? ledger.map(entry => ({ ...entry })) : [];
  const currentXp = Math.max(0, Number(xp) || 0);
  const existing = entries.find(entry => entry.key === transaction.key);
  if (transaction.reverse) {
    if (!existing || existing.reversedAt) return { xp: currentXp, ledger: entries, delta: 0, applied: false };
    const delta = -Math.max(0, Number(existing.amount) || 0);
    existing.reversedAt = transaction.at || Date.now();
    return { xp: Math.max(0, currentXp + delta), ledger: entries, delta, applied: true };
  }
  if (existing && !existing.reversedAt) return { xp: currentXp, ledger: entries, delta: 0, applied: false };
  const requested = Number(transaction.amount) || 0;
  const nextXp = Math.max(0, currentXp + requested);
  const delta = nextXp - currentXp;
  if (!delta) return { xp: currentXp, ledger: entries, delta: 0, applied: false };
  if (existing) {
    existing.amount = delta;
    existing.at = transaction.at || Date.now();
    existing.reversedAt = null;
    existing.label = transaction.label || existing.label;
    existing.type = transaction.type || existing.type;
    existing.dateKey = transaction.dateKey || existing.dateKey;
  } else entries.unshift({ key: transaction.key, amount: delta, at: transaction.at || Date.now(), label: transaction.label || 'Experiencia', type: transaction.type || 'reward', dateKey: transaction.dateKey || '' });
  return { xp: nextXp, ledger: entries, delta, applied: true };
}

export function calculateHardcorePenalty(state, dateKey = state?.daily?.dateKey) {
  if (!dateKey || state?.plan?.mode !== 'hardcore' || state?.plan?.status !== 'active') return { dateKey, total: 0, items: [] };
  if (state.plan?.penaltyHistory?.some(report => report.dateKey === dateKey)) return { dateKey, total: 0, items: [], alreadySettled: true };
  const items = [];
  (state.missions || []).filter(mission => mission.dateKey === dateKey && mission.status !== 'done').forEach(mission => items.push({ type: 'mission', id: mission.id, label: mission.title, amount: -Math.max(25, Math.round((Number(mission.xp) || 60) * .5)) }));
  (state.habits || []).filter(habit => habit.catalogId !== 'daily-training' && !habit.done).forEach(habit => items.push({ type: 'habit', id: habit.id, label: habit.name, amount: -15 }));
  const completedTraining = (state.training?.history || []).some(entry => entry.dateKey === dateKey);
  if (state.daily?.hasTraining && !completedTraining) items.push({ type: 'training', id: `training-${dateKey}`, label: state.daily.trainingTitle || 'Entrenamiento programado', amount: -100 });
  const nutritionDay = state.nutrition?.weeklyPlan?.find(day => day.day === state.daily?.dayName);
  const completedMeals = new Set(state.nutrition?.done || []);
  (nutritionDay?.meals || []).filter(meal => !completedMeals.has(meal.id)).forEach(meal => items.push({ type: 'nutrition', id: meal.id, label: `${meal.slot}: ${meal.name}`, amount: -12 }));
  return { dateKey, total: items.reduce((sum, item) => sum + Math.abs(item.amount), 0), items };
}

export function rank(score) {
  return score >= 90 ? 'Trascendente' : score >= 75 ? 'Élite' : score >= 60 ? 'Avanzado' : score >= 40 ? 'Competente' : score >= 20 ? 'Aprendiz' : 'Novato';
}

const localDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const padDatePart = value => String(value).padStart(2, '0');
const dateSeed = key => [...key].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 17);

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

export function trainingForDate(state, date = new Date()) {
  const dayName = localDayNames[date.getDay()];
  return state.training?.weeklyPlan?.find(day => day.day === dayName && day.enabled) || null;
}

export function generateDailyMissions(state, date = new Date(), variant = 0) {
  const dateKey = localDateKey(date), seed = dateSeed(dateKey) + variant * 11;
  const weak = [...(state.skills || [])].sort((a, b) => a.score - b.score).slice(0, 5);
  const primarySkill = weak[seed % Math.max(1, weak.length)] || { name: 'Foco profundo' };
  const training = trainingForDate(state, date);
  const cognitive = [
    { title: `Bloque de foco: ${primarySkill.name}`, detail: `25 minutos sin interrupciones · evidencia para ${primarySkill.name}`, xp: 80, emoji: '🎯' },
    { title: `Práctica deliberada: ${primarySkill.name}`, detail: `Elegí una dificultad concreta, practicá 20 minutos y registrá el resultado`, xp: 80, emoji: '🧠' },
    { title: 'Resolver antes de consumir', detail: `Dedicá 20 minutos a producir una solución antes de buscar referencias`, xp: 75, emoji: '🧩' },
    { title: 'Aprender y explicar', detail: `Estudiá una idea durante 15 minutos y explicala sin mirar`, xp: 75, emoji: '💡' },
    { title: 'Plan de tres movimientos', detail: `Definí las tres acciones que más acercan tu objetivo de hoy`, xp: 70, emoji: '🗺️' },
    { title: 'Memoria activa', detail: `Recordá cinco ideas de ayer y comprobá cuáles fueron precisas`, xp: 70, emoji: '🧠' },
    { title: 'Decisión pendiente', detail: `Tomá una decisión postergada usando criterio, costo y próximo paso`, xp: 75, emoji: '⚖️' },
  ];
  const recovery = [
    { title: 'Recuperación activa', detail: 'Caminá 25 minutos a ritmo cómodo y soltá tensión', xp: 65, emoji: '🚶' },
    { title: 'Movilidad completa', detail: 'Realizá 15 minutos de movilidad de cadera, espalda y hombros', xp: 65, emoji: '🤸' },
    { title: 'Base de energía', detail: 'Completá agua, proteína y dos porciones de vegetales', xp: 65, emoji: '🥗' },
    { title: 'Descanso estratégico', detail: 'Prepará una hora de sueño sin pantallas ni trabajo pendiente', xp: 65, emoji: '🌙' },
  ];
  const closures = [
    { title: 'Cierre del Sistema', detail: 'Registrá un aprendizaje y el próximo paso de mañana', xp: 60, emoji: '📓' },
    { title: 'Orden de diez minutos', detail: 'Dejá listo el espacio que vas a usar mañana', xp: 55, emoji: '🧹' },
    { title: 'Conversación intencional', detail: 'Tené una conversación sin teléfono y practicá escucha activa', xp: 60, emoji: '💬' },
    { title: 'Preparación de comidas', detail: 'Dejá preparada al menos una comida o sus ingredientes', xp: 60, emoji: '🍱' },
    { title: 'Revisión de progreso', detail: 'Anotá qué funcionó, qué frenó el día y qué vas a ajustar', xp: 60, emoji: '📈' },
    { title: 'Bloque sin teléfono', detail: 'Protegé 45 minutos completos sin redes ni notificaciones', xp: 60, emoji: '📵' },
    { title: 'Prioridad terminada', detail: 'Cerrá una tarea importante antes de abrir una nueva', xp: 65, emoji: '✅' },
  ];
  const selected = [
    { ...cognitive[seed % cognitive.length], category: 'Intelecto' },
    training
      ? { title: `Completar ${training.title}`, detail: `${training.exercises.length} ejercicios · ${state.training.settings.duration} minutos programados`, xp: 100, emoji: '🏋️', category: 'Entrenamiento' }
      : { ...recovery[(seed + 1) % recovery.length], category: 'Recuperación' },
    { ...closures[(seed + 2) % closures.length], category: 'Vida diaria' },
  ];
  return selected.map((mission, index) => ({ id: `mission-${dateKey}-${variant}-${index}`, dateKey, ...mission, status: 'open' }));
}

const habitWeekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const habitAnchors = new Set(['sleep', 'water', 'protein']);
const habitSuggestions = {
  'Diagnóstico y orden': ['plan-day', 'priorities', 'journal', 'tidy'],
  Construcción: ['focus', 'learning', 'no-phone', 'project'],
  Intensificación: ['focus', 'promise', 'review', 'mobility'],
  Consolidación: ['review', 'journal', 'conversation', 'gratitude'],
};

export function buildHabitSchedule(state = {}) {
  const selectedAnswers = Array.isArray(state.onboardingAnswers?.dailyHabits) ? state.onboardingAnswers.dailyHabits : [];
  const selected = [...new Set(selectedAnswers.filter(id => id !== 'strength' && catalogById(habitCatalog, id)))];
  const chosen = selected.length ? selected : ['sleep', 'water', 'steps', 'focus', 'reading', 'vegetables'];
  const anchors = chosen.filter(id => habitAnchors.has(id)).slice(0, 2);
  const rotating = chosen.filter(id => !anchors.includes(id));
  const stage = stageForDay(Number(state.g30?.day) || 1);
  const suggestions = habitSuggestions[stage] || habitSuggestions.Construcción;
  let previousSuggestion = '';
  return habitWeekDays.map((day, dayIndex) => {
    const planned = [...anchors];
    const rotatingCount = Math.min(2, rotating.length);
    for (let offset = 0; offset < rotatingCount; offset++) planned.push(rotating[(dayIndex * rotatingCount + offset) % rotating.length]);
    const orderedSuggestions = suggestions.map((_, index) => suggestions[(dayIndex + index) % suggestions.length]);
    const suggestion = orderedSuggestions.find(id => !planned.includes(id) && id !== previousSuggestion) || orderedSuggestions.find(id => !planned.includes(id)) || orderedSuggestions[0];
    previousSuggestion = suggestion;
    planned.push(suggestion);
    return { day, stage, habitIds: [...new Set(planned)].filter(id => catalogById(habitCatalog, id)) };
  });
}

export function generateDailyHabits(state, date = new Date()) {
  const dateKey = localDateKey(date), dayName = localDayNames[date.getDay()];
  const schedule = buildHabitSchedule(state);
  const scheduledDay = schedule.find(day => day.day === dayName);
  const catalogIds = scheduledDay?.habitIds || [];
  const selectedIds = new Set(Array.isArray(state.onboardingAnswers?.dailyHabits) ? state.onboardingAnswers.dailyHabits : []);
  const generated = catalogIds.map(id => catalogById(habitCatalog, id)).filter(Boolean).map(item => ({
    id: `daily-${dateKey}-${item.id}`, catalogId: item.id, category: item.category, emoji: item.emoji,
    name: item.name, target: item.target, baseline: habitAnchors.has(item.id) && selectedIds.has(item.id) ? 'Base diaria' : selectedIds.has(item.id) ? 'Rotación semanal' : `Sistema · ${scheduledDay?.stage || stageForDay(state.g30?.day || 1)}`, active: true, done: false, custom: false, daily: true, dateKey,
  }));
  const training = trainingForDate(state, date);
  if (training) generated.push({
    id: `daily-${dateKey}-training`, catalogId: 'daily-training', category: 'Entrenamiento', emoji: '🏋️',
    name: 'Completar rutina de entrenamiento', target: training.title, baseline: 'Rutina programada', active: true, done: false, custom: false, daily: true, dateKey,
  });
  const custom = (state.habits || []).filter(habit => habit.custom).map(habit => ({ ...habit, done: false, daily: false, dateKey }));
  return [...generated, ...custom];
}

export function createDailyAssignment(state, date = new Date(), variant = 0) {
  const training = trainingForDate(state, date);
  return {
    dateKey: localDateKey(date), dayName: localDayNames[date.getDay()], hasTraining: Boolean(training),
    trainingTitle: training?.title || 'Recuperación', missions: generateDailyMissions(state, date, variant), habits: generateDailyHabits(state, date),
  };
}

export function generateMissions(state, date = new Date(), variant = 0) {
  return generateDailyMissions(state, date, variant);
}

export function combat(playerPower, rating, roll = .5) {
  const enemy = Math.round(38 + rating / 35);
  const score = playerPower + Math.round(roll * 35);
  return { win: score >= enemy, reward: score >= enemy ? 35 : 8, enemy, score, ratingDelta: score >= enemy ? 18 : -10 };
}

const arenaBoosts = [
  { id: 'fury', emoji: '🔥', name: 'Furia', detail: '+45% de daño en el próximo ataque' },
  { id: 'shield', emoji: '🛡️', name: 'Escudo', detail: 'Reduce 70% el próximo golpe rival' },
  { id: 'heal', emoji: '💚', name: 'Recuperación', detail: 'Recupera 24 puntos de vida' },
];

export function createArenaBattle(state, mode = 'system', roll = .5) {
  if (!['system', 'pvp'].includes(mode)) return null;
  const rating = Number(state?.arena?.rating) || 1000;
  const rivalNames = mode === 'pvp' ? ['Cazador Carmesí', 'Centinela Nocturno', 'Monarca Errante'] : ['Guardián del Sistema', 'Bestia de Prueba', 'Caballero de las Sombras'];
  const enemyPower = Math.round(13 + rating / 160 + roll * 5);
  return {
    id: `battle-${Date.now()}`, mode, status: 'active', round: 1,
    playerHp: 100, enemyHp: 100, enemyPower,
    enemyName: rivalNames[Math.min(rivalNames.length - 1, Math.floor(roll * rivalNames.length))],
    boosts: arenaBoosts.map(boost => ({ ...boost, unlocked: false, used: false })),
    selectedBoost: null,
    log: [`La simulación comenzó contra ${rivalNames[Math.min(rivalNames.length - 1, Math.floor(roll * rivalNames.length))]}.`],
  };
}

export function resolveArenaTurn(battle, skill, boostId = null, roll = .5) {
  if (!battle || battle.status !== 'active' || !skill) return battle;
  const next = structuredClone(battle);
  const boost = next.boosts.find(item => item.id === boostId && item.unlocked && !item.used);
  let attackMultiplier = 1, defenseMultiplier = 1;
  if (boost?.id === 'fury') attackMultiplier = 1.45;
  if (boost?.id === 'shield') defenseMultiplier = .3;
  if (boost?.id === 'heal') next.playerHp = Math.min(100, next.playerHp + 24);
  if (boost) boost.used = true;
  const damage = Math.max(7, Math.round((Number(skill.power) + 8 + roll * 9) * attackMultiplier));
  next.enemyHp = Math.max(0, next.enemyHp - damage);
  next.log.unshift(`${skill.name} causó ${damage} de daño${boost ? ` con ${boost.name}` : ''}.`);
  if (next.enemyHp <= 0) {
    next.status = 'victory';
    next.log.unshift('Victoria confirmada por el Sistema.');
    return next;
  }
  const retaliation = Math.max(5, Math.round((next.enemyPower + (1 - roll) * 8) * defenseMultiplier));
  next.playerHp = Math.max(0, next.playerHp - retaliation);
  next.log.unshift(`${next.enemyName} respondió con ${retaliation} de daño.`);
  next.round += 1;
  next.selectedBoost = null;
  if (next.playerHp <= 0) {
    next.status = 'defeat';
    next.log.unshift('La simulación terminó. Revisá tu estrategia y volvé a intentarlo.');
  }
  return next;
}

export function weeklySummary(state) {
  const completed = state.history.filter(event => event.type === 'task' || event.type === 'mission').filter(event => Date.now() - event.at < 604800000).length;
  const habits = state.habits.filter(habit => habit.done).length;
  return {
    completed,
    habitPct: Math.round(habits / Math.max(1, state.habits.length) * 100),
    training: state.training.history.length,
    recommendation: habits < 3 ? 'Reducí fricción: dejá preparada una señal visible para tu hábito prioritario.' : 'Subí una sola variable de dificultad esta semana.',
  };
}

const activityFactors = { low: 1.2, light: 1.375, moderate: 1.55, high: 1.725 };
const goalAdjustments = { 'fat-loss': -420, muscle: 260, strength: 180, performance: 0 };

export function calculateNutritionTargets(profile, answers = {}) {
  const weight = Math.max(35, Number(profile.weight) || 70);
  const height = Math.max(130, Number(profile.height) || 170);
  const age = Math.max(14, Number(profile.age) || 30);
  const sexOffset = answers.sex === 'female' ? -161 : 5;
  const bmr = 10 * weight + 6.25 * height - 5 * age + sexOffset;
  const calories = Math.round((bmr * (activityFactors[answers.activity] || 1.375) + (goalAdjustments[answers.goal] || 0)) / 50) * 50;
  const protein = Math.round(weight * (answers.goal === 'muscle' ? 2 : 1.8));
  const fat = Math.round(weight * .8);
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories: Math.max(1400, calories), protein, fat, carbs, bmr: Math.round(bmr), method: 'Mifflin-St Jeor + actividad y objetivo' };
}

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const exerciseLibrary = {
  squat: { name: 'Sentadilla goblet', target: 'Piernas · fuerza', tech: 'Pecho alto, rodillas acompañan la punta de los pies y profundidad controlada.', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80' },
  row: { name: 'Remo con mancuerna', target: 'Espalda · postura', tech: 'Columna neutra, codo hacia la cadera y pausa arriba.', img: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=80' },
  press: { name: 'Press inclinado', target: 'Pecho · empuje', tech: 'Escápulas estables, antebrazos verticales y bajada controlada.', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80' },
  deadlift: { name: 'Peso muerto rumano', target: 'Cadena posterior', tech: 'Cadera atrás, espalda neutra y carga cerca del cuerpo.', img: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?auto=format&fit=crop&w=900&q=80' },
  pulldown: { name: 'Jalón al pecho', target: 'Dorsales · tracción', tech: 'Iniciá con escápulas y llevá los codos hacia abajo sin balancearte.', img: 'https://images.unsplash.com/photo-1598268030506-7b5b6de7bb38?auto=format&fit=crop&w=900&q=80' },
  shoulder: { name: 'Press militar', target: 'Hombros · empuje', tech: 'Glúteos y abdomen firmes; terminá con los brazos alineados.', img: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=80' },
  lunge: { name: 'Zancada búlgara', target: 'Piernas · unilateral', tech: 'Apoyo estable, descenso vertical y presión sobre el pie delantero.', img: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=900&q=80' },
  curl: { name: 'Curl de bíceps', target: 'Bíceps', tech: 'Codos quietos y recorrido completo sin impulso.', img: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=900&q=80' },
  triceps: { name: 'Extensión de tríceps', target: 'Tríceps', tech: 'Hombros estables, extendé sin despegar los codos.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80' },
  plank: { name: 'Plancha frontal', target: 'Core · estabilidad', tech: 'Costillas abajo, glúteos activos y respiración controlada.', img: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=900&q=80' },
};

const routineTemplates = {
  'heavy-duty': { label: 'Heavy Duty', sets: 2, reps: 7, rest: 150, splits: [['press', 'pulldown', 'squat', 'curl', 'triceps'], ['deadlift', 'row', 'shoulder', 'lunge', 'plank']] },
  hypertrophy: { label: 'Hipertrofia', sets: 4, reps: 10, rest: 75, splits: [['press', 'row', 'shoulder', 'triceps'], ['squat', 'deadlift', 'lunge', 'plank'], ['pulldown', 'press', 'row', 'curl'], ['squat', 'lunge', 'deadlift', 'plank']] },
  strength: { label: 'Fuerza', sets: 5, reps: 5, rest: 180, splits: [['squat', 'press', 'row', 'plank'], ['deadlift', 'shoulder', 'pulldown', 'lunge']] },
  'full-body': { label: 'Full Body', sets: 3, reps: 10, rest: 90, splits: [['squat', 'press', 'row', 'plank'], ['deadlift', 'shoulder', 'pulldown', 'lunge'], ['squat', 'press', 'pulldown', 'curl', 'triceps']] },
};

const exerciseAliases={press:'incline-press',pulldown:'lat-pulldown',squat:'goblet-squat',curl:'barbell-curl',triceps:'triceps-pushdown',deadlift:'romanian-deadlift',row:'dumbbell-row',shoulder:'overhead-press',lunge:'bulgarian-split',plank:'plank'};

export function exerciseRestSeconds(exerciseId,routineType='full-body'){
  const exercise=catalogById(exerciseCatalog,exerciseAliases[exerciseId]||exerciseId);
  if(exercise?.type==='cardio')return 30;
  if(routineType==='strength')return exercise?.type==='compound'?180:90;
  if(routineType==='heavy-duty')return exercise?.type==='compound'?150:90;
  if(routineType==='hypertrophy')return exercise?.type==='compound'?90:60;
  return exercise?.type==='compound'?105:exercise?.type==='core'?60:75;
}

export function createWorkoutExercise(exerciseId,routineType='full-body',setsOverride){
  const resolvedId=exerciseAliases[exerciseId]||exerciseId;
  const catalogExercise=catalogById(exerciseCatalog,resolvedId);
  const template=routineTemplates[routineType]||routineTemplates['full-body'];
  const legacy=exerciseLibrary[exerciseId]||exerciseLibrary.squat;
  const base=catalogExercise?{name:catalogExercise.name,target:`${catalogExercise.muscle} · ${catalogExercise.type==='isolation'?'aislamiento':'trabajo principal'}`,tech:catalogExercise.tech,img:catalogExercise.img,visualIndex:catalogExercise.visualIndex,fallbackImg:catalogExercise.fallbackImg}:{...legacy};
  const reps=['strength','heavy-duty'].includes(routineType)?template.reps:(catalogExercise?.defaultReps||template.reps);
  const sets=Math.max(1,setsOverride||template.sets);
  const rest=exerciseRestSeconds(resolvedId,routineType);
  return{id:resolvedId,...base,sets,reps,rest,setData:Array.from({length:sets},()=>({kg:0,reps,rpe:7,done:false})),notes:''};
}

const splitExerciseIds = {
  upper: ['bench-press', 'lat-pulldown', 'overhead-press', 'dumbbell-row', 'lateral-raise', 'barbell-curl', 'triceps-pushdown'],
  lower: ['back-squat', 'romanian-deadlift', 'leg-press', 'bulgarian-split', 'leg-curl', 'calf-raise', 'plank'],
};

export function buildTrainingDay(routineType = 'full-body', split = 'upper') {
  const template = routineTemplates[routineType] || routineTemplates['full-body'];
  const selectedSplit = splitExerciseIds[split] ? split : 'upper';
  const exerciseCount = routineType === 'heavy-duty' ? 5 : routineType === 'strength' ? 5 : 6;
  return splitExerciseIds[selectedSplit].slice(0, exerciseCount).map(id => createWorkoutExercise(id, routineType, template.sets));
}

export function buildTrainingPlan(answers = {}) {
  const template = routineTemplates[answers.routineType] || routineTemplates['full-body'];
  const wanted = Array.isArray(answers.trainingDays) ? answers.trainingDays : [];
  const frequency = Math.max(3, Number(answers.weeklyFrequency) || wanted.length || 3);
  const selected = (wanted.length ? wanted : days.filter((_, index) => [0, 2, 4, 5].includes(index))).slice(0, frequency);
  let workoutIndex = 0;
  return days.map(day => {
    const enabled = selected.includes(day);
    const split = workoutIndex % 2 === 0 ? 'upper' : 'lower';
    const splitLabel = split === 'upper' ? 'Tren superior' : 'Tren inferior';
    const entry = { day, enabled, split, title: enabled ? `${template.label} · ${splitLabel}` : 'Recuperación', exercises: enabled ? buildTrainingDay(answers.routineType, split) : [] };
    if (enabled) workoutIndex++;
    return entry;
  });
}

export function calculateFoodNutrition(foodId,quantity){
  const food=catalogById(foodCatalog,foodId);
  if(!food)return{kcal:0,p:0,c:0,f:0};
  const multiplier=Math.max(0,Number(quantity)||0)/food.baseAmount;
  return{kcal:food.kcal*multiplier,p:food.p*multiplier,c:food.c*multiplier,f:food.f*multiplier};
}

export function calculateMealNutrition(foods=[]){
  const total=foods.reduce((sum,item)=>{const value=calculateFoodNutrition(item.foodId,item.quantity);return{kcal:sum.kcal+value.kcal,p:sum.p+value.p,c:sum.c+value.c,f:sum.f+value.f};},{kcal:0,p:0,c:0,f:0});
  return Object.fromEntries(Object.entries(total).map(([key,value])=>[key,Math.round(value*10)/10]));
}

function scaleMealFoods(template,targetKcal){
  const baseFoods=template.map(([foodId,quantity])=>({foodId,quantity}));
  const baseKcal=calculateMealNutrition(baseFoods).kcal||targetKcal;
  const factor=Math.max(.5,Math.min(2,targetKcal/baseKcal));
  return baseFoods.map(item=>{
    const food=catalogById(foodCatalog,item.foodId);
    const raw=item.quantity*factor;
    const quantity=['g','ml'].includes(food?.unit)?Math.max(5,Math.round(raw/5)*5):Math.max(.5,Math.round(raw*2)/2);
    return{foodId:item.foodId,quantity};
  });
}

export function formatMealIngredients(foods=[]){
  return foods.map(item=>{
    const food=catalogById(foodCatalog,item.foodId);
    if(!food)return'';
    const quantity=Number(item.quantity);
    const unit=food.unit==='unidad'&&quantity!==1?'unidades':food.unit==='rebanada'&&quantity!==1?'rebanadas':food.unit;
    return`${quantity} ${unit} de ${food.name}`;
  }).filter(Boolean).join(', ');
}

export function buildNutritionWeek(targets, answers = {}) {
  const count = Math.max(3, Math.min(5, Number(answers.mealCount) || 4));
  const distribution = count === 3 ? [.25, .4, .35] : count === 5 ? [.2, .3, .15, .25, .1] : [.23, .34, .16, .27];
  const slots = count === 3 ? ['Desayuno', 'Almuerzo', 'Cena'] : count === 5 ? ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Colación'] : ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
  return days.map((day, dayIndex) => ({ day, meals: distribution.map((share, index) => {
    const slot=slots[index], compatible=mealPresetsForSlot(slot);
    const preset=compatible[(dayIndex+index)%compatible.length];
    const foods=scaleMealFoods(preset.foods,targets.calories*share);
    const ingredients=formatMealIngredients(foods);
    return { id: `${dayIndex}-${index}`, slot, presetId:preset.id, mealGroup:preset.group, name:preset.name, ...calculateMealNutrition(foods), foods, ingredients, steps:`${preset.steps} Cantidades para esta porción: ${ingredients}.`, img:preset.img, visualIndex:preset.visualIndex };
  }) }));
}

export function scoreAssessment(answers = {}) {
  const sleep = { under6: -8, '6to7': -3, '7to8': 5, over8: 4 }[answers.sleep] || 0;
  const experience = { beginner: -4, novice: 0, intermediate: 6, advanced: 10 }[answers.experience] || 0;
  const activity = { low: -4, light: 0, moderate: 5, high: 8 }[answers.activity] || 0;
  return { Intelecto: 48, Carisma: 46, Rendimiento: 50 + sleep, Físico: 48 + experience + activity };
}
