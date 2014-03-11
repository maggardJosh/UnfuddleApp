var isTicketNew = false;
var currentTicket;

var myTickets = "mine";
var closedTickets = "open";

$(document).on('slidestop', "#sliderMyTickets", function () {
	if (myTickets != $(this).val())
		sliderChanged();
	myTickets = $(this).val();
});
$(document).on('slidestop', "#sliderClosedTickets", function () {
	if (closedTickets != $(this).val()) {
		sliderChanged();
		closedTickets = $(this).val();
	}
});

function sliderChanged() {
	
	$(".ui-li-count").animate({
		opacity : '0'
	}, "fast", function() {  
	updateTicketList();
	forceTicketListBuild();
	$(".ui-li-count").animate({ opacity: '1'}, "fast");
	});
}

function loadTicket(ticketID) {
	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/tickets/" + ticketID + ".json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {
			ticketDictionary[ticketID] = data;
		},
		dataType : "json",
		complete : function () {},
		error : function (e) {},
		async : false
	});
}

function updateCurrentTicket(ticketID) {
	currentTicket = ticketDictionary[ticketID];

	$("#ticketPageHeader").html("Ticket #" + currentTicket.number);
	$("#ticketSummary").html(currentTicket.summary);
	$("#ticketAssignee").html("<span style='float:left; font-weight:bold'>Assigned To:</span> <span style='float:right'>" + people[currentTicket.assignee_id].first_name + " " + people[currentTicket.assignee_id].last_name + "</span>");
	$("#ticketStatus").html("<span style='float:left; font-weight:bold'>Status: </span> <span style='float:right'>" + currentTicket.status + "</span>");
	var regExp = /\!\[\]\(([^)]+)\)/;
	var match;
	var result = currentTicket.description;
	while (match = regExp.exec(result)) {
		result = result.replace(match[0], "<div><img style='width:100%' src='" + match[1] + "'/></div>");
	}
	
	getTicketAttachments();
	
	$("#ticketDescription").html(result);
}

function getTicketAttachments()
{
	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/tickets/" + currentTicket.id + "/attachments.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {
			
				attachmentsArray = data;
				var attachmentHtml = "<li>";
				if (data.length > 0)
					attachmentHtml += "<a onclick='gotoAttachments();'>"
				attachmentHtml += data.length + " Attachment";
				if (data.length > 1 || data.length == 0)
					attachmentHtml += "s";
				if(data.length > 0)
					attachmentHtml += "</a>";
				attachmentHtml += "</li>";
				
				$("#ticketAttachmentsList").html( attachmentHtml);
				
		},
		dataType : "json",
		complete : function () {},
		error : function (e) {},
		async : false
	});
}

function updateTicketList() {
	var ticketArray = [];
	var ticketCount = [0, 0, 0, 0, 0];
	ticketDictionary.forEach(function (ticket) {
		if ((($("#sliderClosedTickets").val() == "closed" && ticket.status == "closed")
				 || ($("#sliderClosedTickets").val() != "closed" && ticket.status != "closed")) &&
			(($("#sliderMyTickets").val() == "mine" && ticket.assignee_id == assigneeID)
				 || ($("#sliderMyTickets").val() == "theirs" && ticket.assignee_id != assigneeID))) {

			ticketArray.push(ticket);
			ticketCount[ticket.priority - 1]++;
		}
	});
	for (var i = 1; i <= 5; i++)
		$("#ticketList" + i).empty();
	for (var i = 1; i <= 5; i++)
		$("#" + i + "TicketCount").html(ticketCount[i - 1]);
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
		$("#ticketList" + ticketPriority).append("<li><a onclick='gotoTicket(" + ticket.id + ");'  style='background:" + priorityColor + "'>" + ticket.summary + "</a></li>");
	});
}

function gotoTicket(ticketID) {
	updateCurrentTicket(ticketID);
	$.mobile.changePage("#ticketPage");
}

function editCurrentTicket() {
	gotoCreateTicket(currentTicket);
}

function gotoCreateTicket(ticket) {
	isTicketNew = (ticket === -1) ? true : false;

	$("#createTicketPageHeader").html(isTicketNew ? "Create Ticket" : "Edit Ticket");

	if (isTicketNew)
		resetCreateTicketPage();
	else
		loadCreateTicketPage(ticket);

	$.mobile.changePage("#createTicketPage");
}

