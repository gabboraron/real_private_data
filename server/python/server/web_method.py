def web_method(name: str):
    def web_method_creator(func):
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper.__name__ = name
        wrapper.is_web_method = True
        return wrapper
    return web_method_creator
