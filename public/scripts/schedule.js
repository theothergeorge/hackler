var START = 3 * 60 + 15;
function getTimeString(time) {
    var actualTime = START + time;
    var minutes = Math.floor(actualTime / 60);
    var seconds = actualTime % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + " : " + seconds;
}

$(document).ready(function() {
	var presentations = _.sortBy(window.presentations, function(presentation){
        return parseInt(presentation.order);
    });

	var container = $('#scheduleList');
    for (var i =0; i < presentations.length; i++) {
        var presentation = presentations[i];
        container.append('<li id="' + presentation.teamId + '">' +
            '<span class="teamName">' + getTimeString(i * 5) + " - " +
            presentation.name + '</span><br/>' +
        '</li>');
    }
 });