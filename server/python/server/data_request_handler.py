import tornado.web
from js_generator.js_generator import JsGenerator
class DataRequestHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/javascript")
        self.write(JsGenerator())