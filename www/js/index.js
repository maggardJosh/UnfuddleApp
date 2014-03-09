var globalProjectID = 0;
var globalTicketID = 0;

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("menubutton", onMenuPressed, false);

$(document).ready(onDeviceReady);
function onDeviceReady() {
	$("#txtDomain").val(domain);
	$("#txtUsername").val(username);
	$("#txtPassword").val(password);

	if (domain && username && password)
		login();
}

function onMenuPressed() {}

function showDialogue(title, message) {
	$("#popupHeader").html(title);
	$("#popupMessage").html(message);
	$.mobile.changePage("#popupDialog");
}

$(document).on('pagebeforeshow', "#ticketReportPage", forceTicketListBuild);

function forceTicketListBuild()
{
	for (var i = 1; i <= 5; i++)
		$("#ticketList" + i).listview("refresh");
		

}

$(document).on('pagebeforeshow', "#createTicketPage", function () {

	$("#drpTicketPriority").selectmenu('refresh');
	$("#drpTicketAssignee").selectmenu('refresh');
});

