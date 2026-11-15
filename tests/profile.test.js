import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {cards,inventory} from '../site/data.js';
import {emptyProfile,validateProfile,selected,meaningful,escapeHtml} from '../site/model.js';
const ids=cards.map(c=>c.id);
test('catalogue accounts for every supplied image and explicit missing card',()=>{
 assert.equal(cards.length,74);assert.equal(new Set(ids).size,74);assert.deepEqual(inventory.counts,{need:10,schema:17,resource:14,mode:33});
 const assets=[...inventory.instructions,...cards.flatMap(c=>[c.front,c.back].filter(Boolean))];assert.equal(assets.length,119);assert.equal(new Set(assets).size,119);
 for(const path of assets)assert(existsSync(new URL('../site/'+path,import.meta.url)),path);
 for(const c of cards)assert(c.title&&c.description&&c.question&&c.type&&c.sourceKind);
});
test('round trip preserves all private notes, choices and scenario',()=>{
 const p=emptyProfile();p.cards[ids[0]]={rating:'sometimes',discuss:true,resource:true,ownName:'Мой режим',situation:'Тестовый эпизод',note:'<script>текст</script>\nВторая строка'};p.sessionNote='Тема';p.situation.mode=ids[0];p.situation.event='Ситуация';
 const restored=validateProfile(JSON.parse(JSON.stringify(p)),ids);assert.equal(restored.cards[ids[0]].ownName,'Мой режим');assert.equal(restored.cards[ids[0]].note,p.cards[ids[0]].note);assert.equal(restored.sessionNote,p.sessionNote);assert.equal(restored.situation.mode,ids[0]);assert(selected(restored.cards[ids[0]]));
});
test('invalid imports fail without mutating current profile',()=>{
 const original=emptyProfile();for(const value of [null,{},[],{...original,version:9},{...original,cards:[]},{...original,cards:{unknown:{}}},{...original,cards:{[ids[0]]:{rating:'diagnosis'}}},{...original,sessionNote:'x'.repeat(12001)}])assert.throws(()=>validateProfile(value,ids));assert.deepEqual(original,emptyProfile());
});
test('no rating, negative rating and notes retain distinct meanings',()=>{
 assert(!meaningful({}));assert(meaningful({rating:'no'}));assert(!selected({rating:'no'}));assert(selected({rating:'no',note:'Обсудить'}));assert(selected({resource:true}));assert(selected({ownName:'Название'}));
});
test('user strings are escaped in HTML and report',()=>{
 assert.equal(escapeHtml('<img src=x onerror="x">&'), '&lt;img src=x onerror=&quot;x&quot;&gt;&amp;');
 const html=readFileSync(new URL('../site/index.html',import.meta.url),'utf8');assert(html.includes("connect-src 'none'"));
});
test('full text is present for all supplied backs',async()=>{
 const {cardText}=await import('../site/card-text.js');
 assert.equal(Object.keys(cardText).length,40);
 for(const c of cards.filter(c=>c.back))assert(cardText[c.id]?.length>50,c.title);
});
test('every card photograph has a preserved source copy',()=>{
 for(const c of cards)for(const p of [c.front,c.back].filter(Boolean))assert(existsSync(new URL('../site/'+p.replace('assets/','originals/'),import.meta.url)),p);
});
