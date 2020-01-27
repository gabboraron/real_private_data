import hashlib

class SHA256Salty():
    __saltSentence:str

    def __init__(self, saltSentence = "My own secret sentence for salt"):
        self.__saltSentence = saltSentence
    
    def string(self, s:str) -> str:
        s = self.preSalt(s)
        hs = hashlib.sha256( s.encode('utf-8') ).hexdigest()
        return self.postSalt(hs)
    
    def array(self, s:str):
        s = self.preSalt(s)
        hs = hashlib.sha256( s.encode('utf-8') ).digest()
        return [b for b in self.postSalt(hs)]

    def preSalt(self, s: str):
        res = ""
        for i in range(len(s)):
            saltChar = "\0"
            if  type(self.__saltSentence) == str and len(self.__saltSentence) != 0:
                saltChar = self.__saltSentence[i % len(self.__saltSentence)]
            res += chr(( ord(s[i]) + i * ord(saltChar) ) % 256) 
            res += saltChar
        return res
    
    def postSalt(self, hashArray):
        #TODO: salt algorithm
        # I'm not sure, if I make a post salt algorithm, it will decrease the
        # SHA crash or not, so I don't do that
        return hashArray

if __name__ == "__main__":
    s = SHA256Salty("alma")
    print(s.array("paprika"))
    print(str(s.array("paprika")).replace(" ",""))
    print(s.string("paprika"))