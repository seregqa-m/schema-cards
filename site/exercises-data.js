const techniques={title:'ISST · дневники и карточки поддержки',url:'https://www.schematherapysociety.com/Techniques'};
const adult={title:'Remco van der Wijngaart · три шага Здорового Взрослого',url:'https://www.schematherapysociety.com/page-18465'};
export const exerciseTypes=[
  {
    id:'diary',title:'Дневник ситуации',time:'7–10 минут',symbol:'◎',
    description:'Разобрать один эпизод: что произошло, что включилось и чего не хватало.',
    intro:'Возьмите недавнюю повседневную ситуацию, о которой сейчас посильно подумать. Выбор схемы или режима — рабочая гипотеза. Карточку можно не выбирать, если ничего не подходит.',
    sources:[techniques],
    slots:[{id:'mode',label:'Какой режим я замечаю?',types:['mode']},{id:'schema',label:'Какая схема могла включиться?',types:['schema']},{id:'need',label:'Какая потребность важна?',types:['need']},{id:'resource',label:'На что можно опереться?',types:['resource','healthy']}],
    sections:[
      {title:'Что произошло',fields:[{id:'event',label:'Факты ситуации',hint:'Что можно было увидеть или услышать, без догадок о чужих намерениях?'},{id:'feelings',label:'Чувства и телесные ощущения'},{id:'thoughts',label:'Какая мысль возникла?'}]},
      {title:'Как я отреагировал',fields:[{id:'reaction',label:'Что я сделал и к чему это привело?'},{id:'needs',label:'Чего мне хотелось или не хватало?'}]},
      {title:'Что можно попробовать',fields:[{id:'perspective',label:'Другой взгляд на ситуацию',hint:'Что известно точно, а что пока только предположение?'},{id:'step',label:'Один посильный шаг или вопрос психологу'}]}
    ]
  },
  {
    id:'adult',title:'Три шага Здорового Взрослого',time:'3–5 минут',symbol:'✳',
    description:'Сначала поддержать себя, затем разобраться и выбрать посильное действие.',
    intro:'Выберите состояние и потребность, которые замечаете сейчас. Не нужно заставлять себя быстро успокоиться: можно остановиться на первом шаге.',
    sources:[adult],
    slots:[{id:'mode',label:'Моё состояние сейчас',types:['mode']},{id:'need',label:'Что мне сейчас нужно?',types:['need']},{id:'resource',label:'Карточка моей опоры',types:['healthy','resource']}],
    sections:[
      {title:'Признать переживание',fields:[{id:'acknowledge',label:'Что я чувствую и как могу отнестись к этому с пониманием?',hint:'Например: «Мне сейчас трудно. Я могу отнестись к себе бережно». Сформулируйте по-своему.'}]},
      {title:'Добавить перспективу',fields:[{id:'perspective',label:'Какая реалистичная мысль даёт мне опору?',hint:'Не обещайте себе идеальный исход. Вспомните доступную помощь, свой опыт или то, что пока неизвестно.'}]},
      {title:'Позаботиться о реальности',fields:[{id:'step',label:'Какой небольшой шаг отвечает моей потребности?',hint:'Например: попросить о конкретной помощи, обозначить границу или дать себе отдых.'}]}
    ]
  },
  {
    id:'support',title:'Карточка поддержки',time:'5–7 минут',symbol:'◇',
    description:'Составить короткое напоминание, к которому можно вернуться в трудный момент.',
    intro:'Выберите повторяющуюся ситуацию и одну карточку опоры. Напишите слова, которым можете поверить. Получится черновик: его полезно уточнить вместе с психологом.',
    sources:[techniques],
    slots:[{id:'trigger',label:'Что обычно включается?',types:['schema','mode']},{id:'need',label:'О какой потребности напомнить?',types:['need']},{id:'resource',label:'Какая карточка поддерживает?',types:['resource','healthy']}],
    sections:[
      {title:'Узнать момент',fields:[{id:'when',label:'Когда мне пригодится эта карточка?'},{id:'signal',label:'По каким признакам я замечу этот момент?'}]},
      {title:'Написать себе',fields:[{id:'message',label:'Моё поддерживающее напоминание',hint:'Несколько коротких предложений: что со мной происходит, что мне важно помнить, какую поддержку я могу получить.'}]},
      {title:'Вернуться к действию',fields:[{id:'step',label:'Что я могу сделать дальше?'},{id:'review',label:'Что хочу уточнить с психологом?'}]}
    ]
  }
];
export const exerciseByType=id=>exerciseTypes.find(x=>x.id===id);
export const exerciseFields=type=>exerciseByType(type)?.sections.flatMap(s=>s.fields)||[];
export const slotAccepts=(slot,card)=>slot.types.includes(card.type)||(slot.types.includes('healthy')&&card.type==='mode'&&card.subgroup==='Здоровые режимы');
