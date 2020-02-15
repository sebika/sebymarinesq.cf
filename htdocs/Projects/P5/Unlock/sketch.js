
const spd = 4;
const password = [0, 4, 2, 5, 8];

var samsung, menu, back, bg, unlock, home, picture = [];

var xScreen, yScreen, screenWidth, screenHeight;
var p, bars;
var opacity = 0, o = 0;

var display = 0; // 0 = off, 1 = on;
var info = 0;

var minX, maxX, size, sliderX, sliderY;
var grab = 0;
var px, py, D = 0, proc = 100, close = 0;

var ppx = 0, ppy = 0, drag = 0, lenght = 0;

var radius = 12.5;
var n = 0, xDot = [], yDot = [];
var xConnected = [], yConnected = [], valConnected = [], valid = [], grow = [], r = [];
var lineOpacity = 0, u = -1, sc;
const growSpeed = 1.3;

var xBox, yBox, boxWidth, boxHeight;

function preload()
{
	samsung = loadImage("logo1.png");
	menu = loadImage("menu.png");
	back = loadImage("back.png");

	picture[0] = loadImage("background1.png");
	picture[1] = loadImage("background2.png");
	picture[2] = loadImage("background3.png");
	picture[3] = loadImage("background4.png");
	picture[4] = loadImage("background5.png");


	unlock = loadImage("unlock.png");
	home = loadImage("home.png");

	bg = picture[floor(random(0,5))];
}

function init()
{
	xScreen = 0.28 * width + 7;
	yScreen = height * 0.09;
	screenWidth = 0.44 * width - 14;
	screenHeight = screenWidth * 1920 / 1080;
	p = floor(random(2, 99));
	bars = floor(1 + random(0,4));
	minX = 0.75 * width + 65;
	maxX = 0.75 * width + 125;
	size = height * 0.06;
	sliderX = minX;
	sliderY = height * 0.3;
	opacity = 0; o = 0;
	dislpay = 0;
	info = 0;
	grab = 0;
	idk = 0;
	n = 0;
	for(var j = 1; j <= 3; j++)
		for(var i = 1; i <= 3; i++)
		{
			n++;
			xDot[n] = (0.25 - 0.5 + 0.25 * (i-1))*screenWidth;
			yDot[n] = (0.42 - 0.5 + j * 0.125)*screenHeight;
			valConnected[n] = 0;
			valid[n] = 1;
			r[n] = radius;
		}
	n = 0;
	sc = 1;
	xBox = xDot[1] - 50;
	yBox = yDot[1] - 30;
	boxWidth = 100 + xDot[3] - xDot[1];
	boxHeight = yDot[7] - yDot[1] + 60;
}

function setup()
{
	createCanvas(windowHeight / 1.7778 * 2, windowHeight);
	frameRate(240);
	init();

	drawPhone();
}

function draw()
{
	drawUpperPhone();
	showScreen();
	drawSlider();

	if(display == 1) 
	{
		sc = 1;
		displayInfo();
		if(lenght >= 200 && drag == 0) display = 2;
	}
	else if(display == 2)
	{
		if(u == -2)	
		{
			u = -1;
			n = 0;
		}
		if(u == -1)
		{
			updatePattern();
			displayPattern();
		}
		else displayResult();
	}

	update();
}

function update()
{
	if(grab == 0)
	{
		if(sliderX == minX) 
		{
			display = 0;
			info = 0;
			opacity = 0;
			o = 0;
			close = 1;
			u = -1;
			n = 0;
			bg = picture[floor(random(0,5))];
		}
		else if(sliderX == maxX && display == 0) display = 1;
	}
	
	if(display == 1 && opacity < 100)
	{
		opacity += 0.5;
		opacity *= 1.3;
		if(opacity > 100) opacity = 100;
	}

	updateSlider();

	if(drag == 0) 
	{
		lenght -= 10;
		if(lenght < 0) lenght = 0;
	}
	else lenght = dist(ppx, ppy, mouseX, mouseY);

	if(u == 0) time ++;
	else time = 0;

	if(time == 100) 
	{
		u = -1;
		n = 0;
	}
}

