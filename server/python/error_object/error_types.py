from .error_type import ErrorType, ErrorLocEnum
from .error_type_enum import ErrorTypeEnum

ErrorTypes = {
    # LOCAL
    ErrorTypeEnum.CONNECTION_ERROR: ErrorType(ErrorTypeEnum.CONNECTION_ERROR, "Connection error", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.LOCAL_CALL_ERROR: ErrorType(ErrorTypeEnum.LOCAL_CALL_ERROR, "Function call local error", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.ALREADY_LOGEDIN: ErrorType(ErrorTypeEnum.ALREADY_LOGEDIN, "You are already loged in", ErrorLocEnum.LOCAL),
    
    # REMOTE
    ErrorTypeEnum.MISSING_USERNAME_PASSWORD: ErrorType(ErrorTypeEnum.MISSING_USERNAME_PASSWORD, "Missing username and/or password", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.BAD_USERNAME_PASSWORD: ErrorType(ErrorTypeEnum.BAD_USERNAME_PASSWORD, "Bad username and/or password", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.REMOTE_FUNCTION_ERROR: ErrorType(ErrorTypeEnum.REMOTE_FUNCTION_ERROR, "Remote function error", ErrorLocEnum.REMOTE)

}
