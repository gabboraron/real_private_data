'use strict';

async function main(){
    await testSimpleJsonRpcPOSTClientService();
    await testSimpleJsonRpcWSClientService();

}
window.addEventListener("load", () => {
    main().then(() =>{
        console.log("main is finished");
    });
});