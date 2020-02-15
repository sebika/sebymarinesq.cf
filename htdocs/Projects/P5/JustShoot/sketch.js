
var bg;

var x, y;
const defaultAnimationSpeed = 0.3;
const defaultCharacterSpeed = 5;
var upAnimation = [], downAnimation = [], leftAnimation = [], rightAnimation = [];
var upFrame, downFrame, leftFrame, rightFrame;
var characterWidth, characterHeight;
var animationSpeed, characterSpeed;
var dir = [];

var tree = [], xTree = [], yTree = [], widthTree = [], heightTree = [], treeType = [], number_of_trees = 0;
var xHitbox = [], yHitbox = [], widthHitbox = [], heightHitbox = [], number_of_hitboxes = 0;

var bullet = [], xBullet = [], yBullet = [], number_of_bullets = 0;
var vx = 0, vy = 0, d = [];
const bulletSize = 15, bulletSpeed = 10;

var dummy = [], deadDummy = [];
var idkDummy = [];
var xDummy = [], yDummy = [], aliveDummy = [], deadFrameDummy = [], number_of_dummies = 0;
const dummyWidth = 59, dummyHeight = 55;

var volume = [], Vol = 1, q = 1;
const xVol = 1150, yVol = 10, volSize = 75;

var u, idk = [];

// Sounds
var deadDummySound, bgSound, treeHit, step, sprint;

function preload()
{
	volume[0] = loadImage("IMG/volumeOff.png");
	volume[1] = loadImage("IMG/volumeOn.png");

	deadDummySound = loadSound("AUDIO/deadDummy.mp3");
	bgSound = loadSound("AUDIO/background.mp3");
	treeHit = loadSound("AUDIO/treeHit.mp3");
	step = loadSound("AUDIO/step.mp3");
	sprint = loadSound("AUDIO/sprint.mp3");

	tree[0] = loadImage("IMG/tree1.png");
	tree[1] = loadImage("IMG/tree9.png");
	tree[2] = loadImage("IMG/tree10.png");
	tree[3] = loadImage("IMG/tree11.png");
	tree[4] = loadImage("IMG/tree12.png");

	upAnimation[0] = loadImage("IMG/up1.png");
	upAnimation[1] = loadImage("IMG/up2.png");
	upAnimation[2] = loadImage("IMG/up3.png");
	upAnimation[3] = loadImage("IMG/up4.png");
	upAnimation[4] = loadImage("IMG/up5.png");
	upAnimation[5] = loadImage("IMG/up6.png");
	upAnimation[6] = loadImage("IMG/up7.png");

	downAnimation[0] = loadImage("IMG/down1.png");
	downAnimation[1] = loadImage("IMG/down2.png");
	downAnimation[2] = loadImage("IMG/down3.png");
	downAnimation[3] = loadImage("IMG/down4.png");
	downAnimation[4] = loadImage("IMG/down5.png");
	downAnimation[5] = loadImage("IMG/down6.png");
	downAnimation[6] = loadImage("IMG/down7.png");

	leftAnimation[0] = loadImage("IMG/left1.png");
	leftAnimation[1] = loadImage("IMG/left2.png");
	leftAnimation[2] = loadImage("IMG/left3.png");
	leftAnimation[3] = loadImage("IMG/left4.png");
	leftAnimation[4] = loadImage("IMG/left5.png");
	leftAnimation[5] = loadImage("IMG/left6.png");
	leftAnimation[6] = loadImage("IMG/left7.png");

	rightAnimation[0] = loadImage("IMG/right1.png");
	rightAnimation[1] = loadImage("IMG/right2.png");
	rightAnimation[2] = loadImage("IMG/right3.png");
	rightAnimation[3] = loadImage("IMG/right4.png");
	rightAnimation[4] = loadImage("IMG/right5.png");
	rightAnimation[5] = loadImage("IMG/right6.png");
	rightAnimation[6] = loadImage("IMG/right7.png");

	bullet[0] = loadImage("IMG/bulletUp.png");
	bullet[1] = loadImage("IMG/bulletDown.png");
	bullet[2] = loadImage("IMG/bulletLeft.png");
	bullet[3] = loadImage("IMG/bulletRight.png");

	dummy[0] = loadImage("IMG/dummy1.png");
	dummy[1] = loadImage("IMG/dummy2.png");
	dummy[2] = loadImage("IMG/dummy3.png");
	dummy[3] = loadImage("IMG/dummy4.png");
	dummy[4] = loadImage("IMG/dummy5.png");
	dummy[5] = loadImage("IMG/dummy6.png");
	dummy[6] = loadImage("IMG/dummy7.png");
	dummy[7] = loadImage("IMG/dummy8.png");

	deadDummy[0] = loadImage("IMG/deadDummy1.png");
	deadDummy[1] = loadImage("IMG/deadDummy2.png");
	deadDummy[2] = loadImage("IMG/deadDummy3.png");
	deadDummy[3] = loadImage("IMG/deadDummy4.png");
	deadDummy[4] = loadImage("IMG/deadDummy5.png");
	deadDummy[5] = loadImage("IMG/deadDummy6.png");
}

