function testGetItem(name) {
    let elements = document.getElementsByClassName(name)
    if(elements.length !== 0) {
        return elements[0]
    }
    return undefined
}

async function wait(milliSec) {
    return new Promise((promise) => {
        setTimeout(() =>{
            promise(undefined)
        }, milliSec)
    })
}