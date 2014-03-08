

var domain = window.localStorage.getItem("unfuddleDomain");
var username = window.localStorage.getItem("username");
var password = window.localStorage.getItem("password");

var globalProjectID = 0;
var globalTicketID = 0;

document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(onDeviceReady);
function onDeviceReady() {
	$("#txtDomain").val(domain);
	$("#txtUsername").val(username);
	$("#txtPassword").val(password);
	
	if(domain && username && password)
	{
		login();
	}
}

function logout() {
	window.localStorage.setItem("unfuddleDomain", "");
	window.localStorage.setItem("username", "");
	window.localStorage.setItem("password", "");
	
	domain = "";
	username= "";
	password = "";
	
	$("#txtDomain").val(domain);
	$("#txtUsername").val(username);
	$("#txtPassword").val(password);
	
	$.mobile.changePage("#loginPage");
	
}

function login() {
	window.localStorage.setItem("unfuddleDomain", $("#txtDomain").val());
	window.localStorage.setItem("username", $("#txtUsername").val());
	window.localStorage.setItem("password", $("#txtPassword").val());
	domain = $("#txtDomain").val();
	username = $("#txtUsername").val();
	password = $("#txtPassword").val();
	$.mobile.loading('show', {
		theme : 'a',
		text : 'Logging in',
		textVisible : true
	});
	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {
			$("#projectList").empty().append("<li data-role='list-divider'>Projects</li>");
			
			data.forEach(function (project) {
				$("#projectList").append("<li><a onclick='gotoProject(" + project.id + ", \"" + project.title + "\");'>" + project.title + "</a></li>");

			});

			$.mobile.changePage("#projectsPage");
			$("#projectList").listview("refresh");
		},
		complete : function () {
			$.mobile.loading('hide');
		},
		error : function (e) {
			console.log(e);
		}
	});
}

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

function gotoTicket(ticket) {
	$.mobile.changePage("#ticketPage");
	$("#ticketPageHeader").html("Ticket #" + ticket.number);
	$("#ticketSummary").html(ticket.summary);
	var regExp = /\!\[\]\(([^)]+)\)/;
	var match;
	var result = ticket.description;
	while(match = regExp.exec(result))
	{
		result = result.replace(match[0], "<img style='width:100%' src='" + match[1] + "'/>");
	}
	
	
	$("#ticketDescription").html(result);
}
