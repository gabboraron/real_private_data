def web_method(name: str = None):
    def web_method_creator(func):
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper.__name__ = name or func.__name__
        wrapper.is_web_method = True
        return wrapper
    return web_method_creator
