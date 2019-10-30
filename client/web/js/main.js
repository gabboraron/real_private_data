
// jrpc POST example

var jrpc = new simple_jsonrpc();
jrpc.toStream = function(_msg){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        try {
            JSON.parse(this.responseText);
            jrpc.messageHandler(this.responseText);
        }
        catch (e){
            console.error(e);
        }
    };
    xhr.open("POST", '/rpc', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(_msg);
};

jrpc.call('ping').then(function (result) {
    console.log(result);
});

/*
//calls
jrpc.call('add', [2, 3]).then(function (result) {
    document.getElementsByClassName('paragraph')[0].innerHTML += 'add(2, 3) result: ' + result + '<br>';
});
jrpc.call('mul', {y: 3, x: 2}).then(function (result) {
    document.getElementsByClassName('paragraph')[0].innerHTML += 'mul(2, 3) result: ' + result + '<br>';
});
jrpc.call('view.getTitle').then(function (result) {
    document.getElementsByClassName('title')[0].innerHTML = result;
});
*/

var ws_protociol = "https:" == window.location.protocol? "wss":"ws"
var ws_url = ws_protociol +"://" + window.location.host + "/ws_rpc"

var jrpc_ws = new simple_jsonrpc();
var ws_url = ws_protociol +"://" + window.location.host + "/ws_rpc"

var socket = new WebSocket(ws_url);
//var socket = new WebSocket("wss://localhost:8443/ws_rpc");
//var socket = new WebSocket("ws://localhost:8081/ws_rpc");


socket.onmessage = function(event) {
    jrpc_ws.messageHandler(event.data);
};

jrpc_ws.toStream = function(_msg){
    socket.send(_msg);
};

socket.onerror = function(error) {
    console.error("Error: " + error.message);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.info('Connection close was clean');
    } else {
        console.error('Connection suddenly close');
    }
    console.info('close code : ' + event.code + ' reason: ' + event.reason);
};

//usage
//after connect
socket.onopen = function(){
    jrpc.call('ping').then(function (result) {
        console.log(result);
    });
    /*
    //calls
    jrpc_ws.call('add', [2, 3]).then(function (result) {
        document.getElementsByClassName('paragraph')[0].innerHTML += 'add(2, 3) result: ' + result + '<br>';
    });

    jrpc_ws.call('mul', {y: 3, x: 2}).then(function (result) {
        document.getElementsByClassName('paragraph')[0].innerHTML += 'mul(2, 3) result: ' + result + '<br>';
    });

    jrpc_ws.batch([
        {call:{method: "add", params: [5,2]}},
        {call:{method: "mul", params: [100, 200]}},
        {call:{method: "create", params: {item: {foo: "bar"}, rewrite: true}}}
    ]);
    */
};