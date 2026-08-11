export const habitCatalog = [
  ['Recuperación','sleep','🌙','Dormir a horario','7,5 h'],['Recuperación','wind-down','🛌','Rutina sin pantallas','30 min'],['Recuperación','sunlight','☀️','Luz solar al despertar','10 min'],['Recuperación','stretch','🧘','Movilidad suave','10 min'],['Recuperación','breathing','🌬️','Respiración consciente','5 min'],
  ['Nutrición','water','💧','Tomar agua','2,5 L'],['Nutrición','breakfast','🥣','Desayuno estructurado','1 comida'],['Nutrición','vegetables','🥦','Comer vegetales','2 porciones'],['Nutrición','fruit','🍎','Comer fruta','2 unidades'],['Nutrición','protein','🥚','Cumplir proteína','Objetivo diario'],['Nutrición','meal-prep','🍱','Preparar comidas','1 bloque'],
  ['Movimiento','steps','👟','Caminar','8.000 pasos'],['Movimiento','strength','🏋️','Entrenamiento de fuerza','1 sesión'],['Movimiento','cardio','🏃','Cardio','25 min'],['Movimiento','mobility','🤸','Movilidad','15 min'],['Movimiento','posture','🪑','Pausa postural','3 pausas'],
  ['Mente','focus','🎯','Foco profundo','50 min'],['Mente','meditation','🧠','Meditación','10 min'],['Mente','journal','📓','Escribir reflexión','5 min'],['Mente','gratitude','🙏','Registrar gratitud','3 cosas'],['Mente','reading','📚','Leer','20 min'],['Mente','learning','💡','Aprender algo nuevo','20 min'],
  ['Productividad','priorities','✅','Definir prioridades','3 prioridades'],['Productividad','plan-day','🗓️','Planificar el día','10 min'],['Productividad','inbox','📥','Vaciar pendientes','1 revisión'],['Productividad','project','🧩','Avanzar proyecto principal','30 min'],['Productividad','tidy','🧹','Ordenar el espacio','10 min'],['Productividad','no-phone','📵','Bloque sin teléfono','60 min'],
  ['Social','conversation','💬','Conversación intencional','1 conversación'],['Social','family','🏠','Tiempo con familia','30 min'],['Social','friend','🤝','Contactar a un amigo','1 contacto'],['Social','listen','👂','Escucha activa','1 conversación'],['Social','kindness','💙','Acción de ayuda','1 acción'],
  ['Disciplina','wake','⏰','Levantarse al primer aviso','1 vez'],['Disciplina','cold','🚿','Ducha consciente','1 vez'],['Disciplina','review','📊','Revisar progreso','5 min'],['Disciplina','promise','🛡️','Cumplir promesa diaria','1 promesa'],
].map(([category,id,emoji,name,target])=>({category,id,emoji,name,target}));

const muscleImages={
  Pecho:'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
  Espalda:'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=80',
  Piernas:'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80',
  Hombros:'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=80',
  Brazos:'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=900&q=80',
  Core:'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=900&q=80',
  Cardio:'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80',
};

export const exerciseCatalog = [
  ['Pecho','bench-press','Press de banca','compound',8],['Pecho','incline-press','Press inclinado','compound',10],['Pecho','dumbbell-press','Press con mancuernas','compound',10],['Pecho','push-up','Flexiones','compound',12],['Pecho','chest-fly','Aperturas','isolation',12],['Pecho','cable-cross','Cruce de poleas','isolation',15],
  ['Espalda','pull-up','Dominadas','compound',8],['Espalda','lat-pulldown','Jalón al pecho','compound',10],['Espalda','barbell-row','Remo con barra','compound',8],['Espalda','dumbbell-row','Remo con mancuerna','compound',10],['Espalda','seated-row','Remo sentado','compound',12],['Espalda','face-pull','Face pull','isolation',15],
  ['Piernas','back-squat','Sentadilla con barra','compound',8],['Piernas','goblet-squat','Sentadilla goblet','compound',10],['Piernas','romanian-deadlift','Peso muerto rumano','compound',10],['Piernas','deadlift','Peso muerto','compound',6],['Piernas','leg-press','Prensa','compound',12],['Piernas','bulgarian-split','Zancada búlgara','compound',10],['Piernas','leg-curl','Curl femoral','isolation',12],['Piernas','leg-extension','Extensión de cuádriceps','isolation',12],['Piernas','calf-raise','Elevación de gemelos','isolation',15],
  ['Hombros','overhead-press','Press militar','compound',8],['Hombros','dumbbell-shoulder','Press de hombros','compound',10],['Hombros','lateral-raise','Elevaciones laterales','isolation',15],['Hombros','rear-delt','Pájaros posteriores','isolation',15],
  ['Brazos','barbell-curl','Curl con barra','isolation',12],['Brazos','hammer-curl','Curl martillo','isolation',12],['Brazos','triceps-pushdown','Extensión de tríceps','isolation',12],['Brazos','skull-crusher','Press francés','isolation',10],['Brazos','dips','Fondos','compound',10],
  ['Core','plank','Plancha frontal','core',45],['Core','dead-bug','Dead bug','core',12],['Core','cable-crunch','Crunch en polea','core',15],['Core','hanging-knee','Elevación de rodillas','core',12],
  ['Cardio','treadmill','Cinta o caminata','cardio',20],['Cardio','bike','Bicicleta','cardio',20],['Cardio','rowing','Remo ergómetro','cardio',15],
].map(([muscle,id,name,type,defaultReps])=>({muscle,id,name,type,defaultReps,img:muscleImages[muscle],tech:`Técnica controlada para ${name.toLowerCase()}; detené la serie si aparece dolor.`}));

