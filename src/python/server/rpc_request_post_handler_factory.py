import sys

from jsonrpcserver import methods, async_dispatch as dispatch
import tornado.web

from rpc_wrapper.rpc_wrapper import RPCWrapper
from .rpc_wrapper_factory import RPCWrapperFactory

if sys.version_info.major != 3:
    print("please use python3")

def RPCRequestPOSTHandlerFactory( rpc_wrapper: RPCWrapper ):
    my_methods = RPCWrapperFactory(rpc_wrapper, methods.Methods())
    
    class RPCRequestPOSTHandler(tornado.web.RequestHandler):
        async def post(self):
            request = self.request.body.decode()
            response = await dispatch(request, my_methods )
            print(response)
            if response.wanted:
                self.write(str(response))


    return RPCRequestPOSTHandler
