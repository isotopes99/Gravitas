const canvas = document.getElementById("gameCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");
const celestial_bodies_spawned=[];
var click_cordinates={
  x:null,
  y:null,
  xUp:null,
  yUp:null,
  x_move:null,
  y_move:null

}
function velocity_increase(mousePos,object){
  var x_distance=mousePos.x-mousePos.xUp;
  var y_distance=mousePos.y-mousePos.yUp;
  const initial_velocity=0.05;
  object.velocity_x=initial_velocity*x_distance;
  object.velocity_y=initial_velocity*y_distance;

}

function get_pos_pressed(event){
  click_cordinates.x=event.clientX;
  click_cordinates.y=event.clientY;
}
function get_pos_released(event){
  click_cordinates.xUp=event.clientX;
  click_cordinates.yUp=event.clientY;
  
  spawning_celestialbodies();
}

let is_mouse_down=false;
// maximum and minimum mass and radius for the bodies  for the bodies//
const max_mass = 15000;
const min_mass = 1000;
const max_radius=150;
const min_radius=10;
const mass_to_become_black_hole=100000;


function is_collided(body1,body2){
  const dx=body1.x-body2.x;
  const dy=body1.y-body2.y;
  const distance=Math.sqrt((dx*dx)+(dy*dy))
  if(distance<(body1.radius+body2.radius)){
    if(body1.mass>body2.mass){
      body1.mass=body1.mass+(body2.mass/2);
      const index=celestial_bodies_spawned.indexOf(body2);
      if(index!=-1){
        celestial_bodies_spawned.splice(index,1);
      }

    }
    else if(body1.mass<body2.mass){
      body2.mass+=body1.mass/2;
      const index=celestial_bodies_spawned.indexOf(body1);
      if(index!=-1){
        celestial_bodies_spawned.splice(index,1);
      }

    }
  }
}

//function for random mass and size generation //
function get_random_mass(radius){
  let mass=radius*100;
  return mass;
  
}
function get_random_size(max_radius,min_radius){
  const random=Math.random();
  const scale=random*(max_radius-min_radius+1);
  const result=Math.floor(scale)+min_radius;
  return result;
}


//functin to spawn planets on the screen//
function spawning_celestialbodies(){
  const new_body=new Celestial_bodies()
  celestial_bodies_spawned.push(new_body)
  
}
// Random index for colours of planets//
function random_colors(){
var colours = ["red", "yellow", "green", "purple", "blue"];
const random_index = Math.floor(Math.random() * colours.length);
let color_picked = colours[random_index];
return color_picked;
}
  
// planets class//
class Celestial_bodies {
  constructor(x, y) {
    this.x = click_cordinates.x;
    this.y = click_cordinates.y;
    this.radius = get_random_size(max_radius,min_radius);
    this.mass =get_random_mass(this.radius);
    this.color = random_colors();
    this.velocity_x=0;
    this.velocity_y=0;
  }
  calculate_gravitational_force(body2, G =6.67) {
    
    const dx = this.x - body2.x;
    const dy = this.y - body2.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    if(distance>0){
    const force_magnitude = (G * this.mass * body2.mass) / (distance * distance);
    const cosA=dx/distance;
    const cosB=dy/distance;
    
    const velocity_x= (((force_magnitude)/this.mass)*cosA);
    const velocity_y=((force_magnitude/this.mass)*cosB);

    this.x-=velocity_x;
    this.y-=velocity_y;

    
   

  }
}



}










// Draw function for celestial bodies
function draw(object) {
  ctx.beginPath();
  ctx.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
  ctx.fillStyle = object.color;
  ctx.fill();
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i=0;i<celestial_bodies_spawned.length;i++){
    const body1=celestial_bodies_spawned[i];
    for(let j=0;j<celestial_bodies_spawned.length;j++){
      if(i!==j){
         const body2=celestial_bodies_spawned[j];
         body1.calculate_gravitational_force(body2);
      }
    }
  }
  for(let i=0;i<celestial_bodies_spawned.length;i++){
    const body1=celestial_bodies_spawned[i];
    for(let j=0;j<celestial_bodies_spawned.length;j++){
      if(i!==j){
         const body2=celestial_bodies_spawned[j];
         is_collided(body1,body2);
      }
    }
  }
  for (const body of celestial_bodies_spawned) {
    if(body.mass>mass_to_become_black_hole){
      body.color="black"
    }
    draw(body);
  }

  requestAnimationFrame(animate);
}
function get_pos_drag(event){
  click_cordinates.x_move=event.clientX;
  click_cordinates.y_move=event.clientY;
}
document.addEventListener("mousedown",get_pos_pressed);
document.addEventListener("mouseup",get_pos_released);
document.onmousemove=function(event){
  get_pos_drag(event);
setInterval(() => {
  animate();
}, 100);
}
