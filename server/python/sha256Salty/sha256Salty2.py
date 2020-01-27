from .sha256Salty import SHA256Salty

class SHA256Salty2(SHA256Salty):
    def __init__(self):
        super().__init__("")
    
    def preSalt(self, s: str) -> str:
        res = ""
        for i in range(len(s)):
            saltChar = s[len(s) -1 - i]
            res += chr((ord(s[i]) + i * ord(saltChar) ) % 256) 
            res += saltChar
        return res

if __name__ == "__main__":
    s = SHA256Salty2()
    print(s.array("paprika"))
    print(str(s.array("paprika")).replace(" ",""))
    print(s.string("paprika"))