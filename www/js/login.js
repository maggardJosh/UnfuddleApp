
var domain = window.localStorage.getItem("unfuddleDomain");
var username = window.localStorage.getItem("username");
var password = window.localStorage.getItem("password");

var assigneeID = -1;

function logout() {
	window.localStorage.setItem("unfuddleDomain", "");
	window.localStorage.setItem("username", "");
	window.localStorage.setItem("password", "");

	domain = "";
	username = "";
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
			getAssigneeID();

			$.mobile.changePage("#projectsPage");
			$("#projectList").listview("refresh");
		},
		complete : function () {
			$.mobile.loading('hide');
			
		},
		error : function (e) {
			showDialogue("Error", "Problem logging in<br/>Code "+e.status);
		}
	});
}

function getAssigneeID()
{
	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/people/current.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		async: false,
		contentType : "json",
		success : function (data) {
		assigneeID = data.id;
		},
		complete : function () {
			
		},
		error : function (e) {
			showDialogue("Error", "Problem logging in<br/>Code "+e.status);
		}
	});
}

