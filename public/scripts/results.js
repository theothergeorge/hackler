
function generateRandomData() {
	var data = [];
	for (var i = 0; i < 10; i++) {
		var votes = Math.floor(Math.random() * 10);
		data.push({
			id : i,
			name: "Team " + i,
			votes : votes
		});
	}
	return data;
}

// Total width/height is 96%
var maxDimension = 100;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function renderData(data) {
	var container = $('.votesContainer');
	var numOfTeams = Object.keys(data).length;
	var height = maxDimension / numOfTeams;
	var maxVotes = _.max(data, "votes").votes;

	_.each(_.sortBy(data, 'name'), function(team){
		var width = team.votes / maxVotes * maxDimension;
		var votesString = team.votes + " votes";
		var existingBar = $('.votesContainer .barWrapper.team'+team.id);
		if (existingBar.length > 0) {
			existingBar.animate({height: height + "%"});
			$('.bar', existingBar).animate({width: width + "%"});
			$('.votesText', existingBar).text(votesString);
			existingBar.addClass('edited');
		} else {
			var color = getRandomColor();
			var barWrapper = $('<div/>', { class: "barWrapper team" + team.id})
				.css({ height: height + '%' });
			var text = $('<div/>', { class: 'text', text: team.name });
			var bar = $('<div/>', { class: 'bar' })
				.css({ width: width + '%', backgroundColor: color });
			var votesText = $('<div/>', { class: 'votesText', text: votesString});
			container.append(barWrapper.append(bar, text, votesText));
			barWrapper.addClass('edited');
		}
	});
	console.log($('.barWrapper:not(.edited)').length);
	$('.barWrapper:not(.edited)').remove();
	$('.barWrapper').removeClass('edited');
}

function getVotes() {
	$.ajax({
		url: "/api/votes",
		type: "GET",
		success: function(data) {
			renderData(data);
		}
	});
}

$(document).ready(function(){
	getVotes();
	window.setInterval(function(){
		getVotes();
	}, 1000);
});