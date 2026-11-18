import {exerciseHasContent,exerciseTitle} from './exercises-model.js?v=20261116ex2';
import {reportCards,buildReport} from './report-model.js?v=20261116ex2';
import {escapeHtml as esc} from './model.js?v=20261116ex2';

let runtimePromise;
function loadScript(file){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=new URL(file,import.meta.url).href;
    script.onload=()=>resolve();script.onerror=()=>{script.remove();reject(new Error('Не удалось загрузить модуль PDF. Проверьте соединение и попробуйте ещё раз.'));};
    document.head.append(script);
  });
}
function loadRuntime(){
  if(!runtimePromise)runtimePromise=(async()=>{
    if(!window.pdfMake)await loadScript('./vendor/pdfmake/pdfmake.min.js');
    await loadScript('./vendor/pdfmake/vfs_fonts.js');
    return window.pdfMake;
  })().catch(error=>{runtimePromise=null;throw error;});
  return runtimePromise;
}
function imageData(card){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    const timer=setTimeout(()=>fail(),30000);
    const fail=()=>{clearTimeout(timer);reject(new Error(`Не загрузилась иллюстрация «${card.title}». Попробуйте ещё раз или отключите иллюстрации.`));};
    image.onerror=fail;
    image.onload=()=>{
      clearTimeout(timer);
      try{
        const canvas=document.createElement('canvas');canvas.width=540;canvas.height=720;
        canvas.getContext('2d').drawImage(image,0,0,540,720);
        resolve(canvas.toDataURL('image/jpeg',.88));
      }catch{fail();}
    };
    image.src=new URL(`${card.front}?v=20261116c`,import.meta.url).href;
  });
}
function makeBlob(pdfMake,definition){
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Создание PDF заняло слишком много времени. Попробуйте выбрать меньше карточек.')),90000);
    try{pdfMake.createPdf(definition).getBlob(blob=>{clearTimeout(timer);resolve(blob);});}
    catch(error){clearTimeout(timer);reject(error);}
  });
}

