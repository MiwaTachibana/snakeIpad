$(document).ready(function(){

	//Canvas 
	var $canvas = $("#canvas")[0];
	var ctx = $canvas.getContext("2d");
	$canvas.width = 420;
	$canvas.height = 556;
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//cw = cell width variable 
	var cw = 10;
	//d =  direction right/default
	var d;
	var active = true;
	var food;
	var score = 0;
	
	var snake_array; //an array of cells to make up the snake
	

	//keyboard functions
	window.addEventListener("keydown", function(e) {
		if( e.keyCode === 37 && d !== "right"){
			console.log("left");
			d = "left";
		} else if (e.keyCode === 39 && d !== "left" ) {
			console.log("right");
			d = "right";
		} else if (e.keyCode === 38 && d !== "down") {
			console.log("up");
			d = "up";
		} else if (e.keyCode === 40 && d!== "up") {
			console.log("down");
			d = "down";
		}
	})



	function new_game()
	{
		d = "right"; //default direction
		make_snake();
		make_food(); 
		score = 0;

		
		// move the snake using a timer that will trigger the draw function
		//every 60ms

		if(typeof game_loop != "undefined") {
			clearInterval(game_loop);
		}
			game_loop = setInterval(draw, 80);

		
	}
	new_game();

/*******************************************************/


	
	function make_snake()
	{
		console.log("making snake");
		var length = 5; //Length of the snake
		snake_array = []; 
		//using a for loop, push the 5 elements into the array
		//every element will have the x value of the index and y value of zero
		for(var i = length-1; i>=0; i--)
		{
			//Will make a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}


	
	function make_food()
	{
		food = {
			//generates random coordinates for the food

			//This will generate a cell with x/y coordinates between 0-49
			//Bc there are 50(500/10) positions accross the rows and columns
			x: Math.floor(Math.random()*41), 
			y: Math.floor(Math.random()*54.6)
		};
		
	}

/*****************************************************/
	
	//draw snake
	function draw()
	{
		//x & y coordinates of snake head
		var headX = snake_array[0].x;
		var headY = snake_array[0].y;


		//drawing the background
		//need to paint the background on every frame to avoid snake trail
		ctx.fillStyle = "#7EB966";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);


		//moving snake head different directions
		if(d == "right") {
			headX++;
		} else if(d == "left") {
			headX--;
		} else if(d == "up") {
			headY--; 
		} else if(d == "down") {
			headY++; 
		}
		
		//if the snake head hits the wall or itself, game over
		//if check_collision = true -->game over
		//headX == -1 is the left wall
		//headY == -1 is the top
		//headX == w/cw is the right wall
		//headX == h/cw is the bottom
		
		if( headX == -1 || 
			headX >= 42 || 
			headY == -1 || 
			headY >= 55.6|| 
			check_collision(headX, headY, snake_array))
		{
			//game over and restart game
			console.log("out of bounds or hit itself")
			showGameOver();
			
			return;
		}

		function showGameOver() {
			active = false;
			ctx.clearRect( 0, 0, w, h);
			ctx.fillStyle = "white";
			ctx.font = "48px arcade";
			ctx.fillText( "Game Over!", ( (w/2) - (ctx.measureText("Game Over!").width / 2)), 50 );

			ctx.font = "20px arcade";
			ctx.fillText("Your Score Was: " + score, ( (w / 2) - (ctx.measureText("Your Score Was: " + score).width / 2)), 70);
			// new_game();
		}
		
//////////////////////////////////////////////////////

		//if the snake eats the food = head position matches with the 
		//food position,
		//Create a new head instead of moving the tail
		if(headX == food.x && headY == food.y)
		{
			//makes new head, adding a piece. 
			var tail = {
				x: headX, 
				y: headY
			};

			//increase score
			score+= 10;
			//Create new food
			make_food();
		}else
		//normal movement of snake

		// snake moves by popping out the tail block and putting it in front  
		{ var tail = snake_array.pop(); //pops out the last cell
			tail = {
				x: headX, 
				y: headY
			} 

		}

		snake_array.unshift(tail); //puts the tail at the beginning of the array = first cell
		
////////////////////////////////////////////////


		//PAINTS THE SNAKE ON THE SCREEN
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_blocks(c.x, c.y);
		}
		

		// canvasing of snake
		function paint_blocks(x, y)
		{
			ctx.fillStyle = "#343A1A";
			// paint 10px wide cells
			ctx.fillRect(x*cw, y*cw, cw, cw);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x*cw, y*cw, cw, cw);
		}


		// paint the food on the screen
		paint_blocks(food.x, food.y);

		// paint the score
		//(text, x coordinates, y coordinates)
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-4);

	
	}
	



/***********************************************************/



	//check collision with snakes own body	
	function check_collision(x, y, array)
	{
		//will check if the provided x/y coordinates exist
		//in the snake array of cells 
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}


	

	
	
	
})