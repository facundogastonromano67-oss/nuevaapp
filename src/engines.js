import { exerciseCatalog, foodCatalog, habitCatalog, catalogById } from './catalogs.js';
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

export function generateDailyHabits(state, date = new Date()) {
  const dateKey = localDateKey(date), seed = dateSeed(dateKey);
  const groups = [
    ['steps', 'cardio', 'mobility', 'posture'],
    ['focus', 'meditation', 'reading', 'learning', 'journal'],
    ['priorities', 'plan-day', 'project', 'no-phone', 'tidy'],
    ['vegetables', 'fruit', 'protein', 'meal-prep', 'conversation', 'listen'],
  ];
  const catalogIds = ['sleep', 'water', ...groups.map((group, index) => group[(seed + index * 2) % group.length])];
  const generated = catalogIds.map(id => catalogById(habitCatalog, id)).filter(Boolean).map(item => ({
    id: `daily-${dateKey}-${item.id}`, catalogId: item.id, category: item.category, emoji: item.emoji,
    name: item.name, target: item.target, baseline: 'Asignado hoy', active: true, done: false, custom: false, daily: true, dateKey,
  }));
  const training = trainingForDate(state, date);
  if (training) generated.push({
    id: `daily-${dateKey}-training`, catalogId: 'daily-training', category: 'Entrenamiento', emoji: '🏋️',
    name: 'Completar rutina de entrenamiento', target: training.title, baseline: 'Asignado hoy', active: true, done: false, custom: false, daily: true, dateKey,
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
  const base=catalogExercise?{name:catalogExercise.name,target:`${catalogExercise.muscle} · ${catalogExercise.type==='isolation'?'aislamiento':'trabajo principal'}`,tech:catalogExercise.tech,img:catalogExercise.img}:{...legacy};
  const reps=['strength','heavy-duty'].includes(routineType)?template.reps:(catalogExercise?.defaultReps||template.reps);
  const sets=Math.max(1,setsOverride||template.sets);
  const rest=exerciseRestSeconds(resolvedId,routineType);
  return{id:resolvedId,...base,sets,reps,rest,setData:Array.from({length:sets},()=>({kg:0,reps,rpe:7,done:false})),notes:''};
}

const makeExercise = (id, template) => {
  const routineType=Object.keys(routineTemplates).find(key=>routineTemplates[key]===template)||'full-body';
  return createWorkoutExercise(id,routineType,template.sets);
};

export function buildTrainingPlan(answers = {}) {
  const template = routineTemplates[answers.routineType] || routineTemplates['full-body'];
  const wanted = Array.isArray(answers.trainingDays) ? answers.trainingDays : [];
  const frequency = Math.max(3, Number(answers.weeklyFrequency) || wanted.length || 3);
  const selected = (wanted.length ? wanted : days.filter((_, index) => [0, 2, 4, 5].includes(index))).slice(0, frequency);
  let workoutIndex = 0;
  return days.map(day => {
    const enabled = selected.includes(day);
    const split = template.splits[workoutIndex % template.splits.length];
    const entry = { day, enabled, title: enabled ? `${template.label} · Sesión ${workoutIndex + 1}` : 'Recuperación', exercises: enabled ? split.map(id => makeExercise(id, template)) : [] };
    if (enabled) workoutIndex++;
    return entry;
  });
}

const mealPool = [
  ['Avena proteica con banana', 'Avena, yogur, banana y canela', 'Mezclá la avena con yogur y terminá con banana.', 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=80'],
  ['Huevos, tostadas y fruta', 'Huevos, pan integral, tomate y fruta', 'Cociná los huevos y servilos sobre tostadas con tomate.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80'],
  ['Bowl de pollo y arroz', 'Pollo, arroz, brócoli, zanahoria y oliva', 'Dorá el pollo, cociná el arroz y sumá vegetales.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'],
  ['Carne magra con papa', 'Carne magra, papa, ensalada y oliva', 'Horneá las papas, cociná la carne y acompañá con ensalada.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'],
  ['Yogur con frutos rojos', 'Yogur, frutos rojos, avena y semillas', 'Mezclá todo y conservá frío hasta comer.', 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80'],
  ['Sándwich proteico', 'Pan integral, huevo o pollo, hojas verdes y tomate', 'Armá el sándwich y tostalo si lo preferís.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80'],
  ['Salmón con batata', 'Salmón, batata, hojas verdes y limón', 'Horneá batata y salmón; serví con verdes.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80'],
  ['Pasta con pollo y vegetales', 'Pasta, pollo, tomate y vegetales', 'Cociná la pasta, salteá el resto y combiná.', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80'],
  ['Fruta y yogur', 'Fruta de estación y yogur', 'Lavá, cortá y serví con yogur.', 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80'],
];

const mealFoodTemplates=[
  [['oats',50],['greek-yogurt',200],['banana',1],['whey',1]],
  [['egg',2],['bread',2],['tomato',100],['banana',1]],
  [['chicken',150],['rice',200],['broccoli',100],['olive-oil',.5]],
  [['beef',150],['potato',250],['greens',100],['olive-oil',.5]],
  [['greek-yogurt',250],['berries',100],['oats',30]],
  [['bread',2],['chicken',100],['greens',50],['tomato',100]],
  [['salmon',160],['sweet-potato',250],['greens',100]],
  [['pasta',200],['chicken',130],['tomato',100]],
  [['apple',1],['greek-yogurt',200]],
];

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
  return baseFoods.map(item=>({foodId:item.foodId,quantity:Math.round(item.quantity*factor*10)/10}));
}

export function buildNutritionWeek(targets, answers = {}) {
  const count = Math.max(3, Math.min(5, Number(answers.mealCount) || 4));
  const distribution = count === 3 ? [.25, .4, .35] : count === 5 ? [.2, .3, .15, .25, .1] : [.23, .34, .16, .27];
  return days.map((day, dayIndex) => ({ day, meals: distribution.map((share, index) => {
    const poolIndex=(dayIndex*2+index)%mealPool.length;
    const [name, ingredients, steps, img] = mealPool[poolIndex];
    const slots = count === 3 ? ['Desayuno', 'Almuerzo', 'Cena'] : count === 5 ? ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Colación'] : ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
    const foods=scaleMealFoods(mealFoodTemplates[poolIndex],targets.calories*share);
    return { id: `${dayIndex}-${index}`, slot: slots[index], name, ...calculateMealNutrition(foods), foods, ingredients, steps, img };
  }) }));
}

export function scoreAssessment(answers = {}) {
  const sleep = { under6: -8, '6to7': -3, '7to8': 5, over8: 4 }[answers.sleep] || 0;
  const experience = { beginner: -4, novice: 0, intermediate: 6, advanced: 10 }[answers.experience] || 0;
  const activity = { low: -4, light: 0, moderate: 5, high: 8 }[answers.activity] || 0;
  return { Intelecto: 48, Carisma: 46, Rendimiento: 50 + sleep, Físico: 48 + experience + activity };
}
