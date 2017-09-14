function subscribe() {
	$.ajax({
		method: "GET",
		url: "http://localhost:8000/subscribe",
		timeout: 30000,
		dataType: 'text',
		success: function (data) {
		    data = JSON.parse(data);
			updateText(data.message);
		},
		complete: function () {
			console.log("subscribe");
			subscribe();
		}
	});
}

function publish(message) {
	let data = JSON.stringify({ message });
	$.ajax({
		type: "POST",
        crossDomain: true,
		url: "http://localhost:8000/publish",
		contentType: "application/json",
        dataType: "json",
		data: data
	});
}

function updateText(message) {
    $("#message").html(message);
}

function getMessage() {
	return $('#input').val();
}

$(document).ready(function () {
	$("#btnSubscribe").click(function () {
		updateText("You're subscribed");
		subscribe();
    });

	$("#btnPush").click(function () {
		publish(getMessage());
	});
});