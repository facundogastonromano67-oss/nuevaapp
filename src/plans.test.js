import { describe, expect, it } from 'vitest';
import { assessmentQuestions } from './assessment.js';
import { attributeForActivity, buildHabitSchedule, buildIntellectAssessment, buildNutritionWeek, buildTrainingDay, buildTrainingPlan, calculateFoodNutrition, calculateHardcorePenalty, calculateMealNutrition, calculateNutritionTargets, createArenaBattle, createDailyAssignment, createWorkoutExercise, effortProgression, exerciseRestSeconds, formatMealIngredients, generateDailyHabits, generateDailyMissions, localDateKey, repetitionProgression, resolveArenaTurn, scoreIntellectAssessment, sportScheduleFromAnswers, transactXp } from './engines.js';
import { exerciseCatalog, foodCatalog, habitCatalog, mealPresetCatalog } from './catalogs.js';
import { intellectRoutes } from './data.js';

describe('evaluación guiada', () => {
  it('incluye hábitos dentro del cuestionario guiado', () => {
    expect(assessmentQuestions).toHaveLength(36);
    expect(assessmentQuestions.every(question => question.options.length >= 2)).toBe(true);
    expect(assessmentQuestions.find(question => question.id === 'dailyHabits')).toMatchObject({ multi: true });
    expect(assessmentQuestions.find(question => question.id === 'planMode')?.options.map(option => option.value)).toEqual(['normal', 'hardcore']);
  });

  it('evalúa las cinco habilidades y adapta dos preguntas a la ruta elegida', () => {
    const skillNames = ['Foco profundo', 'Pensamiento crítico', 'Memoria', 'Aprendizaje', 'Planificación'];
    for (const route of Object.keys(intellectRoutes)) {
      const questions = buildIntellectAssessment(route);
      expect(questions).toHaveLength(12);
      expect(new Set(questions.map(question => question.skill))).toEqual(new Set(skillNames));
      expect(questions.filter(question => question.skill === intellectRoutes[route].skill)).toHaveLength(4);
    }
    expect(buildIntellectAssessment('logic').map(question => question.id)).not.toEqual(buildIntellectAssessment('memory').map(question => question.id));
  });

  it('genera resultados separados por habilidad', () => {
    const questions = buildIntellectAssessment('memory');
    const answers = Object.fromEntries(questions.map(question => [question.id, 1]));
    const report = scoreIntellectAssessment(answers, 'memory');
    expect(report).toMatchObject({ totalCorrect: 12, totalQuestions: 12, routeSkill: 'Memoria' });
    expect(report.results.Memoria).toMatchObject({ correct: 4, total: 4, score: 100 });
    expect(report.results.Planificación).toMatchObject({ correct: 2, total: 2, score: 100 });
  });
});

describe('experiencia y contrato del plan', () => {
  it('entrega XP una sola vez, revierte al desmarcar y permite volver a completar', () => {
    const first = transactXp(100, [], { key: 'mission-1', amount: 80, at: 1 });
    expect(first).toMatchObject({ xp: 180, delta: 80, applied: true });
    expect(transactXp(first.xp, first.ledger, { key: 'mission-1', amount: 80, at: 2 })).toMatchObject({ xp: 180, delta: 0, applied: false });
    const reversed = transactXp(first.xp, first.ledger, { key: 'mission-1', amount: 80, reverse: true, at: 3 });
    expect(reversed).toMatchObject({ xp: 100, delta: -80, applied: true });
    expect(transactXp(reversed.xp, reversed.ledger, { key: 'mission-1', amount: 80, at: 4 })).toMatchObject({ xp: 180, delta: 80, applied: true });
  });

  it('calcula los incumplimientos Hardcore y no penaliza el plan Normal', () => {
    const state = {
      plan: { mode: 'hardcore', status: 'active', penaltyHistory: [] },
      missions: [{ id: 'm1', dateKey: '2026-08-10', title: 'Misión', xp: 80, status: 'open' }],
      habits: [{ id: 'h1', name: 'Agua', done: false }, { id: 'training', catalogId: 'daily-training', name: 'Rutina', done: false }],
      daily: { dateKey: '2026-08-10', dayName: 'Lunes', hasTraining: true, trainingTitle: 'Fuerza' },
      training: { history: [] },
      nutrition: { done: [], weeklyPlan: [{ day: 'Lunes', meals: [{ id: 'food-1', slot: 'Almuerzo', name: 'Pollo' }, { id: 'food-2', slot: 'Cena', name: 'Pescado' }] }] },
    };
    expect(calculateHardcorePenalty(state).total).toBe(179);
    expect(calculateHardcorePenalty({ ...state, plan: { ...state.plan, mode: 'normal' } }).total).toBe(0);
  });

  it('considera el deporte al evaluar la actividad diaria Hardcore', () => {
    const state = {
      plan: { mode: 'hardcore', status: 'active', penaltyHistory: [] }, missions: [], habits: [],
      daily: { dateKey: '2026-08-12', dayName: 'Miércoles', hasTraining: true },
      training: { history: [], sportHistory: [{ dateKey: '2026-08-12', day: 'Miércoles' }], weeklyPlan: [{ day: 'Miércoles', enabled: false, sport: { name: 'Fútbol' } }] },
      nutrition: { done: [], weeklyPlan: [] },
    };
    expect(calculateHardcorePenalty(state).total).toBe(0);
    state.training.sportHistory = [];
    expect(calculateHardcorePenalty(state).total).toBe(100);
  });
});

