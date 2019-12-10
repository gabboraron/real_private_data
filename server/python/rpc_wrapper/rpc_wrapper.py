from .web_method import web_method

class RPCWrapper:

    def __init__(self):
        self.test = "alma"
        pass

    
    @web_method("ping")
    def ping(self):
        return "pong"
    

    @web_method("replay")
    def replay(self, message):
        return self.test + message
    

    @web_method(name = "add")
    def add_other_name(self, x: int, y: int) -> int:
        return x + y

    @web_method("login")
    def login(self, userhash, passhare) -> bool:
        #TODO implement it
        return userhash == "username" and passhare == "password"