function setup()
{
	createCanvas(windowWidth,windowHeight);
	frameRate(240);
	init();

	bgSound.setVolume(0.5);
	step.setVolume(0.65);
	sprint.setVolume(0.65);
	bgSound.loop();
}

function init()
{
	characterHeight = 81;
	x = random(width/2 - 100, width/2 + 100);
	y = random(height/2 - 50, height/2 + 50);
	upFrame = 0;
	downFrame = 0;
	leftFrame = 0;
	rightFrame = 0;
	for(var i = 0; i <= 3; i++)
		dir[i] = 0;
	dir[floor(random(0,4))] = 1;
	if(dir[0] == 1 || dir[1] == 1) characterWidth = 55;
	else characterWidth = 62;

	animationSpeed = defaultAnimationSpeed;
	characterSpeed = defaultCharacterSpeed;

	//set trees
	loadTrees();

	//set hitboxes for trees
	loadHitboxes();
}

function draw()
{
	background(167,244,184);

	update();

	renderEverything();
	//ALL hitboxes	
	/*fill('red');
	noStroke();
	for(var i = 0; i < number_of_hitboxes; i++)
		rect(xHitbox[i], yHitbox[i], widthHitbox[i], heightHitbox[i]);*/
}

function update()
{
	if(frameCount % 60 == 0 && number_of_dummies < 5) spawnDummy();

	handleKeyboard();

	checkCollision();

	checkBulletsTrajectory();
}

function checkBulletsTrajectory()
{
	for(var i = 0; i < number_of_bullets; i++)
	{
		var px, py, u = 0;
		px = xBullet[i] + bulletSize / 2;
		py = yBullet[i] + bulletSize / 2;

		// for target dummies //////////////////////////////////////////////
		for(var j = 0; j < number_of_dummies; j++)
			if(abs(px - xDummy[j] - dummyWidth/2) < dummyWidth * 0.5 && py >= yDummy[j] && py <= yDummy[j] + dummyHeight && aliveDummy[j] == 1)
			{
				aliveDummy[j] = 0;
				deadFrameDummy[j] = -1;
				u = 1;
			}
		if(u == 1)
		{
			for(var j = i; j < number_of_bullets; j++)
			{
				xBullet[j] = xBullet[j+1];
				yBullet[j] = yBullet[j+1];
				d[j] = d[j+1];
			}
			number_of_bullets --;
			console.log("del");
			if(number_of_bullets == -1) number_of_bullets ++;
			if(Vol == 1) deadDummySound.play();
		}
		
		// for trees /////////////////////////////////
		u = 0;
		for(var j = 0; j < number_of_hitboxes; j++)
			if(px >= xHitbox[j] && px <= xHitbox[j] + widthHitbox[j])
			{
				if(py - (yHitbox[j] + heightHitbox[j]/2) > -10 && py - (yHitbox[j] + heightHitbox[j]/2) <= 0)
				{
					u = 1;
					break;
				}
			}
			
		if(u == 1)
		{
			for(var j = i; j < number_of_bullets; j++)
			{
				xBullet[j] = xBullet[j+1];
				yBullet[j] = yBullet[j+1];
				d[j] = d[j+1];
			}
			number_of_bullets --;
			console.log("del");
			if(number_of_bullets == -1) number_of_bullets ++;
			if(Vol == 1) treeHit.play();
		}
	}
}

