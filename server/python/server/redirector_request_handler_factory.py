import sys
if sys.version_info.major != 3:
    print("please use python3")

import os
import tornado.web

def RedirectorRequestHandlerFactory(host: str, secure_port: int):
    class RedirectorRequestHandler(tornado.web.RequestHandler):
        
        def get(self):
            self.write("""
                <html>
                <head>
                    <script>
                        setTimeout(function(){{window.location.href = '{0}'; }}, 3000)
                    </script>
                </head>
                <body>
                <h1><a href='{0}'>You will be redirect to secure {0} in 3 sec</a></h1> 
                </body>
                </html>
                """.format( "https://{}:{}".format(host, secure_port)))
    
    
    return RedirectorRequestHandler
