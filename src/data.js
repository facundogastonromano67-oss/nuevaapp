export const attributes={Intelecto:['Foco profundo','Pensamiento crítico','Memoria','Aprendizaje','Planificación'],Carisma:['Comunicación','Escucha activa','Presencia','Negociación','Liderazgo'],Rendimiento:['Disciplina','Consistencia','Gestión del tiempo','Resiliencia','Ejecución'],Físico:['Fuerza','Resistencia','Movilidad','Composición corporal','Recuperación']};
export const questions=Array.from({length:30},(_,i)=>({id:i+1,text:[...Object.values(attributes).flat(), 'Duermo con horarios regulares','Mantengo energía estable','Cumplo lo que planifico','Gestiono bien el estrés','Reviso mi progreso','Entreno con intención','Como de forma estructurada','Pido feedback','Termino lo que empiezo','Adapto mi plan'][i%30],attr:Object.keys(attributes)[i%4]}));
export const exercises=[
 {id:'squat',name:'Sentadilla goblet',target:'Piernas · fuerza',tech:'Pecho alto, rodillas acompañan la punta de los pies y profundidad controlada.',sets:3,reps:10,rest:75,img:'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80'},
 {id:'row',name:'Remo con mancuerna',target:'Espalda · postura',tech:'Columna neutra, codo hacia la cadera y pausa arriba.',sets:3,reps:12,rest:60,img:'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=80'},
 {id:'press',name:'Press inclinado',target:'Pecho · empuje',tech:'Escápulas estables, antebrazos verticales y bajada lenta.',sets:3,reps:8,rest:90,img:'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80'}];