function renderEverything()
{
	displayUI();

	for(var i = 0; i < number_of_trees; i++)
	{
		idk[i] = 0;
		idkDummy[i] = 0;
	}
	for(var i = 0; i < number_of_trees; i++)
	{
		var px, py;
		px = x;
		py = y + characterHeight;
		if(py >= yTree[i] && py <= yTree[i] + heightTree[i] && px >= xTree[i] && px <= xTree[i] + widthTree[i])
			idk[i] = 1;
		px = x + characterWidth;
		py = y + characterHeight;
		if(py >= yTree[i] && py <= yTree[i] + heightTree[i] && px >= xTree[i] && px <= xTree[i] + widthTree[i])
			idk[i] = 1;
		for(var j = 0; j < number_of_dummies; j++)
		{
			px = xDummy[j];
			py = yDummy[j] + dummyHeight;
			if(py >= yTree[i] && py <= yTree[i] + heightTree[i] && px >= xTree[i] && px <= xTree[i] + widthTree[i])
				idkDummy[i] = 2;
			px = xDummy[j] + dummyWidth;
			py = yDummy[j] + dummyHeight;
			if(py >= yTree[i] && py <= yTree[i] + heightTree[i] && px >= xTree[i] && px <= xTree[i] + widthTree[i])
				idkDummy[i] = 2;
		}
	}

	for(var i = 0; i < number_of_trees; i++)
		if(idk[i] == 0 && idkDummy[i] == 0) displayTree(i);


	displayDummies();
	for(var i = 0; i < number_of_trees; i++)
		if(idkDummy[i] == 2) displayTree(i);

	displayBullets();
	displayCharacter();
	for(var i = 0; i < number_of_trees; i++)
		if(idk[i] == 1) displayTree(i);


	tint(255,256/3);
	displayDummies();
	displayBullets();
	displayCharacter();
	noTint();
}

function displayUI()
{
	image(volume[Vol], xVol, yVol, volSize, volSize);
}

function checkCollision()
{
	var u = 0;
	for(var i = 0; i < number_of_dummies; i++)
	{
		var px, py;
		px = xDummy[i] + dummyWidth * 0.4;
		py = yDummy[i] + dummyHeight * 0.1;
		if(px >= x && px <= x + characterWidth && py >= y && py <= y + characterHeight)
		{
			u = 1;
			break;
		}
		px = xDummy[i] + dummyWidth * 0.6;
		py = yDummy[i] + dummyHeight * 0.1;
		if(px >= x && px <= x + characterWidth && py >= y && py <= y + characterHeight)
		{
			u = 1;
			break;
		}
		px = xDummy[i] + dummyWidth * 0.4;
		py = yDummy[i] + dummyHeight * 0.5;
		if(px >= x && px <= x + characterWidth && py >= y && py <= y + characterHeight)
		{
			u = 1;
			break;
		}
		px = xDummy[i] + dummyWidth * 0.6;
		py = yDummy[i] + dummyHeight * 0.5;
		if(px >= x && px <= x + characterWidth && py >= y && py <= y + characterHeight)
		{
			u = 1;
			break;
		}
	}
	if(u == 1)
	{
		if(dir[0] == 1) y += characterSpeed;
		else if(dir[1] == 1) y -= characterSpeed;
		else if(dir[2] == 1) x += characterSpeed;
		else x -= characterSpeed;
	}
}

