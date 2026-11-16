import {exerciseByType,exerciseFields} from './exercises-data.js?v=20261116ex2';

export function newExercise(type,id,date=new Date()){
  if(!exerciseByType(type))throw new Error('Неизвестное упражнение.');
  return {id,type,createdAt:date.toISOString(),title:'',cards:{},answers:{}};
}
export function validateExercises(value,allowedIds){
  if(value===undefined)return [];
  if(!Array.isArray(value)||value.length>100)throw new Error('Неверный список упражнений (максимум 100 записей).');
  const seen=new Set(),allowed=new Set(allowedIds);
  const str=(v,max=12000)=>{if(v===undefined)return '';if(typeof v!=='string'||v.length>max)throw new Error('Неверный текст упражнения.');return v;};
  return value.map(item=>{
    if(!item||typeof item!=='object'||!exerciseByType(item.type)||typeof item.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(item.id)||seen.has(item.id))throw new Error('Повреждена запись упражнения.');
    seen.add(item.id);
    if(!item.cards||typeof item.cards!=='object'||Array.isArray(item.cards)||!item.answers||typeof item.answers!=='object'||Array.isArray(item.answers))throw new Error('Повреждены ответы упражнения.');
    const createdAt=str(item.createdAt,40);
    if(!/^\d{4}-\d{2}-\d{2}T/.test(createdAt)||!Number.isFinite(Date.parse(createdAt)))throw new Error('Неверная дата упражнения.');
    const result={id:item.id,type:item.type,createdAt,title:str(item.title,160),cards:{},answers:{}};
    for(const slot of exerciseByType(item.type).slots){const id=str(item.cards[slot.id],80);if(id&&!allowed.has(id))throw new Error('В упражнении неизвестная карточка.');result.cards[slot.id]=id;}
    for(const field of exerciseFields(item.type))result.answers[field.id]=str(item.answers[field.id]);
    return result;
  });
}
export const exerciseTitle=entry=>entry.title?.trim()||exerciseByType(entry.type)?.title||'Упражнение';
export const exerciseHasContent=entry=>Object.values(entry.answers||{}).some(v=>v?.trim())||Object.values(entry.cards||{}).some(Boolean)||!!entry.title?.trim();
export const exerciseCardIds=entry=>[...new Set(Object.values(entry.cards||{}).filter(Boolean))];
