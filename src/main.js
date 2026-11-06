import * as THREE from 'three';
import './style.css';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bc3d1);
scene.fog = new THREE.Fog(0x9bc3d1, 95, 360);
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 700);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('game').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd9efff, 0x65734d, 2));
const sun = new THREE.DirectionalLight(0xffe3b3, 2.4);
sun.position.set(-90, 140, 70);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -120; sun.shadow.camera.right = 120;
sun.shadow.camera.top = 120; sun.shadow.camera.bottom = -120;
scene.add(sun);

const mat = (color, roughness=.9) => new THREE.MeshStandardMaterial({ color, roughness });
const grass=mat(0x638b58), road=mat(0x343b40), line=mat(0xe5d7a2), glass=new THREE.MeshStandardMaterial({color:0x79a7b8,roughness:.3,metalness:.15});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1200,1200),grass);
ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
const city=new THREE.Group();scene.add(city);const solidBuildings=[];
function box(parent,w,h,d,material,x,y,z,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m;}
function building(x,z,w,d,h,color,kind){
 const g=new THREE.Group();g.position.set(x,0,z);city.add(g);
 box(g,w,h,d,mat(color),0,h/2,0);box(g,w+1,.7,d+1,mat(0x51585a),0,h+.35,0);
 const floors=Math.max(2,Math.floor(h/4));
 for(let f=0;f<floors;f++){const y=2+f*3.5;for(let side of [-1,1])for(let col of [-1,0,1])box(g,1.15,1.4,.12,glass,col*w*.28,y,side*(d/2+.07),false);}
 box(g,2.1,3.2,.18,mat(0x493b31),0,1.6,d/2+.12,false);
 const sign=box(g,Math.min(w*.72,kind.length*.65),.55,.2,mat(0x1c5b54),0,h*.72,d/2+.16,false);
 solidBuildings.push({x,z,w,d,kind});
}
function roadX(x,z,len){box(city,13,.12,len,road,x,0,z,false);for(let p=-len/2+7;p<len/2;p+=12)box(city,.16,.03,4,line,x,.08,z+p,false);}
function roadZ(x,z,len){box(city,len,.12,13,road,x,0,z,false);for(let p=-len/2+7;p<len/2;p+=12)box(city,4,.03,.16,line,x+p,.08,z,false);}
for(let i=-5;i<=5;i++){roadX(i*55,0,600);roadZ(0,i*55,600);}
const landmarkKinds=['SUPERMARKET','RESTAURANT','BANK','HOSPITAL','MALL','CHAIR STORE','BED STORE','FOOD STORE'];
let landmarkIndex=0;
for(let x=-275;x<=275;x+=55)for(let z=-275;z<=275;z+=55)for(let side=0;side<2;side++){
 const bx=x+(side?15:-15),bz=z+15,w=18+((Math.abs(x+z)+side*7)%8),d=17+((Math.abs(x-z)+side*5)%7),h=12+((Math.abs(x*3+z*2)+side*11)%35);
 const special=(z===-275&&side===0&&x>=-275&&x<=110)?landmarkKinds[(x+275)/55]:null;
 const kind=special|| (side?'SHOP':'RESIDENCE');
 building(bx,bz,w,d,h,[0xb9a080,0x9babb0,0xc5b49a,0x8e9b83,0xb47f67][(Math.abs(x+z+side*3)/5|0)%5],kind);
}
const trunk=mat(0x65452f),leaves=mat(0x39734c);
function tree(x,z,s){const g=new THREE.Group();g.position.set(x,0,z);city.add(g);const t=new THREE.Mesh(new THREE.CylinderGeometry(.35*s,.5*s,3*s,7),trunk);t.position.y=1.5*s;t.castShadow=true;g.add(t);const c=new THREE.Mesh(new THREE.SphereGeometry(2.1*s,8,7),leaves);c.position.y=4*s;c.castShadow=true;g.add(c);}
for(let x=-290;x<=290;x+=18)for(let z=-290;z<=290;z+=18)if(Math.abs(x%55)>9&&Math.abs(z%55)>9&&Math.random()>.65)tree(x+(Math.random()-.5)*5,z+(Math.random()-.5)*5,.7+Math.random()*.5);

