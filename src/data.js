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
 {id:'discipline',title:'Disciplina sin fricción',skill:'Disciplina',lessons:[['Diseñá el entorno','La disciplina sostenible empieza reduciendo decisiones. Dejá visible lo importante, prepará la noche anterior y definí un inicio de dos minutos.'],['Regla del mínimo viable','En días difíciles, protegé la identidad con una versión pequeña del hábito. Consistencia antes que intensidad.'],['Revisión semanal','Medí adherencia, detectá fricción y cambiá una sola variable por semana.']]},
 {id:'focus',title:'Foco de combate',skill:'Foco profundo',lessons:[['Bloques de atención','Elegí una salida concreta, cerrá entradas y trabajá 25–50 minutos sin alternar.'],['Recuperar la atención','Cuando aparezca una distracción, anotala y volvé al siguiente gesto físico de la tarea.'],['Energía cognitiva','Ubicá el trabajo exigente en tu franja de mayor energía y agrupá lo administrativo.']]},
 {id:'communication',title:'Comunicación intencional',skill:'Comunicación',lessons:[['Escuchar antes de responder','Reflejando hechos, emoción y necesidad reducís malentendidos antes de proponer soluciones.'],['Mensajes claros','Contexto breve, pedido observable y fecha concreta. Evitá insinuaciones.'],['Conversaciones difíciles','Describí conducta e impacto sin atacar identidad; acordá el próximo paso.']]},
 {id:'physical',title:'Rendimiento físico',skill:'Recuperación',lessons:[['Sobrecarga progresiva','Progresá una variable por vez: repeticiones, carga, series o control técnico.'],['RPE útil','RPE 8 significa unas dos repeticiones en reserva. Registrarlo mejora decisiones futuras.'],['Recuperación activa','Sueño, proteína, pasos y manejo de fatiga sostienen más progreso que sesiones heroicas aisladas.']]}];
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
  ['LUNA', '4'], ['RÍO', '7'], ['SOL', '2'], ['NUBE', '9'], ['BOSQUE', '5'],
];

export const intellectCoreQuestions = [
  iq('focus-count', 'Foco profundo', 'Atención', 'En la secuencia 8 · 3 · 8 · 1 · 8 · 6, ¿cuántas veces aparece el 8?', [['2'], ['3', true], ['4']]),
  iq('focus-match', 'Foco profundo', 'Atención', '¿Cuál cadena es exactamente igual a K7M2Q9?', [['K7N2Q9'], ['K7M2Q9', true], ['K7M2O9']]),
  iq('critical-sequence', 'Pensamiento crítico', 'Pensamiento crítico', 'Completá la regla: 2 · 6 · 12 · 20 · ?', [['26'], ['30', true], ['32']]),
  iq('critical-logic', 'Pensamiento crítico', 'Pensamiento crítico', 'Todas las runas son señales y algunas señales son azules. ¿Todas las runas son azules?', [['No se puede afirmar', true], ['Sí'], ['Ninguna runa es azul']]),
  iq('memory-river', 'Memoria', 'Memoria de trabajo', '¿Qué número acompañaba a RÍO?', [['4'], ['7', true], ['9']]),
  iq('memory-sun', 'Memoria', 'Memoria de trabajo', '¿Qué palabra acompañaba al número 2?', [['SOL', true], ['LUNA'], ['BOSQUE']]),
  iq('learning-rule', 'Aprendizaje', 'Aprendizaje', 'Regla nueva: todo símbolo azul vale el doble. Si un triángulo azul vale 4 de base, ¿cuál es su valor final?', [['6'], ['8', true], ['12']]),
  iq('learning-feedback', 'Aprendizaje', 'Aprendizaje', 'Probaste una estrategia y falló dos veces del mismo modo. ¿Qué acción genera mejor aprendizaje?', [['Repetirla sin cambios'], ['Comparar el error, ajustar una variable y volver a probar', true], ['Cambiar de objetivo inmediatamente']]),
  iq('planning-order', 'Planificación', 'Planificación', 'Para enviar un informe primero necesitás revisarlo, y para revisarlo necesitás un borrador. ¿Qué va primero?', [['Enviar'], ['Revisar'], ['Crear el borrador', true]]),
  iq('planning-time', 'Planificación', 'Planificación', 'Tenés 25 minutos y tareas de 15, 10 y 20 minutos. ¿Qué opción completa más tareas sin superar el tiempo?', [['La tarea de 20'], ['Las tareas de 15 y 10', true], ['Las tres tareas']]),
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
