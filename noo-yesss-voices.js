/* Noo or Yesss: record every item with your own voice.
   Your recording is used first. Anything not recorded is read by the phone voice.
   Needs the updated NY hook line in the game (see README at the bottom). */
(function(){
'use strict';
if(typeof window.NY!=='function')return;
var NY=window.NY();
if(!NY.set||!NY.get){try{console.warn('Voice pack: please update the window.NY hook line in the game.')}catch(e){}return}
var $=function(s){return document.querySelector(s)};
function lg(){return NY.lang()}
function key(t){return NY.optKey(t)}

/* ---------- 1. my voice first, phone voice second ---------- */
var mode='mine';
try{if(localStorage.getItem('nooyesss:vmode')==='phone')mode='phone'}catch(e){}
var origClip=NY.get('clipUrl'),origSpeak=NY.get('speakText');
/* built-in voice shipped with the game (file noo-yesss-voices.js), used when this device has no recording of its own */
function builtIn(id){var b=window.NY_VOICES&&window.NY_VOICES[lg()];return (id&&b&&b[id])||null}
function hasAny(id){return !!(NY.hasClip(id)||builtIn(id))}
function clip(id){if(mode==='phone')return null;return origClip(id)||builtIn(id)}
NY.set('clipUrl',clip);
/* any text the game would read aloud is first looked up as a recording of that exact text */
NY.set('speakText',function(text,pitch,rate,cb){
  var url=text?clip(key(text)):null;
  if(url){NY.playClip(url,cb);return}
  origSpeak(text,pitch,rate,cb);
});

/* ---------- words on screen ---------- */
var V={
 en:{title:'Record all items',help:'Pick a group and say each word clearly. Your voice is used first. Anything you skip is read by the phone voice.',
  say:'Say it clearly, then tap Stop.',onlyMissing:'Only show items I have not recorded',auto:'Go to the next item automatically',back:'Back',
  rec:'🎙 Record',stop:'⏹ Stop',play:'▶ Play',del:'🗑 Delete',file:'📁 File',list:'☰ Groups',saved:'✓ Saved.',
  done:'Everything in this group is recorded! 🎉',blocked:'The microphone is not available here. Use File to pick a voice note, or open the game on a computer.',
  tooBig:'That file is too large. Please use a clip under 5 MB.',mine:'🎙 My voice',phone:'📱 Phone voice',modeTitle:'Who reads aloud?',open:'🎙 Record all items',
  gSys:'Game phrases',gNames:'Children names',gQs:'Questions',gDays:'Day questions',gOpp:'Opposite questions',recorded:'recorded',export:'📦 Save voices for release',exporting:'Preparing the file…',exportNone:'There are no recordings on this device yet.',exported:'Saved {n} recordings ({m} MB) as noo-yesss-voices.js. Put it next to the game and load it before the voice script. Children\'s names are left out.'},
 sw:{title:'Rekodi vitu vyote',help:'Chagua kundi na sema kila neno vizuri. Sauti yako hutumika kwanza. Ulichoruka kitasomwa na sauti ya simu.',
  say:'Sema vizuri kisha bonyeza Simamisha.',onlyMissing:'Onyesha tu nisivyorekodi',auto:'Nenda kwa kinachofuata moja kwa moja',back:'Rudi',
  rec:'🎙 Rekodi',stop:'⏹ Simamisha',play:'▶ Cheza',del:'🗑 Futa',file:'📁 Faili',list:'☰ Makundi',saved:'✓ Imehifadhiwa.',
  done:'Vyote katika kundi hili vimerekodiwa! 🎉',blocked:'Kipaza sauti hakipatikani hapa. Tumia Faili kuchagua ujumbe wa sauti, au fungua mchezo kwenye kompyuta.',
  tooBig:'Faili ni kubwa mno. Tumia klipu chini ya MB 5.',mine:'🎙 Sauti yangu',phone:'📱 Sauti ya simu',modeTitle:'Nani asome kwa sauti?',open:'🎙 Rekodi vitu vyote',
  gSys:'Maneno ya mchezo',gNames:'Majina ya watoto',gQs:'Maswali',gDays:'Maswali ya siku',gOpp:'Maswali ya kinyume',recorded:'imerekodiwa',export:'📦 Hifadhi sauti kwa kutoa mchezo',exporting:'Naandaa faili…',exportNone:'Hakuna rekodi kwenye kifaa hiki bado.',exported:'Rekodi {n} zimehifadhiwa ({m} MB) kama noo-yesss-voices.js. Iweke karibu na mchezo na uipakie kabla ya script ya sauti. Majina ya watoto hayajajumuishwa.'}
};
function X(){return V[lg()]}

/* ---------- 2. the full list of things that can be recorded ---------- */
function uniq(items){var s={},o=[];items.forEach(function(i){if(!s[i.k]){s[i.k]=1;o.push(i)}});return o}
function words(list){return uniq(list.map(function(w){return {k:key(w),t:String(w)}}))}
function groups(){
  var T=NY.T(),L=NY.L,P=window.NYPACK||{},lang=lg(),x=X(),out=[];

  var fb=T.cheers.map(function(c){return {k:'c:'+c,t:c}});
  fb.push({k:'well',t:T.wellPlain},{k:'no',t:T.no},{k:'try',t:T.tryPlain});
  out.push({id:'fb',title:T.gFeedback,items:fb});

  var sys=[{k:key(T.tapHint),t:T.tapHint}];
  NY.TAPCATS.forEach(function(c){var l=T[c[2]];if(l)sys.push({k:key(l),t:l})});
  var zs=lang==='sw'?['Rafiki mpya!','Endelea kucheza unifungue!']:['A new friend!','Keep playing to unlock me!'];
  zs.forEach(function(z){sys.push({k:key(z),t:z})});
  out.push({id:'sys',title:x.gSys,items:uniq(sys)});

  var names=Object.keys(NY.players);
  if(names.length)out.push({id:'names',title:x.gNames,items:words(names)});

  var q=T.q,skip={math:1,days:1,opp:1};
  var qs=[];
  Object.keys(q).forEach(function(id){if(!skip[id])qs.push({k:'q:'+id,t:q[id]})});
  NY.LETTERS[lang].forEach(function(l){
    qs.push({k:'q:letter:'+l[1],t:lang==='sw'?l[1]+' inaanza na herufi gani?':l[1]+' starts with which letter?'});
  });
  out.push({id:'qs',title:x.gQs,items:uniq(qs)});

  NY.TAPCATS.forEach(function(c){
    var id=c[0],title=T[c[2]]||id,items;
    if(id==='numbers'){
      items=[];for(var n=1;n<=100;n++)items.push({k:key(n),t:NY.numWord(n),label:String(n)});
    }else if(id==='letters'){
      var lw=NY.TAP_LETTERS[lang].map(function(l){return l[1]}).concat(NY.LETTERS[lang].map(function(l){return l[1]}));
      items=uniq(words(NY.ALPHA).concat(words(lw)));
    }else if(id==='colors'){
      var ex=lang==='sw'?['kijivu','samawati','dhahabu']:['grey','sky blue','gold'];
      items=words(NY.COLORS.map(L).concat(ex));
    }else if(id==='shapes'){
      items=words(Object.keys(NY.SHAPE_NAMES).map(function(k){return L(NY.SHAPE_NAMES[k])}));
    }else if(NY.TAPLISTS[id]){
      items=words(NY.TAPLISTS[id].map(L));
    }else return;
    out.push({id:id,title:title,items:items});
  });

  /* questions built by the content pack (days and opposites), when it is installed */
  if(NY.TAPLISTS.days){
    var d=NY.TAPLISTS.days.map(L),dq=[];
    d.forEach(function(n){
      dq.push(lang==='sw'?'Siku gani inakuja baada ya '+n+'?':'What day comes after '+n+'?');
      dq.push(lang==='sw'?'Siku gani inakuja kabla ya '+n+'?':'What day comes before '+n+'?');
    });
    out.push({id:'dayq',title:x.gDays,items:words(dq)});
  }
  if(P.OPP){
    var s=lang==='sw'?2:0,oq=[],ow=[];
    P.OPP.forEach(function(o){
      [o[s],o[s+1]].forEach(function(w){
        ow.push(w);
        oq.push(lang==='sw'?'Kinyume cha "'+w+'" ni nini?':'What is the opposite of "'+w+'"?');
      });
    });
    out.push({id:'oppq',title:x.gOpp,items:words(oq.concat(ow))});
  }
  return out;
}
/* the older record screen now lists everything too */
NY.set('phraseGroups',groups);

/* ---------- 3. guided recording screen ---------- */
var onlyMissing=true,auto=true,rec=null,cur=null;
var st=document.createElement('style');
st.textContent='.vtext{font-family:var(--display);font-size:clamp(2.2rem,10vw,3.6rem);line-height:1.1;text-align:center;overflow-wrap:anywhere}'+
'.vsub{font-size:1.4rem;text-align:center;font-weight:800}'+
'.vbar{height:18px;border:3px solid var(--ink);border-radius:999px;background:var(--soft);overflow:hidden}.vbar i{display:block;height:100%;background:var(--leaf)}'+
'.vrow{display:flex;gap:10px;flex-wrap:wrap}.vrow .btn{flex:1 1 120px}'+
'.vopt{display:flex;gap:10px;align-items:center;font-size:1.05rem;font-weight:800}.vopt input{width:24px;height:24px;flex:none}'+
'.vlang{display:flex;gap:10px;flex-wrap:wrap}.vlang .btn[aria-pressed="true"]{background:var(--ink);color:var(--sun)}'+
'#vrec .btn.rec{background:var(--coral);color:#fff}#vrec .btn.rec.on{background:var(--ink);color:var(--sun)}'+
'.vfile{position:relative;display:inline-flex;align-items:center;justify-content:center}.vfile input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}';
document.head.appendChild(st);

var sec=document.createElement('section');sec.id='vrec';sec.className='card';sec.hidden=true;
sec.innerHTML='<div class="bar"><button class="btn alt small" id="vBack" type="button"></button>'+
 '<div class="vlang" role="group" aria-label="Language"><button class="btn alt small" type="button" data-vl="en">English</button><button class="btn alt small" type="button" data-vl="sw">Kiswahili</button></div></div>'+
 '<h2 id="vTitle"></h2><p id="vHelp"></p><div class="note" id="vNote" hidden role="status" aria-live="polite"></div>'+
 '<div id="vBody" style="display:flex;flex-direction:column;gap:14px"></div>';
$('main').appendChild(sec);

function note(m){var n=$('#vNote');n.textContent=m||'';n.hidden=!m}
function have(g){return g.items.filter(function(i){return hasAny(i.k)}).length}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function paintLangBtns(){
  sec.querySelectorAll('[data-vl]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-vl')===lg()?'true':'false')});
  $('#vBack').textContent=X().back;
}
function toggle(text,val,fn){
  var l=el('label','vopt'),c=el('input');c.type='checkbox';c.checked=val;
  c.addEventListener('change',function(){fn(c.checked)});
  l.appendChild(c);l.appendChild(document.createTextNode(text));return l;
}

