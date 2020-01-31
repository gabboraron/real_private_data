from jsonrpcserver import methods
from rpc_wrapper.auth_wrapper import auth_wrapper

def RPCWrapperFactory(wrapper_class, my_methods = methods.global_methods):
    for attr in dir(wrapper_class):
        func = getattr(wrapper_class, attr)
        if "is_web_method" in dir(func) and func.is_web_method:
            my_methods.add(auth_wrapper(func, wrapper_class.login))
    return my_methods