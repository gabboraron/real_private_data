import sys
if sys.version_info.major != 3:
    print("please use python3")

from jsonrpcserver import methods, async_dispatch as dispatch
import tornado.web

def RPCRequestHandlerFactory( my_methods = methods.global_methods ):
    # TODO somehow inject the user manager api
    class RPCRequestHandler(tornado.web.RequestHandler):
        async def post(self):
            request = self.request.body.decode()
            response = await dispatch(request, my_methods )
            print(response)
            if response.wanted:
                self.write(str(response))


    return RPCRequestHandler