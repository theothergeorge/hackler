$(document).ready(function() {

	var presentations = window.presentations;
    if (presentations.length == 0) {
        // empty, bootstrap with team first
        presentations = teams;
    }
    $( "#presentationList" ).sortable();
    $( "#presentationList" ).disableSelection();

	var container = $('#presentationList');
    _.each(presentations, function(presentation){
    	container.append('<li id="' + presentation.teamId + '">' +
    		'<span class="teamName">' +
    		presentation.name + '</span><br/>' +
    	'</li>');
    });

    $('.savePresentation').on('click tap', function(evt){
    	var order = [];
    	var children = container.children();
    	for (var i = 0; i < container.children().length; i++) {
    		var teamId = $(children[i]).attr('id');
            var teamName = $('span', children[i]).text();
    		order.push({
                name: teamName,
    			teamId: window.parseInt(teamId),
    			order: i
    		});
    	}
    	$.ajax({
    		url: "/api/presentations",
    		type: "POST",
    		dataType: "json",
            data: { presentations: order },
    		success: function(data) {
    			window.location.href = "/home";
    		}
    	});
    });
 });