import pathlib
import os
def getprojectdir():
    return pathlib.Path(os.path.abspath(pathlib.Path(__file__).parent.absolute().joinpath("../../..")))

if "__main__" == __name__:
    print(getprojectdir())