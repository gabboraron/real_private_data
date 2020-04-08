async function testCreateFile(fileName, password, waitTime = 1000) {
    testGetItem("fPassNameInput").value = fileName
    await wait(waitTime)
    testGetItem("fPassNewPasswordInput").value = password
    await wait(waitTime)
    testGetItem("fPassNewPassword2Input").value = password
    await wait(waitTime)
    testGetItem("fPassNewFile").click()
}