function displayResult()
{
	if(u == 0)
	{
		textSize(14);

		translate(xScreen + screenWidth * 0.5, yScreen + screenHeight * 0.5);
		if(1.2 - opacity / 500 > 1)	scale(1.2 - opacity / 500);
		else scale(1);
		fill(255, map(opacity, 0, 102, 0, 255));

		noStroke();
		textAlign(CENTER, CENTER);
		textFont("Samsung Sans");
		if(u == 0) text("Incorrect pattern drawn", 0, screenHeight * (0.45 - 0.5));
		text("EMERGENCY CALL", 0, screenHeight * (0.9 - 0.5));

		fill("white");
		for(var i = 1; i <= 9; i++)
		{
			var uu = 0;
			for(var j = 1; j <= n; j++)
				if(valConnected[j] == i)
				{
					uu = 1;
					break;
				}
			if(uu == 1) fill("red");
			else fill("white");
			ellipse(xDot[i], yDot[i], radius, radius);
		}

		stroke("red");
		fill("red");
		strokeWeight(3);
		for(var i = 1; i < n; i++)
			line(xConnected[i], yConnected[i], xConnected[i+1], yConnected[i+1]);

		stroke("white");
		strokeWeight(1);
		noFill();
		rectMode(CENTER);
		rect(0,screenHeight * (0.9 - 0.5), width * 0.2, 25, 5);
		rectMode(CORNER);

		scale(1);
		translate(0,0);
	}
	else if(u == 1)
	{
		textSize(14);

		translate(xScreen + screenWidth * 0.5, yScreen + screenHeight * 0.5);
		scale(sc);
		sc -= 0.02;
		if(sc < 0.8) sc = 0.8;
		fill(255, map(sc, 0.8, 1, 0, 255));

		noStroke();
		textAlign(CENTER, CENTER);
		textFont("Samsung Sans");
		if(u == 0) text("Incorrect pattern drawn", 0, screenHeight * (0.45 - 0.5));
		text("EMERGENCY CALL", 0, screenHeight * (0.9 - 0.5));

		fill(255, map(sc, 0.8, 1, 0, 255));
		for(var i = 1; i <= 9; i++)
		{
			var uu = 0;
			for(var j = 1; j <= n; j++)
				if(valConnected[j] == i)
				{
					uu = 1;
					break;
				}
			fill(255, map(sc, 0.8, 1, 0, 255));
			ellipse(xDot[i], yDot[i], radius, radius);
		}

		stroke(255, map(sc, 0.8, 1, 0, 255));
		fill(255, map(sc, 0.8, 1, 0, 255));
		strokeWeight(3);
		for(var i = 1; i < n; i++)
			line(xConnected[i], yConnected[i], xConnected[i+1], yConnected[i+1]);

		255, map(sc, 0.8, 1, 0, 255)
		strokeWeight(1);
		noFill();
		rectMode(CENTER);
		rect(0,screenHeight * (0.9 - 0.5), width * 0.2, 25, 5);
		rectMode(CORNER);

		scale(1);
		translate(0,0);
	}
}