export function openReport({cards,profile,cardText,exerciseIds,cardIds}){
  const snapshot=JSON.parse(JSON.stringify(profile));
  const candidates=reportCards(cards,snapshot);
  const exercises=(snapshot.exercises||[]).filter(exerciseHasContent);
  let ids=new Set((cardIds??candidates.map(c=>c.id)).filter(id=>candidates.some(c=>c.id===id)));
  let pickedExercises=new Set((exerciseIds??exercises.map(e=>e.id)).filter(id=>exercises.some(e=>e.id===id)));
  let busy=false,generation=0,url;
  const dialog=document.querySelector('#export-dialog');
  const revoke=()=>{if(url){URL.revokeObjectURL(url);url=null;}};
  dialog.innerHTML=`<div class="dialog-toolbar export-toolbar"><h2 id="export-title">PDF для психолога</h2><button class="close" data-report="close" aria-label="Закрыть выгрузку">×</button></div>
    <div class="export-body"><p>Выберите, что взять на встречу. Каждая карточка и запись упражнения начнётся с новой страницы; длинные заметки продолжатся на следующих.</p>
    <div class="export-privacy"><p><strong>Ваши ответы, отметки и заметки не отправляются на сервер.</strong> PDF собирается в вашем браузере и скачивается на устройство.</p><a href="https://github.com/seregqa-m/schema-cards" target="_blank" rel="noopener noreferrer">Открытый код на GitHub ↗</a></div>
    <fieldset id="export-controls"><legend class="sr-only">Состав PDF</legend>
    <div class="export-options"><label><input type="checkbox" data-option="images" checked> Иллюстрации</label><label><input type="checkbox" data-option="fullText" checked> Полные описания</label><label><input type="checkbox" data-option="notes" ${exerciseIds?'':'checked'}> Мои заметки к карточкам</label><label><input type="checkbox" data-option="context" ${exerciseIds?'':'checked'}> Тема встречи и разбор ситуации</label></div>
    <div class="export-selection-header"><strong id="export-count"></strong><div class="button-row"><button class="text-button" data-report="all">Все карточки</button><button class="text-button" data-report="discuss">Только «Хочу обсудить»</button><button class="text-button" data-report="none">Снять выбор карточек</button></div></div>
    <div class="export-list">${candidates.map(c=>`<label class="export-card"><input type="checkbox" data-export-id="${c.id}" checked><img src="${esc(c.front.replace('assets/','assets/thumbs/'))}?v=20261116c" width="45" height="60" alt=""><span>${esc(c.title)}${snapshot.cards[c.id]?.discuss?'<small>Хочу обсудить</small>':''}</span></label>`).join('')||'<p class="muted">Карточек пока нет. Можно отметить их в библиотеке или выбрать в упражнении.</p>'}</div>
    <div class="export-selection-header"><strong>Записи упражнений</strong><p class="tiny muted">Каждая выбранная запись включает её ответы. Снимите галочку у записи, которую не хотите передавать.</p></div>
    <div class="export-list">${exercises.map(e=>`<label class="export-card"><input type="checkbox" data-export-exercise="${e.id}" ${pickedExercises.has(e.id)?'checked':''}><span>${esc(exerciseTitle(e))}<small>${new Date(e.createdAt).toLocaleDateString('ru-RU')}</small></span></label>`).join('')||'<p class="muted">Заполненные упражнения появятся здесь.</p>'}</div>
    </fieldset></div>
    <div class="export-bottom"><p id="export-status" role="status" aria-live="polite"></p><button id="create-pdf" class="button primary-button" data-report="create">Скачать PDF</button><a id="download-pdf" class="button primary-button" hidden>Скачать готовый PDF ↓</a></div>`;
  const q=selector=>dialog.querySelector(selector);
  const sync=()=>{
    q('#export-count').textContent=`Карточки: ${ids.size} из ${candidates.length} · Упражнения: ${pickedExercises.size}`;
    q('#create-pdf').disabled=(!ids.size&&!pickedExercises.size)||busy;
    dialog.querySelectorAll('[data-export-id]').forEach(input=>input.checked=ids.has(input.dataset.exportId));
  };
  const invalidate=()=>{generation++;revoke();q('#download-pdf').hidden=true;q('#create-pdf').hidden=false;q('#export-status').textContent='';};
  dialog.onchange=event=>{
    if(busy)return;
    const exerciseId=event.target.dataset.exportExercise;
    if(exerciseId){if(event.target.checked)pickedExercises.add(exerciseId);else pickedExercises.delete(exerciseId);}
    const id=event.target.dataset.exportId;
    if(id){if(event.target.checked)ids.add(id);else ids.delete(id);}
    invalidate();sync();
  };
  dialog.onclick=async event=>{
    const action=event.target.closest('[data-report]')?.dataset.report;
    if(action==='close'){dialog.close();return;}
    if(busy)return;
    if(['all','none','discuss'].includes(action)){
      ids=new Set(candidates.filter(c=>action==='all'||action==='discuss'&&snapshot.cards[c.id]?.discuss).map(c=>c.id));
      invalidate();sync();return;
    }
    if(action!=='create'||(!ids.size&&!pickedExercises.size))return;
    const token=++generation;busy=true;revoke();q('#export-controls').disabled=true;sync();
    q('#create-pdf').textContent='Создаём PDF…';
    const status=text=>{if(generation===token&&dialog.open)q('#export-status').textContent=text;};
    try{
      const options=Object.fromEntries([...dialog.querySelectorAll('[data-option]')].map(el=>[el.dataset.option,el.checked]));
      status('Подготавливаем документ…');
      const pdfMake=await loadRuntime();
      const chosen=candidates.filter(c=>ids.has(c.id));const images={};
      if(options.images)for(let i=0;i<chosen.length;i++){
        if(generation!==token||!dialog.open)return;
        status(`Подготавливаем иллюстрации: ${i+1} из ${chosen.length}`);
        images[chosen[i].id]=await imageData(chosen[i]);
      }
      if(generation!==token||!dialog.open)return;
      status('Собираем страницы…');
      const date=new Date();
      const definition=buildReport({cards,profile:snapshot,cardText,ids:[...ids],exerciseIds:[...pickedExercises],options,images,date});
      const blob=await makeBlob(pdfMake,definition);
      if(generation!==token||!dialog.open)return;
      url=URL.createObjectURL(blob);
      const filename=`vnutri-${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}.pdf`;
      const link=q('#download-pdf');link.href=url;link.download=filename;link.hidden=false;
      q('#create-pdf').hidden=true;
      const size=blob.size<1024*1024?`${Math.ceil(blob.size/1024)} КБ`:`${(blob.size/1024/1024).toLocaleString('ru-RU',{maximumFractionDigits:1})} МБ`;
      status(`PDF готов · ${size}. Если скачивание не началось, нажмите кнопку ещё раз.`);
      link.click();
    }catch(error){status(error.message||'Не удалось создать PDF. Попробуйте ещё раз.');}
    finally{if(generation===token&&dialog.open){busy=false;q('#export-controls').disabled=false;q('#create-pdf').textContent='Скачать PDF';sync();}}
  };
  dialog.onclose=()=>{generation++;revoke();dialog.innerHTML='';dialog.onchange=null;dialog.onclick=null;};
  sync();dialog.showModal();
}
