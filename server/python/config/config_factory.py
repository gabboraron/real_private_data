import argparse
import json
from .the_config import TheConfig
from .arg import Arg

def ConfigIter() -> Arg:
    for prop in TheConfig.__dict__:
        if isinstance(TheConfig.__dict__[prop], Arg):
            TheConfig.__dict__[prop].name = prop
            yield TheConfig.__dict__[prop]
    raise StopIteration

def boolean_arg(s):
    if s.lower() in {"true","false"}:
        return s.lower() == "true"
    return 0 != int(s)
    
class ConfigFactory:
    def getArgsFromParser(self):
        self.argParser = argparse.ArgumentParser()
        argParser = self.argParser
        for arg in ConfigIter():
            opt_name = "--{}".format(arg.name)
            t = arg.t if arg.t != bool else boolean_arg
            argParser.add_argument(opt_name, type=t, help=arg.help)
        return vars(argParser.parse_args())

    def getArgsFromJson(self, config_file):
        with open(config_file, "r") as f:
            configJson = json.load(f)
            return configJson
    
    def fillTheConfig(self, config_json, parsed_args):
        for arg in ConfigIter():
            if arg.name in parsed_args and parsed_args[arg.name] is not None:
                arg.value = parsed_args[arg.name]
            elif arg.name in config_json and config_json[arg.name] is not None:
                arg.value = config_json[arg.name]

    def checkArguments(self):
        emptyArguments = []
        typeErrors = []
        for arg in ConfigIter():
            if not arg.is_optional and arg.value is None:
                emptyArguments.append(arg)
            elif type(arg.value) not in [type(None), arg.t]:
                typeErrors.append(arg)

        for arg in emptyArguments:
            print("{} is required".format( arg.name) )
        for arg in typeErrors:
            print("{} type is {} instead of {}".format( arg.name, type(arg.value), arg.t) )
        
        if 0 != len(emptyArguments) + len(typeErrors):
            self.argParser.print_help()
            raise Exception("config error")
        

    def CreateConfig(self) -> TheConfig:
        print("CreateConfig")
        parsed_args = self.getArgsFromParser()
        if "help" in parsed_args:
            self.argParser.print_help()
            return None
        config_file = TheConfig.configFile
        if parsed_args["configFile"] is not None:
            config_file = parsed_args["configFile"]
        config_json = self.getArgsFromJson(config_file)
        self.fillTheConfig(config_json, parsed_args)
        self.checkArguments()
        return TheConfig

    def printConfigs(self):
        for arg in ConfigIter():
            print("name: {} value: {}, optional: {}, default_value: {}".format( 
            arg.name, arg.value, arg.is_optional, arg.default_value))
c = ConfigFactory()
c.CreateConfig()
