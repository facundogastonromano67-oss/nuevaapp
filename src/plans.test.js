import { describe, expect, it } from 'vitest';
import { assessmentQuestions } from './assessment.js';
import { buildNutritionWeek, buildTrainingPlan, calculateNutritionTargets } from './engines.js';

describe('evaluación guiada', () => {
  it('contiene exactamente 30 preguntas con opciones', () => {
    expect(assessmentQuestions).toHaveLength(30);
    expect(assessmentQuestions.every(question => question.options.length >= 2)).toBe(true);
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