function renderList(){
  cur=null;var x=X(),box=$('#vBody');box.innerHTML='';
  paintLangBtns();$('#vTitle').textContent=x.title;$('#vHelp').textContent=x.help;
  box.appendChild(toggle(x.onlyMissing,onlyMissing,function(v){onlyMissing=v}));
  box.appendChild(toggle(x.auto,auto,function(v){auto=v}));
  groups().forEach(function(g){
    var h=have(g),b=el('button','btn alt',g.title+' · '+h+'/'+g.items.length+(h===g.items.length?' ✓':''));
    b.type='button';b.style.textAlign='left';b.style.fontSize='1.2rem';
    b.addEventListener('click',function(){startGroup(g)});
    box.appendChild(b);
  });
  var eb2=el('button','btn small',x.export);eb2.type='button';eb2.style.background='var(--sky)';
  eb2.addEventListener('click',exportVoices);box.appendChild(eb2);
}
function exportVoices(){
  var x=X(),out={en:{},sw:{}},old=window.NY_VOICES||{},skip={};
  Object.keys(NY.players).forEach(function(n){skip[key(n)]=1});   /* never ship children's names */
  ['en','sw'].forEach(function(l){var o=old[l]||{};Object.keys(o).forEach(function(k){out[l][k]=o[k]})});
  note(x.exporting);
  var r;try{r=indexedDB.open('nooyesss-voice',1)}catch(e){note(x.exportNone);return}
  r.onerror=function(){note(x.exportNone)};
  r.onsuccess=function(){
    var items=[];
    try{
      var rq=r.result.transaction('clips').objectStore('clips').openCursor();
      rq.onsuccess=function(){var c=rq.result;if(c){items.push({key:String(c.key),blob:c.value});c.continue()}else finish(items)};
      rq.onerror=function(){note(x.exportNone)};
    }catch(e){note(x.exportNone)}
  };
  function finish(items){
    items=items.filter(function(it){return !skip[it.key.slice(it.key.indexOf('|')+1)]});
    var left=items.length;
    if(!left&&!Object.keys(out.en).length&&!Object.keys(out.sw).length){note(x.exportNone);return}
    if(!left){write();return}
    items.forEach(function(it){
      var fr=new FileReader(),i=it.key.indexOf('|'),l=it.key.slice(0,i),k=it.key.slice(i+1);
      fr.onload=function(){if(out[l])out[l][k]=fr.result;if(!--left)write()};
      fr.onerror=function(){if(!--left)write()};
      fr.readAsDataURL(it.blob);
    });
  }
  function write(){
    var js='/* Built-in voice for Noo or Yesss. Load this file BEFORE noo-yesss-voice.js */\nwindow.NY_VOICES='+JSON.stringify(out)+';\n';
    var blob=new Blob([js],{type:'text/javascript'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='noo-yesss-voices.js';document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},1500);
    note(x.exported.replace('{n}',Object.keys(out.en).length+Object.keys(out.sw).length).replace('{m}',(blob.size/1048576).toFixed(1)));
  }
}
function startGroup(g){
  var items=onlyMissing?g.items.filter(function(i){return !hasAny(i.k)}):g.items;
  if(!items.length){note(X().done);return}
  note('');cur={g:g,items:items,i:0};renderStep();
}
function renderStep(){
  if(!cur){renderList();return}
  var x=X(),it=cur.items[cur.i],box=$('#vBody'),has=hasAny(it.k),busy=!!rec;
  box.innerHTML='';paintLangBtns();
  $('#vTitle').textContent=cur.g.title;$('#vHelp').textContent=x.say;
  var bar=el('div','vbar');bar.appendChild(el('i'));bar.firstChild.style.width=Math.round(100*(cur.i+1)/cur.items.length)+'%';
  box.appendChild(bar);
  box.appendChild(el('div','vsub',(cur.i+1)+' / '+cur.items.length+(has?'  ✓':'')));
  box.appendChild(el('div','vtext',it.label||it.t));
  if(it.label)box.appendChild(el('div','vsub',it.t));

  var r1=el('div','vrow');
  var rb=el('button','btn rec'+(busy?' on':''),busy?x.stop:x.rec);rb.type='button';
  rb.addEventListener('click',function(){busy?stopRec():startRec(it.k)});
  r1.appendChild(rb);box.appendChild(r1);

  var r2=el('div','vrow');
  var pb=el('button','btn alt small',x.play);pb.type='button';pb.disabled=busy||!has;
  pb.addEventListener('click',function(){var u=origClip(it.k)||builtIn(it.k);if(u){NY.stopVoice();NY.playClip(u,function(){})}});
  var fl=el('label','btn alt small vfile');fl.appendChild(document.createTextNode(x.file));
  var inp=el('input');inp.type='file';inp.accept='audio/*';inp.disabled=busy;
  inp.addEventListener('change',function(){addFile(it.k,inp.files&&inp.files[0]);inp.value=''});
  fl.appendChild(inp);
  var db=el('button','btn alt small',x.del);db.type='button';db.disabled=busy||!NY.hasClip(it.k);
  db.addEventListener('click',function(){NY.deleteClip(it.k);note('');renderStep()});
  r2.appendChild(pb);r2.appendChild(fl);r2.appendChild(db);box.appendChild(r2);

  var r3=el('div','vrow');
  var pv=el('button','btn alt small','⏮');pv.type='button';pv.disabled=busy||cur.i===0;
  pv.addEventListener('click',function(){cur.i--;note('');renderStep()});
  var ls=el('button','btn alt small',x.list);ls.type='button';ls.disabled=busy;
  ls.addEventListener('click',function(){note('');renderList()});
  var nx=el('button','btn alt small','⏭');nx.type='button';nx.disabled=busy||cur.i>=cur.items.length-1;
  nx.addEventListener('click',function(){cur.i++;note('');renderStep()});
  r3.appendChild(pv);r3.appendChild(ls);r3.appendChild(nx);box.appendChild(r3);
}
function saved(){
  if(!cur){renderList();return}
  if(auto&&cur.i<cur.items.length-1){cur.i++;note(X().saved);renderStep()}
  else if(auto){note(X().done);renderList()}
  else{note(X().saved);renderStep()}
}
function startRec(id){
  note('');
  if(rec)return;
  if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)||typeof MediaRecorder==='undefined'){note(X().blocked);return}
  NY.stopVoice();
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    var chunks=[],mr=new MediaRecorder(stream);
    mr.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
    mr.onstop=function(){
      stream.getTracks().forEach(function(t){t.stop()});
      var cancelled=rec&&rec.cancel;rec=null;
      if(cancelled)return;
      var blob=new Blob(chunks,{type:mr.mimeType||'audio/webm'});
      if(blob.size>0){NY.saveClip(id,blob);saved()}else renderStep();
    };
    rec={id:id,mr:mr};mr.start();renderStep();
  }).catch(function(){rec=null;note(X().blocked);renderStep()});
}
function stopRec(){if(rec){try{rec.mr.stop()}catch(e){rec=null;renderStep()}}}
function addFile(id,f){
  if(!f)return;
  if(f.size>5*1024*1024){note(X().tooBig);return}
  NY.saveClip(id,f);saved();
}
function leave(){
  if(rec){rec.cancel=true;try{rec.mr.stop()}catch(e){}rec=null}
  NY.stopVoice();sec.hidden=true;
  NY.show(NY.state.name?'menu':'welcome');NY.openDrawer();
}
$('#vBack').addEventListener('click',leave);
sec.querySelectorAll('[data-vl]').forEach(function(b){
  b.addEventListener('click',function(){
    if(rec){rec.cancel=true;try{rec.mr.stop()}catch(e){}rec=null}
    var d=document.querySelector('#drawer .lang button[data-lang="'+b.getAttribute('data-vl')+'"]');
    if(d)d.click();
    note('');cur=null;renderList();
  });
});