const player=new THREE.Group();scene.add(player);
const skin=mat(0x75482f),shirt=mat(0x2db38b),pants=mat(0x202b35);
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.75,4,7),shirt);torso.position.y=1.45;torso.castShadow=true;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),skin);head.position.y=2.25;head.castShadow=true;player.add(head);
const legs=[];for(const x of [-.2,.2]){const l=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.55,3,6),pants);l.position.set(x,.55,0);player.add(l);legs.push(l);}
player.position.set(0,0,4);

function makeCar(x,z,color,parked=true){const g=new THREE.Group();g.position.set(x,.15,z);city.add(g);box(g,2.1,.75,4.2,mat(color,.55),0,.7,0);box(g,1.65,.75,2.1,glass,0,1.35,-.15);for(const wx of [-1.08,1.08])for(const wz of [-1.35,1.35]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.24,10),mat(0x17191b));w.rotation.z=Math.PI/2;w.position.set(wx,.42,wz);g.add(w);}return{group:g,speed:0,parked,occupied:false};}
const cars=[];for(let i=0;i<12;i++){const c=makeCar(-260+Math.random()*520,(i%4)*55-82.5,[0xd04c3e,0xe2e0d5,0x267a99,0x272b31,0xc6a340][i%5]);c.group.rotation.y=(i%2)*Math.PI/2;cars.push(c);}
for(let i=0;i<8;i++){const c=makeCar(-260+i*72,-28,[0xc54c3f,0xd6d7d0,0x1c718b,0x272a30][i%4],false);c.speed=4+Math.random()*3;cars.push(c);}
const people=[];for(let i=0;i<24;i++){const p=new THREE.Group();const top=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.55,3,6),mat([0xd6a23d,0xb95648,0x397e80,0xd2d2cb,0x70589a][i%5]));top.position.y=1.05;p.add(top);const h=new THREE.Mesh(new THREE.SphereGeometry(.19,8,7),skin);h.position.y=1.75;p.add(h);p.position.set(-285+Math.random()*570,0,-125+Math.random()*250);city.add(p);people.push({mesh:p,angle:Math.random()*Math.PI*2,turn:1+Math.random()*3});}
const state={started:false,driving:null,money:50000,energy:100,ownsHome:false,inventory:[],furniture:[],activeJob:null,inside:false,outsidePosition:null};
const saveKey='cityLife3DSaveV2';
const jobs=[
 {name:'Neighbourhood delivery',pay:160,x:78,z:-92,detail:'Deliver a parcel to the apartment block'},
 {name:'Market collection',pay:220,x:-92,z:88,detail:'Collect supplies from the market'},
 {name:'Office documents',pay:280,x:112,z:112,detail:'Take documents to the business district'}
];
const jobMarker=new THREE.Group();
const markerRing=new THREE.Mesh(new THREE.TorusGeometry(2.4,.16,6,24),mat(0xffd34f));
markerRing.rotation.x=Math.PI/2;jobMarker.add(markerRing);
const markerBeam=new THREE.Mesh(new THREE.CylinderGeometry(.12,.65,5,8,1,true),new THREE.MeshBasicMaterial({color:0xffd34f,transparent:true,opacity:.22,side:THREE.DoubleSide}));
markerBeam.position.y=2.5;jobMarker.add(markerBeam);jobMarker.visible=false;city.add(jobMarker);
function openPanel(title,copy,options){
 $('panel-title').textContent=title;$('panel-copy').textContent=copy;
 const root=$('panel-options');root.innerHTML='';
 options.forEach(o=>{const b=document.createElement('button');b.textContent=o.label;b.onclick=()=>{o.run();};root.appendChild(b);});
 $('city-panel').classList.remove('hidden');
}
function closePanel(){$('city-panel').classList.add('hidden');}
$('close-panel').onclick=closePanel;
function openJobs(){
 if(state.activeJob){openPanel('Active work',state.activeJob.detail+' · Go to the marked location to collect $'+state.activeJob.pay.toLocaleString('en-US')+'.',[{label:'Cancel this job',run:()=>{state.activeJob=null;closePanel();notify('Job cancelled.');}}]);return;}
 openPanel('Local job board','Choose a lawful local task. Reach the yellow marker to collect your payment.',jobs.map((j)=>({label:j.name+' · $'+j.pay.toLocaleString('en-US'),run:()=>{state.activeJob=j;closePanel();notify('Job accepted: '+j.detail+'.');}})));
}
$('jobs').onclick=openJobs;
$('city-menu').onclick=()=>openPanel('City services','Manage your growing life in the city.',[
 {label:state.ownsHome?'Home owned ✓':'Buy a starter home · $15,000',run:()=>{if(state.ownsHome){notify('You already own a home.');return;}if(state.money<15000){notify('You need $15,000. Earn money from local jobs.');return;}state.money-=15000;state.ownsHome=true;closePanel();notify('Congratulations! You own a home.');save(false);}},
 {label:'View inventory · '+state.inventory.length+' items',run:()=>openPanel('Inventory',state.inventory.length?state.inventory.join(', '):'Your inventory is empty.',[{label:'Close',run:closePanel}])},
 {label:'Save progress',run:()=>{closePanel();save();}}
]);
function notify(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(notify.t);notify.t=setTimeout(()=>$('toast').style.display='none',2200);}
function save(showMessage=true){try{localStorage.setItem(saveKey,JSON.stringify({money:state.money,player:{x:player.position.x,z:player.position.z},energy:state.energy,ownsHome:state.ownsHome,inventory:state.inventory,furniture:state.furniture,activeJob:state.activeJob}));if(showMessage)notify('Progress saved on this device.');}catch{notify('Unable to save.');}}
function load(){try{const d=JSON.parse(localStorage.getItem(saveKey));if(!d)return false;state.money=d.money??50000;state.energy=d.energy??100;state.ownsHome=!!d.ownsHome;state.inventory=d.inventory||[];state.furniture=d.furniture||[];state.activeJob=d.activeJob||null;player.position.set(d.player?.x||0,0,d.player?.z||4);return true;}catch{return false;}}
function collides(x,z,r=.8){return solidBuildings.some(b=>Math.abs(x-b.x)<b.w/2+r&&Math.abs(z-b.z)<b.d/2+r);}
const input={x:0,y:0,sprint:false};let pointer=null;const stick=$('stick'),nub=$('nub');
function moveStick(e){const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,len=Math.hypot(dx,dy),k=Math.min(1,len/43);input.x=len?dx/len*k:0;input.y=len?dy/len*k:0;nub.style.left=(35+input.x*36)+'px';nub.style.top=(35+input.y*36)+'px';}
stick.addEventListener('pointerdown',e=>{pointer=e.pointerId;stick.setPointerCapture(pointer);moveStick(e);});stick.addEventListener('pointermove',e=>{if(e.pointerId===pointer)moveStick(e);});
function stopStick(){pointer=null;input.x=input.y=0;nub.style.left='35px';nub.style.top='35px';}
stick.addEventListener('pointerup',stopStick);stick.addEventListener('pointercancel',stopStick);
$('sprint').addEventListener('pointerdown',()=>input.sprint=true);['pointerup','pointercancel','pointerleave'].forEach(e=>$('sprint').addEventListener(e,()=>input.sprint=false));
const keys={};addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function keyboard(){if(keys.w||keys.arrowup)input.y=-1;else if(keys.s||keys.arrowdown)input.y=1;else if(pointer===null)input.y=0;if(keys.a||keys.arrowleft)input.x=-1;else if(keys.d||keys.arrowright)input.x=1;else if(pointer===null)input.x=0;if(keys.shift)input.sprint=true;}
function nearestCar(){let best=null,bd=5;for(const c of cars){const d=c.group.position.distanceTo(player.position);if(d<bd){bd=d;best=c;}}return best;}
function useVehicle(){if(state.inside){notify('Use ACTION to leave the building.');return;}if(state.driving){state.driving.occupied=false;state.driving=null;player.visible=true;notify('You left the car.');return;}const c=nearestCar();if(!c){notify('Move closer to a parked car.');return;}if(!c.parked){notify('That car is moving in traffic. Find a parked car.');return;}state.driving=c;c.occupied=true;player.visible=false;notify('Driving mode: use the joystick to steer and move.');}
$('vehicle').onclick=useVehicle;

