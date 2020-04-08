async function startPhoneBookAddContacts(){
    let waitTime = testGetItem("waitTime").value
    let username = testGetItem("username").value
    let password = testGetItem("password").value
    let fileName = testGetItem("fileName").value
    let filePassword = testGetItem("filePassword").value
/*
    let waitTime = 500
    let username = "u"
    let password = "p"
    let fileName = "f1"
    let filePassword = "f1"
    */
    await testLogin(username, password, undefined, waitTime)
    await wait(waitTime)
    await openCreatePhoneBookFile(waitTime)
    await testCreateFile(fileName, filePassword)
    await testAddMediaData(waitTime)
}