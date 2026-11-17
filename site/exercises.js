import {exerciseTypes,exerciseByType,slotAccepts} from './exercises-data.js?v=20261116ex2';
import {exerciseTitle} from './exercises-model.js?v=20261118visual1';
import {escapeHtml as esc} from './model.js?v=20261116ex2';

const dateLabel=value=>new Date(value).toLocaleDateString('ru-RU');
const sources=def=>`<details class="exercise-sources"><summary>Основа упражнения и источники</summary><p>Формат и вопросы адаптированы сервисом для этой колоды. Это не дословный перевод, не диагностический тест и не проверенная программа лечения.</p>${def.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('')}</details>`;

export function exerciseHome(entries){
  return `<section class="hero exercise-hero"><div><span class="eyebrow">ОТ КАРТОЧКИ К НЕБОЛЬШОМУ ШАГУ</span><h1>Попробовать<br>по-другому.</h1><p>Три коротких формата для работы с карточками. Выбирайте тот, который подходит сегодня; любой вопрос можно пропустить.</p><p class="tiny">Записи сохраняются только в этом браузере. Их можно включить в PDF для психолога.</p></div></section>
  <div class="exercise-grid">${exerciseTypes.map((def,i)=>`<article class="exercise-tile"><div class="exercise-tile-top"><span class="exercise-symbol">${def.symbol}</span><span class="tiny">${def.time}</span></div><span class="eyebrow">0${i+1}</span><h2>${def.title}</h2><p>${def.description}</p><button class="button primary-button" data-exercise-new="${def.id}">Начать упражнение →</button>${sources(def)}</article>`).join('')}</div>
  <aside class="inline-notice">Начните с посильной повседневной ситуации. Если переживания усиливаются, можно остановиться и вернуться к записи вместе с психологом.</aside>
  <section class="exercise-history"><div class="collection-header"><h2>Мои записи <small>${entries.length}</small></h2>${entries.length?'<button class="text-button" data-action="pdf">PDF для психолога ↓</button>':''}</div>${entries.length?entries.slice().reverse().map(e=>`<article class="exercise-record"><div><span class="tiny">${dateLabel(e.createdAt)} · ${esc(exerciseByType(e.type).title)}</span><h3>${esc(exerciseTitle(e))}</h3></div><button class="button" data-exercise-open="${e.id}">Продолжить</button><button class="text-button muted" data-exercise-delete="${e.id}" aria-label="Удалить запись: ${esc(exerciseTitle(e))}">Удалить</button></article>`).join(''):'<p class="muted">Здесь появятся начатые упражнения. Можно возвращаться к ним и дополнять записи.</p>'}</section>
  <details class="exercise-sources therapist-methods"><summary>Какие ещё методы есть в схема-терапии?</summary><p>Диалоги между режимами с пересаживанием на стулья и работа с образами, включая переписывание болезненных воспоминаний, входят в схема-терапию. Карточки могут обозначать участников такого диалога. В этом сервисе нет самостоятельных сценариев этих техник: формат и темп лучше выбирать с психологом.</p><a href="https://www.schematherapysociety.com/Techniques" target="_blank" rel="noopener noreferrer">ISST · Chair Work и Imagery ↗</a></details>`;
}