function updatePattern()
{
	if(drag == 1)
	{
		lineOpacity = map(dist(xConnected[n], yConnected[n], xConnected[n+1], yConnected[n+1]), 0, 50, 0, 100);
		for(var i = 1; i <= 9; i++)
			if(dist(xDot[i], yDot[i], mouseX - xScreen - screenWidth * 0.5, mouseY - yScreen - screenHeight * 0.5) <= 2*radius && valid[i] == 1)
			{
				n++;
				xConnected[n] = xDot[i];
				yConnected[n] = yDot[i];
				valConnected[n] = i;
				valid[i] = 0;
				lineOpacity = 0;
				grow[i] = 1;
				break;
			}
		if((valConnected[n] == 1 && valConnected[n-1] == 3) || (valConnected[n] == 3 && valConnected[n-1] == 1) || (valConnected[n] == 4 && valConnected[n-1] == 6) || (valConnected[n] == 6 && valConnected[n-1] == 4) || (valConnected[n] == 7 && valConnected[n-1] == 9) || (valConnected[n] == 9 && valConnected[n-1] == 7))
		{
			n++;
			xConnected[n] = xDot[i];
			yConnected[n] = yDot[i];
			valConnected[n] = i;
			valConnected[n-1] = (valConnected[n-2] + valConnected[n]) / 2;
			grow[(valConnected[n-2] + valConnected[n]) / 2] = 1;
			valid[i] = 0;
			lineOpacity = 0;
			grow[i] = 1;
		}
		if((valConnected[n] == 1 && valConnected[n-1] == 7) || (valConnected[n] == 7 && valConnected[n-1] == 1) || (valConnected[n] == 2 && valConnected[n-1] == 8) || (valConnected[n] == 8 && valConnected[n-1] == 2) || (valConnected[n] == 3 && valConnected[n-1] == 9) || (valConnected[n] == 9 && valConnected[n-1] == 3))
		{
			n++;
			xConnected[n] = xDot[i];
			yConnected[n] = yDot[i];
			valConnected[n] = i;
			valConnected[n-1] = (valConnected[n-2] + valConnected[n]) / 2;
			grow[(valConnected[n-2] + valConnected[n]) / 2] = 1;
			valid[i] = 0;
			lineOpacity = 0;
			grow[i] = 1;
		}
		if((valConnected[n] == 1 && valConnected[n-1] == 9) || (valConnected[n] == 9 && valConnected[n-1] == 1) || (valConnected[n] == 3 && valConnected[n-1] == 7) || (valConnected[n] == 7 && valConnected[n-1] == 3))
		{
			n++;
			xConnected[n] = xDot[i];
			yConnected[n] = yDot[i];
			valConnected[n] = i;
			valConnected[n-1] = (valConnected[n-2] + valConnected[n]) / 2;
			grow[(valConnected[n-2] + valConnected[n]) / 2] = 1;
			valid[i] = 0;
			lineOpacity = 0;
			grow[i] = 1;
		}


		xConnected[n+1] = mouseX - xScreen - screenWidth * 0.5;
		yConnected[n+1] = mouseY - yScreen - screenHeight * 0.5;

		for(var i = 1; i <= 9; i++)
		{
			if(grow[i] == 1) 
			{
				r[i] += growSpeed;
				if(r[i] > 2 * radius)
				{
					r[i] = 2 * radius;
					grow[i] = -1;
				}
			}
			else if(grow[i] == -1)
			{
				r[i] -= growSpeed;
				if(r[i] < radius)
				{
					r[i] = radius;
					grow[i] = 0;
				}	
			}
			else r[i] = radius;
		}
	}
	else
	{
		if(n != 0)
		{
			u = 1;
			for(var i = 0; i <= 9; i++)
				if(valConnected[i] != password[i] && valConnected[i] >= 0 && password[i] > 0)
				{
					u = 0;
					break;
				}
		}
		if(u == -1)
		{
			n = 0;
			for(var i = 1; i <= 9; i++)
			{
				valConnected[i] = 0;
				valid[i] = 1;
				r[i] = radius;
				grow[i] = 0;
			}
			lineOpacity = 0;
		}
	}
}

function displayPattern()
{
	textSize(14);

	translate(xScreen + screenWidth * 0.5, yScreen + screenHeight * 0.5);
	if(1.2 - opacity / 500 > 1)	scale(1.2 - opacity / 500);
	else scale(1);
	fill(255, map(opacity, 0, 102, 0, 255));

	noStroke();
	textAlign(CENTER, CENTER);
	textFont("Samsung Sans");
	if(drag == 0) text("Draw unlock pattern", 0, screenHeight * (0.45 - 0.5));
	text("EMERGENCY CALL", 0, screenHeight * (0.9 - 0.5));

	fill("white");
	if(u == 0) fill("red");
	for(var i = 1; i <= 9; i++)
		ellipse(xDot[i], yDot[i], r[i], r[i]);

	stroke("white");
	fill("white");
	strokeWeight(3);
	for(var i = 1; i < n; i++)
		line(xConnected[i], yConnected[i], xConnected[i+1], yConnected[i+1]);
	

	noFill();
	stroke("white");
	// rect(xBox, yBox, boxWidth, boxHeight);

	var x1, y1, x2, y2, x3, y3;
	x1 = xConnected[n];
	y1 = yConnected[n];
	x2 = xConnected[n+1];
	y2 = yConnected[n+1];

	if(x2 >= xBox && x2 <= xBox + boxWidth && y2 >= yBox && y2 <= yBox + boxHeight)
	{
		x3 = x2;
		y3 = y2;
	}
	else
	{
		var ook = 0;
		for(x3 = xBox; x3 <= xBox + boxWidth; x3 += 0.01)
		{
			y3 = yBox;
			if(coliniare(x1, y1, x2, y2, x3, y3) == 1)
			{
				if((x1 >= x3 && x3 >= x2) || (x2 >= x3 && x3 >= x1) && (y1 >= y3 && y3 >= y2) || (y2 >= y3 && y3 >= y1))
				{
					ook = 1;
					break;
				}
			}
			y3 = yBox + boxHeight;
			if(coliniare(x1, y1, x2, y2, x3, y3) == 1)
			{
				if((x1 >= x3 && x3 >= x2) || (x2 >= x3 && x3 >= x1) && (y1 >= y3 && y3 >= y2) || (y2 >= y3 && y3 >= y1))
				{
					ook = 1;
					break;
				}
			}
		}
		if(ook == 0)
			for(y3 = yBox; y3 <= yBox + boxHeight; y3 += 0.01)
			{
				x3 = xBox;
				if(coliniare(x1, y1, x2, y2, x3, y3) == 1)
				{
					if((x1 >= x3 && x3 >= x2) || (x2 >= x3 && x3 >= x1) && (y1 >= y3 && y3 >= y2) || (y2 >= y3 && y3 >= y1))
					{
						ook = 1;
						break;
					}
				}
				x3 = xBox + boxWidth;
				if(coliniare(x1, y1, x2, y2, x3, y3) == 1)
				{
					if((x1 >= x3 && x3 >= x2) || (x2 >= x3 && x3 >= x1) && (y1 >= y3 && y3 >= y2) || (y2 >= y3 && y3 >= y1))
					{
						ook = 1;
						break;
					}
				}
			}
	}

	stroke(255, 256 * lineOpacity / 100);
	line(x1, y1, x3, y3);

	stroke("white");
	strokeWeight(1);
	noFill();
	rectMode(CENTER);
	rect(0,screenHeight * (0.9 - 0.5), width * 0.2, 25, 5);
	rectMode(CORNER);


	scale(1);
	translate(0,0);
}

