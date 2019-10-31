from jsonrpcserver import methods, async_dispatch as dispatch

def web_method(name: str):
    def web_method_creator(func):
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper.__name__ = name
        wrapper.is_web_method = True
        return wrapper
    return web_method_creator


def RPCWrapperFactory(wrapper_class, my_methods = methods.global_methods):
    for attr in dir(wrapper_class):
        func = getattr(wrapper_class, attr)
        if "is_web_method" in dir(func) and func.is_web_method:
            my_methods.add(func)
    return my_methods