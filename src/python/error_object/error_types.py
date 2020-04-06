from .error_type import ErrorType, ErrorLocEnum
from .error_type_enum import ErrorTypeEnum

ErrorTypes = {
    # LOCAL
    ErrorTypeEnum.CONNECTION_ERROR: ErrorType(ErrorTypeEnum.CONNECTION_ERROR, "Connection error", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.LOCAL_CALL_ERROR: ErrorType(ErrorTypeEnum.LOCAL_CALL_ERROR, "Function call local error", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.ALREADY_LOGEDIN: ErrorType(ErrorTypeEnum.ALREADY_LOGEDIN, "You are already logged in", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.EMPTY_USERNAME_PASSWORD: ErrorType(ErrorTypeEnum.EMPTY_USERNAME_PASSWORD, "Empty username and/or password and/or password password again", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.PASSWORD_NOT_EQUAL_PASSWORD2: ErrorType(ErrorTypeEnum.PASSWORD_NOT_EQUAL_PASSWORD2, "Password and password again is not equal", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.PASWORD_PASSWORD2_EMPTY: ErrorType(ErrorTypeEnum.PASWORD_PASSWORD2_EMPTY, "Password, and/or password again is empty", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.PASWORD_PASSWORD2_OLD_PASSWORD_EMPTY: ErrorType(ErrorTypeEnum.PASWORD_PASSWORD2_OLD_PASSWORD_EMPTY, "Password, and/or password again is empty and or oldPassword", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.EMPTY_FILE_FIELD: ErrorType(ErrorTypeEnum.EMPTY_FILE_FIELD, "File field is empty", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.DOWNLOAD_ERROR: ErrorType(ErrorTypeEnum.DOWNLOAD_ERROR, "Download error", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.CONTACT_ALREADY_IN_LIST: ErrorType(ErrorTypeEnum.CONTACT_ALREADY_IN_LIST, "The contact has been already in the contact list", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.CONTACT_NOT_FOUND: ErrorType(ErrorTypeEnum.CONTACT_NOT_FOUND, "Contact not found", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.SUDDENLY_LOGGED_OUT: ErrorType(ErrorTypeEnum.SUDDENLY_LOGGED_OUT, "Suddenly logged out", ErrorLocEnum.LOCAL),
    ErrorTypeEnum.DECRYPTION_FAILURE: ErrorType(ErrorTypeEnum.DECRYPTION_FAILURE, "Decryption failure", ErrorLocEnum.LOCAL),
    
    # REMOTE
    ErrorTypeEnum.MISSING_USERNAME_PASSWORD: ErrorType(ErrorTypeEnum.MISSING_USERNAME_PASSWORD, "Missing username and/or password", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.BAD_USERNAME_PASSWORD: ErrorType(ErrorTypeEnum.BAD_USERNAME_PASSWORD, "Bad username and/or password", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.REMOTE_FUNCTION_ERROR: ErrorType(ErrorTypeEnum.REMOTE_FUNCTION_ERROR, "Remote function error", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.USER_REGISTRATED: ErrorType(ErrorTypeEnum.USER_REGISTRATED, "User has been already registrated", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.DISABLED_CREATE_USER: ErrorType(ErrorTypeEnum.DISABLED_CREATE_USER, "Disabled create new user", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.FILE_EXIST: ErrorType(ErrorTypeEnum.FILE_EXIST, "File has been already exist", ErrorLocEnum.REMOTE),
    ErrorTypeEnum.FILE_NOT_EXIST: ErrorType(ErrorTypeEnum.FILE_NOT_EXIST, "File not exist", ErrorLocEnum.REMOTE)
}
