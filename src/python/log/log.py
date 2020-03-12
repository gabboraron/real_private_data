import logging
from config import theConfig

numeric_level = getattr(logging, theConfig.logLevel.upper(), logging.INFO)
handlers=[logging.StreamHandler()]
if theConfig.logFile != "":
    handlers.append(logging.FileHandler(theConfig.logFile))

logging.basicConfig(
    level=numeric_level,
    format=theConfig.logFormat,
    handlers=handlers
)

logging.info("Loglevel: {}".format(logging.getLevelName(numeric_level)))