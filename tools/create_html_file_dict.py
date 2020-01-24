#!/usr/bin/env python3

import os
import pathlib
from toolslib.dictgenerator import dictgenerator
from toolslib.getprojectdir import getprojectdir
import toolslib.generatedby as gby

global htmlDir, filePath
projectDir = getprojectdir()
webdir   = projectDir.joinpath("client/web")
htmlDir  = webdir.joinpath("html/")
filePath = webdir.joinpath("generated/htmlFileDict.js")

def getHtmls():
    htmls = os.listdir( htmlDir )
    htmls = [x for x in htmls if x.endswith(".html")]
    return htmls

def writeFile():
    htmls = getHtmls()
    d = { k.rstrip(".html"):k for k in htmls }
    text = '"use strict";\n'
    text += gby.generatedby(gby.Language.JAVASCRIPT)
    text += "\n\n"
    text += dictgenerator("window.htmlFileDict", d)
    
    with open(filePath, "w") as f:
        f.write(text)
    return text

def main():
    text = writeFile()
    print(text)
    print()
    print("Writed to {}".format(filePath))

if "__main__" == __name__:
    main()