describe('bibliotecas de personalización', () => {
  it('ofrece listas extensas y organizadas', () => {
    expect(habitCatalog.length).toBeGreaterThanOrEqual(35);
    expect(exerciseCatalog.length).toBeGreaterThanOrEqual(35);
    expect(foodCatalog.length).toBeGreaterThanOrEqual(30);
  });

  it('calcula dos huevos como 12 g de proteína', () => {
    expect(calculateFoodNutrition('egg', 2)).toMatchObject({ kcal: 140, p: 12 });
  });

  it('suma automáticamente los alimentos de una comida', () => {
    expect(calculateMealNutrition([{ foodId: 'egg', quantity: 2 }, { foodId: 'bread', quantity: 2 }])).toMatchObject({ kcal: 300, p: 20 });
  });

  it('acepta ingredientes propios y recetas de milanesa', () => {
    const custom={custom:true,foodId:'custom-milanesa',name:'Milanesa casera',unit:'g',baseAmount:100,quantity:180,kcal:230,p:20,c:12,f:11};
    expect(calculateMealNutrition([custom])).toMatchObject({kcal:414,p:36});
    expect(formatMealIngredients([custom])).toContain('180 g de Milanesa casera');
    expect(mealPresetCatalog.some(meal=>meal.name.includes('Milanesa'))).toBe(true);
  });

  it('asigna cada actividad a su XP de atributo',()=>{
    expect(attributeForActivity('mission','Intelecto','')).toBe('Intelecto');
    expect(attributeForActivity('habit','Social','Conversación')).toBe('Carisma');
    expect(attributeForActivity('training','','')).toBe('Físico');
    expect(attributeForActivity('mission','Vida diaria','Prioridad terminada')).toBe('Rendimiento');
  });

  it('adapta el descanso al método y al tipo de ejercicio', () => {
    expect(exerciseRestSeconds('bench-press', 'strength')).toBe(180);
    expect(exerciseRestSeconds('lateral-raise', 'hypertrophy')).toBe(60);
    const strengthPress=createWorkoutExercise('bench-press', 'strength');
    expect(strengthPress).toMatchObject({ sets: 3, reps: 7, rest: 180 });
    expect(strengthPress.setData.map(set=>set.reps)).toEqual([7,6,5]);
    expect(strengthPress.setData.map(set=>set.rpe)).toEqual([7,8,9]);
    expect(repetitionProgression(7,4,'strength')).toEqual([7,6,5,4]);
    expect(effortProgression(2,'heavy-duty')).toEqual([9,10]);
    expect(createWorkoutExercise('bench-press','strength',9).setData).toHaveLength(5);
  });
});

describe('asignación diaria', () => {
  const dailyState = {
    skills: [
      { name: 'Foco profundo', score: 30 }, { name: 'Planificación', score: 35 }, { name: 'Memoria', score: 40 },
    ],
    habits: [{ id: 'custom-1', name: 'Mi hábito', target: '10 min', custom: true, done: true }],
    training: {
      settings: { duration: 50 },
      weeklyPlan: [
        { day: 'Lunes', enabled: true, title: 'Fuerza · Sesión 1', exercises: [{}, {}, {}] },
        { day: 'Martes', enabled: false, title: 'Descanso', exercises: [] },
      ],
    },
  };
  const monday = new Date(2026, 7, 10, 12);
  const tuesday = new Date(2026, 7, 11, 12);

  it('cambia misiones y hábitos cuando cambia la fecha local', () => {
    expect(localDateKey(monday)).toBe('2026-08-10');
    expect(localDateKey(tuesday)).toBe('2026-08-11');
    expect(generateDailyMissions(dailyState, monday).map(item => item.id)).not.toEqual(generateDailyMissions(dailyState, tuesday).map(item => item.id));
    expect(generateDailyHabits(dailyState, monday).map(item => item.catalogId)).not.toEqual(generateDailyHabits(dailyState, tuesday).map(item => item.catalogId));
  });

  it('agrega la rutina sólo en días con entrenamiento y conserva hábitos personalizados', () => {
    const trainingDay = createDailyAssignment(dailyState, monday);
    const restDay = createDailyAssignment(dailyState, tuesday);
    expect(trainingDay.hasTraining).toBe(true);
    expect(trainingDay.habits.some(habit => habit.catalogId === 'daily-training')).toBe(true);
    expect(restDay.hasTraining).toBe(false);
    expect(restDay.habits.some(habit => habit.catalogId === 'daily-training')).toBe(false);
    expect(trainingDay.habits.find(habit => habit.id === 'custom-1').done).toBe(false);
  });

  it('usa como base los hábitos elegidos durante la evaluación', () => {
    const selectedState = { ...dailyState, onboardingAnswers: { dailyHabits: ['water', 'reading', 'journal'] } };
    const assignment = createDailyAssignment(selectedState, tuesday);
    expect(assignment.habits.filter(habit => !habit.custom).map(habit => habit.catalogId)).toContain('water');
    expect(assignment.habits.filter(habit => !habit.custom).length).toBeGreaterThanOrEqual(3);
  });

  it('mantiene hábitos base y rota el resto según día y etapa G30', () => {
    const selectedState = { ...dailyState, g30: { day: 9 }, onboardingAnswers: { dailyHabits: ['sleep', 'water', 'steps', 'focus', 'reading', 'vegetables'] } };
    const schedule = buildHabitSchedule(selectedState);
    expect(schedule).toHaveLength(7);
    expect(schedule.every(day => day.habitIds.includes('sleep') && day.habitIds.includes('water'))).toBe(true);
    expect(new Set(schedule.map(day => day.habitIds.join('|'))).size).toBeGreaterThan(1);
    expect(schedule.every(day => day.stage === 'Construcción')).toBe(true);
  });
});

