#!/usr/bin/env python3

import ssl
import sys
import logging
import tornado.httpserver
import tornado.ioloop
import tornado.web

from config import theConfig

import log.log
from config.tools import configLog
from server.redirector_request_handler_factory import RedirectorRequestHandlerFactory
from server.rpc_request_post_handler_factory import RPCRequestPOSTHandlerFactory
from server.rpc_request_ws_handler_factory import RPCRequestWSHandlerFactory
from server.data_request_handler import DataRequestHandler
from rpc_wrapper.rpc_wrapper import RPCWrapper

from js_generator.js_generator import JsGenerator
from data_manager.file_manager import FileManager

if sys.version_info.major != 3:
    logging.error("please use python3")

# generate csr, and key:
#
# openssl genrsa -des3 -passout pass:my_password -out keypair.key 2048
# openssl rsa -passin pass:my_password -in keypair.key -out private.key
# openssl req -new -key private.key -out private.csr
# openssl x509 -req -days 365 -in private.csr -signkey private.key -out private.crt

file_manager = FileManager()
rpc_wrapper = RPCWrapper(file_manager)


redirecterApplication = tornado.web.Application([
    (r'/*', RedirectorRequestHandlerFactory(theConfig.host, theConfig.secure_port)),
])

application = tornado.web.Application([
    (r'/rpc',    RPCRequestPOSTHandlerFactory(   rpc_wrapper)),
    (r'/ws_rpc', RPCRequestWSHandlerFactory( rpc_wrapper)),
    (r'/generated/data.js', DataRequestHandler ),
    (r"/(.*)", tornado.web.StaticFileHandler, { "path": theConfig.web_root, "default_filename": "index.html" }),
])


if __name__ == '__main__':
    logging.info("Runner command: " +" ".join(sys.argv))
    configLog(False)
    ssl_ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_ctx.load_cert_chain(theConfig.crt_file, theConfig.key_file)
    https_server = tornado.httpserver.HTTPServer(application, ssl_options=ssl_ctx)
    https_server.listen(theConfig.secure_port)
    logging.info("HTTPS Server starting... https://%s:%d/"%(theConfig.host, theConfig.secure_port))

    http_server = tornado.httpserver.HTTPServer(redirecterApplication)
    http_server.listen(theConfig.open_port)
    logging.info("HTTP redirect Server starting... http://%s:%d/"%(theConfig.host, theConfig.open_port))
    
    if theConfig.debug:
        http_server2 = tornado.httpserver.HTTPServer(application)
        http_server2.listen(8081)
        logging.info("Debug HTTP Server starting... http://%s:%d/"%(theConfig.host, theConfig.debug_open_port))

        data_path = theConfig.web_root + "/generated/data.js"
        logging.info("Save data.js to {}".format(data_path))
        with open(data_path,"w") as f:
            f.write(JsGenerator())

    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt as identifier:
        logging.info("Server closed because KeyboardInterrupt")
        exit()
    