const interiorGroup=new THREE.Group();interiorGroup.position.set(520,0,520);city.add(interiorGroup);
function buildInterior(kind){
 interiorGroup.clear();const floor=mat(0x9b8870),wall=mat(0xd8d0bd),dark=mat(0x51453b),wood=mat(0x815638);
 box(interiorGroup,18,.35,16,floor,0,.1,0,false);box(interiorGroup,18,4,.35,wall,0,2,-8,false);
 box(interiorGroup,.35,4,16,wall,-9,2,0,false);box(interiorGroup,.35,4,16,wall,9,2,0,false);
 box(interiorGroup,6,4,.35,wall,6,2,8,false);box(interiorGroup,6,4,.35,wall,-6,2,8,false);
 for(const x of [-5,0,5])box(interiorGroup,2.2,1.5,.12,glass,x,2.6,-7.78,false);
 for(const x of [-5,0,5]){const lamp=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),new THREE.MeshBasicMaterial({color:0xffe4a3}));lamp.position.set(x,3.7,0);interiorGroup.add(lamp);}
 if(kind==='SHOP'){box(interiorGroup,10,1.2,1.3,wood,0,.8,-3);for(let x=-4;x<=4;x+=2)box(interiorGroup,.7,1.2,.55,mat(0x4e9a82),x,1.9,-3);box(interiorGroup,3,1.1,2,dark,0,.7,4);}
 else{box(interiorGroup,5,.8,2.4,mat(0x577b82),-3,.65,2);box(interiorGroup,5,.35,2.4,mat(0xd2c5a7),-3,1.2,2);box(interiorGroup,2,.8,2,wood,5,.5,-3);box(interiorGroup,2,.15,2,mat(0x7a9caa),5,1,-3);}
}
function enterBuilding(kind){state.outsidePosition=player.position.clone();state.inside=true;state.insideKind=kind;buildInterior(kind);player.position.set(520,0,521);player.rotation.y=Math.PI;if(state.driving){state.driving.occupied=false;state.driving=null;}player.visible=true;closePanel();notify('You entered the '+(kind==='SHOP'?'shop':'building')+'. Press ACTION to leave.');}
function exitBuilding(){state.inside=false;player.position.copy(state.outsidePosition||new THREE.Vector3(0,0,4));state.outsidePosition=null;notify('You stepped back outside.');}

