from .error_types import ErrorTypes

def getErrorTypesDict():
    return {errorType.ty.value: errorType.toJson() for errorType in ErrorTypes.values() }

if "__main__" == __name__:
    print(getErrorTypesDict())