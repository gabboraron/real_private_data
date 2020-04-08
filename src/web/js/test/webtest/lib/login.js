
async function testLogin(username, password, RpcClient, waitTime = 1000) {
    let userInput = testGetItem("loginUsername")
    let passwordInput = testGetItem("loginPassword")
    let loginButton = testGetItem("loginButton")
    if(    typeof(userInput) === "undefined" 
        || typeof(passwordInput) === "undefined"
        || typeof(loginButton) === "undefined") {
        return new Error("I can't find userInput and/or passwordInput and/or loginButton")
    }
    userInput.value = username
    await wait(waitTime)
    passwordInput.value = password
    await wait(waitTime)
    loginButton.click()
    // TODO: check if login
    await wait(2000)
}