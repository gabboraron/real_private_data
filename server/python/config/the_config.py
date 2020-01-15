from .arg import *
from .config_base import ConfigBase

class TheConfig(ConfigBase):
    configFile:StrArg = StrArg(help="Config json file default: config.json", default_value="config.json")

    debug:BoolArg      = BoolArg(help="debugmode default false", default_value=False)
    open_port:IntArg   = IntArg(help="Open port", default_value = 8080)
    secure_port:IntArg = IntArg(help="Secure port", default_value = 8443)
    host:StrArg        = StrArg(help="host", default_value = "localhost")
    crt_file:StrArg    = StrArg(help="crt_file", is_optional=False)
    key_file:StrArg    = StrArg(help="key_file", is_optional=False)
    web_root:StrArg    = StrArg(help="web root", is_optional=False)