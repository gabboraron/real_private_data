'use strict'
async function testSimpleJsonRpcPOSTClientService() {
    console.log("Test SimpleJsonRpcPOSTClient connection");
    let postClient = new SimpleJsonRpcPOSTClientService();
    postClient.start("username","password");
    try {
        let c = await postClient.start();
        console.log(c);
        let res = await postClient.call("ping");
        console.log(res);
    } catch(e){
        console.error(e);
    }
    var postClientError = new SimpleJsonRpcPOSTClientService();
    postClientError.start("username1", "password1");
    try {
        console.log("Test SimpleJsonRpcPOSTClientService connection with bad password");
        let c = await postClientError.start();
        console.log(c);
    } catch(e)
    {
        console.error(e);
    }
}