function spawnDummy()
{
	var u = 1;
	var px, py;
	while(1)
	{
		px = random(75, width - 75);
		py = random(50, height - 50);
		var dist;
		dist = sqrt((x-px)*(x-px) + (y-py)*(y-py));
		if(dist >=  75) break;
	}
	xDummy[number_of_dummies] = px;
	yDummy[number_of_dummies] = py;
	aliveDummy[number_of_dummies] = 1;
	number_of_dummies ++;		
}

function displayDummies()
{
	for(var i = 0; i < number_of_dummies; i++)
		if(aliveDummy[i] == 1) image(dummy[floor(frameCount/7)%8], xDummy[i], yDummy[i], dummyWidth, dummyHeight);
		else 
		{
			if(deadFrameDummy[i] == -1) deadFrameDummy[i] ++;
			else if(frameCount % 10 == 0) deadFrameDummy[i] ++;
			if(deadFrameDummy[i] != -1)
			{
				image(deadDummy[deadFrameDummy[i]], xDummy[i], yDummy[i], dummyWidth, dummyHeight);
				if(deadFrameDummy[i] == 5)
				{
					for(var j = i; j < number_of_dummies; j++)
					{
						xDummy[j] = xDummy[j+1];
						yDummy[j] = yDummy[j+1];
						aliveDummy[j] = aliveDummy[j+1];
						deadFrameDummy[j] = deadFrameDummy[j+1];
					}
					number_of_dummies --;
				}
			}
			else image(dummy[floor(frameCount/7)%8], xDummy[i], yDummy[i], dummyWidth, dummyHeight);
		}
}

function displayBullets()
{
	for(var i = 0; i < number_of_bullets; i++)
		image(bullet[d[i] - 1], xBullet[i], yBullet[i], bulletSize, bulletSize);
}

function displayCharacter()
{
	if(dir[0] == 1)  image(upAnimation[floor(upFrame)], x, y, characterWidth, characterHeight);
	else if(dir[1] == 1)  image(downAnimation[floor(downFrame)], x, y, characterWidth, characterHeight);
	else if(dir[2] == 1)  image(leftAnimation[floor(leftFrame)], x, y, characterWidth, characterHeight);
	else image(rightAnimation[floor(rightFrame)], x, y, characterWidth, characterHeight);
}

function displayTree(nr)
{
	image(tree[treeType[nr]], xTree[nr], yTree[nr], widthTree[nr], heightTree[nr]);
}

