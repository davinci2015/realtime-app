function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        // Handle response
    };

    xmlhttp.open("GET", "fetch-clients.php", true);
    xmlhttp.send();
};

setInterval(loadXMLDoc, 1000);