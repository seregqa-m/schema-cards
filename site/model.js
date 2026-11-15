export const STORAGE_KEY='vnutri.profile.v1';
export const ratings={yes:'Узнаю себя',sometimes:'Иногда похоже',unsure:'Пока не понимаю',no:'Не узнаю'};
export const fields=['ownName','situation','feelings','thoughts','actions','need','support','note'];
export function emptyProfile(){return {format:'vnutri-profile',version:1,updatedAt:null,cards:{},sessionNote:'',situation:{event:'',schema:'',mode:'',need:'',resource:'',step:''}};}
export function validateProfile(value,ids){
 if(!value||value.format!=='vnutri-profile'||value.version!==1||!value.cards||typeof value.cards!=='object'||Array.isArray(value.cards))throw new Error('Это не файл профиля «Внутри» версии 1.');
 const p=emptyProfile();const allowed=new Set(ids);
 const str=(v,max=12000)=>{if(v===undefined)return '';if(typeof v!=='string'||v.length>max)throw new Error('Неверный формат или слишком длинный текст.');return v;};
 p.sessionNote=str(value.sessionNote);p.updatedAt=typeof value.updatedAt==='string'?value.updatedAt:null;
 for(const [id,e] of Object.entries(value.cards)){
  if(!allowed.has(id))throw new Error('В файле есть карточки из другой версии каталога. Импорт отменён, текущие записи сохранены.');
  if(!e||typeof e!=='object'||Array.isArray(e))throw new Error('Повреждена запись карточки.');
  if(e.rating && !Object.hasOwn(ratings,e.rating))throw new Error('Неизвестная отметка карточки.');
  const entry={rating:e.rating||'',discuss:e.discuss===true,resource:e.resource===true};
  for(const key of fields)entry[key]=str(e[key]);
  p.cards[id]=entry;
 }
 if(value.situation){
  if(typeof value.situation!=='object'||Array.isArray(value.situation))throw new Error('Неверный формат ситуации.');
  for(const key of Object.keys(p.situation))p.situation[key]=str(value.situation[key]);
  for(const key of ['schema','mode','need','resource'])if(p.situation[key]&&!allowed.has(p.situation[key]))throw new Error('В ситуации указана неизвестная карточка.');
 }
 return p;
}
export function meaningful(e){return !!e&&(!!e.rating||e.discuss||e.resource||fields.some(k=>e[k]?.trim()));}
export function selected(e){return meaningful(e)&&(e.rating!=='no'||e.discuss||e.resource||fields.some(k=>e[k]?.trim()));}
export function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