function handleKeyboard()
{
	var auxX = x, auxY = y;
	if(keyIsDown(87) || keyIsDown(UP_ARROW))
	{
		y -= characterSpeed;
		//check for hitbox first
		u = 1;
		for(var i = 0; i < number_of_hitboxes; i++)
			if((y + characterHeight >= yHitbox[i] && y + characterHeight <= yHitbox[i] + heightHitbox[i]) && ((x >= xHitbox[i] && x <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth >= xHitbox[i] && x + characterWidth <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth/2 >= xHitbox[i] && x + characterWidth/2 <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth * 0.25 >= xHitbox[i] && x + characterWidth * 0.25 <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth * 0.75 >= xHitbox[i] && x + characterWidth * 0.75 <= xHitbox[i] + widthHitbox[i])))
			{
				u = 0;
				break;
			}
		if(u == 0) y += characterSpeed;
		else
		{
			upFrame += animationSpeed;
			if(upFrame > 6) upFrame = 0;
			downFrame = 0;
			leftFrame = 0;
			rightFrame = 0;
			for(var i = 0; i <= 3; i++)
				dir[i] = 0;
			dir[0] = 1;
			characterWidth = 55;
		}		
	}
	else if(keyIsDown(83) || keyIsDown(DOWN_ARROW))
	{
		y += characterSpeed;

		//check for hitbox first
		u = 1;
		for(var i = 0; i < number_of_hitboxes; i++)
			if((y + characterHeight >= yHitbox[i] && y + characterHeight <= yHitbox[i] + heightHitbox[i]) && ((x >= xHitbox[i] && x <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth >= xHitbox[i] && x + characterWidth <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth/2 >= xHitbox[i] && x + characterWidth/2 <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth * 0.25 >= xHitbox[i] && x + characterWidth * 0.25 <= xHitbox[i] + widthHitbox[i]) || (x + characterWidth * 0.75 >= xHitbox[i] && x + characterWidth * 0.75 <= xHitbox[i] + widthHitbox[i])))
			{
				u = 0;
				break;
			}
		if(u == 0) y -= characterSpeed;
		else
		{
			downFrame += animationSpeed;
			if(downFrame > 6) downFrame = 0;
			upFrame = 0;
			leftFrame = 0;
			rightFrame = 0;
			for(var i = 0; i <= 3; i++)
				dir[i] = 0;
			dir[1] = 1;
			characterWidth = 55;
		}
	}
	else if(keyIsDown(65) || keyIsDown(LEFT_ARROW))
	{
		x -= characterSpeed;
		leftFrame += animationSpeed;
		if(leftFrame > 6) leftFrame = 0;
		upFrame = 0;
		downFrame = 0;
		rightFrame = 0;
		for(var i = 0; i <= 3; i++)
			dir[i] = 0;
		dir[2] = 1;
		characterWidth = 62;		
	}
	else if(keyIsDown(68) || keyIsDown(RIGHT_ARROW))
	{
		x += characterSpeed;
		rightFrame += animationSpeed;
		if(rightFrame > 6) rightFrame = 0;
		upFrame = 0;
		downFrame = 0;
		leftFrame = 0;
		for(var i = 0; i <= 3; i++)
			dir[i] = 0;
		dir[3] = 1;
		characterWidth = 62;
	}
	else
	{
		if(dir[0] == 1 || dir[1] == 1) characterWidth = 55;
			else characterWidth = 62;
		upFrame = 0;
		downFrame = 0;
		leftFrame = 0;
		rightFrame = 0;
	}

	if(Vol == 1)
	{
		if(auxX != x || auxY != y)
		{
			if(keyIsDown(SHIFT))
			{
				if(keyIsDown(68) || keyIsDown(65) || keyIsDown(83) || keyIsDown(87))
					if(sprint.isPlaying() == 0)
					{
						sprint.loop();
						step.stop();
					}
			}
			else 
			{
				sprint.pause();
				if(keyIsDown(68) || keyIsDown(65) || keyIsDown(83) || keyIsDown(87))
				{
					if(step.isPlaying() == 0)
						step.loop();
				}
				else step.pause();
			}
		}
		else
		{
			step.stop();
			sprint.stop();
		}
	}	

	// SPRINT
	if(keyIsDown(SHIFT))
	{
		animationSpeed = defaultAnimationSpeed * 1.5;
		characterSpeed = defaultCharacterSpeed * 1.5;
	}
	else
	{
		animationSpeed = defaultAnimationSpeed;
		characterSpeed = defaultCharacterSpeed;
	}

	//FIRE
	if(keyIsDown(ENTER) || mouseIsPressed == true || keyIsDown(32))
	{
		if(dir[0] == 1)
		{
			if(number_of_bullets == 0 || abs(y - yBullet[number_of_bullets-1]) >= 50)
			{
				d[number_of_bullets] = 1;
				xBullet[number_of_bullets] = x + characterWidth * 0.55;
				yBullet[number_of_bullets] = y - 5;
				number_of_bullets ++;
			}
		}
		else if(dir[1] == 1)
		{
			if(number_of_bullets == 0 || abs(y + characterHeight - yBullet[number_of_bullets-1]) >= 50)
			{
				d[number_of_bullets] = 2;
				xBullet[number_of_bullets] = x + characterWidth * 0.16;
				yBullet[number_of_bullets] = y + characterHeight - 16;
				number_of_bullets ++;
			}
		}
		else if(dir[2] == 1)
		{
			if(number_of_bullets == 0 || abs(x - xBullet[number_of_bullets-1]) >= 50)
			{
				d[number_of_bullets] = 3;
				xBullet[number_of_bullets] = x;
				yBullet[number_of_bullets] = y + characterHeight * 0.63;
				number_of_bullets ++;
			}
		}
		else if(dir[3] == 1)
		{
			if(number_of_bullets == 0 || abs(x + characterWidth - xBullet[number_of_bullets-1]) >= 50)
			{
				d[number_of_bullets] = 4;
				xBullet[number_of_bullets] = x + characterWidth;
				yBullet[number_of_bullets] = y + characterHeight * 0.63;
				number_of_bullets ++;
			}
		}
	}
	for(var i = 0; i <= number_of_bullets; i++)
	{
		if(d[i] == 1) yBullet[i] -= bulletSpeed;
		else if(d[i] == 2) yBullet[i] += bulletSpeed;
		else if(d[i] == 3) xBullet[i] -= bulletSpeed;
		else xBullet[i] += bulletSpeed;

		if(xBullet[i] < 0 || xBullet[i] > width || yBullet[i] < 0 || yBullet[i] > height)
		{
			for(var j = i; j < number_of_bullets; j++)
			{
				xBullet[j] = xBullet[j+1];
				yBullet[j] = yBullet[j+1];
				d[j] = d[j+1];
			}
			number_of_bullets --;
		}
	}	
}

