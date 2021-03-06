var s = Snap("#svg");

var startY = 150
var rad = 100
var pupilRatio = 1/4
var leftEyeX = rad * 2
var rightEyeX = rad * 5
var animationTime = 250
var pupilStrokeWidth = 4

var shadowFilter = s.filter(Snap.filter.shadow(0, 0, 4))

function makeEye(x){
	var eye = s.circle(x, startY, rad);

	eye.addClass('eye')

	eye.attr({
		fill: "#fff",
		stroke: "#000",
		strokeWidth: 3,
		filter: shadowFilter
	})


	var pupil = s.circle(x, startY, rad * pupilRatio);
	pupil.attr({
		fill: "#000",
		stroke: Snap.hsl(Math.random() * 360, 50, 50),
		strokeWidth: pupilStrokeWidth
	})

	pupil.addClass('pupil')

	pupil.click(function(){
		// this.attr({
		// 	stroke: Snap.hsl(Math.random() * 360, 50, 50)
		// })//instead of just setting it, we'll animate it
		var thisPupil = this
		if(thisPupil.inAnim().length > 0)
			return
		

		thisPupil.animate({//change to a random stroke color, and increase the stroke width temporarily
			stroke: Snap.hsl(Math.random() * 360, 50, 50),
			strokeWidth: pupilStrokeWidth * 1.5
		}, animationTime, mina.linear, function(){
			thisPupil.animate({
				strokeWidth: pupilStrokeWidth
			}, animationTime)
		})

		thisPupil.parent().children()[0].animate({
			r: rad * 1.0625
		}, animationTime, mina.linear, function(){
			
			thisPupil.parent().children()[0].animate({r: rad}, animationTime)
		})


	})

	var group = s.group(eye, pupil)

	eye.hover(function(){

		var thisEye = this
		var thisGroup = thisEye.parent()
		if(eye.inAnim().length)
			return

		thisGroup.children()[1].animate({r: rad * pupilRatio * 1.25}, animationTime, mina.linear, function(){
			thisGroup.children()[1].animate({r: rad * pupilRatio}, animationTime)
		})

	})

	return group
}

function addTransformation(element, transformation){
	//e.g. addTransformation(leftEye.children()[1],"r45")
	//just doing leftEye.children()[1].transform("r45") would get rid of the eye's translation
	element.transform(transformation+element.transform().string)
}


var leftEye = makeEye(leftEyeX)
var rightEye = makeEye(rightEyeX)

var leftEyeAnimating = false
var rightEyeAnimating = false

var maxTravelDistance = rad * (1-pupilRatio) * 3/4

s.mousemove(function(e){
	var mouseX = e.x
	var mouseY = e.y

	var leftEyeAngle = Math.atan2(mouseY - startY, mouseX - leftEyeX)

	var leftEyeDistance = Math.sqrt(Math.pow(mouseX - leftEyeX, 2) + Math.pow(mouseY - startY, 2))

	leftEyeDistance = Math.min(leftEyeDistance / 4, maxTravelDistance)

	var leftEyeTransformX = Math.cos(leftEyeAngle) * leftEyeDistance
	var leftEyeTransformY = Math.sin(leftEyeAngle) * leftEyeDistance

	leftEye.children()[1].transform('t'+leftEyeTransformX+","+leftEyeTransformY)

	var rightEyeAngle = Math.atan2(mouseY - startY, mouseX - rightEyeX)

	var rightEyeDistance = Math.sqrt(Math.pow(mouseX - rightEyeX, 2) + Math.pow(mouseY - startY, 2))

	rightEyeDistance = Math.min(rightEyeDistance / 4, maxTravelDistance)

	var rightEyeTransformX = Math.cos(rightEyeAngle) * rightEyeDistance
	var rightEyeTransformY = Math.sin(rightEyeAngle) * rightEyeDistance

	rightEye.children()[1].transform('t'+rightEyeTransformX+","+rightEyeTransformY)
})