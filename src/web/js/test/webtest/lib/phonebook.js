async function testAddContact(nickName, fullName, address, description, numbers, waitTime = 100) {
    testGetItem("phbShowAddContactButton").click()
    await  wait(waitTime)
    testGetItem("phbNickName").value = nickName
    await  wait(waitTime)
    testGetItem("phbFullName").value = fullName
    await  wait(waitTime)
    testGetItem("phbAddress").value = address
    await  wait(waitTime)
    testGetItem("phbDescription").value = description
    for(let i = 0; i < numbers.length; ++i ){
        await  wait(waitTime)
        testGetItem("phbAddNumberButton").click()
        await  wait(waitTime)
        document.getElementsByClassName("phoneNumberInput")[i].value = numbers[i]
    }
    await  wait(waitTime)
    testGetItem("phbModifyContactSaveButton").click()
}

async function openCreatePhoneBookFile(waitTime = 1000) {
    testGetItem("createFileNavItem").click()
    await wait(waitTime)
    testGetItem("createPhbFileLink").click()
}
