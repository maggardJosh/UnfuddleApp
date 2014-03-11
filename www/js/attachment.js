var attachmentsArray;

function gotoAttachments()
{
	$("#lviewAttachments").empty();
	for(var i=0; i<attachmentsArray.length; i++)
	{
		$("#lviewAttachments").append("<li><a onclick='downloadAttachment(" + attachmentsArray[i].id + ");'>" + attachmentsArray[i].filename + "</a></li>");
	}
	$.mobile.changePage("#attachmentListPage");
	
}

function downloadAttachment(attachmentID)
{https://f5games.unfuddle.com/projects/7/tickets/1238/attachments/121/download?display=inline
	var urlString = "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/tickets/" + currentTicket.id + "/attachments/" + attachmentID + "/download";
	window.location = "https://" + domain + ".unfuddle.com/projects/" + globalProjectID + "/tickets/" + currentTicket.id + "/attachments/" + 	attachmentID + "/download?display=inline";												
	/*$.ajax({
		type : "GET",
		url : urlString,
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		success : function (data) {
			console.log(data);
				window.location = ""+urlString+"";
		},
		complete : function () {},
		error : function (e) {},
		async : false
	});*/
}