export const meals=[
 {id:'breakfast',slot:'Desayuno',name:'Yogur proteico con avena y frutos rojos',kcal:480,p:35,c:58,f:12,img:'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80',ingredients:'250 g yogur griego, 50 g avena, 100 g frutos rojos, 15 g nueces',steps:'Mezclá yogur y avena. Sumá fruta y terminá con nueces.'},
 {id:'lunch',slot:'Almuerzo',name:'Bowl de pollo, arroz y vegetales',kcal:690,p:52,c:78,f:18,img:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',ingredients:'180 g pollo, 100 g arroz en crudo, brócoli, zanahoria, oliva',steps:'Cociná el arroz. Dorá el pollo. Salteá vegetales y armá el bowl.'},
 {id:'snack',slot:'Merienda',name:'Tostadas con huevo y palta',kcal:410,p:22,c:38,f:20,img:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',ingredients:'2 tostadas integrales, 2 huevos, 1/2 palta, tomate',steps:'Tostá el pan, cociná los huevos y montá con palta y tomate.'},
 {id:'dinner',slot:'Cena',name:'Salmón con batata y verdes',kcal:620,p:44,c:54,f:25,img:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',ingredients:'180 g salmón, 250 g batata, hojas verdes, limón',steps:'Horneá la batata 30 min. Cociná el salmón 10–12 min y serví con verdes.'}];
export const academy=[
 {id:'training',title:'Entrenamiento desde cero',skill:'Fuerza',library:'training',lessons:[['Cómo leer una rutina','Aprendé a interpretar ejercicios, series, repeticiones, descanso y RPE antes de comenzar. Así podés anticipar la sesión y adaptar el orden si una máquina está ocupada.'],['Heavy Duty sin mitos','Es un enfoque de bajo volumen y esfuerzo alto. Requiere técnica, registro, recuperación suficiente y no convierte el fallo muscular en una obligación para todas las series.'],['Hipertrofia práctica','Para ganar músculo importan la constancia, el volumen semanal tolerable, la cercanía razonable al fallo y una progresión que puedas sostener.'],['Entrenar fuerza','La fuerza prioriza práctica técnica, cargas altas, descansos amplios y series de calidad. No hace falta agotar el músculo para que la sesión sea efectiva.'],['Series, repeticiones y descanso','Las repeticiones pueden caer entre series exigentes. Ajustá carga o repeticiones para conservar técnica y usá descansos acordes al objetivo.'],['Progresión con RIR y RPE','Registrá peso, repeticiones y esfuerzo. Cuando completás el rango con margen y buena técnica, aumentá una sola variable.']]},
 {id:'nutrition',title:'Nutrición aplicable',skill:'Composición corporal',library:'nutrition',lessons:[['Balance energético','El peso cambia por la relación entre energía consumida y gastada a lo largo del tiempo. Las estimaciones iniciales se corrigen con tendencia real, hambre y rendimiento.'],['Déficit calórico sostenible','Un déficit debe permitir adherencia, entrenamiento y suficiente proteína. La velocidad importa: recortes agresivos elevan el riesgo de perder masa magra y rendir peor.'],['Volumen para ganar músculo','Un superávit moderado y una subida de peso controlada suelen limitar la ganancia innecesaria de grasa. Más calorías no significa automáticamente más músculo.'],['Proteína y distribución','Buscá una cantidad diaria suficiente y repartila entre comidas que realmente puedas sostener. La comida cotidiana sigue siendo la base.'],['Cantidades y etiquetas','Pesá o medí ingredientes cuando necesites precisión, diferenciá peso crudo y cocido y verificá la porción declarada en la etiqueta.'],['Recetas y meal prep','Combiná una proteína, un carbohidrato, vegetales y una grasa medida. Cocinar por tandas reduce decisiones sin obligarte a comer siempre lo mismo.']]},
 {id:'discipline',title:'Disciplina sin fricción',skill:'Disciplina',library:'life',lessons:[['Diseñá el entorno','La disciplina sostenible empieza reduciendo decisiones. Dejá visible lo importante, prepará la noche anterior y definí un inicio de dos minutos.'],['Regla del mínimo viable','En días difíciles, protegé la identidad con una versión pequeña del hábito. Consistencia antes que intensidad.'],['Revisión semanal','Medí adherencia, detectá fricción y cambiá una sola variable por semana.']]},
 {id:'communication',title:'Comunicación intencional',skill:'Comunicación',library:'life',lessons:[['Escuchar antes de responder','Reflejar hechos, emoción y necesidad reduce malentendidos antes de proponer soluciones.'],['Mensajes claros','Contexto breve, pedido observable y fecha concreta. Evitá insinuaciones.'],['Conversaciones difíciles','Describí conducta e impacto sin atacar identidad; acordá el próximo paso.']]}];
export const academyImageLibraries={
 training:{src:'./assets/images/academy-training-v1.png',columns:3,rows:2},
 nutrition:{src:'./assets/images/academy-nutrition-v1.png',columns:3,rows:2},
 life:{src:'./assets/images/academy-life-v1.png',columns:3,rows:2},
};
export const academyConcepts=academy.flatMap((course,courseIndex)=>course.lessons.map((lesson,lessonIndex)=>({
  id:`${course.id}-${lessonIndex}`,courseId:course.id,courseTitle:course.title,title:lesson[0],description:lesson[1],library:course.library,imageIndex:lessonIndex,
})));
export const combatSkills=Array.from({length:28},(_,i)=>({id:i+1,name:['Corte umbral','Guardia espectral','Lectura táctica','Pulso de control'][i%4]+' '+(Math.floor(i/4)+1),type:['Ataque','Defensa','Táctica','Control'][i%4],power:8+(i%7)*2,unlocked:i<8}));
export const minigames=['Memoria de runas','Reflejo relámpago','Cálculo veloz','Foco sostenido','Tiro preciso','Decisión táctica','Secuencia sombra','Reacción dual','Patrón oculto','Pulso estable'];
export const avatarPresets = [
  {id:'shadow',emoji:'🥷',name:'Cazador sombra',colors:['#101d30','#376fb3']},
  {id:'monarch',emoji:'👑',name:'Monarca',colors:['#241b35','#8d62dc']},
  {id:'warrior',emoji:'⚔️',name:'Guerrero',colors:['#2a1719','#c14f55']},
  {id:'mage',emoji:'🔮',name:'Mago táctico',colors:['#17152d','#655ad3']},
  {id:'archer',emoji:'🏹',name:'Explorador',colors:['#132820','#3e9a70']},
  {id:'guardian',emoji:'🛡️',name:'Guardián',colors:['#172431','#397eae']},
  {id:'rogue',emoji:'🗡️',name:'Acechador',colors:['#22252a','#727b86']},
  {id:'strategist',emoji:'♟️',name:'Estratega',colors:['#272113','#b78c3d']},
];

const iq = (id, skill, category, prompt, options) => ({
  id, skill, category, prompt,
  options: options.map(([label, correct = false]) => ({ label, value: correct ? 1 : 0 })),
});

export const intellectRoutes = {
  logic: { label: 'Lógica y patrones', skill: 'Pensamiento crítico', emoji: '🧩' },
  memory: { label: 'Memoria', skill: 'Memoria', emoji: '🧠' },
  focus: { label: 'Atención y foco', skill: 'Foco profundo', emoji: '🎯' },
  planning: { label: 'Planificación y decisiones', skill: 'Planificación', emoji: '🗺️' },
  learning: { label: 'Aprendizaje y adaptación', skill: 'Aprendizaje', emoji: '💡' },
};

export const intellectMemoryStimulus = [
  ['LUNA', '4'], ['RÍO', '7'], ['SOL', '2'], ['NUBE', '9'], ['BOSQUE', '5'], ['FARO','8'], ['ROCA','3'], ['VIENTO','6'],
];

export const intellectCoreQuestions = [
  iq('focus-count', 'Foco profundo', 'Atención', 'En 7·2·7·7·2·1·7·2·2·7, ¿cuántas veces aparece un 7 seguido inmediatamente por un 2?', [['2'], ['3', true], ['4']]),
  iq('focus-match', 'Foco profundo', 'Atención', '¿Cuál cadena coincide exactamente con Q7M2-K9R4-T6?', [['Q7M2-K9R4-TG'], ['Q7M2-K9R4-T6', true], ['Q7N2-K9R4-T6']]),
  iq('critical-sequence', 'Pensamiento crítico', 'Pensamiento crítico', 'Completá la regla: 3 · 8 · 18 · 38 · ?', [['68'], ['76'], ['78', true]]),
  iq('critical-logic', 'Pensamiento crítico', 'Pensamiento crítico', 'Ningún informe aprobado tiene errores críticos. Este informe tiene un error crítico. ¿Qué se deduce necesariamente?', [['No fue aprobado', true], ['Fue revisado'], ['Tiene más de un error']]),
  iq('memory-river', 'Memoria', 'Memoria de trabajo', '¿Qué número acompañaba a FARO?', [['6'], ['8', true], ['3']]),
  iq('memory-sun', 'Memoria', 'Memoria de trabajo', '¿Qué palabra acompañaba al número 3?', [['ROCA', true], ['NUBE'], ['VIENTO']]),
  iq('learning-rule', 'Aprendizaje', 'Aprendizaje', 'Regla nueva: primero duplicá el valor y después restá 3. Si la base es 7, ¿cuál es el resultado?', [['10'], ['11', true], ['17']]),
  iq('learning-feedback', 'Aprendizaje', 'Aprendizaje', 'Dos métodos mejoran un resultado, pero fueron probados con dificultades distintas. ¿Qué comparación permite aprender mejor?', [['Elegir el mayor número final'], ['Repetir ambos bajo condiciones equivalentes y medir el cambio', true], ['Usar el método más nuevo']]),
  iq('planning-order', 'Planificación', 'Planificación', 'B depende de A; D depende de B y C. Si A y C pueden hacerse en paralelo, ¿qué secuencia termina antes?', [['A → B → C → D'], ['A y C → B → D', true], ['D → B → A y C']]),
  iq('planning-time', 'Planificación', 'Planificación', 'Tenés 45 minutos. A dura 20, B 15 y C 10; B debe hacerse antes que C. ¿Qué plan completa las tres?', [['A → C → B'], ['B → A → C', true], ['C → B → A']]),
];

export const intellectAdaptiveQuestions = {
  logic: [
    iq('logic-extra-condition', 'Pensamiento crítico', 'Ruta elegida', 'Si entreno, registro datos. Hoy no registré datos. ¿Qué conclusión es válida?', [['No entrené', true], ['Entrené igual'], ['No se puede saber si registré']]),
    iq('logic-extra-ratio', 'Pensamiento crítico', 'Ruta elegida', 'Una receta usa 2 medidas por cada 5 porciones. ¿Cuántas medidas necesita para 15 porciones?', [['5'], ['6', true], ['7']]),
  ],
  memory: [
    iq('memory-extra-moon', 'Memoria', 'Ruta elegida', '¿Qué número acompañaba a LUNA?', [['2'], ['4', true], ['5']]),
    iq('memory-extra-nine', 'Memoria', 'Ruta elegida', '¿Qué palabra acompañaba al número 9?', [['NUBE', true], ['RÍO'], ['BOSQUE']]),
  ],
  focus: [
    iq('focus-extra-target', 'Foco profundo', 'Ruta elegida', 'En 4 · 9 · 4 · 7 · 1 · 4 · 2, ¿en qué posición aparece el tercer 4?', [['Quinta'], ['Sexta', true], ['Séptima']]),
    iq('focus-extra-difference', 'Foco profundo', 'Ruta elegida', 'Encontrá la cadena diferente.', [['B8R5T2'], ['B8R5T2'], ['B8R6T2', true]]),
  ],
  planning: [
    iq('planning-extra-blocker', 'Planificación', 'Ruta elegida', 'Una tarea importante depende de una respuesta externa. ¿Cuál es el mejor primer paso?', [['Esperar sin hacer nada'], ['Pedir la respuesta y avanzar una parte independiente', true], ['Cancelar el objetivo']]),
    iq('planning-extra-priority', 'Planificación', 'Ruta elegida', 'Tenés una tarea urgente de 10 min y una importante de 40 min. Disponés de 50 min. ¿Qué plan protege ambas?', [['Hacer sólo la importante'], ['Resolver la urgente y bloquear 40 min para la importante', true], ['Alternar cada dos minutos']]),
  ],
  learning: [
    iq('learning-extra-transfer', 'Aprendizaje', 'Ruta elegida', 'Aprendiste que dividir un problema reduce errores. ¿Qué demuestra transferencia?', [['Usarlo sólo en el ejercicio original'], ['Aplicarlo a un proyecto nuevo y comparar el resultado', true], ['Memorizar la frase sin usarla']]),
    iq('learning-extra-recall', 'Aprendizaje', 'Ruta elegida', '¿Qué práctica suele comprobar mejor si entendiste una idea?', [['Releerla muchas veces'], ['Explicarla sin mirar y detectar vacíos', true], ['Subrayar todo el texto']]),
  ],
};

const scenario=(id,attribute,prompt,options)=>({id,attribute,prompt,options:options.map(([label,value])=>({label,value}))});
export const characterEvidenceQuestions=[
  scenario('charisma_conflict','Carisma','Un compañero rechaza tu propuesta delante del grupo. ¿Qué hacés primero?',[["Defiendo mi posición hasta que acepte",0],["Le pido que explique su objeción y reformulo el punto en común",3],["Evito responder y cambio de tema",1],["Le doy la razón aunque no la comparta",1]]),
  scenario('charisma_clarity','Carisma','Tenés que explicar una idea compleja a alguien sin experiencia. ¿Cómo comprobás que se entendió?',[["Uso todos los términos técnicos",0],["La explico con un ejemplo y le pido que la reconstruya con sus palabras",3],["La repito más fuerte",0],["Pregunto solamente si entendió",1]]),
  scenario('charisma_listening','Carisma','En una conversación importante notás que estás preparando tu respuesta mientras la otra persona habla.',[["Interrumpo para no perder mi idea",0],["Anoto una palabra clave y vuelvo a escuchar antes de responder",3],["Asiento aunque no siga el hilo",1],["Cambio a un tema que manejo mejor",0]]),
  scenario('charisma_leadership','Carisma','Un equipo está trabado y hay opiniones enfrentadas.',[["Decido solo para ahorrar tiempo",1],["Sintetizo criterios, asigno un próximo paso verificable y fijo una revisión",3],["Espero que alguien tome el control",0],["Busco que todos estén de acuerdo antes de avanzar",2]]),
  scenario('performance_recovery','Rendimiento','Incumpliste dos días seguidos una tarea importante. ¿Qué hacés?',[["Abandono el plan porque ya falló",0],["Compenso haciendo el triple mañana",1],["Identifico el obstáculo, reduzco el próximo paso y retomo hoy",3],["Espero al lunes para reiniciar",0]]),
  scenario('performance_priority','Rendimiento','Aparecen tres urgencias mientras trabajás en tu prioridad principal.',[["Cambio entre las cuatro tareas",0],["Evalúo impacto y plazo, resuelvo o delego lo crítico y protejo un bloque para la prioridad",3],["Respondo primero lo más reciente",1],["Ignoro todo lo nuevo",1]]),
  scenario('performance_focus','Rendimiento','Durante un bloque de trabajo revisaste el teléfono cinco veces.',[["Confío en tener más voluntad la próxima vez",1],["Alejo el teléfono, bloqueo avisos y reinicio un bloque más corto medible",3],["Sigo trabajando con el teléfono a la vista",0],["Doy el día por perdido",0]]),
  scenario('performance_measure','Rendimiento','Una estrategia se siente productiva, pero no mejora el resultado durante dos semanas.',[["La mantengo porque exige esfuerzo",1],["Defino una métrica, cambio una variable y comparo el siguiente ciclo",3],["Cambio todo el sistema al mismo tiempo",0],["Dejo de medir para evitar presión",0]]),
];

export const sportCatalog = [
  {id:'football',name:'Fútbol',emoji:'⚽',lowerLoad:'high',impact:'high'},
  {id:'basketball',name:'Básquet',emoji:'🏀',lowerLoad:'high',impact:'high'},
  {id:'padel',name:'Pádel',emoji:'🎾',lowerLoad:'moderate',impact:'moderate'},
  {id:'tennis',name:'Tenis',emoji:'🎾',lowerLoad:'moderate',impact:'moderate'},
  {id:'running',name:'Running',emoji:'🏃',lowerLoad:'high',impact:'high'},
  {id:'cycling',name:'Ciclismo',emoji:'🚴',lowerLoad:'moderate',impact:'low'},
  {id:'swimming',name:'Natación',emoji:'🏊',lowerLoad:'low',impact:'low'},
  {id:'combat',name:'Deporte de combate',emoji:'🥊',lowerLoad:'high',impact:'high'},
  {id:'other',name:'Otro deporte',emoji:'🏅',lowerLoad:'moderate',impact:'moderate'},
];
