import {ratings,fields,selected} from './model.js';

export const reportLabels={ownName:'Моё название',situation:'В какой ситуации это происходит?',feelings:'Чувства и ощущения в теле',thoughts:'Какие мысли появляются?',actions:'Что я делаю в ответ?',need:'В чём я нуждаюсь?',support:'Что помогает / какой шаг я могу выбрать?',note:'Что хочу обсудить с психологом?'};
const typeNames={need:'Потребность',schema:'Ранняя схема',resource:'Позитивная схема',mode:'Режим'};

export function reportCards(cards,profile){
  return cards.filter(c=>selected(profile.cards[c.id])).sort((a,b)=>Number(!!profile.cards[b.id]?.discuss)-Number(!!profile.cards[a.id]?.discuss));
}

export function buildReport({cards,profile,cardText,ids,options={},images={},date=new Date()}){
  const include={images:true,fullText:true,notes:true,context:true,...options};
  const wanted=new Set(ids);
  const chosen=reportCards(cards,profile).filter(c=>wanted.has(c.id));
  if(!chosen.length)throw new Error('Выберите хотя бы одну карточку.');
  const block=(label,value)=>[
    {text:label,style:'label',headlineLevel:2},
    {text:String(value),style:'body',margin:[0,0,0,12]}
  ];
  const content=[
    {text:'ВНУТРИ / КАРТОЧКИ СХЕМА-ТЕРАПИИ',style:'eyebrow'},
    {text:'Карта для встречи\nс психологом',style:'cover'},
    {text:`${date.toLocaleDateString('ru-RU')} · Карточек: ${chosen.length}`,style:'meta',margin:[0,8,0,20]},
    {text:'Личные наблюдения для совместного обсуждения. Это не диагноз и не результат психологического теста.',style:'body',margin:[0,0,0,22]}
  ];
  if(include.context){
    if(profile.sessionNote?.trim())content.push(...block('С чем я хочу прийти на встречу',profile.sessionNote));
    const situation=profile.situation||{};
    if(situation.event?.trim())content.push(...block('Одна ситуация: что произошло',situation.event));
    for(const [key,label] of Object.entries({schema:'Ранняя схема',mode:'Режим',need:'Потребность',resource:'Ресурсная карточка'})){
      const c=chosen.find(c=>c.id===situation[key]);
      if(c)content.push({text:[{text:label+': ',bold:true},c.title],style:'body',margin:[0,0,0,6]});
    }
    if(situation.step?.trim())content.push(...block('Поддерживающий шаг',situation.step));
  }
  content.push({text:'Выбранные карточки',style:'section',margin:[0,15,0,10]});
  content.push({ol:chosen.map(c=>({text:c.title,linkToDestination:c.id,margin:[0,0,0,5]})),fontSize:10.5,color:'#304e3e'});
  content.push({text:'Иллюстрации и тексты колоды: © 2021 ООО «Институт Схема-Терапии» (Москва). Художник Юлия Зайцевская. Пояснения режимов и вопросы сервиса отделены от оригинального текста колоды.',style:'meta',margin:[0,24,0,0]});

  chosen.forEach((c,index)=>{
    const e=profile.cards[c.id]||{};
    content.push({text:`${String(index+1).padStart(2,'0')} / ${typeNames[c.type]}`,style:'eyebrow',pageBreak:'before',id:c.id});
    content.push({text:c.title,style:'cardTitle',margin:[0,8,0,12]});
    const tags=[ratings[e.rating],e.discuss?'Хочу обсудить':'',e.resource?'Мой ресурс':''].filter(Boolean);
    if(tags.length)content.push({text:tags.join(' · '),style:'tags',margin:[0,0,0,16]});
    const original=include.fullText&&cardText[c.id];
    const description=[
      {text:original?'Описание исходной карточки':c.sourceKind==='theory'?'Пояснение сервиса по теории':'Краткое описание карточки',style:'label'},
      {text:original||c.description,style:'body'}
    ];
    if(include.images){
      if(!images[c.id])throw new Error(`Не загрузилась иллюстрация «${c.title}». Попробуйте ещё раз или отключите иллюстрации.`);
      content.push({columns:[{image:images[c.id],width:142},{width:'*',stack:description}],columnGap:20,margin:[0,0,0,20]});
    }else content.push({stack:description,margin:[0,0,0,20]});
    if(include.notes){
      const populated=fields.filter(k=>e[k]?.trim());
      if(populated.length){
        content.push({text:'Мои наблюдения',style:'section',margin:[0,6,0,12],headlineLevel:1});
        for(const field of populated)content.push(...block(reportLabels[field],e[field]));
      }
    }
  });
  return {
    pageSize:'A4',pageMargins:[42,44,42,44],language:'ru-RU',
    info:{title:'Карта для встречи с психологом',author:'Внутри',subject:'Выбранные карточки и личные наблюдения'},
    defaultStyle:{font:'Roboto',fontSize:11,color:'#283f36',lineHeight:1.2},
    styles:{
      cover:{fontSize:30,bold:true,lineHeight:1.12},
      cardTitle:{fontSize:23,bold:true,lineHeight:1.12},
      eyebrow:{fontSize:9,bold:true,color:'#68736b',characterSpacing:1},
      meta:{fontSize:8.5,color:'#68736b',lineHeight:1.3},
      body:{fontSize:11,lineHeight:1.25},
      section:{fontSize:16,bold:true},
      label:{fontSize:10,bold:true,color:'#526354',margin:[0,0,0,5]},
      tags:{fontSize:10,color:'#526354'}
    },
    content,
    footer:(page,pages)=>({columns:[{text:'Внутри · Личные наблюдения',alignment:'left'},{text:`${page} / ${pages}`,alignment:'right'}],fontSize:8,color:'#68736b',margin:[42,15,42,0]}),
    pageBreakBefore:(node,following)=>!!node.headlineLevel&&following.length===0
  };
}