export const foodCatalog = [
  ['Proteínas','egg','🥚','Huevo','unidad',1,70,6,0.5,5],['Proteínas','egg-white','🍳','Clara de huevo','unidad',1,17,3.6,0.2,0],['Proteínas','chicken','🍗','Pechuga de pollo','g',100,165,31,0,3.6],['Proteínas','beef','🥩','Carne vacuna magra','g',100,200,27,0,10],['Proteínas','tuna','🐟','Atún al natural','g',100,116,26,0,1],['Proteínas','salmon','🐟','Salmón','g',100,208,20,0,13],['Proteínas','turkey','🍗','Pavo','g',100,135,29,0,1],['Proteínas','tofu','🧊','Tofu','g',100,144,17,3,9],['Proteínas','lentils','🫘','Lentejas cocidas','g',100,116,9,20,0.4],
  ['Lácteos','greek-yogurt','🥛','Yogur griego','g',100,97,9,4,5],['Lácteos','milk','🥛','Leche','ml',200,120,6.4,9.6,6],['Lácteos','cheese','🧀','Queso fresco','g',30,80,6,1,6],['Lácteos','whey','🥤','Proteína en polvo','scoop',1,120,24,3,2],
  ['Carbohidratos','rice','🍚','Arroz cocido','g',100,130,2.7,28,0.3],['Carbohidratos','oats','🥣','Avena','g',50,190,6.5,32,3.5],['Carbohidratos','potato','🥔','Papa cocida','g',100,87,1.9,20,0.1],['Carbohidratos','sweet-potato','🍠','Batata cocida','g',100,90,2,21,0.2],['Carbohidratos','pasta','🍝','Pasta cocida','g',100,157,5.8,31,0.9],['Carbohidratos','bread','🍞','Pan integral','rebanada',1,80,4,14,1],['Carbohidratos','tortilla','🫓','Tortilla integral','unidad',1,130,4,22,3],['Carbohidratos','quinoa','🌾','Quinoa cocida','g',100,120,4.4,21,1.9],
  ['Frutas','banana','🍌','Banana','unidad',1,105,1.3,27,0.4],['Frutas','apple','🍎','Manzana','unidad',1,95,0.5,25,0.3],['Frutas','berries','🫐','Frutos rojos','g',100,50,1,12,0.5],['Frutas','orange','🍊','Naranja','unidad',1,62,1.2,15,0.2],
  ['Vegetales','broccoli','🥦','Brócoli','g',100,35,2.4,7,0.4],['Vegetales','tomato','🍅','Tomate','g',100,18,0.9,3.9,0.2],['Vegetales','carrot','🥕','Zanahoria','g',100,41,0.9,10,0.2],['Vegetales','greens','🥬','Hojas verdes','g',100,23,2.9,3.6,0.4],['Vegetales','pumpkin','🎃','Calabaza','g',100,45,1,12,0.1],
  ['Grasas','olive-oil','🫒','Aceite de oliva','cucharada',1,119,0,0,13.5],['Grasas','avocado','🥑','Palta','g',100,160,2,8.5,14.7],['Grasas','peanuts','🥜','Maní','g',30,170,7,6,14],['Grasas','almonds','🌰','Almendras','g',30,174,6.4,6.5,15],['Grasas','peanut-butter','🥜','Mantequilla de maní','cucharada',1,95,3.5,3.5,8],
].map(([category,id,emoji,name,unit,baseAmount,kcal,p,c,f])=>({category,id,emoji,name,unit,baseAmount,kcal,p,c,f}));

export const catalogById=(catalog,id)=>catalog.find(item=>item.id===id);

export function groupedOptions(catalog,groupKey,selected=''){
  const groups=[...new Set(catalog.map(item=>item[groupKey]))];
  return groups.map(group=>`<optgroup label="${group}">${catalog.filter(item=>item[groupKey]===group).map(item=>`<option value="${item.id}" ${item.id===selected?'selected':''}>${item.emoji||''} ${item.name}</option>`).join('')}</optgroup>`).join('');
}
