import tornado.web
from config.tools import configToJsString

class ConfigRequestHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/javascript")
        self.write(configToJsString())