function mousePressed()
{
	if(mouseX >= xVol && mouseX <= xVol + volSize && mouseY >= yVol && mouseY <= yVol + volSize)
	{
		if(Vol == 1) Vol = 0;
		else Vol = 1;
		if(bgSound.isPlaying() == 1) bgSound.pause();
		else bgSound.play();
		if(deadDummySound.isPlaying() == 1) deadDummySound.stop();
		if(treeHit.isPlaying() == 1) treeHit.stop();
	}
}

function loadTrees()
{
	treeType[0] = 0;
	xTree[0] = 10;
	yTree[0] = 30;
	widthTree[0] = 260;
	heightTree[0] = 187;

	treeType[1] = 1;
	xTree[1] = 390;
	yTree[1] = 180;
	widthTree[1] = 232;
	heightTree[1] = 229;

	treeType[2] = 3;
	xTree[2] = 1040;
	yTree[2] = 390;
	widthTree[2] = 141;
	heightTree[2] = 223;

	treeType[3] = 3;
	xTree[3] = 890;
	yTree[3] = 500;
	widthTree[3] = 141;
	heightTree[3] = 223;

	treeType[4] = 2;
	xTree[4] = 1170;
	yTree[4] = 280;
	widthTree[4] = 141;
	heightTree[4] = 223;

	treeType[6] = 1;
	xTree[6] = 600;
	yTree[6] = 30;
	widthTree[6] = 232;
	heightTree[6] = 229;

	treeType[5] = 3;
	xTree[5] = 1280;
	yTree[5] = -50;
	widthTree[5] = 300;
	heightTree[5] = 300*1.58;

	treeType[7] = 2;
	xTree[7] = 780;
	yTree[7] = 150;
	widthTree[7] = 141;
	heightTree[7] = 223;

	treeType[8] = 4;
	xTree[8] = 30;
	yTree[8] = 458;
	widthTree[8] = 100;
	heightTree[8] = 158;

	treeType[9] = 4;
	xTree[9] = 180;
	yTree[9] = 410;
	widthTree[9] = 113.9;
	heightTree[9] = 180;

	treeType[10] = 4;
	xTree[10] = 100;
	yTree[10] = 300;
	widthTree[10] = 110;
	heightTree[10] = 172;

	treeType[11] = 1;
	xTree[11] = 1220;
	yTree[11] = 500;
	widthTree[11] = 300;
	heightTree[11] = 295;

	treeType[12] = 1;
	xTree[12] = 600;
	yTree[12] = 600;
	widthTree[12] = 300;
	heightTree[12] = 295;

	treeType[13] = 2;
	xTree[13] = 300;
	yTree[13] = 480;
	widthTree[13] = 141;
	heightTree[13] = 223;

	treeType[14] = 3;
	xTree[14] = 480;
	yTree[14] = 550;
	widthTree[14] = 141;
	heightTree[14] = 223;

	treeType[15] = 2;
	xTree[15] = 900;
	yTree[15] = 250;
	widthTree[15] = 141;
	heightTree[15] = 223;

	treeType[16] = 2;
	xTree[16] = 1050;
	yTree[16] = 100;
	widthTree[16] = 141;
	heightTree[16] = 223;

	treeType[17] = 3;
	xTree[17] = 890;
	yTree[17] = -40;
	widthTree[17] = 141;
	heightTree[17] = 223;

	treeType[18] = 4;
	xTree[18] = 250;
	yTree[18] = 200;
	widthTree[18] = 100;
	heightTree[18] = 158;

	treeType[19] = 4;
	xTree[19] = 350;
	yTree[19] = 50;
	widthTree[19] = 100;
	heightTree[19] = 158;

	number_of_trees = 20;
}

