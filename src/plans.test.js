import { describe, expect, it } from 'vitest';
import { assessmentQuestions } from './assessment.js';
import { buildIntellectAssessment, buildNutritionWeek, buildTrainingPlan, calculateFoodNutrition, calculateMealNutrition, calculateNutritionTargets, createDailyAssignment, createWorkoutExercise, exerciseRestSeconds, generateDailyHabits, generateDailyMissions, localDateKey, scoreIntellectAssessment } from './engines.js';
import { exerciseCatalog, foodCatalog, habitCatalog } from './catalogs.js';
import { intellectRoutes } from './data.js';

describe('evaluación guiada', () => {
  it('contiene exactamente 30 preguntas con opciones', () => {
    expect(assessmentQuestions).toHaveLength(30);
    expect(assessmentQuestions.every(question => question.options.length >= 2)).toBe(true);
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

  it('adapta el descanso al método y al tipo de ejercicio', () => {
    expect(exerciseRestSeconds('bench-press', 'strength')).toBe(180);
    expect(exerciseRestSeconds('lateral-raise', 'hypertrophy')).toBe(60);
    expect(createWorkoutExercise('bench-press', 'strength')).toMatchObject({ sets: 5, reps: 5, rest: 180 });
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
  });

  it('arma siete días de alimentación dentro del objetivo', () => {
    const targets = calculateNutritionTargets({ age: 30, height: 178, weight: 82 }, answers);
    const week = buildNutritionWeek(targets, answers);
    expect(week).toHaveLength(7);
    expect(week.every(day => day.meals.length === 4)).toBe(true);
    expect(week[0].meals.reduce((sum, meal) => sum + meal.kcal, 0)).toBeCloseTo(targets.calories, -1);
  });
});
