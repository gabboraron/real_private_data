#!/usr/bin/env python3
import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import ssl
from config import theConfig
from config.tools import configToJsString, configToJs
from jsonrpcserver import methods, async_dispatch as dispatch

from server.redirector_request_handler_factory import RedirectorRequestHandlerFactory
from server.rpc_request_post_handler_factory import RPCRequestPOSTHandlerFactory
from server.web_request_handler_factory import WebRequestHandlerFactory
from server.rpc_request_ws_handler_factory import RPCRequestWSHandlerFactory
from server.config_request_handler import ConfigRequestHandler
from server.rpc_wrapper_factory import RPCWrapperFactory
from rpc_wrapper.rpc_wrapper import RPCWrapper

# generate csr, and key:
#
# openssl genrsa -des3 -passout pass:my_password -out keypair.key 2048
# openssl rsa -passin pass:my_password -in keypair.key -out private.key
# openssl req -new -key private.key -out private.csr
# openssl x509 -req -days 365 -in private.csr -signkey private.key -out private.crt

rpc_wrapper = RPCWrapper()


redirecterApplication = tornado.web.Application([
    (r'/*', RedirectorRequestHandlerFactory(theConfig.host, theConfig.secure_port)),
])

application = tornado.web.Application([
    (r'/rpc',    RPCRequestPOSTHandlerFactory(   rpc_wrapper)),
    (r'/ws_rpc', RPCRequestWSHandlerFactory( rpc_wrapper)),
    (r'/config.js', ConfigRequestHandler ),
    (r"/(.*)", tornado.web.StaticFileHandler, { "path": theConfig.web_root, "default_filename": "index.html" }),
])


if __name__ == '__main__':
    ssl_ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_ctx.load_cert_chain(theConfig.crt_file, theConfig.key_file)
    https_server = tornado.httpserver.HTTPServer(application, ssl_options=ssl_ctx)
    https_server.listen(theConfig.secure_port)
    print("HTTPS Server starting... https://%s:%d/"%(theConfig.host, theConfig.secure_port))

    http_server = tornado.httpserver.HTTPServer(redirecterApplication)
    http_server.listen(theConfig.open_port)
    print("HTTP redirect Server starting... http://%s:%d/"%(theConfig.host, theConfig.open_port))
    
    if theConfig.debug:
        http_server2 = tornado.httpserver.HTTPServer(application)
        http_server2.listen(8081)
        print("Debug HTTP Server starting... http://%s:%d/"%(theConfig.host, theConfig.debug_open_port))

        print("Save config.js to {}".format(theConfig.web_root + "/config.js"))
        configToJs( theConfig.web_root + "/config.js" )

    tornado.ioloop.IOLoop.instance().start()