function coliniare(x1, y1, x2, y2, x3, y3)
{
	var det;
	det = x1*y2 + x2*y3 + x3*y1 - x1*y3 - x2*y1 - x3*y2;
	if(abs(det)/2 < 2) return 1;
	else return 0;
}

function updateSlider()
{
	
	if(idk == 0)
	{
			if(mouseIsPressed == true && mouseButton == LEFT && grab == 1)
			sliderX = mouseX;

		if(grab == 0 && sliderX != minX && sliderX != maxX)
		{
			if(abs(sliderX - minX) < abs(sliderX - maxX)) sliderX -= spd;
			else sliderX += spd;
		}
	}
	else
	{
		sliderX += semn*spd;
	}
	if(sliderX > maxX) 
	{
		sliderX = maxX;
		idk = 0;
	}
	else if(sliderX < minX) 
	{
		sliderX = minX;
		idk = 0;
	}
}
function mouseClicked()
{
	if(mouseButton == LEFT)
	{

		if(mouseX >= xScreen && mouseX <= xScreen + screenWidth && mouseY >= yScreen && mouseY <= yScreen + screenHeight)
		{
			if(display == 1) info = 1;
			if(u == 0) u = -2;
		}
		if(D == 0)
		{
			if(dist(mouseX, mouseY, sliderX, sliderY) <= size)
			{
				idk = 1;
				if(display > 0) semn = -1;
				else semn = 1;
			}
			if(dist(mouseX, mouseY, maxX, sliderY) <= size && sliderX == minX)
			{
				idk = 1;
				semn = 1;
			}
			if(dist(mouseX, mouseY, minX, sliderY) <= size && sliderX == maxX)
			{
				idk = 1;
				semn = -1;
			}
		}
		
	}
}

function mousePressed()
{
	if(dist(mouseX, mouseY, sliderX, sliderY) <= size)
	{
		if(grab == 0) 
		{
			px = mouseX;
			py = mouseY;
		}
		grab = 1;
	}
	if(mouseX >= xScreen && mouseX <= xScreen + screenWidth && mouseY >= yScreen && mouseY <= yScreen + screenHeight)
	{
		if(drag == 0)
		{
			ppx = mouseX;
			ppy = mouseY;
		}
		drag = 1;
	}
}

function mouseReleased()
{
	if(grab == 1) 
		D = dist(px, py, mouseX, mouseY);
	grab = 0;
	o = 0;

	drag = 0;
}


