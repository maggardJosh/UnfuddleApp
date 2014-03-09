var globalProjectID = 0;
var globalTicketID = 0;

document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(onDeviceReady);
function onDeviceReady() {
	$("#txtDomain").val(domain);
	$("#txtUsername").val(username);
	$("#txtPassword").val(password);
	
	if(domain && username && password)
		login();
}

function showDialogue(title, message)
{
	$("#popupHeader").html(title);
	$("#popupMessage").html(message);
	$.mobile.changePage("#popupDialog");
}

$(document).on('pagebeforeshow', "#ticketReportPage", function (toPage, options) { 

		for (var i = 1; i <= 5; i++)
			$("#ticketList" + i).listview("refresh");
 } );