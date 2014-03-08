
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
