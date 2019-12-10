def auth_wrapper(f, auth_f, isAsync = True):
    def wrapper(*args, **kwargs):
        userhash = None
        passhare = None
        ret = {"error": None, "data": None}
        if "__userhash__" in kwargs:
            userhash = kwargs["__userhash__"]
            passhare = kwargs["__passhare__"]
        elif len(args) >= 2:
            userhash = args[0]
            passhare = args[1]
            args = args[2:]
        else:
            ret["error"] = {
                "code": 1,
                "message":"Missing username and/or password"
                }
            return ret
        if not auth_f(userhash, passhare):
            ret["error"] = {
                "code": 2,
                "message": "Bad username and/or password"
                }
            return ret
        try:
            ret["data"] = f(*args, **kwargs)
        except Exception as e:
            ret["error"] = {
                "code":3,
                "message":"Function error: %s"%str(e)
            }
        return ret
    wrapper.__name__ = f.__name__
    if isAsync:
        async def async_wrapper(*args, **kwargs):
            return wrapper(*args, **kwargs)
        async_wrapper.__name__ = f.__name__
        return async_wrapper
    return wrapper