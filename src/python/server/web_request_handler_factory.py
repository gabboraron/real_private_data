import tornado.web

def WebRequestHandlerFactory():
    class WebRequestHandler(tornado.web.RequestHandler):
        def get(self):
            self.write("hello")
    return WebRequestHandler