describe('generación de planes', () => {
  const answers = {
    sex: 'male', activity: 'moderate', goal: 'muscle', routineType: 'hypertrophy',
    trainingDays: ['Lunes', 'Miércoles', 'Viernes', 'Sábado'], weeklyFrequency: '4', mealCount: '4',
  };

  it('calcula calorías y macros desde datos objetivos', () => {
    const targets = calculateNutritionTargets({ age: 30, height: 178, weight: 82 }, answers);
    expect(targets.calories).toBeGreaterThan(2000);
    expect(targets.protein).toBeGreaterThan(140);
    expect(targets.carbs).toBeGreaterThan(80);
  });

  it('arma una semana de entrenamiento según días y método', () => {
    const plan = buildTrainingPlan(answers);
    expect(plan).toHaveLength(7);
    expect(plan.filter(day => day.enabled)).toHaveLength(4);
    expect(plan.find(day => day.day === 'Lunes').title).toContain('Hipertrofia');
    expect(plan.filter(day => day.enabled).map(day => day.split)).toEqual(['upper', 'lower', 'upper', 'lower']);
    expect(buildTrainingDay('strength', 'lower').every(exercise => ['Piernas', 'Core'].includes(exerciseCatalog.find(item => item.id === exercise.id).muscle))).toBe(true);
    const upper=buildTrainingDay('hypertrophy','upper');
    expect(upper.slice(0,2).map(exercise=>exercise.id)).toEqual(['bench-press','dumbbell-press']);
    expect(upper.every(exercise=>exercise.setData.length===3)).toBe(true);
  });

  it('integra tres días de fútbol y adapta el gimnasio',()=>{
    const football={...answers,sportType:'football',sportDays:['Martes','Jueves','Sábado'],sportIntensity:'high',sportCombination:'separate'};
    const separated=buildTrainingPlan(football);
    expect(sportScheduleFromAnswers(football)).toHaveLength(3);
    expect(separated.filter(day=>day.enabled&&day.sport)).toHaveLength(0);
    expect(separated.find(day=>day.day==='Martes').sport.name).toBe('Fútbol');
    const combined=buildTrainingPlan({...football,trainingDays:['Martes','Jueves','Sábado'],weeklyFrequency:'3',sportCombination:'same-day'});
    expect(combined.filter(day=>day.enabled&&day.sport)).toHaveLength(3);
    expect(combined.find(day=>day.day==='Jueves').split).toBe('lower');
    expect(combined.find(day=>day.day==='Jueves').exercises.every(exercise=>exercise.setData.length<=2)).toBe(true);
    expect(buildTrainingPlan({...football,weeklyFrequency:'2',sportCombination:'adaptive'}).filter(day=>day.enabled)).toHaveLength(2);
  });

  it('arma siete días de alimentación dentro del objetivo', () => {
    const targets = calculateNutritionTargets({ age: 30, height: 178, weight: 82 }, answers);
    const week = buildNutritionWeek(targets, answers);
    expect(week).toHaveLength(7);
    expect(week.every(day => day.meals.length === 4)).toBe(true);
    expect(week[0].meals.reduce((sum, meal) => sum + meal.kcal, 0)).toBeCloseTo(targets.calories, -1);
    expect(week.every(day => day.meals.every(meal => mealPresetCatalog.find(preset => preset.id === meal.presetId).allowedSlots.includes(meal.slot)))).toBe(true);
    expect(formatMealIngredients([{ foodId: 'egg', quantity: 2 }])).toContain('2 unidades de Huevo');
  });
});

describe('Arena por rondas', () => {
  it('crea tres boosts funcionales y permite usarlos con una habilidad', () => {
    const state = { arena: { rating: 1000 } };
    const battle = createArenaBattle(state, 'system', .3);
    battle.boosts[0].unlocked = true;
    const next = resolveArenaTurn(battle, { name: 'Corte umbral', power: 20 }, 'fury', 1);
    expect(next.boosts).toHaveLength(3);
    expect(next.boosts[0].used).toBe(true);
    expect(next.enemyHp).toBeLessThan(100);
    expect(createArenaBattle(state, 'dungeon')).toBe(null);
  });
});
