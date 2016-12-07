Vector2 = function(x, y){
  this.x = x || 0;
  this.y = y || 0;
  return this;
};
Vector2.prototype.add = function(vector){
  this.x += vector.x;
  this.y += vector.y;
  return this;
};
Vector2.prototype.sub = function(vector){
  this.x -= vector.x;
  this.y -= vector.y;
  return this;
};
Vector2.prototype.mult = function(a){
  if(typeof a == "object"){
    this.x *= a.x;
    this.y *= a.y;
  } else if (typeof a == "number"){
    this.x *= a;
    this.y *= a;
  }
  return this;
};
Vector2.prototype.div = function(a){
  if(typeof a == "object"){
    this.x /= a.x;
    this.y /= a.y;
  } else if (typeof a == "number"){
    this.x /= a;
    this.y /= a;
  }
  return this;
}
Vector2.prototype.norm = function(){  
  this.div(this.mag());
  return this;
};
Vector2.prototype.setMag = function(e){
  this.norm();
  this.mult(e);
  return this;
};
Vector2.prototype.limit = function(max){
  if(this.mag() > max){
    this.setMag(max);
  }
  return this;
};
Vector2.prototype.direction = function(e){
  return Math.atan2(this.y, this.x);
};
Vector2.prototype.rotate = function(e){
  var newDirection = this.direction() + e,
      mag = this.mag();
  
  this.x = Math.cos(newDirection) * mag;
  this.y = Math.sin(newDirection) * mag;
  return this;
};
Vector2.prototype.mag = function(){
  return Math.sqrt((this.x*this.x) + (this.y*this.y));
};
Vector2.prototype.angleTo = function(vector){
  var angle = Math.atan2(vector.x - this.x, vector.y - this.y);
  return angle;
};
Vector2.prototype.distanceTo = function(vector){
	return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
};
Vector2.prototype.copy = function(){
  return new Vector2(this.x, this.y);
};
Vector2.prototype.set = function(){
  var args = arguments
  if(args.length == 1){
    if(typeof args[0] == "object"){
      this.x = args[0].x;
      this.y = args[0].y;
    } else if (typeof args[0] == "number"){
      this.x = args[0];
      this.y = args[0];
    }
  } else if (args.length == 2){
    this.x = args[0];
    this.y = args[1];
  }
  return this;
};
Vector2.prototype.map = function(vXmin, vXmax, vYmin, vYmax){
  if(vXmin < this.x < vXmax && vYmin < this.y < vYmax){
    return this;
  }
  this.x < vXmin ? this.x = vXmin : this;
  this.x > vXmax ? this.x = vXmax : this;
  this.y < vYmin ? this.y = vYmin : this;
  this.y > vYmax ? this.y = vYmax : this;
};
Math.radians = function(deg){
  return deg * (Math.PI / 180);
};
Math.degrees = function(rad){
  return rad * (180 / Math.PI);
};
random = function(){
  if(arguments){
    var arg = arguments;
    if(arg.length == 1){
      return Math.random()*arg[0];
    }
    if(arg.length == 2){
      return Math.random()*( Math.max(arg[0], arg[1])-(Math.min(arg[0], arg[1])) )+Math.min(arg[0], arg[1]);
    }
  } else {
    return Math.random();
  }
};

