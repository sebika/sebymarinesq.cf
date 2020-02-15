var h = [], v = [], n = 175;
const spacex = 50,  spacey = 25;
var gap;
var once = 0;

function setup()
{
	createCanvas(800,600);
	frameRate(60);
}

function preload()
{
	for(var i = 1; i <= n; i++)
	{
		v[i] = random(1000);
		h[i] = map(i, 0, n, 0, 600 - 2*spacey);
	}
	for(var i = 1; i < n; i++)
		for(var j = i + 1; j <= n; j++)
			if(v[i] > v[j])
			{
				var aux = v[i];
				v[i] = v[j];
				v[j] = aux;
				aux = h[i];
				h[i] = h[j];
				h[j] = aux;
			}
}

function draw()
{	
	drawLines();
	bubble();

	/*if(once == 0)
	{
		once = 1;
		console.log("+");
		quickSort(h, 1, n);
	}*/
}

function quickSort(arr, low, high)
{
	if(low < high)
	{
		var pi = partition(arr, low, high);

		quickSort(arr, low, pi - 1);
		quickSort(arr, pi + 1, high);
	}
}

function partition(arr, low, high)
{
	var pivot = arr[high];
	var i = low - 1;
	for(var j = low; j <= high - 1; j++)
	{
		if(arr[j] <= pivot)
		{
			i++;
			var aux;
			aux = arr[i];
			arr[i] = arr[j];
			arr[j] = aux;
		}
	}
	aux = arr[i+1];
	arr[i+1] = arr[high];
	arr[high] = aux;
	return i + 1;
}

function bubble()
{
	textAlign(CENTER, CENTER);
	textFont("Calibri");
	textSize(20);
	fill("white");
	noStroke();
	text("BUBBLE SORT", width/2, height - spacey/2);
	if(h[n] != width - 2*(n-spacex))
	{
		var u = 0;
		for(var i = 0; i < n; i++)
			for(var j = i + 1; j <= n; j++)
			{
				if(h[j] < h[i] && u == 0)
				{
					var aux = h[i];
					h[i] = h[j];
					h[j] = aux;
					u ++;
				}
				if(u == 1) break;
			}
	}
}

function drawLines()
{
	background('black');
	gap = 0;
	for(var i = 1; i <= n; i++)
	{
		stroke("white");
		strokeWeight(2);
		line(spacex + i + gap, height - spacey - h[i], spacex + i + gap, height - spacey);
		gap += 3;
	}
}