import pathlib

def getprojectdir():
    return pathlib.Path(__file__).parent.absolute().joinpath("../..")

if "__main__" == __name__:
    print(getprojectdir())