const option = (value, label = value) => ({ value, label });

export const assessmentQuestions = [
  { id: 'sex', section: 'Tu realidad', text: '¿Qué referencia biológica usamos para estimar tu metabolismo?', options: [option('male', 'Masculina'), option('female', 'Femenina')] },
  { id: 'occupation', section: 'Tu realidad', text: '¿A qué te dedicás la mayor parte del día?', options: [option('office', 'Trabajo de oficina o estudio'), option('standing', 'Trabajo de pie'), option('physical', 'Trabajo físico'), option('mixed', 'Actividad mixta')] },
  { id: 'schedule', section: 'Tu realidad', text: '¿Cómo son normalmente tus horarios?', options: [option('fixed', 'Fijos'), option('rotating', 'Rotativos'), option('flexible', 'Flexibles'), option('night', 'Principalmente nocturnos')] },
  { id: 'activity', section: 'Tu realidad', text: 'Fuera del entrenamiento, ¿cuánto te movés?', options: [option('low', 'Muy poco'), option('light', 'Algo durante el día'), option('moderate', 'Bastante'), option('high', 'Trabajo o actividad física intensa')] },
  { id: 'goal', section: 'Objetivo', text: '¿Cuál es tu objetivo físico principal?', options: [option('fat-loss', 'Perder grasa'), option('muscle', 'Ganar músculo'), option('strength', 'Ganar fuerza'), option('performance', 'Mejorar rendimiento general')] },
  { id: 'pace', section: 'Objetivo', text: '¿Qué ritmo querés priorizar?', options: [option('sustainable', 'Sostenible y progresivo'), option('balanced', 'Equilibrado'), option('demanding', 'Exigente, con seguimiento cercano')] },
  { id: 'experience', section: 'Entrenamiento', text: '¿Qué experiencia tenés entrenando con una rutina?', options: [option('beginner', 'Menos de 6 meses'), option('novice', '6 a 18 meses'), option('intermediate', '1,5 a 3 años'), option('advanced', 'Más de 3 años')] },
  { id: 'routineType', section: 'Entrenamiento', text: '¿Qué tipo de rutina querés seguir?', options: [option('heavy-duty', 'Heavy Duty'), option('hypertrophy', 'Hipertrofia'), option('strength', 'Fuerza'), option('full-body', 'Full Body')] },
  { id: 'trainingDays', section: 'Entrenamiento', text: '¿Qué días podés entrenar?', multi: true, options: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(x => option(x)) },
  { id: 'weeklyFrequency', section: 'Entrenamiento', text: '¿Cuántas sesiones podés sostener todas las semanas?', options: [3,4,5,6].map(x => option(String(x), `${x} días`)) },
  { id: 'duration', section: 'Entrenamiento', text: '¿Cuánto tiempo real tenés por sesión?', options: [option('35', '35 minutos'), option('50', '50 minutos'), option('65', '65 minutos'), option('80', '80 minutos')] },
  { id: 'venue', section: 'Entrenamiento', text: '¿Dónde vas a entrenar principalmente?', options: [option('gym', 'Gimnasio'), option('home', 'Casa'), option('outdoors', 'Aire libre'), option('mixed', 'Combinado')] },
  { id: 'equipment', section: 'Entrenamiento', text: '¿Con qué equipamiento contás?', options: [option('full', 'Gimnasio completo'), option('basic', 'Mancuernas y banco'), option('bands', 'Bandas y peso corporal'), option('bodyweight', 'Sólo peso corporal')] },
  { id: 'exerciseLikes', section: 'Entrenamiento', text: '¿Qué movimientos querés que aparezcan?', multi: true, options: ['Sentadilla','Peso muerto','Press de banca','Dominadas','Remo','Press militar','Brazos','Core'].map(x => option(x)) },
  { id: 'exerciseAvoids', section: 'Entrenamiento', text: '¿Qué movimientos preferís evitar?', multi: true, options: ['Ninguno','Sentadilla','Peso muerto','Press de banca','Dominadas','Impacto o saltos'].map(x => option(x)) },
  { id: 'limitations', section: 'Entrenamiento', text: '¿Tenés una limitación que deba condicionar la propuesta?', options: [option('none', 'Ninguna conocida'), option('knee', 'Rodilla'), option('back', 'Espalda'), option('shoulder', 'Hombro'), option('medical', 'Otra indicación profesional')] },
  { id: 'cardio', section: 'Entrenamiento', text: '¿Qué cardio aceptarías hacer?', options: [option('walk', 'Caminata'), option('bike', 'Bicicleta'), option('run', 'Carrera'), option('intervals', 'Intervalos breves'), option('none', 'No quiero cardio por ahora')] },
  { id: 'effort', section: 'Entrenamiento', text: '¿Cómo preferís distribuir el esfuerzo?', options: [option('short-hard', 'Sesiones cortas e intensas'), option('balanced', 'Esfuerzo equilibrado'), option('volume', 'Más volumen con intensidad moderada')] },
  { id: 'pushupExpectation', section: 'Pruebas', text: '¿Qué versión de flexiones podés probar con seguridad?', options: [option('wall', 'Contra la pared'), option('knees', 'Con rodillas apoyadas'), option('standard', 'Flexión estándar'), option('skip', 'No puedo realizarla ahora')] },
  { id: 'squatExpectation', section: 'Pruebas', text: '¿Qué versión de sentadilla podés probar con seguridad?', options: [option('chair', 'Sentarse y levantarse de una silla'), option('bodyweight', 'Sentadilla sin peso'), option('loaded', 'Sentadilla con carga'), option('skip', 'No puedo realizarla ahora')] },
  { id: 'plankExpectation', section: 'Pruebas', text: '¿Qué versión de plancha podés probar con seguridad?', options: [option('incline', 'Inclinada'), option('knees', 'Con rodillas apoyadas'), option('standard', 'Plancha estándar'), option('skip', 'No puedo realizarla ahora')] },
  { id: 'sleep', section: 'Recuperación', text: '¿Cuántas horas dormís habitualmente?', options: [option('under6', 'Menos de 6'), option('6to7', 'Entre 6 y 7'), option('7to8', 'Entre 7 y 8'), option('over8', 'Más de 8')] },
  { id: 'dietStyle', section: 'Alimentación', text: '¿Qué estilo de alimentación querés usar como base?', options: [option('omnivore', 'Omnívora'), option('mediterranean', 'Mediterránea'), option('vegetarian', 'Vegetariana'), option('simple', 'Simple y práctica')] },
  { id: 'mealCount', section: 'Alimentación', text: '¿Cuántas comidas te resulta cómodo hacer?', options: [3,4,5].map(x => option(String(x), `${x} comidas`)) },
  { id: 'proteins', section: 'Alimentación', text: '¿Qué proteínas querés incluir?', multi: true, options: ['Pollo','Carne vacuna','Pescado','Huevos','Lácteos','Legumbres','Tofu'].map(x => option(x)) },
  { id: 'carbs', section: 'Alimentación', text: '¿Qué fuentes de energía preferís?', multi: true, options: ['Arroz','Papa o batata','Avena','Pan integral','Pasta','Legumbres','Fruta'].map(x => option(x)) },
  { id: 'produce', section: 'Alimentación', text: '¿Qué vegetales o frutas comés con gusto?', multi: true, options: ['Hojas verdes','Tomate','Zanahoria','Brócoli','Calabaza','Banana','Frutos rojos','Cítricos'].map(x => option(x)) },
  { id: 'dislikes', section: 'Alimentación', text: '¿Qué grupo preferís que no aparezca?', options: [option('none', 'Ninguno'), option('fish', 'Pescado'), option('dairy', 'Lácteos'), option('legumes', 'Legumbres'), option('vegetables', 'Verduras cocidas')] },
  { id: 'exclusions', section: 'Alimentación', text: '¿Hay una exclusión que debamos respetar?', options: [option('none', 'Ninguna'), option('gluten', 'Sin gluten'), option('lactose', 'Sin lactosa'), option('nuts', 'Sin frutos secos'), option('professional', 'Tengo indicaciones profesionales específicas')] },
  { id: 'intellect', section: 'Intelecto', text: '¿Qué tipo de desafío intelectual querés recibir primero?', options: [option('logic', 'Lógica y patrones'), option('memory', 'Memoria'), option('focus', 'Atención y foco'), option('planning', 'Planificación y decisiones'), option('learning', 'Aprendizaje y adaptación')] },
];

export function answersFromForm(form) {
  const data = new FormData(form);
  return Object.fromEntries(assessmentQuestions.map(question => {
    const values = data.getAll(question.id);
    return [question.id, question.multi ? values : (values[0] || '')];
  }));
}

export function assessmentIsComplete(answers) {
  return validateAssessment(answers).valid;
}

export function validateAssessment(answers) {
  const missing = assessmentQuestions.filter(question => question.multi
    ? !Array.isArray(answers[question.id]) || answers[question.id].length === 0
    : !answers[question.id]);
  const selectedDays = Array.isArray(answers.trainingDays) ? answers.trainingDays.length : 0;
  const weeklyFrequency = Number(answers.weeklyFrequency) || 0;
  const dayMismatch = weeklyFrequency > 0 && selectedDays < weeklyFrequency;
  return { valid: missing.length === 0 && !dayMismatch, missing, selectedDays, weeklyFrequency, dayMismatch };
}