function drawSlider()
{
	fill("#868f99");
	noStroke();
	rect(width * 0.74 + 20, 50, 200, height-100);

	if(abs(sliderX - minX) < abs(sliderX - maxX) * 2) fill("silver");
	else fill("#2f6bd8");
	noStroke();
	rect(0.75 * width + 45, height * 0.275, 100, height * 0.05, 15);

	if(grab == 1)
	{
		if(o < 75)
		{
			o += 0.5;
			o *= 1.1;
		}
		noStroke();
		fill(175, o);
		ellipse(sliderX, sliderY, size*2, size*2);
	}
	

	stroke("black");
	strokeWeight(0.5);
	fill("white");
	ellipse(sliderX, sliderY, size, size);
}

function displayInfo()
{
	noStroke();

	if(lenght <= 50)
	{
		fill(255, 255 * opacity / 100);

		//NETWORK
		textSize(14);
		textAlign(LEFT, TOP);
		textFont("Samsung Sans");
		text("TELEKOM.RO", xScreen + 3, yScreen + 3);

		//SIGNAL
		textAlign(RIGHT, TOP);
		textSize(14);
		strokeWeight(1.5);
		stroke("white");
		for(var i = 25; i <= 100; i+= 25)
		{
			if(i/25 <= bars) stroke("white");
			else stroke("gray");
			line(xScreen + screenWidth - 55 - (100-i)/5, yScreen + 17, xScreen + screenWidth - 55 - (100-i)/5, yScreen + 17 - 14 * i / 100);
		}

		//BATTERY
		if(p > 15) fill(255, 255 * opacity / 100);
		else 
		{
			fill(255, 0, 0, 255 * opacity / 100);
			stroke(255, 0, 0, 255 * opacity / 100);
			strokeWeight(1);
		}
		rect(xScreen + screenWidth - 14, yScreen + 3 + (100-p)/100*14, 5, p/100*14 - 1);

		stroke(255, 255 * opacity / 100);
		noFill();
		rect(xScreen + screenWidth - 15, yScreen + 3, 7, 14);

		fill("white");
		noStroke();
		text(p + "%", xScreen + screenWidth - 20, yScreen + 3);

		//INFO
		if(info == 1)
		{
			textSize(14);
			textAlign(CENTER, CENTER);
			textFont("Samsung Sans");
			text("Swipe screen to unlock", xScreen + screenWidth/2, yScreen + screenHeight * 0.85);
			image(unlock, width/2 - 10, yScreen + screenHeight*0.78, 20, 113/98*20)
		}
	}

	translate(xScreen + screenWidth/2, yScreen + screenHeight * 0.535);
	scale(1 - lenght / 2500);
	//fill(255, 255 * (opacity - lenght) / 100);
	noStroke();
	fill(255, 255 * (opacity - lenght/2)/ 100);

	//CLOCK
	strokeWeight(1);
	textSize(110);
	textAlign(CENTER, CENTER);
	textFont("Samsung Sans");
	text(H(), 0, screenHeight * (0.2 - 0.535));
	text(MIN(), 0, yScreen + screenHeight * (0.25 - 0.535));

	//DATE
	textSize(14);
	textAlign(CENTER, CENTER);
	textFont("Samsung Sans");
	text(M() + " " + day(), 0, yScreen + screenHeight * (0.4 - 0.535));

	scale(1);
	translate(0,0);
}

function H()
{
	var h = (hour() + 23)%24;
	if(h < 10) return "0" + h;
	else return h;
}

function MIN()
{
	if(minute() < 10) return "0" + minute();
	else return minute();
}

function M()
{
	if(month() == 1) return "JANUARY";
	else if(month() == 2) return "FEBRUARY";
	else if(month() == 3) return "MARCH";
	else if(month() == 4) return "APRIL";
	else if(month() == 5) return "MAY";
	else if(month() == 6) return "JUNE";
	else if(month() == 7) return "JULY";
	else if(month() == 8) return "AUGUST";
	else if(month() == 9) return "SEPTEMBER";
	else if(month() == 10) return "OCTOMBER";
	else if(month() == 11) return "NOVEMBER";
	else return "DECEMBER";
}

