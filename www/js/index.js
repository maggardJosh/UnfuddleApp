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