/* ---------- 4. grown-ups menu: open the recorder, choose who reads ---------- */
var ob=el('button','btn alt small');ob.type='button';ob.id='vOpen';
var ro=$('#recOpenM');ro.parentNode.insertBefore(ob,ro);
ob.addEventListener('click',function(){
  NY.show('record');$('#record').hidden=true;sec.hidden=false;note('');renderList();
});
var mw=el('div'),mh=el('h3'),mb=el('div','levels');
mw.style.cssText='display:flex;flex-direction:column;gap:10px';mw.appendChild(mh);mw.appendChild(mb);
var vs=$('#voices');vs.parentNode.insertBefore(mw,vs);
function paintMode(){
  var x=X();ob.textContent=x.open;mh.textContent=x.modeTitle;mb.innerHTML='';
  [['mine',x.mine],['phone',x.phone]].forEach(function(m){
    var b=el('button','btn alt small',m[1]);b.type='button';
    b.setAttribute('aria-pressed',mode===m[0]?'true':'false');
    b.addEventListener('click',function(){
      mode=m[0];try{localStorage.setItem('nooyesss:vmode',mode)}catch(e){}
      paintMode();
      NY.say([{t:lg()==='sw'?'Habari':'Hello',pitch:1.3}],{rate:.9,fallback:3000});
    });
    mb.appendChild(b);
  });
}
new MutationObserver(paintMode).observe($('#drawer'),{attributes:true,attributeFilter:['class']});
paintMode();
})();

