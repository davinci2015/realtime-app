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
			subscribe();
		}
	});
}

function publish() {
	let data = JSON.stringify({ "message": "Hello to all clients " + new Date().getSeconds() });
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

$(document).ready(function () {
	$("#btnSubscribe").click(function () {
		subscribe();
		updateText("You're subscribed");
    });

	$("#btnPush").click(function () {
		publish();
	});
});