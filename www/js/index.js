

var domain = window.localStorage.getItem("unfuddleDomain");
var username = window.localStorage.getItem("username");
var password = window.localStorage.getItem("password");

document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(onDeviceReady);
function onDeviceReady() {
	$("#txtDomain").val(domain);
	$("#txtUsername").val(username);
	$("#txtPassword").val(password);
}
function login() {
	window.localStorage.setItem("unfuddleDomain", $("#txtDomain").val());
	window.localStorage.setItem("username", $("#txtUsername").val());
	window.localStorage.setItem("password", $("#txtPassword").val());
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
			console.log(data);
			data.forEach(function (project) {
				$("#projectList").append("<li><a onclick='gotoProject(" + project.id + ", \"" + project.title + "\");'>" + project.title + "</a></li>");

			});

			$.mobile.changePage("#projectsPage");
			$("#projectList").listview("refresh");
		},
		complete : function () {},
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
	$("#projectPageHeader").html(projectTitle);
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
			$("#ticketList").empty();
			console.log(data);
			var ticketArray = [];
			data.forEach(function (ticket) {
				if (ticket.status != "closed")
					ticketArray.push(ticket);
			});
			ticketArray.sort(sortByPriority);
			var ticketPriority = -1;
			var priorityColor = "";
			ticketArray.forEach(function (ticket) {
				if (ticketPriority != ticket.priority) 
				{
					ticketPriority = ticket.priority;
					var priorityLabel = "";
					switch(ticketPriority)
					{
					case "5": priorityLabel = "Highest"; priorityColor="rgba(255,50,50,.55);"; break;
					case "4": priorityLabel = "High"; priorityColor="rgba(255,130,130,.55);"; break;
					case "3": priorityLabel = "Normal"; priorityColor="rgba(255,255,255,.2);"; break;
					case "2": priorityLabel = "Low"; priorityColor="rgba(130,160,205,.5);"; break;
					case "1": priorityLabel = "Lowest"; priorityColor="rgba(70,70,185,.3);"; break;
					}
					$("#ticketList").append("<li data-role='list-divider'>" + priorityLabel + "</li>");
				}
				$("#ticketList").append("<li style='background:"+priorityColor+"'><a>" + ticket.summary + "</a></li>");
			});

			$.mobile.changePage("#projectPage");
			$("#ticketList").listview("refresh");
		},
		complete : function () {},
		error : function (e) {
			console.log(e);
		}
	});
}
