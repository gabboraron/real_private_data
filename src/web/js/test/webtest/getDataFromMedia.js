// From: https://mot.inf.elte.hu/munkatarsak

let main = document.getElementsByClassName("subpage-description")[0].children

let json = []
for(let i = 0; i < main.length; ++i) {
    if(main[i].tagName !== "TABLE") {
        continue
    }
    let t = main[i]
    let trs = t.getElementsByTagName("tr")
    let description = "";
    let comma = ""
    for(let j = 0; j < trs.length; ++j) {
        description += comma + trs[j].innerText
        comma = ", "
    }
    let contact = {
        Nickname: trs[0].children[2].innerText,
        Fullname: trs[0].children[2].innerText,
        Address: "Szobaszám " + trs[2].children[1].innerText,
        Description: description,
        PhoneNumber: trs[3].children[1].innerText
    }
    json.push(contact)
}

JSON.stringify(json, null, 4)