from error_object.error_object import ErrorObject
from error_object.error_type_enum import ErrorTypeEnum

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
            ret["error"] = ErrorObject(ErrorTypeEnum.MISSING_USERNAME_PASSWORD).toJson()
            return ret
        auth = False
        try:
            auth = auth_f(userhash, passhare)
        except ErrorObject as e:
            ret["error"] = e.toJson()
            return ret
        except Exception as e:
            ret["error"] = ErrorObject(ErrorTypeEnum.REMOTE_FUNCTION_ERROR, str(e)).toJson()
            return ret

        if not auth:
            ret["error"] = ErrorObject(ErrorTypeEnum.BAD_USERNAME_PASSWORD).toJson()
            return ret
        try:
            ret["data"] = f(*args, **kwargs)
        except ErrorObject as e:
            ret["error"] = e.toJson()
            return ret
        except Exception as e:
            ret["error"] = ErrorObject(ErrorTypeEnum.REMOTE_FUNCTION_ERROR, str(e)).toJson()
        return ret
    wrapper.__name__ = f.__name__
    if isAsync:
        async def async_wrapper(*args, **kwargs):
            return wrapper(*args, **kwargs)
        async_wrapper.__name__ = f.__name__
        return async_wrapper
    return wrapper