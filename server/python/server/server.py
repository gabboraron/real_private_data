#!/usr/bin/env python3

import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import ssl
from jsonrpcserver import methods, async_dispatch as dispatch

from redirector_request_handler_factory import RedirectorRequestHandlerFactory
from rpc_request_handler_factory import RPCRequestHandlerFactory
from web_request_handler_factory import WebRequestHandlerFactory
from rpc_request_ws_handler_factory import RPCRequestWSHandlerFactory

# generate csr, and key:
#
# openssl genrsa -des3 -passout pass:my_password -out keypair.key 2048
# openssl rsa -passin pass:my_password -in keypair.key -out private.key
# openssl req -new -key private.key -out private.csr
# openssl x509 -req -days 365 -in private.csr -signkey private.key -out private.crt


#TODO take that to config file

host="localhost"
open_port=8080
secure_port=8443
crt_file = "/home/somla/working/real_private_data/server/ssl/httpscertificate/new_crt.crt"
key_file = "/home/somla/working/real_private_data/server/ssl/httpscertificate/new_key.key"
web_root = "/home/somla/working/real_private_data/client/web"


my_methods = methods.Methods()


@my_methods.add
async def ping():
    return str({"alma":"majom", "dinnye":{"dinnze","majom"}})



redirecterApplication = tornado.web.Application([
    (r'/*', RedirectorRequestHandlerFactory(host, secure_port)),
])

application = tornado.web.Application([
    (r'/rpc', RPCRequestHandlerFactory(my_methods) ),
    (r'/ws_rpc', RPCRequestWSHandlerFactory(my_methods) ),
    (r"/(.*)", tornado.web.StaticFileHandler, { "path": web_root }),
])


if __name__ == '__main__':
    ssl_ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_ctx.load_cert_chain(crt_file, key_file)
    https_server = tornado.httpserver.HTTPServer(application, ssl_options=ssl_ctx)
    https_server.listen(secure_port)

    http_server2 = tornado.httpserver.HTTPServer(application)
    http_server2.listen(8081)

    http_server = tornado.httpserver.HTTPServer(redirecterApplication)
    http_server.listen(open_port)

    tornado.ioloop.IOLoop.instance().start()
