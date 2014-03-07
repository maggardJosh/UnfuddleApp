app.initialize();
//window.onload = onsDeviceReady;
/*function onsDeviceReady()
{
$("#txtDomain").val(domain);
$("#txtUsername").val(username);
$("#txtPassword").val(password);
}*/
var domain = window.localStorage.getItem("unfuddleDomain");
var username = window.localStorage.getItem("username");
var password = window.localStorage.getItem("password");
function doThings() {
	window.localStorage.setItem("unfuddleDomain", $("#txtDomain").val());
	window.localStorage.setItem("username", $("#txtUsername").val());
	window.localStorage.setItem("password", $("#txtPassword").val());

	domain = $("#txtDomain").val();
	username = $("#txtUsername").val();
	password = $("#txtPassword").val();

	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/7/tickets.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {

			console.log(data);
			var resultingString = "";
			data.forEach(function (ticket) {
				if (ticket.status != "closed")
					resultingString = resultingString.concat(ticket.summary + "<br/>");
			});

			$("#resultDiv").html(resultingString);
		},
		complete : function () {},
		error : function (e) {
			console.log(e);
		}
	});

}
