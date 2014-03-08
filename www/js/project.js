
function sortByPriority(a, b) {
	var aPriority = a.priority;
	var bPriority = b.priority;
	return ((aPriority > bPriority) ? -1 : ((aPriority < bPriority) ? 1 : 0));
}

function gotoProject(projectID, projectTitle) {
	globalProjectID = projectID;
	$("#projectPageHeader").html(projectTitle + " Tickets");
	$.mobile.loading('show', {
		theme : 'a',
		text : 'Loading Tickets',
		textVisible : true
	});
	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + projectID + "/tickets.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {
			for (var i = 1; i <= 5; i++)
				$("#ticketList" + i).empty();

			var ticketArray = [];
			var ticketCount = [0,0,0,0,0];
			data.forEach(function (ticket) {
				if (ticket.status != "closed")
				{
					ticketArray.push(ticket);
					ticketCount[ticket.priority-1]++;
					}
			});
			for(var i=1; i<=5; i++)
				$("#" + i + "TicketCount").html(ticketCount[i-1]);
			ticketArray.sort(sortByPriority);
			var ticketPriority = -1;
			var priorityColor = "";
			ticketArray.forEach(function (ticket) {
				if (ticketPriority != ticket.priority) {
					ticketPriority = ticket.priority;
					var priorityLabel = "";
					switch (ticketPriority) {
					case "5":
						priorityColor = "rgba(255,50,50,.55);";
						break;
					case "4":
						priorityColor = "rgba(255,130,130,.55);";
						break;
					case "3":
						priorityColor = "rgba(255,255,255,.2);";
						break;
					case "2":
						priorityColor = "rgba(130,160,205,.5);";
						break;
					case "1":
						priorityColor = "rgba(70,70,185,.3);";
						break;
					}
				}
				$("#ticketList" + ticketPriority).append("<li><a onclick='gotoTicket("+JSON.stringify(ticket)+");'  style='background:" + priorityColor + "'>" + ticket.summary + "</a></li>");
			});

			$.mobile.changePage("#projectPage");
			for (var i = 1; i <= 5; i++)
				$("#ticketList" + i).listview("refresh");
		},
		complete : function () {
			$.mobile.loading('hide');
		},
		error : function (e) {
			console.log(e);
		}
	});
}