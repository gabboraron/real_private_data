import sys
if sys.version_info.major != 3:
    print("please use python3")

from config import theConfig
from jsonrpcserver import methods, async_dispatch as dispatch
import tornado.websocket
from rpc_wrapper.rpc_wrapper import RPCWrapper
from .rpc_wrapper_factory import RPCWrapperFactory

def RPCRequestWSHandlerFactory(rpc_wrapper: RPCWrapper):
    my_methods = RPCWrapperFactory(rpc_wrapper, methods.Methods())

    class RPCRequestWSHandler(tornado.websocket.WebSocketHandler):
        def open(self):
            print("WebSocket opened")

        async def on_message(self, message):
            request = message
            response = await dispatch(request, my_methods, basic_logging=True, debug=theConfig.debug )
            print(response)
            if response.wanted:
                self.write_message(str(response))

        
        def on_close(self):
            print("WebSocket closed")


    return RPCRequestWSHandler