import sys
if sys.version_info.major != 3:
    print("please use python3")

from jsonrpcserver import methods, async_dispatch as dispatch
import tornado.web

from rpc_wrapper import RPCWrapper
from rpc_wrapper_factory import RPCWrapperFactory

def RPCRequestHandlerFactory( rpc_wrapper: RPCWrapper ):
    my_methods = RPCWrapperFactory(rpc_wrapper, methods.Methods())
    
    class RPCRequestHandler(tornado.web.RequestHandler):
        async def post(self):
            request = self.request.body.decode()
            response = await dispatch(request, my_methods )
            print(response)
            if response.wanted:
                self.write(str(response))


    return RPCRequestHandler