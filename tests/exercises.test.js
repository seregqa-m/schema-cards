import test from 'node:test';
import assert from 'node:assert/strict';
import {cards} from '../site/data.js';
import {cardText} from '../site/card-text.js';
import {emptyProfile,validateProfile} from '../site/model.js';
import {newExercise,exerciseCardIds} from '../site/exercises-model.js';
import {buildReport,reportCards} from '../site/report-model.js';
import {exerciseHome,exerciseEditor} from '../site/exercises.js';

const ids=cards.map(c=>c.id);
const mode=cards.find(c=>c.type==='mode'),need=cards.find(c=>c.type==='need');
function fixture(){const p=emptyProfile();const e=newExercise('adult','test-one',new Date('2026-11-16T12:00:00Z'));e.title='Моя запись';e.cards={mode:mode.id,need:need.id};e.answers={acknowledge:'<img src=x onerror=alert(1)>\nМой ответ',perspective:'Реалистичная опора',step:'Небольшой шаг'};p.exercises=[e];return p;}

test('old v1 imports remain valid and exercise records round-trip without changing card marks',()=>{
  const old=emptyProfile();delete old.exercises;assert.deepEqual(validateProfile(old,ids).exercises,[]);
  const p=fixture(),restored=validateProfile(JSON.parse(JSON.stringify(p)),ids);
  assert.equal(restored.exercises[0].answers.acknowledge,p.exercises[0].answers.acknowledge);
  assert.equal(restored.exercises[0].cards.mode,mode.id);
  assert.deepEqual(restored.cards,{});
  assert.deepEqual(exerciseCardIds(restored.exercises[0]),[mode.id,need.id]);
});
test('invalid exercise imports fail without mutating existing data',()=>{
  const p=fixture();const original=JSON.stringify(p);
  const changes=[{id:'<script>'},{type:'unknown'},{createdAt:'not a date'},{cards:{mode:'unknown'}},{answers:[]},{answers:{step:'x'.repeat(12001)}}];
  for(const change of changes)assert.throws(()=>validateProfile({...p,exercises:[{...p.exercises[0],...change}]},ids));
  assert.throws(()=>validateProfile({...p,exercises:[p.exercises[0],p.exercises[0]]},ids));
  assert.throws(()=>validateProfile({...p,exercises:Array(101).fill(p.exercises[0])},ids));
  assert.equal(JSON.stringify(p),original);
});
test('exercise views render user input as text, including titles and textarea endings',()=>{
  const p=fixture();p.exercises[0].title='</h3><img src=x onerror=alert(1)>';
  p.exercises[0].answers.step='</textarea><script>alert(1)</script>';
  for(const html of [exerciseHome(p.exercises),exerciseEditor(p.exercises[0],cards)]){
    assert(!html.includes('<script>'));assert(!html.includes('<img src=x'));
    assert(html.includes('&lt;/h3&gt;'));
  }
});
test('PDF supports exercise-only export and never includes unselected exercise answers or linked card names',()=>{
  const p=fixture();const second=newExercise('support','test-two');second.title='PRIVATE SECOND TITLE';second.answers.message='PRIVATE SECOND ANSWER';p.exercises.push(second);
  const definition=buildReport({cards,profile:p,cardText,ids:[],exerciseIds:['test-one'],options:{images:false,context:false,notes:false}});
  const text=JSON.stringify(definition.content);
  assert(text.includes('Мой ответ'));assert(text.includes('Небольшой шаг'));
  assert(!text.includes('PRIVATE SECOND'));assert(!text.includes(mode.title));assert(!text.includes(need.title));
  assert.throws(()=>buildReport({cards,profile:p,cardText,ids:[],exerciseIds:[]}));
});
test('only selected referenced cards enter PDF, and selecting an exercise never changes profile ratings',()=>{
  const p=fixture();const before=JSON.stringify(p);
  assert.deepEqual(reportCards(cards,p).map(c=>c.id),[mode.id,need.id]);
  const content=JSON.stringify(buildReport({cards,profile:p,cardText,ids:[need.id],exerciseIds:['test-one'],options:{images:false,context:false}}).content);
  assert(content.includes(need.title));assert(!content.includes(mode.title));
  assert.equal(JSON.stringify(p),before);
});
