export const stageForDay = day => day <= 7 ? 'Diagnóstico y orden' : day <= 15 ? 'Construcción' : day <= 23 ? 'Intensificación' : 'Consolidación';

export function levelFromXp(xp) {
  let level = 1, need = 500, left = xp;
  while (left >= need) { left -= need; level++; need = Math.round(need * 1.18); }
  return { level, current: left, need, percent: Math.round(left / need * 100) };
}

export function rank(score) {
  return score >= 90 ? 'Trascendente' : score >= 75 ? 'Élite' : score >= 60 ? 'Avanzado' : score >= 40 ? 'Competente' : score >= 20 ? 'Aprendiz' : 'Novato';
}

export function generateMissions(state) {
  const weak = [...state.skills].sort((a, b) => a.score - b.score).slice(0, 3);
  const templates = [
    skill => ({ title: `Entrená ${skill.name}`, detail: `15 minutos de práctica deliberada · evidencia para ${skill.name}`, xp: 80 }),
    skill => ({ title: 'Bloque sin distracciones', detail: `25 minutos sobre tu prioridad · refuerza ${skill.name}`, xp: 70 }),
    skill => ({ title: 'Cierre del Sistema', detail: `Registrá un aprendizaje y el próximo paso · refuerza ${skill.name}`, xp: 60 }),
  ];
  return weak.map((skill, index) => ({ id: crypto.randomUUID(), ...templates[index](skill), status: 'open' }));
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

const makeExercise = (id, template) => {
  const base = exerciseLibrary[id] || exerciseLibrary.squat;
  return { id, ...base, sets: template.sets, reps: template.reps, rest: template.rest, setData: Array.from({ length: template.sets }, () => ({ kg: 0, reps: template.reps, rpe: 7, done: false })), notes: '' };
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

export function buildNutritionWeek(targets, answers = {}) {
  const count = Math.max(3, Math.min(5, Number(answers.mealCount) || 4));
  const distribution = count === 3 ? [.25, .4, .35] : count === 5 ? [.2, .3, .15, .25, .1] : [.23, .34, .16, .27];
  return days.map((day, dayIndex) => ({ day, meals: distribution.map((share, index) => {
    const [name, ingredients, steps, img] = mealPool[(dayIndex * 2 + index) % mealPool.length];
    const slots = count === 3 ? ['Desayuno', 'Almuerzo', 'Cena'] : count === 5 ? ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Colación'] : ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
    return { id: `${dayIndex}-${index}`, slot: slots[index], name, kcal: Math.round(targets.calories * share / 10) * 10, p: Math.round(targets.protein * share), c: Math.round(targets.carbs * share), f: Math.round(targets.fat * share), ingredients, steps, img };
  }) }));
}

export function scoreAssessment(answers = {}) {
  const sleep = { under6: -8, '6to7': -3, '7to8': 5, over8: 4 }[answers.sleep] || 0;
  const experience = { beginner: -4, novice: 0, intermediate: 6, advanced: 10 }[answers.experience] || 0;
  const activity = { low: -4, light: 0, moderate: 5, high: 8 }[answers.activity] || 0;
  return { Intelecto: 48, Carisma: 46, Rendimiento: 50 + sleep, Físico: 48 + experience + activity };
}
