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
  },
  {
    id:'pair-checkin',title:'Как я сейчас',time:'5–10 минут',symbol:'◌',audience:'pair',
    description:'По очереди выбрать своё состояние и потребность, рассказать о них и услышать друг друга.',
    intro:'По очереди выберите картинки про себя и объясните, что в них откликается. Другой слушает и пересказывает услышанное, а говорящий уточняет. Решать проблему сразу необязательно.',
    sources:[{title:'Roediger и Frank-Noyon · Connection Dialogues',url:'https://www.schematherapy-roediger.org/images/Roediger/Couples_Module_System/the_12_modules/Module%2011%20-%20Connection%20Dialogues.pdf'}],
    slots:[
      {id:'first-mode',label:'Участник 1 · Моё состояние',types:['mode']},
      {id:'first-need',label:'Участник 1 · Моя потребность',types:['need']},
      {id:'second-mode',label:'Участник 2 · Моё состояние',types:['mode']},
      {id:'second-need',label:'Участник 2 · Моя потребность',types:['need']}
    ],
    sections:[
      {title:'Участник 1 рассказывает',slotIds:['first-mode','first-need'],intro:'Выберите свои картинки и расскажите, что они означают для вас. Участник 2 слушает, затем пересказывает: «Я услышал, что тебе сейчас…». Уточните, правильно ли вас поняли.',fields:[
        {id:'first-experience',label:'Участник 1 · Что со мной сейчас?',hint:'Какая деталь картинки откликается? Что я чувствую и чего мне хочется?'},
        {id:'first-understood',label:'Участник 1 · Мне важно, чтобы ты понял…',hint:'Запишите своими словами после обсуждения. Можно оставить поле пустым.'}
      ]},
      {title:'Участник 2 рассказывает',slotIds:['second-mode','second-need'],intro:'Теперь поменяйтесь ролями: участник 2 выбирает картинки и рассказывает, участник 1 слушает и пересказывает. Говорящий может уточнить или поправить.',fields:[
        {id:'second-experience',label:'Участник 2 · Что со мной сейчас?',hint:'Какая деталь картинки откликается? Что я чувствую и чего мне хочется?'},
        {id:'second-understood',label:'Участник 2 · Мне важно, чтобы ты понял…',hint:'Запишите своими словами после обсуждения. Можно оставить поле пустым.'}
      ]},
      {title:'Общий итог',fields:[{id:'shared-notice',label:'Что мы поняли друг о друге?'},{id:'shared-step',label:'Нужен ли нам какой-то небольшой шаг?',hint:'Можно просто закончить разговор. Если хочется действия, договоритесь о чём-то конкретном и посильном для обоих.'}]}
    ]
  },
  {
    id:'pair-good-together',title:'Что нам хорошо вместе',time:'10 минут',symbol:'✳',audience:'pair',
    description:'Вспомнить приятный совместный опыт через картинки и придумать небольшое общее занятие.',
    intro:'Каждый выбирает ресурсную картинку и вспоминает конкретный момент, когда вам было хорошо вместе. Обсудите, что помогло этому случиться, и выберите одно посильное занятие на ближайшие дни.',
    sources:[{title:'Eckhard Roediger · Possible Exercises for the Couples',url:'https://www.schematherapy-roediger.org/images/Roediger/Couples_Module_System/the_12_modules/Module%2012%20-%20Possible%20Exercises%20for%20the%20Couples.pdf'},{title:'Schema Therapy Canberra · Happy Child mode in couples',url:'https://www.schematherapycanberra.com.au/sctworkbook.html'}],
    slots:[{id:'first-resource',label:'Участник 1 · Моя ресурсная картинка',types:['resource','healthy']},{id:'second-resource',label:'Участник 2 · Моя ресурсная картинка',types:['resource','healthy']}],
    sections:[
      {title:'Воспоминание участника 1',slotIds:['first-resource'],intro:'Выберите картинку, которая напоминает о хорошем совместном моменте. Расскажите, что происходило и что было приятно именно вам.',fields:[{id:'first-memory',label:'Участник 1 · Какой момент я вспоминаю?'},{id:'first-value',label:'Участник 1 · Что сделало его приятным?',hint:'Например: внимание, игра, свобода, близость или возможность быть собой.'}]},
      {title:'Воспоминание участника 2',slotIds:['second-resource'],intro:'Теперь второй участник выбирает свою картинку и рассказывает. Воспоминания и впечатления могут различаться.',fields:[{id:'second-memory',label:'Участник 2 · Какой момент я вспоминаю?'},{id:'second-value',label:'Участник 2 · Что сделало его приятным?',hint:'Что в этом опыте хотелось бы повторить, даже в небольшом масштабе?'}]},
      {title:'Что попробуем вместе',fields:[{id:'shared-activity',label:'Какое небольшое занятие подходит нам обоим?',hint:'Каждый может предложить вариант или отказаться. Выберите то, на что оба согласны.'},{id:'shared-plan',label:'Когда и как мы это устроим?',hint:'Например: двадцать минут прогулки после ужина в субботу.'}]}
    ]
  }

];
export const exerciseByType=id=>exerciseTypes.find(x=>x.id===id);
export const exerciseFields=type=>exerciseByType(type)?.sections.flatMap(s=>s.fields)||[];
export const slotAccepts=(slot,card)=>slot.types.includes(card.type)||(slot.types.includes('healthy')&&card.type==='mode'&&card.subgroup==='Здоровые режимы');
