var Current = 0, step = 1;
var v = [], mx = 0;
var recaman = [], len = 0;
var G = 5;
var f = 1, u = 0;

function setup()
{
	createCanvas(800,600);
	background('black');

	noFill();

	frameRate(240);

	colorMode(HSB);

	len++;
	recaman[len] = 0;
}

function draw()
{	
	background('black');

	displayArcs();

	update();
}
	

function update()
{



	New = next(Current);
	//console.log(mx);
	if(mx < New) mx = New;
	recaman[++len] = New;	
	v[New] = 1;
	Current = New;
	step ++;	
}

function next(i)
{
	if(i - step > 0 && v[i-step] != 1) return i - step;
	else return i + step;
}

function displayArcs()
{
	strokeWeight(G);
	if(G >= 1) G -= 0.02;

	for(var i = 1; i < len; i++)
	{
		var x1, x2;
		x1 = map(recaman[i], 0, mx, 0, width);
		x2 = map(recaman[i+1], 0, mx, 0, width);

		stroke(i%256, 255, 255);

		if(x2 > x1) arc((x1+x2)/2, height/2, abs(x1-x2), abs(x1-x2), PI, 2*PI);
		else arc((x1+x2)/2, height/2, abs(x1-x2), abs(x1-x2), 0, PI);
	}
}