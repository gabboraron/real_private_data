
"""
This is a singleton metaclass
usage
MyClass(metaclass=Singleton)
or
MyClass(BaseClass, metaclass=Singleton)
"""
class Singleton(type):
    """
    This is a singleton metaclass
    usage
    MyClass(metaclass=Singleton)
    or
    MyClass(BaseClass, metaclass=Singleton)
    """
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
    