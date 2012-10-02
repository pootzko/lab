(function() {
	// initialize vars and objects
	var canvas, ctx, text, ctxt;
	var canvas_width = 980;
	var canvas_height = 560;
	var max_particles = 750;

	var r, g, b, r_sign = 1, g_sign = 1, b_sign = 1, r_add = 3, g_add = 3, b_add = 3;
	var algorithm = "SWARM";		
	var PI_2 = Math.PI * 2;
	var i;

	var to_distance;
	var stir_distance;
	var blow_distance;	
	var friction;	
	
	var particles = [];
	var temp_index = [];
	var lead_particle = new Particle();	
	var target = new Particle();
	
	
	// initialize canvas and particles
	function init() {
		canvas = document.getElementById("main-canvas");
		text = document.getElementById("text-canvas");
		
		// check if users browser is supported
		if (canvas.getContext) {
			// generate starting particle RGB value
			if (r == null) {
				r = Math.floor(Math.random() * 255);
				g = Math.floor(Math.random() * 255);
				b = Math.floor(Math.random() * 255);	
			}
			
			// generate particles, their initial position and velocity
			var i = max_particles;
			while (i--) {
				var particle = new Particle();
				particle.position_x = Math.random() * canvas_width;
				particle.position_y = Math.random() * canvas_height;
				particle.velocity_x = 0;
				particle.velocity_y = 0;
				particles[i] = particle;				
			}		
			
			// initialize lead_particle needed for "SINGLE" algorithm
			lead_particle = particles[0];
			
			// initialize main canvas and redraw its content every 70 miliseconds
			ctx = canvas.getContext("2d");			
			setInterval(draw, 70);	
			
			// initialize text canvas
			ctxt = text.getContext("2d");
			drawInfo();
			
			// change algorithm on mouse click
			canvas.addEventListener("click", changeAlgorithm, false);		
			
			// footer message
			var message = "For performance, Swarm Intelligence is best viewed in Chromium/Chrome. To switch between different \"following algorithms\" (3 available ATM) click inside canvas.<br />--- <a href='http://www.cmikavac.net/2011/10/22/swarm-intelligence-in-html5-canvas/'>About Swarm Intelligence experiment</a>. --- Swarm Intelligence was built upon Daniel Puhes <a href='http://www.spielzeugz.de/html5/liquid-particles.html'>Liquid Particles</a>. Permission granted, thanks Daniel! --- Copyleft 2011. All wrongs reserved. ---";
			document.getElementById("footer").innerHTML = message;
		}
		else {
			// browser too old footer message
			var message = "To view the content of this page you need a more recent version of Chromium/Chrome, Firefox, Opera, Safari, or Internet Explorer.";
			document.getElementById("footer").innerHTML = message;
		}
	}
	
	
	
	// draw everything
	function draw() {
		// draw canvas frame (last fillStyle param (0.6) gives the "tail" effect)
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(8, 8, 12, 0.6)";
		ctx.fillRect(0, 0, canvas_width, canvas_height);
		ctx.globalCompositeOperation = "lighter";
		
		// draw info (slows down a lot in everything except chromium)
		//ctx.fillStyle = '#fff';
		//ctx.textBaseline = 'top';		
		//ctx.fillText("ALGORITHM: " + algorithm, 5, 5);
		//ctx.fillText("RGB:  " + r + "  " + g + "  " + b, 5, 18);	
		
		// amount of system chaos -> bigger number means less chaos
		var system_chaos = Math.random() * 2000;		
		
		
		// increse/reduce the speed of color change
		if ((Math.random() * 5) < 1)
			changeColor();
		
		// draw particles
		i = max_particles;
		while ( i-- ){		
			// get current particle
			var particle = particles[i];
			
			// amount of current particle chaos -> bigger number means less chaos
			var particle_chaos = Math.random() * 1000;
			
			if (system_chaos < 2) {
				changeAlgorithm();			
			}
			
			// algorithm switching
			if (temp_index[i] != null) {
				algorithmSwarm();
			}
			if (algorithm == "SWARM") {
				algorithmSwarm();
			}
			if (algorithm == "TAIL") {
				algorithmTail();
			}
			if (algorithm == "LEAD") {
				algorithmLead();
			}
			
			
			// calculate the distance between particle and target positions
			var distance_x = particle.position_x - target.position_x;
			var distance_y = particle.position_y - target.position_y; 
			var distance  = Math.sqrt(distance_x * distance_x + distance_y * distance_y) || 0.001;
			distance_x /= distance;
			distance_y /= distance;
			
			
			// explodes the swarm if the chaos is right 
			if (system_chaos < 1) {
				if (distance < blow_distance) {
					var blow_acceleration = (1 - (distance / blow_distance)) * 30 * Math.random();
					particle.velocity_x += distance_x * blow_acceleration + 0.5 - Math.random();
					particle.velocity_y += distance_y * blow_acceleration + 0.5 - Math.random();
				}
			}
			
			
			// blows random particles away
			if (particle_chaos < 1) {
				if (distance < blow_distance) {
					var blow_acceleration = (1 - (distance / blow_distance)) * 40;
					particle.velocity_x += distance_x * blow_acceleration + 0.5 - Math.random();
					particle.velocity_y += distance_y * blow_acceleration + 0.5 - Math.random();
				}
			}		
			
			
			// if particle is too far away from target, give 
			// her some additional speed so it does not stop
			if (distance < to_distance) {
				var to_accelerate = (1 - (distance / to_distance)) * canvas_width * 0.0014;
				particle.velocity_x -= distance_x * to_accelerate;
				particle.velocity_y -= distance_y * to_accelerate;			
			}			
			if (distance < stir_distance) {
				var min_acceleration = (1 - (distance / stir_distance)) * canvas_width * 0.00026;
				particle.velocity_x += target.velocity_x * min_acceleration;
				particle.velocity_y += target.velocity_y * min_acceleration;			
			}
			
			
			// slowdown/speedup everything
			particle.velocity_x *= friction;
			particle.velocity_y *= friction;
			
			
			// determines particle size (always stays between 0.4 - 3.5)
			var avg_velocity_x = Math.abs(particle.velocity_x);
			var avg_velocity_y = Math.abs(particle.velocity_y);
			var avg_velocity = (avg_velocity_x + avg_velocity_y) * 0.225;
			
			if (avg_velocity_x < .1) 
				particle.velocity_x *= Math.random() * 3;
			if (avg_velocity_y < .1) 
				particle.velocity_y *= Math.random() * 3;
			
			var sc = Math.max(Math.min(avg_velocity, 3.5), 0.4);
			
			
			// when particles reach canvas frame, bounce 
			// them off in the opposite direction
			var next_px = particle.position_x + particle.velocity_x;
			var next_py = particle.position_y + particle.velocity_y;	
			
			// bounce off x component
			if (next_px > canvas_width) {
				next_px = canvas_width;
				particle.velocity_x *= -1;
			}
			else if (next_px < 0) {
				next_px = 0;
				particle.velocity_x *= -1;
			}
			
			// bounce off y component
			if (next_py > canvas_height) {
				next_py = canvas_height;
				particle.velocity_y *= -1;
			}
			else if (next_py < 0) {
				next_py = 0;
				particle.velocity_y *= -1;
			}
			
			particle.position_x = next_px;
			particle.position_y = next_py;			
			
			
			// give particles their color and size
			particle.color = "rgb(" + r + ", " + g + ", " + b + ")";			
			ctx.fillStyle = particle.color;
			ctx.beginPath();
			ctx.arc(next_px, next_py, sc, 0, PI_2, true);
			ctx.closePath();
			ctx.fill();		
		}
	}
	

	
	// define particle class
	function Particle() {
		this.color = "rgb(" + r + ", " + g + ", " + b + ")";
		this.position_x = 0;
		this.position_y = 0;		
		this.velocity_x = 0;
		this.velocity_y = 0;
		this.size = 1; 
	}


	
	// slowly changes the color of all particles
	function changeColor() {
		// absolute value to be added/subtracted to/from particles r/g/b values							
		var check;
		
		// set R value
		check = r + r_add * r_sign;				
		if ((check < 0) || (check > 255))
			r_sign *= -1;
		r += r_add * r_sign;
		
		// set G value				
		check = g + g_add * g_sign;				
		if ((check < 0) || (check > 255))
			g_sign *= -1;
		g += g_add * g_sign;
		
		// set B value
		check = b + b_add * b_sign;
		if ((check < 0) || (check > 255))
			b_sign *= -1;
		b += b_add * b_sign;
	}
	

	
	// changes particle following pattern
	function changeAlgorithm() {
		var algorithm_randomizer = Math.floor(Math.random() * 3) + 1;	
		if (algorithm_randomizer == 1)
			algorithm = "SWARM";
		if (algorithm_randomizer == 2)
			algorithm = "TAIL";
		if (algorithm_randomizer == 3)
			algorithm = "LEAD";	
		
		// change algorithm text on algorithm change
		drawInfo();
	}
	

	
	// draws the name of the algorithm
	function drawInfo() {
		ctxt.clearRect(0, 0, canvas_width, canvas_height);
		ctxt.fillStyle = '#fff';		
		ctxt.textBaseline = 'top';
		ctxt.fillText("ALGORITHM: " + algorithm, 5, 5);		
	}
	
	
	
	// each particle finds a new particle to 
	// follow after 5000-10000 redraws
	function algorithmSwarm() {
		to_distance = canvas_width * 2.5;
		stir_distance = canvas_width * 0.09;
		blow_distance = canvas_width * 0.38;			
		friction = 0.96;
		if (1 < (Math.random() * 5000 + 5000)) {
			var j = Math.floor(Math.random() * max_particles);
			temp_index[i] = j;
			target = particles[temp_index[i]];								
		}		
	}

	

	// each particle finds a new random particle 
	// to follow on each redraw
	function algorithmTail() {		
		to_distance = canvas_width * 0.85;
		stir_distance = canvas_width * 0.15;
		blow_distance = canvas_width * 0.5;	
		friction = 0.955;
		var j = Math.floor(Math.random() * max_particles);
		temp_index[i] = j;
		target = particles[temp_index[i]];			
	}


	
	// all particles follow the same (single) particle
	function algorithmLead() {	
		to_distance = canvas_width * 0.7;
		stir_distance = canvas_width * 0.5;
		blow_distance = canvas_width * 0.7;	
		friction = 0.973;		
		lead_particle.position_x += Math.random() * 8 - 4;				
		lead_particle.position_y += Math.random() * 8 - 4;
		lead_particle.velocity_x = Math.random() * 2;
		lead_particle.velocity_y = Math.random() * 2;						
		target = lead_particle;		
	}


	
	window.onload = init;
	
	
	
})();
