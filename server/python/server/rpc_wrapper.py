from rpc_wrapper_factory import web_method

class RPCWrapper:

    def __init__(self):
        self.test = "alma"
        pass

    
    @web_method("ping")
    async def ping(self):
        return "pong"
    

    @web_method("replay")
    async def replay(self, message):
        return self.test + message
    

    @web_method(name = "add")
    async def add_other_name(self, x: int, y: int) -> int:
        return x + y
