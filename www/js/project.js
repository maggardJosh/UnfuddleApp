var globalProjectName = "";

function sortByPriority(a, b) {
	var aPriority = a.priority;
	var bPriority = b.priority;
	return ((aPriority > bPriority) ? -1 : ((aPriority < bPriority) ? 1 : 0));
}

function gotoProject(projectID, projectTitle) {
	globalProjectID = projectID;
	globalProjectName = projectTitle;
	$("#projectPageHeader").html(projectTitle);
	$("#ticketReportPageHeader").html(projectTitle +" Tickets");

	$.mobile.changePage("#projectPage");
	
}

function gotoTicketPage() {
	$.mobile.loading('show', {
		theme : 'a',
		text : 'Loading Tickets',
		textVisible : true
	});
	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/tickets.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {
			getTicketList(data);
		},
		complete : function () {
			$.mobile.loading('hide');
		},
		error : function (e) {
			
		}
	});
}