export function exerciseEditor(entry,cards,storageReady=true){
  const def=exerciseByType(entry.type);
  return `<div class="exercise-editor"><button class="text-button" data-exercise-home>← Все упражнения и записи</button><header class="exercise-heading"><span class="eyebrow">${def.time} · ${dateLabel(entry.createdAt)}</span><h1>${def.title}</h1><p>${def.intro}</p></header><p class="exercise-storage" id="exercise-save-status" role="status">${storageReady?'Изменения сохраняются только в этом браузере':'Запись только в памяти вкладки — скачайте JSON или PDF'}</p>
  <label class="label" for="exercise-title">Название записи · необязательно</label><input id="exercise-title" data-exercise-title maxlength="160" value="${esc(entry.title)}" placeholder="Например: разговор после встречи">
  <section class="panel"><h2>Карточки для этого упражнения</h2><p>Откройте галерею и выберите картинку, которая откликается. Любой выбор можно пропустить или изменить.</p><div class="exercise-slots">${def.slots.map(slot=>`<div class="exercise-slot" id="slot-${slot.id}">${exerciseSlot(slot,entry.cards[slot.id],cards)}</div>`).join('')}</div><p class="tiny">Выбор здесь не меняет отметки карточек в профиле.</p></section>
  ${def.sections.map((section,index)=>`<section class="panel exercise-step"><span class="eyebrow">ШАГ ${index+1} ИЗ ${def.sections.length}</span><h2>${section.title}</h2>${section.fields.map(field=>`<label class="label" for="answer-${field.id}">${field.label}</label>${field.hint?`<p class="exercise-hint" id="hint-${field.id}">${field.hint}</p>`:''}<textarea id="answer-${field.id}" data-exercise-answer="${field.id}" maxlength="12000" rows="3" ${field.hint?`aria-describedby="hint-${field.id}"`:''} placeholder="Можно написать несколько слов или пропустить">${esc(entry.answers[field.id]||'')}</textarea>`).join('')}</section>`).join('')}
  ${sources(def)}<div class="exercise-actions"><button class="button primary-button" data-exercise-pdf="${entry.id}">PDF этой записи ↓</button><button class="button" data-exercise-home>К моим записям</button></div><p class="tiny muted">Если сейчас трудно продолжать, можно остановиться. Вопросы и незаконченные ответы тоже можно обсудить с психологом.</p></div>`;
}

const thumbnail=card=>`${esc(card.front.replace('assets/','assets/thumbs/'))}?v=20261116c`;

export function exerciseSlot(slot,id,cards){
  const card=cards.find(c=>c.id===id);
  return `<h3 class="label" id="slot-label-${slot.id}">${esc(slot.label)}</h3>
  <button class="exercise-choice ${card?'has-card':'is-empty'}" data-exercise-pick="${slot.id}" aria-haspopup="dialog" aria-label="${esc(card?`Заменить карточку: ${card.title}. ${slot.label}`:`Выбрать по картинкам: ${slot.label}`)}">
    ${card?`<img src="${thumbnail(card)}" alt="" width="360" height="480"><span>${esc(card.title)}<small>Заменить картинку ↻</small></span>`:'<span class="exercise-choice-placeholder"><span aria-hidden="true">＋</span>Выбрать<br>по картинкам</span>'}
  </button>${card?`<div class="exercise-choice-actions"><button class="text-button" data-card="${card.id}" aria-label="Описание карточки: ${esc(card.title)}">Описание</button><button class="text-button muted" data-exercise-clear="${slot.id}" aria-label="Убрать карточку: ${esc(card.title)}">Убрать</button></div>`:''}`;
}

export function exercisePicker(entry,slotId,cards){
  const slot=exerciseByType(entry.type)?.slots.find(s=>s.id===slotId);
  if(!slot)return '';
  const options=cards.filter(card=>slotAccepts(slot,card));
  return `<header class="dialog-toolbar picker-toolbar"><div><span class="eyebrow">ВЫБОР ПО КАРТИНКАМ · ${options.length}</span><h2 id="exercise-picker-title">${esc(slot.label)}</h2><p id="exercise-picker-hint">Нажмите на картинку, которая откликается.</p></div><button class="icon-button" data-exercise-picker-close aria-label="Закрыть выбор карточки" autofocus>×</button></header>
  <div class="exercise-picker-grid">${options.map(card=>`<button class="picker-card" data-exercise-select="${card.id}" aria-label="Выбрать карточку: ${esc(card.title)}" aria-pressed="${entry.cards[slotId]===card.id}"><img src="${thumbnail(card)}" alt="" width="360" height="480" loading="lazy"><span class="picker-card-title">${esc(card.title)}</span>${entry.cards[slotId]===card.id?'<span class="picker-selected" aria-hidden="true">✓ Выбрана</span>':''}</button>`).join('')}</div>
  <footer class="picker-footer"><button class="button" data-exercise-select="">Пока без карточки</button><span class="tiny muted">Выбор можно изменить в любой момент</span></footer>`;
}