(function(){
	var canvasBody = document.getElementById("canvas"),
			canvas = canvasBody.getContext("2d"),
			gui = new dat.GUI(),
			w = canvasBody.width = document.body.clientWidth,//window.innerWidth,
			h = canvasBody.height = document.body.clientHeight,//window.innerHeight,
			stats,
			pi2 = Math.PI*2,
			pi= Math.PI,
			piD2 = Math.PI/2,
			tick = 0,
			opts = {
				canvas: {
					backgroundColor: "rgba(	253,253,253,0.2)",
					amount: 5,	//设置箭头数目********************
					displayStats: false,
				},
				particle: {
					speed: 1,
					maxSpeed: 0.25,
					bounce: false
				},
				size: 7,	//设置箭头大小*****************
			},
			particles = [],
			Mouse = new Vector2(w/2, h/2), 
			Particle = function(X, Y){
				this.pos = new Vector2(X||0, Y||0);
				this.acc = new Vector2(0, 0);
				this.speed = new Vector2(0, 0);
				this.color = "#AFFED8";		//设置箭头颜色**********************
				this.maxSpeed = opts.particle.maxSpeed + Math.random()*opts.particle.maxSpeed;
			}; //alert(window.innerWidth);
	
	Particle.prototype.update = function(){
		if(opts.particle.bounce){
			this.border();
		}
		this.speed.add(this.acc);
		this.speed.limit(10);
		this.pos.add(this.speed);
		this.acc.set(0);
		
	};
	Particle.prototype.lookFor = function(tar){
		var dir = tar.copy();
		dir.sub(this.pos);
		var steer = dir.sub(this.speed);
		steer.limit(this.maxSpeed)
		this.force(steer); 
	};
	Particle.prototype.force = function(f){
		this.acc.add(f);
	};
	Particle.prototype.render = function(){
		var d = this.speed.direction();
		canvas.strokeStyle = this.color;
		canvas.fillStyle = this.color;
		canvas.beginPath();
		canvas.moveTo(Math.cos(d)*(opts.size)+this.pos.x,Math.sin(d)*(opts.size)+this.pos.y);
		canvas.lineTo(Math.cos(d+piD2)*(opts.size/3)+this.pos.x,Math.sin(d+piD2)*(opts.size/2)+this.pos.y);
		canvas.lineTo(Math.cos(d-piD2)*(opts.size/3)+this.pos.x,Math.sin(d-piD2)*(opts.size/3)+this.pos.y)
		canvas.lineTo(Math.cos(d)*opts.size+this.pos.x,Math.sin(d)*opts.size+this.pos.y);
		canvas.closePath();
		canvas.stroke();
		canvas.fill();
	};
	
	Particle.prototype.border = function(){
		this.pos.x > w - opts.size ? (this.speed.x*=-1, this.pos.x = w-opts.size) : undefined;
		this.pos.x < opts.size ? (this.speed.x*=-1, this.pos.x = opts.size) : undefined;
		this.pos.y > h - opts.size ? (this.speed.y*=-1, this.pos.y = h-opts.size) : undefined;
		this.pos.y < opts.size ? (this.speed.y*=-1, this.pos.y = opts.size) : undefined;
	};
	function populate(){
		particles = [];
		for(var i = 0; i < opts.canvas.amount; particles[i++] = new Particle(Math.random()*w, Math.random()*h));
	};
	function statsC(){
		if(opts.canvas.displayStats){
			document.querySelector(".statss").style.opacity = "0.9"
		} else {
			document.querySelector(".statss").style.opacity = "0"
		}
	};
	function setup(){
		stats = new Stats();
		stats.showPanel( 0 );
		populate();
		gui.add(opts.canvas, 'amount', 1, 100).onFinishChange(populate);
		gui.add(opts, "size", 5, 15);
		gui.add(opts.canvas, "displayStats").onFinishChange(statsC).name("Display FPS");
		gui.add(opts.particle, "bounce");
		gui.close();
		stats.domElement.className = "statss";
		document.body.appendChild( stats.domElement );
		window.requestAnimationFrame(loop);
		statsC();
	};
	
	function loop(){
		stats.begin();
		canvas.fillStyle = opts.canvas.backgroundColor;
		canvas.fillRect(0,0,w,h);
		
		particles.map(function(P){
			P.lookFor(Mouse);
			P.update();
			P.render();
		});
		window.requestAnimationFrame(loop);
		stats.end();
	};
	setup();
	
	window.addEventListener("resize", function(){
		w = canvasBody.width = document.body.clientWidth < 1200? 1200:document.body.clientWidth;//window.innerWidth;
		h = canvasBody.height = document.body.clientHeight;//window.innerHeight;
	});
	window.addEventListener("mousemove", function(e){
		Mouse.set({x:e.pageX,y:e.pageY});		
	});
	window.addEventListener("mousedown", populate);
})();