function showScreen()
{
	
	if(close == 1) 
	{
		noStroke();
		fill("#222323");
		if(proc < 100) proc += 5;
		rect(xScreen, yScreen, screenWidth * proc / 100, screenHeight, 5);
		rect(xScreen + screenWidth - screenWidth * proc / 100, yScreen, screenWidth * proc / 100, screenHeight, 5);

		stroke("black");
		strokeWeight(2.5);
		strokeCap(SQUARE);
	}
	if(display == 1)
	{	
		close = 0;
		proc = 0;
		tint(255, 256 * opacity / 100)
		image(bg, xScreen, yScreen, screenWidth, screenHeight);
		noTint();
	}
	else if(display == 2)
	{	
		if(u == 1)
		{
			tint(255, 255 - map(sc, 0.8, 1, 0, 255));
			image(home, xScreen, yScreen, screenWidth, screenHeight);
			noTint();
			textSize(20);
			textFont("Samsung sans");
			fill("white");
			stroke("white");
			text(";(  \n You unlocked my phone", xScreen + screenWidth/2, yScreen + 100);
		}
		else
		{
			if(opacity == 100) opacity = 0;
			if(opacity < 98) opacity += 6;
			tint(255, 128)
			image(bg, xScreen, yScreen, screenWidth, screenHeight);
			stroke("black");
			fill(0, opacity);
			strokeWeight(2.5);
			strokeCap(SQUARE);
			rect(xScreen, yScreen, screenWidth, screenHeight, 5);
		}		
	}
	
	stroke("black");
	strokeWeight(2.5);
	strokeCap(SQUARE);
	noFill();
	rect(xScreen, yScreen, screenWidth, screenHeight, 5);
}

function drawUpperPhone()
{
	noStroke();
	fill("#fff682");
	rect(0.28 * width + 15, 15, 0.4 * width, 20);

	stroke("black");
	strokeWeight(1);
	strokeCap(SQUARE);
	fill("black");
	rect(0.45 * width, height * 0.03, 0.1 * width, 3, 20);

	ellipse(0.395 * width, height * 0.03 + 2.5, 10, 10);
	ellipse(0.565 * width, height * 0.03 + 2.5, 3, 3);
	ellipse(0.575 * width, height * 0.03 + 2.5, 3, 3);

	stroke("white");
	strokeWeight(3);
	strokeCap(SQUARE);
	fill("yellow");
	ellipse(0.605 * width, height * 0.03 + 2.5, 11, 11);

	stroke("black");
	strokeWeight(0.65);
	strokeCap(SQUARE);
	noFill();
	ellipse(0.605 * width, height * 0.03 + 2.5, 13, 13);

}

function drawPhone()
{
	stroke("blue");
	strokeWeight(3);
	strokeCap(SQUARE);
	fill("#fff682");
	rect(0.28 * width, 5, 0.44 * width, height - 10, 30);
	fill("blue");
	rect(0.72 * width, height * 0.25, 3, height * 0.1, 15);
	rect(0.28 * width-3, height * 0.2, 3, height * 0.2, 15);

	showScreen();

	stroke("black");
	strokeWeight(1);
	strokeCap(SQUARE);
	fill("black");
	rect(0.45 * width, height * 0.03, 0.1 * width, 3, 20);

	ellipse(0.395 * width, height * 0.03 + 2.5, 10, 10);
	ellipse(0.565 * width, height * 0.03 + 2.5, 3, 3);
	ellipse(0.575 * width, height * 0.03 + 2.5, 3, 3);

	stroke("white");
	strokeWeight(3);
	strokeCap(SQUARE);
	fill("yellow");
	ellipse(0.605 * width, height * 0.03 + 2.5, 11, 11);

	stroke("black");
	strokeWeight(0.65);
	strokeCap(SQUARE);
	noFill();
	ellipse(0.605 * width, height * 0.03 + 2.5, 13, 13);

	var r = width / 9;
	image(samsung,width/2 - r/2, height * 0.055, r, r*0.153);

	var buttonHeight = height / 50;
	var hhh = 0.952;
	stroke("#A9A9A9");
	strokeWeight(1.5);
	strokeCap(SQUARE);
	noFill();
	rect(0.45 * width, height * hhh, 0.1 * width, buttonHeight, 30);


	buttonHeight = height / 50;

	imageMode(CENTER);
	image(menu, 0.39 * width - buttonHeight, height * hhh + buttonHeight /2, buttonHeight * 2, buttonHeight);
	image(back, 0.64 * width - buttonHeight * 0.75, height * hhh + buttonHeight /2, buttonHeight * 2, buttonHeight);
	imageMode(CORNER);

	/*stroke("red");
	line(width * 0.5, 0, width * 0.5, height);
	line(width * 0.29, 0, width * 0.29, height);
	line(width * 0.71, 0, width * 0.71, height);
	line(width * 0.395, 0, width * 0.395, height);
	line(width * 0.605, 0, width * 0.605, height);*/
}