function loadCreateTicketPage(ticket) {
	$("#createTicketSummary").val(ticket.summary);
	$("#txtTicketDescription").val(ticket.description);
	$("#drpTicketPriority").val(ticket.priority);
	console.log(ticket);
	$("#drpTicketStatus").val(ticket.status.toLowerCase());
	loadPeopleDropdown();

	$("#drpTicketAssignee").val(ticket.assignee_id);
}

function resetCreateTicketPage() {
	$("#createTicketSummary").val("");
	$("#txtTicketDescription").val("");
	$("#drpTicketPriority").val("3");
	$("#drpTicketStatus").val("new");
	loadPeopleDropdown();

}

function loadPeopleDropdown() {
	$("#drpTicketAssignee").html('<option value=" ">None</option>');

	$.ajax({
		type : "GET",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/people.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json"
		},
		timeout : 5000,
		contentType : "json",
		success : function (data) {
			data.forEach(function (user) {
				$("#drpTicketAssignee").append('<option value="' + user.id + '">' + user.first_name + ' ' + user.last_name + '</option>');
			});
		},
		complete : function () {},
		error : function (e) {},
		async : false
	});
	$("#drpTicketAssignee").val(" ");
}

function saveTicket() {
	if (isTicketNew)
		createTicket();
	else
		updateTicket();
}

var ticketDictionary = new Array();
function getTicketList(data) {

	ticketDictionary = [];
	data.forEach(function (ticket) {
		ticketDictionary[ticket.id] = ticket;
	});

	updateTicketList();

	$.mobile.changePage("#ticketReportPage");
}

function updateTicket() {
	$.mobile.loading('show', {
		theme : 'a',
		text : 'Creating Ticket',
		textVisible : true
	});
	var xmlString = "<ticket>";
	xmlString += "<assignee-id>" + $("#drpTicketAssignee").val() + "</assignee-id>";
	xmlString += "<summary>" + $("#createTicketSummary").val() + "</summary>";
	xmlString += "<description>" + $("#txtTicketDescription").val() + "</description>";
	xmlString += "<priority>" + $("#drpTicketPriority").val() + "</priority>";
	xmlString += "<status>" + $("#drpTicketStatus").val() + "</status>";
	xmlString += "</ticket>";

	$.ajax({
		type : "PUT",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/tickets/" + currentTicket.id + ".xml",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/xml",
			"Content-Type" : "application/xml"
		},
		data : xmlString,
		timeout : 5000,
		success : function (data) {},
		complete : function () {
			$.mobile.loading('hide');
		},
		error : function (e) {
			if (!(e.readyState == 4 && e.status == 200))
				showDialogue("Error", "Problem Updating Ticket<br/>" + e.responseText);
			else {
				loadTicket(currentTicket.id);
				updateCurrentTicket(currentTicket.id);
				updateTicketList();
				history.back();
			}
		}
	});
}

function createTicket() {
	$.mobile.loading('show', {
		theme : 'a',
		text : 'Creating Ticket',
		textVisible : true
	});
	var xmlString = "<ticket>";
	xmlString += "<assignee-id>" + $("#drpTicketAssignee").val() + "</assignee-id>";
	xmlString += "<summary>" + $("#createTicketSummary").val() + "</summary>";
	xmlString += "<description>" + $("#txtTicketDescription").val() + "</description>";
	xmlString += "<priority>" + $("#drpTicketPriority").val() + "</priority>";
	xmlString += "<status>" + $("#drpTicketStatus").val() + "</status>";
	xmlString += "</ticket>";
	$.ajax({
		type : "POST",
		url : "https://" + domain + ".unfuddle.com/api/v1/projects/" + globalProjectID + "/tickets.json",
		headers : {
			"Authorization" : "Basic " + btoa(username + ':' + password),
			"Accept" : "application/json",
			"Content-Type" : "application/xml"
		},
		contentType : "text/xml",
		data : xmlString,
		timeout : 5000,
		success : function (data) {},
		complete : function () {
			$.mobile.loading('hide');
		},
		error : function (e) {
			showDialogue("Error", "Problem Creating Ticket<br/>" + e.responseText);
		}
	});
}
