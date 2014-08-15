var timerTimer;
var timeOut = 180;
var currentTime;
var paused = false;
var currentOrder = 0;
var presentations;
function startTimer() {
	stopTimer();
	currentTime = timeOut;
	timerTimer = window.setInterval(function(){
		if (currentTime <= 0) {
			stopTimer();
			flashTimeOut();
		} else {
			if (!paused) {
				$('.timer').text(getTimeString(currentTime));
				currentTime --;
			}
		}
	}, 1000);
}

function getTimeString(time) {
	var minutes = Math.floor(time / 60);
	var seconds = time % 60;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	return minutes + " : " + seconds;
}

function stopTimer() {
	window.clearInterval(timerTimer);
	timerTimer = null;
	$('.timer').text(getTimeString(timeOut));
}

function flashTimeOut() {

}

function pauseTimer() {
	paused = !paused;
}

function showPresentation(index) {
	index = index < 0 ? 0 : index;
	$('.currentTeamName').text(presentations[index].name);
	if (index < presentations.length -1) {
		$('.nextTeamName').text(presentations[index + 1].name);
		paused = true;
		startTimer();
	} else {
		$('.nextTeamName').text("NO MORE!");
	}
	currentIndex = index;
}

$(document).ready(function() {
	presentations = _.sortBy(window.presentations, 'order');
	// Set up first slide
	showPresentation(0);

	key('left', function(){
		showPresentation(currentIndex - 1);
	});
	key('right', function(){
		showPresentation(currentIndex + 1);
	});
	key('space', function(){
		pauseTimer();
	});
	key('x', function() {
		stopTimer();
	});
});