function loadHitboxes()
{
	xHitbox[0] = 50 + xTree[0];
	yHitbox[0] = yTree[0] + heightTree[0];
	widthHitbox[0] = 150;
	heightHitbox[0] = 10;

	xHitbox[1] = 105 + xTree[1];
	yHitbox[1] = yTree[1] + heightTree[1];
	widthHitbox[1] = 35;
	heightHitbox[1] = 10;

	xHitbox[2] = 55 + xTree[2];
	yHitbox[2] = yTree[2] + heightTree[2];
	widthHitbox[2] = 25;
	heightHitbox[2] = 10;

	xHitbox[3] = 55 + xTree[3];
	yHitbox[3] = yTree[3] + heightTree[3];
	widthHitbox[3] = 25;
	heightHitbox[3] = 10;

	xHitbox[4] = 55 + xTree[4];
	yHitbox[4] = yTree[4] + heightTree[4];
	widthHitbox[4] = 35;
	heightHitbox[4] = 10;

	xHitbox[6] = 105 + xTree[6];
	yHitbox[6] = yTree[6] + heightTree[6];
	widthHitbox[6] = 35;
	heightHitbox[6] = 10;

	xHitbox[5] = 10000 + xTree[5];
	yHitbox[5] = yTree[5] + heightTree[5];
	widthHitbox[5] = 25;
	heightHitbox[5] = 10;

	xHitbox[7] = 55 + xTree[7];
	yHitbox[7] = yTree[7] + heightTree[7];
	widthHitbox[7] = 35;
	heightHitbox[7] = 10;

	xHitbox[8] = 43 + xTree[8];
	yHitbox[8] = yTree[8] + heightTree[8];
	widthHitbox[8] = 10;
	heightHitbox[8] = 10;

	xHitbox[9] = 52 + xTree[9];
	yHitbox[9] = yTree[9] + heightTree[9];
	widthHitbox[9] = 10;
	heightHitbox[9] = 10;

	xHitbox[10] = 49 + xTree[10];
	yHitbox[10] = yTree[10] + heightTree[10];
	widthHitbox[10] = 10;
	heightHitbox[10] = 10;

	xHitbox[11] = 55 + xTree[15];
	yHitbox[11] = yTree[15] + heightTree[15];
	widthHitbox[11] = 35;
	heightHitbox[11] = 10;

	xHitbox[12] = 55 + xTree[16];
	yHitbox[12] = yTree[16] + heightTree[16];
	widthHitbox[12] = 35;
	heightHitbox[12] = 10;

	xHitbox[13] = 55 + xTree[17];
	yHitbox[13] = yTree[17] + heightTree[17];
	widthHitbox[13] = 25;
	heightHitbox[13] = 10;

	xHitbox[14] = 43 + xTree[18];
	yHitbox[14] = yTree[18] + heightTree[18];
	widthHitbox[14] = 10;
	heightHitbox[14] = 10;

	xHitbox[15] = 43 + xTree[19];
	yHitbox[15] = yTree[19] + heightTree[19];
	widthHitbox[15] = 10;
	heightHitbox[15] = 10;

	number_of_hitboxes = 16;
}

