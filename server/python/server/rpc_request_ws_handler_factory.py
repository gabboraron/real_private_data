import sys
if sys.version_info.major != 3:
    print("please use python3")

from jsonrpcserver import methods, async_dispatch as dispatch
import tornado.websocket

def RPCRequestWSHandlerFactory( my_methods = methods.global_methods ):
    # TODO somehow inject the user manager api
    class RPCRequestWSHandler(tornado.websocket.WebSocketHandler):
        def open(self):
            print("WebSocket opened")

        async def on_message(self, message):
            request = message
            response = await dispatch(request, my_methods )
            print(response)
            if response.wanted:
                self.write(str(response))

        
        def on_close(self):
            print("WebSocket closed")


    return RPCRequestWSHandler