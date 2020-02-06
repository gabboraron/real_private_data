'use strict'

// 1. layer is encrypted
// 2. layer is look like this
// "<encryptedNames>","<encryptedRecords>"
// 3.1 layer <encryptedNames>
// "name1","name2",...,"nameN"
// 3.2 layer <encryptedRecords>
// "<encryptedRekord1>","<encryptedRekord2>",...

class PhoneBookFile extends SecretFile {
  constructor () {
    super()
    this.type = 'txt'
  }

  start () {
    return super.start()
  }

  stop () {
    return super.start()
  }
  __escape(str) {
    return str.replace(/\"/g, '""');
  }
  __split(str) {
      if(str[0] !== '"') {
        throw new ErrorObject("parse errror");
      }
      let ret = [];
      let inComma = true;
      let isComma = false;
      let currRecord = "";
      for (let i = 1; i < str.length; ++i) {
          if(inComma) {
            if(isComma)
          } else {

          }
          if('"' === str[i]) {
            if(inComma)
            isComma = !isComma;
          } else {

          }
      }
  }
}

//TODO: not here
function test_split(){

}