/* ===== README =====
   1. Replace the old window.NY=... hook in the game with the longer one below (same place, just above the last applyLang();):

   window.NY=function(){return {state:state,players:players,store:store,TXT:TXT,TOPICS:TOPICS,TAPCATS:TAPCATS,TAPLISTS:TAPLISTS,TAP_LETTERS:TAP_LETTERS,
     COLORS:COLORS,ANIMALS:ANIMALS,LETTERS:LETTERS,ALPHA:ALPHA,NUMS:NUMS,SHAPE_NAMES:SHAPE_NAMES,
     mk:mk,shuffle:shuffle,pickOne:pickOne,byTier:byTier,L:L,T:T,lang:function(){return lang},say:say,show:show,cheer:cheer,
     confetti:confetti,tone:tone,sparkle:sparkle,optKey:optKey,applyLang:applyLang,stopVoice:stopVoice,openDrawer:openDrawer,
     numWord:numWord,playClip:playClip,saveClip:saveClip,deleteClip:deleteClip,hasClip:hasClip,
     get:function(n){return n==='clipUrl'?clipUrl:n==='speakText'?speakText:null},
     set:function(n,f){if(n==='clipUrl')clipUrl=f;else if(n==='speakText')speakText=f;else if(n==='phraseGroups')phraseGroups=f}}};

   2. Add these lines after the pack line, before </body>. The voices file is optional and is made by the 'Save voices for release' button:
   <script src="noo-yesss-voices.js"></script>
   <script src="noo-yesss-voice.js"></script>
*/
