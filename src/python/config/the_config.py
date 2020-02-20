import sys
import os

from .arg import BoolArg, StrArg, IntArg
#, FloatArg
from .config_base import ConfigBase

global p
p = {
    "file_dir": os.path.dirname(sys.argv[0])
}
class TheConfig(ConfigBase):
    configFile:StrArg = StrArg(help="Config json file default: config.json", default_value=p["file_dir"] + "/config.json")

    debug:BoolArg      = BoolArg(help="debugmode default false", default_value=False, is_public=True)
    show_rpc_message   = BoolArg(help="Show rpc message", default_value=False)
    open_port:IntArg   = IntArg(help="Open port", default_value = 8080)
    debug_open_port:IntArg = IntArg(help="debug port", default_value = 8081)
    secure_port:IntArg = IntArg(help="Secure port", default_value = 8443)
    host:StrArg        = StrArg(help="host", default_value = "localhost")
    crt_file:StrArg    = StrArg(help="crt_file", is_optional=False)
    key_file:StrArg    = StrArg(help="key_file", is_optional=False)
    web_root:StrArg    = StrArg(help="web root", is_optional=False)
    data_dir:StrArg    = StrArg(help="Data dir")
    test_dir:StrArg    = StrArg(help="Dir for test", default_value="/var/tmp/real_private_data")
    salt:StrArg        = StrArg(help="Salt", default_value="My own Salt", is_public=True)
    server_salt:StrArg = StrArg(help="Salt", default_value="Server salt")
    enable_create_user:BoolArg = BoolArg(help="Enable Create user", default_value=False)

    defaultRpcClient   = StrArg(help="Default Rpc call", is_public=True, default_value="SimpleJsonRpcWebSocketClientService")