async function testSimpleJsonRpcWSClientService() {
    console.log("Test SimpleJsonRpcWebSocketClientService connection");
    let wsClient = new SimpleJsonRpcWebSocketClientService("username", "password");
    try {
        let c = await wsClient.start();
        console.log(c);
        let res = await wsClient.call("ping");
        console.log(res);
    } catch(e){
        console.error(e);
    }
    var wsClientError = new SimpleJsonRpcWebSocketClientService("username1", "password1");
    try {
        console.log("Test SimpleJsonRpcWebSocketClientService connection with bad password");
        let c = await wsClientError.start();
        console.log(c);
    } catch(e)
    {
        console.error(e);
    }
}