function interact(){
 if(state.inside){exitBuilding();return;}
 if(state.driving){notify('Leave the vehicle before interacting.');return;}
 let nearestPerson=null,pd=5;
 for(const p of people){const d=p.mesh.position.distanceTo(player.position);if(d<pd){pd=d;nearestPerson=p;}}
 let nearestBuilding=null,bd=18;
 for(const b of solidBuildings){const d=Math.hypot(player.position.x-b.x,player.position.z-b.z);if(d<bd){bd=d;nearestBuilding=b;}}
 if(nearestBuilding&&bd<Math.min(pd,18)){
  if(nearestBuilding.kind==='SHOP'){
   openPanel('Corner shop','Enter to explore this shop, or buy an everyday item.',[
    {label:'Enter shop',run:()=>enterBuilding('SHOP')},
    {label:'Bottled water · $3',run:()=>buyItem('Bottled water',3)},
    {label:'Meal pack · $7',run:()=>buyItem('Meal pack',7)},
    {label:'Mobile phone · $80',run:()=>buyItem('Mobile phone',80)}
   ]);
  }else{
   openPanel('Residential building',state.ownsHome?'Explore this residence. You already own a starter home.':'A starter home is available for $15,000.',[
    {label:'Enter building',run:()=>enterBuilding('HOME')},
    {label:state.ownsHome?'Home already owned':'Buy starter home · $15,000',run:()=>{if(state.ownsHome){notify('You already own a home.');return;}if(state.money<15000){notify('Not enough money. Try the job board.');return;}state.money-=15000;state.ownsHome=true;closePanel();notify('You bought your first home!');save(false);}}
   ]);
  }
 }else if(nearestPerson&&pd<5){openPanel('City resident','Resident: Welcome! There is honest work on the job board if you need to earn money.',[{label:'Thanks!',run:closePanel},{label:'Find local work',run:openJobs}]);}
 else notify('Nothing close enough. Walk near a resident, shop or home.');
}
function buyItem(name,cost){if(state.money<cost){notify('Not enough money for that item.');return;}state.money-=cost;state.inventory.push(name);closePanel();notify(name+' purchased.');save(false);}
$('interact').onclick=interact;
$('save').onclick=save;
$('start').onclick=()=>{load();$('start-screen').style.display='none';state.started=true;notify('Welcome back to CITY LIFE: UNLIMITED.');};
function nowClock(){return performance.now();}
function update(dt){
 keyboard();const ix=input.x,iz=input.y;
 if(state.driving){const c=state.driving;c.speed+=(-iz)*24*dt;c.speed*=Math.pow(.985,dt*60);c.speed=THREE.MathUtils.clamp(c.speed,-10,30);c.group.rotation.y-=ix*dt*(.8+Math.abs(c.speed)*.04)*Math.sign(c.speed||1);const f=new THREE.Vector3(Math.sin(c.group.rotation.y),0,Math.cos(c.group.rotation.y));const next=c.group.position.clone().addScaledVector(f,c.speed*dt);if(!collides(next.x,next.z,1.5))c.group.position.copy(next);else{c.speed*=-.2;notify('You bumped into a building.');}player.position.copy(c.group.position);}
 else{const speed=input.sprint&&state.energy>0?10:5.2;if(input.sprint&&Math.hypot(ix,iz)>.1)state.energy=Math.max(0,state.energy-19*dt);else state.energy=Math.min(100,state.energy+9*dt);const len=Math.hypot(ix,iz)||1;if(Math.hypot(ix,iz)>.08){const dx=ix/len,dz=iz/len,nx=player.position.x+dx*speed*dt,nz=player.position.z+dz*speed*dt;if(!collides(nx,player.position.z))player.position.x=THREE.MathUtils.clamp(nx,-590,590);if(!collides(player.position.x,nz))player.position.z=THREE.MathUtils.clamp(nz,-590,590);player.rotation.y=Math.atan2(dx,dz);legs.forEach((l,i)=>l.rotation.x=Math.sin(performance.now()*.012+i*Math.PI)*.55);}else legs.forEach(l=>l.rotation.x=0);}
 for(const p of people){p.turn-=dt;if(p.turn<0){p.angle+=(Math.random()-.5)*2;p.turn=1+Math.random()*3;}const nx=p.mesh.position.x+Math.sin(p.angle)*.8*dt,nz=p.mesh.position.z+Math.cos(p.angle)*.8*dt;if(!collides(nx,nz,.3)){p.mesh.position.x=nx;p.mesh.position.z=nz;}else p.angle+=Math.PI/2;}
 for(const c of cars)if(!c.parked){c.group.position.x+=Math.sin(c.group.rotation.y)*c.speed*dt;c.group.position.z+=Math.cos(c.group.rotation.y)*c.speed*dt;if(c.group.position.x>300)c.group.position.x=-300;}
 if(state.activeJob&&Math.hypot(player.position.x-state.activeJob.x,player.position.z-state.activeJob.z)<7){state.money+=state.activeJob.pay;notify('Job completed! You earned $'+state.activeJob.pay.toLocaleString('en-US'));state.activeJob=null;save(false);}
 // A gentle day-to-evening cycle keeps the district from looking static.
 const cycle=(nowClock()/240000)*Math.PI*2;
 sun.position.set(Math.cos(cycle)*100,75+Math.sin(cycle)*45,70);
 sun.intensity=1.1+Math.max(0,Math.sin(cycle))*1.4;
 scene.background.setHSL(.55,.28,.22+Math.max(0,Math.sin(cycle))*.35);
 scene.fog.color.copy(scene.background);
 const target=state.driving?state.driving.group.position:player.position;const desired=new THREE.Vector3();
 if(state.driving){const f=new THREE.Vector3(Math.sin(state.driving.group.rotation.y),0,Math.cos(state.driving.group.rotation.y));desired.set(target.x-f.x*9,6.5,target.z-f.z*9);}else desired.set(target.x+Math.sin(player.rotation.y)*8,7.5,target.z+Math.cos(player.rotation.y)*8);
 camera.position.lerp(desired,1-Math.exp(-5*dt));camera.lookAt(target.x,target.y+1.4,target.z);
 if(state.activeJob){jobMarker.visible=true;jobMarker.position.set(state.activeJob.x,.25,state.activeJob.z);markerRing.rotation.z+=dt*.8;}else jobMarker.visible=false;
 $('vehicle').textContent=state.driving?'EXIT CAR':'ENTER CAR';
 $('money').textContent=state.money.toLocaleString('en-US');$('status').textContent=state.driving?'Driving · '+Math.round(Math.abs(state.driving.speed)*5)+' km/h':'On foot · Energy '+Math.round(state.energy)+'%';$('objective').textContent=state.inside?'Inside · ACTION to exit':(state.activeJob?state.activeJob.name+(state.ownsHome?' · Homeowner':''):(state.ownsHome?'Homeowner · Explore freely':'Find work and buy a home'));
}
camera.position.set(0,8,14);camera.lookAt(0,0,0);
// Original cinematic opening: a flyover, street-level pass and title reveal.
const intro=$('cinematic'),caption=$('cinematic-caption'),title=$('cinematic-title');
const introStart=performance.now();
const camCurve=new THREE.CatmullRomCurve3([
 new THREE.Vector3(-118,72,132),new THREE.Vector3(-68,46,84),
 new THREE.Vector3(-18,28,40),new THREE.Vector3(48,20,-12),
 new THREE.Vector3(90,13,-42),new THREE.Vector3(8,8,20)
]);
const lookCurve=new THREE.CatmullRomCurve3([
 new THREE.Vector3(0,0,0),new THREE.Vector3(-30,8,0),
 new THREE.Vector3(0,3,0),new THREE.Vector3(35,5,-10),
 new THREE.Vector3(0,2,0),new THREE.Vector3(0,1,4)
]);
let introFinished=false;
function finishIntro(){if(introFinished)return;introFinished=true;intro.classList.add('done');setTimeout(()=>{intro.style.display='none';},1200);}
$('skip-intro').onclick=finishIntro;
function cinematic(now){
 if(introFinished)return;
 const t=Math.min(1,(now-introStart)/16000);
 const p=camCurve.getPoint(t),look=lookCurve.getPoint(t);
 camera.position.copy(p);camera.lookAt(look);
 const captions=[
  [0,'A CITY THAT NEVER STANDS STILL'],
  [.22,'EVERY STREET HAS A STORY'],
  [.47,'EVERY CHOICE OPENS A NEW ROAD'],
  [.7,'YOUR LIFE. YOUR CITY. YOUR RULES.']
 ];
 let current=captions[0][1];for(const c of captions)if(t>=c[0])current=c[1];
 caption.textContent=current;caption.style.opacity=t<.94?'1':'0';
 if(t>.72)title.classList.add('show');
 if(t>=1)finishIntro();
}
let last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.04,(now-last)/1000);last=now;if(!introFinished)cinematic(now);if(state.started)update(dt);renderer.render(scene,camera);}
requestAnimationFrame(frame);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);});
setInterval(()=>{if(state.started)save(false);},15000);
