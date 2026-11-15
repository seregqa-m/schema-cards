import test from 'node:test';
import assert from 'node:assert/strict';
import {cards} from '../site/data.js';
import {cardText} from '../site/card-text.js';
import {emptyProfile,fields} from '../site/model.js';
import {buildReport,reportCards} from '../site/report-model.js';

const first=cards[0],second=cards.find(c=>cardText[c.id]),third=cards.at(-1);
function fixture(){const p=emptyProfile();p.cards[first.id]={rating:'yes',note:'Первая запись'};p.cards[second.id]={rating:'sometimes',discuss:true,note:'Вторая запись'};p.cards[third.id]={rating:'no'};return p;}
const build=(p,ids,options={})=>buildReport({cards,cardText,profile:p,ids,options:{images:false,...options},date:new Date('2026-11-16T10:00:00Z')});

test('PDF includes only explicitly chosen eligible cards, once each',()=>{
 const p=fixture(),ids=[first.id,first.id,third.id,'unknown'];const d=build(p,ids);const text=JSON.stringify(d.content);
 assert(text.includes(first.title));assert(!text.includes(second.title));assert(!text.includes(third.title));
 assert.equal(d.content.filter(n=>n.pageBreak==='before').length,1);
 assert.equal(reportCards(cards,p)[0].id,second.id);
 assert.throws(()=>build(p,[]));
});
test('privacy controls omit all notes and context, including custom names',()=>{
 const p=fixture();for(const field of fields)p.cards[first.id][field]='PRIVATE_'+field;
 p.sessionNote='PRIVATE_SESSION';p.situation.event='PRIVATE_EVENT';p.situation.step='PRIVATE_STEP';
 const text=JSON.stringify(build(p,[first.id],{notes:false,context:false}).content);
 assert(!text.includes('PRIVATE_'));assert(text.includes(first.description));
});
test('all note fields and complete original description survive verbatim',()=>{
 const p=fixture();const long='Очень длинная заметка. '.repeat(400)+'\nКОНЕЦ';
 for(const field of fields)p.cards[second.id][field]=field==='note'?long:`<b>${field}</b>\nВторая строка`;
 const d=build(p,[second.id]);const text=JSON.stringify(d.content);
 assert(text.includes(JSON.stringify(cardText[second.id]).slice(1,-1)));
 for(const field of fields)assert(text.includes(JSON.stringify(p.cards[second.id][field]).slice(1,-1)));
 const short=JSON.stringify(build(p,[second.id],{fullText:false}).content);assert(short.includes(second.description));
});
test('context does not mention a deselected linked card',()=>{
 const p=fixture();p.situation.mode=first.id;p.situation.need=second.id;
 const text=JSON.stringify(build(p,[first.id]).content);
 assert(!text.includes(second.title));
});
test('missing image fails explicitly instead of silently dropping a card',()=>{
 assert.throws(()=>build(fixture(),[first.id],{images:true}),/иллюстрация/);
});
