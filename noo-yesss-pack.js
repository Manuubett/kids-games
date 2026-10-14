/* Noo or Yesss: content pack + My Zoo + daily streak.
   Needs one hook line inside the game (see README at the bottom of this file). */
(function(){
'use strict';
if(typeof window.NY!=='function')return;
var NY=window.NY();
var $=function(s){return document.querySelector(s)};
var TXT=NY.TXT,TAPLISTS=NY.TAPLISTS,state=NY.state,players=NY.players;
function lg(){return NY.lang()}
function ix(){return lg()==='sw'?1:0}

/* ================= 1. MORE CONTENT: [English, Kiswahili, picture] ================= */
TAPLISTS.animals=TAPLISTS.animals.concat([
 ['tiger','simbamarara','🐯'],['wolf','mbwa mwitu','🐺'],['fox','mbweha','🦊'],['panda','panda','🐼'],['koala','koala','🐨'],
 ['kangaroo','kangaruu','🦘'],['peacock','tausi','🦚'],['flamingo','heroe','🦩'],['octopus','pweza','🐙'],['shark','papa','🦈'],
 ['bat','popo','🦇'],['gorilla','sokwe mtu','🦍']
]);
var MORE={
 family:[['mother','mama','👩'],['father','baba','👨'],['baby','mtoto mchanga','👶'],['grandmother','bibi','👵'],['grandfather','babu','👴'],['brother','kaka','👦'],['sister','dada','👧'],['friend','rafiki','🤝']],
 jobs:[['teacher','mwalimu','🧑‍🏫'],['doctor','daktari','🧑‍⚕️'],['nurse','muuguzi','👩‍⚕️'],['farmer','mkulima','🧑‍🌾'],['cook','mpishi','🧑‍🍳'],['police officer','polisi','👮'],['firefighter','mzimamoto','🧑‍🚒'],['builder','fundi','👷'],['pilot','rubani','🧑‍✈️']],
 clothes:[['shirt','shati','👕'],['trousers','suruali','👖'],['dress','gauni','👗'],['shoes','viatu','👟'],['hat','kofia','🧢'],['socks','soksi','🧦'],['jacket','koti','🧥'],['scarf','skafu','🧣']],
 feelings:[['happy','furaha','😀'],['sad','huzuni','😢'],['angry','hasira','😠'],['scared','hofu','😨'],['sleepy','usingizi','😴'],['surprised','mshangao','😮'],['sick','mgonjwa','🤒'],['love','upendo','🥰']],
 kenyan:[['ugali','ugali','🍲'],['sukuma wiki','sukuma wiki','🥬'],['chapati','chapati','🫓'],['githeri','githeri','🫘'],['nyama choma','nyama choma','🍖'],['samosa','sambusa','🥟'],['pilau','pilau','🍛'],['porridge','uji','🥣'],['mandazi','mandazi','🍩'],['beans','maharagwe','🫘']],
 school:[['book','kitabu','📖'],['pencil','penseli','✏️'],['school bag','mkoba','🎒'],['ruler','rula','📏'],['scissors','mkasi','✂️'],['crayons','rangi za kuchorea','🖍️'],['paper','karatasi','📄'],['teacher','mwalimu','🧑‍🏫']],
 days:[['Monday','Jumatatu','📅'],['Tuesday','Jumanne','📅'],['Wednesday','Jumatano','📅'],['Thursday','Alhamisi','📅'],['Friday','Ijumaa','📅'],['Saturday','Jumamosi','📅'],['Sunday','Jumapili','📅']]
};
Object.keys(MORE).forEach(function(k){TAPLISTS[k]=MORE[k]});

/* Tap-and-hear picture buttons: [key, picture, label key, English label, Kiswahili label] */
[['family','👪','tFamily','Family','Familia'],['jobs','🧑‍🚒','tJobs','Jobs','Kazi'],['clothes','👕','tClothes','Clothes','Nguo'],
 ['feelings','😀','tFeelings','Feelings','Hisia'],['kenyan','🍲','tKenyan','Kenyan food','Chakula cha Kenya'],
 ['school','🎒','tSchool','School','Shule'],['days','📅','tDays','Days of the week','Siku za wiki']
].forEach(function(c){NY.TAPCATS.push([c[0],c[1],c[2]]);TXT.en[c[2]]=c[3];TXT.sw[c[2]]=c[4]});

/* Quiz topics made from the lists above: [id, tile, colour, list, EN title, EN sub, EN question, SW title, SW sub, SW question] */
[
 ['food','🍎','var(--tangerine)','fruits','Food','Name the food','Which food is this?','Chakula','Taja chakula','Hiki ni chakula gani?'],
 ['vehicles','🚗','var(--sky)','vehicles','Vehicles','What goes vroom?','Which vehicle is this?','Vyombo vya usafiri','Gari na zaidi','Hiki ni chombo gani cha usafiri?'],
 ['body','🖐️','var(--coral)','body','My Body','Body parts','Which body part is this?','Mwili wangu','Sehemu za mwili','Hii ni sehemu gani ya mwili?'],
 ['home','🏠','var(--grape)','things','Things','At home','What is this?','Vitu','Nyumbani','Hiki ni kitu gani?'],
 ['family','👪','var(--bubblegum)','family','Family','People we love','Who is this?','Familia','Watu tunaowapenda','Huyu ni nani?'],
 ['kenya','🍲','var(--leaf)','kenyan','Kenyan Food','Ugali and more','Which food is this?','Chakula cha Kenya','Ugali na zaidi','Hiki ni chakula gani?'],
 ['clothes','👕','var(--sky)','clothes','Clothes','What do we wear?','What is this?','Nguo','Tunavaa nini?','Hii ni nini?'],
 ['feelings','😀','var(--tangerine)','feelings','Feelings','How do we feel?','How does this face feel?','Hisia','Tunajisikiaje?','Uso huu unajisikiaje?'],
 ['jobs','🧑‍🌾','var(--grape)','jobs','Jobs','Who helps us?','Who is this?','Kazi','Nani hutusaidia?','Huyu ni nani?']
].forEach(function(q){
  var id=q[0],cat=q[3];
  TXT.en.t[id]=[q[4],q[5]];TXT.en.q[id]=q[6];
  TXT.sw.t[id]=[q[7],q[8]];TXT.sw.q[id]=q[9];
  NY.TOPICS.push({id:id,tile:q[1],color:q[2],build:function(){
    var pool=TAPLISTS[cat].slice(0,NY.byTier([8,12,99]));
    var names=pool.map(NY.L),qq=NY.T().q[id];
    return NY.shuffle(pool).slice(0,NY.byTier([4,5,6])).map(function(a){
      return NY.mk(qq,'<div class="big" style="font-size:6rem">'+a[2]+'</div>',NY.L(a),names,qq,'q:'+id);
    });
  }});
});

/* Days of the week: what comes after / before? */
TXT.en.t.days=['Days','What day comes next?'];TXT.sw.t.days=['Siku','Siku gani inafuata?'];
TXT.en.q.days='Days';TXT.sw.q.days='Siku';
NY.TOPICS.push({id:'days',tile:'📅',color:'var(--sky)',build:function(){
  var names=MORE.days.map(NY.L),out=[],used={};
  var n=NY.byTier([3,4,5]);
  while(out.length<n){
    var i=Math.floor(Math.random()*7);if(used[i])continue;used[i]=1;
    var before=NY.byTier([0,1,1])&&Math.random()<.4;
    var d=NY.L(MORE.days[i]),ans=NY.L(MORE.days[(i+(before?6:1))%7]);
    var p=lg()==='sw'?('Siku gani inakuja '+(before?'kabla ya ':'baada ya ')+d+'?'):('What day comes '+(before?'before ':'after ')+d+'?');
    out.push(NY.mk(p,{text:d},ans,names,p));
  }
  return out;
}});

/* Opposites */
var OPP=[['big','small','kubwa','ndogo'],['hot','cold','joto','baridi'],['up','down','juu','chini'],['day','night','mchana','usiku'],
 ['happy','sad','furaha','huzuni'],['fast','slow','haraka','polepole'],['open','close','fungua','funga'],['full','empty','jaa','tupu'],['long','short','ndefu','fupi']];
TXT.en.t.opp=['Opposites','Big or small?'];TXT.sw.t.opp=['Kinyume','Kubwa au ndogo?'];
TXT.en.q.opp='Opposites';TXT.sw.q.opp='Kinyume';
NY.TOPICS.push({id:'opp',tile:'↔️',color:'var(--coral)',build:function(){
  var s=lg()==='sw'?2:0,words=[];
  OPP.forEach(function(o){words.push(o[s],o[s+1])});
  return NY.shuffle(OPP).slice(0,NY.byTier([4,5,6])).map(function(o){
    var flip=Math.random()<.5,w=flip?o[s+1]:o[s],ans=flip?o[s]:o[s+1];
    var p=lg()==='sw'?('Kinyume cha "'+w+'" ni nini?'):('What is the opposite of "'+w+'"?');
    return NY.mk(p,{text:w},ans,words,p);
  });
}});

/* ================= 2. MY ZOO: stars unlock animals ================= */
var ZT={
 en:{zoo:'My Zoo',more:'{a} more stars for a new animal',all:'You found every animal!',friend:'A new friend: {a}!',ok:'Yay!',streak:'{n} day streak',locked:'Keep playing to unlock me!',toast:'🎁 New animal! Open My Zoo'},
 sw:{zoo:'Mbuga Yangu',more:'Nyota {a} zaidi kupata mnyama mpya',all:'Umepata wanyama wote!',friend:'Rafiki mpya: {a}!',ok:'Safi!',streak:'Siku {n} mfululizo',locked:'Endelea kucheza unifungue!',toast:'🎁 Mnyama mpya! Fungua Mbuga Yangu'}
};
function ZX(){return ZT[lg()]}
var FACTS={
 dog:['Dogs wag their tails when they are happy.','Mbwa hutikisa mkia wanapofurahi.'],cat:['Cats can see well in the dark.','Paka huona vizuri gizani.'],
 cow:['A cow gives us milk.',"Ng'ombe hutupa maziwa."],fish:['Fish breathe underwater.','Samaki hupumua majini.'],
 bird:['Most birds can fly.','Ndege wengi wanaweza kuruka.'],lion:["A lion's roar can be heard very far away.",'Mngurumo wa simba husikika mbali sana.'],
 elephant:['An elephant uses its trunk like a hand.','Tembo hutumia mkonga wake kama mkono.'],monkey:['Monkeys love to climb trees.','Tumbili hupenda kupanda miti.'],
 giraffe:['The giraffe is the tallest animal.','Twiga ndiye mnyama mrefu kuliko wote.'],zebra:['Every zebra has its own stripes.','Kila punda milia ana mistari yake.'],
 horse:['Horses can sleep standing up.','Farasi wanaweza kulala wakiwa wamesimama.'],sheep:['Sheep give us wool.','Kondoo hutupa sufu.'],
 chicken:['Hens lay eggs.','Kuku hutaga mayai.'],bee:['Bees make honey.','Nyuki hutengeneza asali.'],
 turtle:['A turtle carries its home on its back.','Kobe hubeba nyumba yake mgongoni.'],hippo:['Hippos spend the day in the water.','Viboko hukaa majini mchana.'],
 butterfly:['A butterfly starts life as a caterpillar.','Kipepeo huanza maisha kama kiwavi.']
};
function animals(){return TAPLISTS.animals}
/* first 5 animals cost 10 stars each, then 15 stars each */
function progress(stars){
  var n=0,max=animals().length,c;
  while(n<max){c=n<5?10:15;if(stars>=c){stars-=c;n++}else break}
  return {n:n,cost:c||15,have:stars,left:(c||15)-stars,done:n>=max};
}
function dayNum(){return Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5)}
function me(){return players[state.name]}

var style=document.createElement('style');
style.textContent=
'#menu .homebtns{grid-template-rows:1fr 1fr 1fr}#menu .bigbtn{padding:14px 20px}#menu .bigbtn .bi{font-size:4rem}'+
'.b-zoo{background:var(--leaf)}.bigbtn{position:relative}.zdot{position:absolute;top:10px;right:14px;background:var(--coral);border:3px solid var(--ink);border-radius:999px;padding:2px 12px;font-family:var(--display);font-size:1rem}'+
'.zbar{height:22px;border:4px solid var(--ink);border-radius:999px;background:var(--soft);overflow:hidden}.zfill{height:100%;background:var(--leaf);width:0;transition:width .4s}'+
'.zgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px}'+
'.zcell{border:4px solid var(--ink);border-radius:22px;background:var(--soft);min-height:96px;font-size:3.2rem;line-height:1;padding:8px;box-shadow:0 5px 0 var(--ink)}'+
'.zcell.lock span{filter:brightness(0);opacity:.22}.zcell.hit{animation:boing .6s}'+
'.zstat{font-family:var(--display);font-size:1.4rem;background:var(--ink);color:var(--sun);border-radius:999px;padding:6px 16px}.zstat[hidden]{display:none}'+
'#zoo{min-height:100dvh}#zoo .bar{align-items:center}'+
'.zrev{position:fixed;inset:0;z-index:90;background:rgba(29,26,59,.75);display:grid;place-items:center;padding:20px}'+
'.zrev>div{background:var(--paper);border:5px solid var(--ink);border-radius:32px;padding:28px;text-align:center;display:flex;flex-direction:column;gap:14px;align-items:center;max-width:420px;width:100%;animation:pop .4s}'+
'.zrev .e{font-size:8rem;line-height:1}.ztoast{position:fixed;left:50%;bottom:18px;translate:-50% 0;z-index:85;background:var(--ink);color:var(--sun);border-radius:999px;padding:10px 20px;font-family:var(--display);font-size:1.1rem}';
document.head.appendChild(style);

/* home button, streak chip and the zoo screen */
var hb=$('#menu .homebtns'),zb=document.createElement('button');
zb.type='button';zb.className='bigbtn b-zoo';zb.id='zooOpen';
zb.innerHTML='<span class="bi">🦁</span><span class="bt" id="zooOpenText"></span><span class="zdot" id="zooDot" hidden>🎁</span>';
hb.appendChild(zb);
var chip=document.createElement('div');chip.className='zstat';chip.id='menuStreak';chip.hidden=true;
$('#menuStars').parentNode.insertBefore(chip,$('#menuStars').nextSibling);
var zoo=document.createElement('section');zoo.id='zoo';zoo.className='card';zoo.hidden=true;
zoo.innerHTML='<div class="bar"><button class="btn alt small" id="zooBack" type="button" style="font-size:1.7rem;min-width:56px;min-height:56px">🏠</button><div class="zstat" id="zooStreak"></div><div class="zstat" id="zooStars"></div></div>'+
 '<h2 id="zooTitle"></h2><div class="zbar"><div class="zfill" id="zooFill"></div></div><p id="zooNext"></p><div class="zgrid" id="zooGrid"></div><p class="note" id="zooFact" hidden></p>';
$('main').appendChild(zoo);

function paintStreak(){
  var z=me()&&me().zoo,n=(z&&z.streak)||0;
  var alive=z&&z.day&&z.day>=dayNum()-1&&n>0;
  var t=alive?'🔥 '+n:'';
  chip.textContent=t;chip.hidden=!t;$('#zooStreak').textContent=t;$('#zooStreak').hidden=!t;
}
function paintMenuBits(){
  $('#zooOpenText').textContent=ZX().zoo;
  $('#zooDot').hidden=!(me()&&pendingCount()>0);
  paintStreak();
}
function pendingCount(){
  var p=me();if(!p)return 0;
  return progress(p.stars||0).n-((p.zoo&&p.zoo.seen)||0);
}

function renderZoo(){
  var p=me()||{stars:0},u=progress(p.stars||0),list=animals(),x=ZX();
  $('#zooTitle').textContent=x.zoo;$('#zooStars').textContent='⭐ '+(p.stars||0);
  $('#zooFill').style.width=(u.done?100:Math.round(100*u.have/u.cost))+'%';
  $('#zooNext').textContent=u.done?x.all:x.more.replace('{a}',u.left);
  $('#zooFact').hidden=true;paintStreak();
  var g=$('#zooGrid');g.innerHTML='';
  list.forEach(function(a,i){
    var b=document.createElement('button'),open=i<u.n;
    b.type='button';b.className='zcell'+(open?'':' lock');
    var s=document.createElement('span');s.textContent=open?a[2]:a[2];b.appendChild(s);
    b.setAttribute('aria-label',open?NY.L(a):'?');
    b.addEventListener('click',function(){
      b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');
      var f=$('#zooFact');
      if(!open){f.textContent=x.locked;f.hidden=false;NY.say([{t:x.locked,pitch:1.4}],{rate:.9,fallback:4000});return}
      NY.sparkle(b);NY.tone([523,659],.08);
      var fact=FACTS[a[0]],items=[{k:NY.optKey(NY.L(a)),t:NY.L(a),pitch:1.3}];
      f.textContent=NY.L(a)+(fact?': '+fact[ix()]:'');f.hidden=false;
      if(fact)items.push({t:fact[ix()],pitch:1.2});
      NY.say(items,{rate:.85,fallback:9000});
    });
    g.appendChild(b);
  });
}
function openZoo(){
  NY.show('menu');$('#menu').hidden=true;zoo.hidden=false;$('#menuToggle').hidden=true;
  renderZoo();setTimeout(maybeReveal,300);
}
function leaveZoo(){zoo.hidden=true;NY.stopVoice();NY.show('menu');paintMenuBits()}
$('#zooOpen').addEventListener('click',openZoo);
$('#zooBack').addEventListener('click',leaveZoo);

/* the "new animal" celebration */
var revealing=false;
function maybeReveal(){
  if(revealing||!me())return;
  var inZoo=!zoo.hidden,onMenu=!$('#menu').hidden;
  if(!inZoo&&!onMenu)return;
  var p=me(),u=progress(p.stars||0),seen=(p.zoo&&p.zoo.seen)||0;
  if(u.n<=seen)return;
  p.zoo=p.zoo||{};p.zoo.seen=u.n;NY.store.set(players);
  var a=animals()[u.n-1],x=ZX(),name=NY.L(a);
  revealing=true;
  var o=document.createElement('div');o.className='zrev';
  o.innerHTML='<div><div class="e">'+a[2]+'</div><h2></h2><button class="btn" type="button"></button></div>';
  o.querySelector('h2').textContent=x.friend.replace('{a}',name);
  var ok=o.querySelector('button');ok.textContent=x.ok;
  ok.addEventListener('click',function(){o.remove();revealing=false;if(!zoo.hidden)renderZoo();paintMenuBits();NY.stopVoice()});
  document.body.appendChild(o);
  NY.cheer();NY.confetti();
  NY.say([{t:lg()==='sw'?'Rafiki mpya!':'A new friend!',pitch:1.6},{k:NY.optKey(name),t:name,pitch:1.4}],{rate:.9,fallback:8000});
}

/* streak + new-animal toast whenever a star is won */
var last={};
function onStars(){
  var p=me();if(!p)return;
  var stars=p.stars||0,prev=last[state.name];last[state.name]=stars;
  if(prev!==undefined&&stars>prev){
    p.zoo=p.zoo||{};var z=p.zoo,dn=dayNum();
    if(z.day!==dn){z.streak=(z.day===dn-1)?(z.streak||0)+1:1;z.day=dn;NY.store.set(players)}
    if(pendingCount()>0&&$('#menu').hidden&&zoo.hidden)toast(ZX().toast);
  }
  paintMenuBits();
}
function toast(m){
  if($('.ztoast'))return;
  var t=document.createElement('div');t.className='ztoast';t.textContent=m;document.body.appendChild(t);
  setTimeout(function(){t.remove()},3500);
}
var mo=new MutationObserver(onStars);
['#menuStars','#gameStars','#tapStars'].forEach(function(s){mo.observe($(s),{childList:true,characterData:true,subtree:true})});
new MutationObserver(function(){
  if(!$('#menu').hidden){paintMenuBits();setTimeout(maybeReveal,500)}
}).observe($('#menu'),{attributes:true,attributeFilter:['hidden']});

NY.applyLang();   /* rebuild menus so the new topics and buttons appear */
paintMenuBits();
})();

/* ===== README =====
   1. Save this file next to the game, or paste its contents inside a second <script> block just before </body>.
   2. In the game's own script, just above the line `applyLang();` near the very end (the one followed by `openDB(`), add:

   window.NY=function(){return {state:state,players:players,store:store,TXT:TXT,TOPICS:TOPICS,TAPCATS:TAPCATS,TAPLISTS:TAPLISTS,
     mk:mk,shuffle:shuffle,pickOne:pickOne,byTier:byTier,L:L,T:T,lang:function(){return lang},say:say,show:show,cheer:cheer,
     confetti:confetti,tone:tone,sparkle:sparkle,optKey:optKey,applyLang:applyLang,stopVoice:stopVoice}};
*/
