def dictgenerator(name, d):
    maxLength:int = max( [ len(k) for k in d ] )
    text:str = "{} = {{".format(name)
    for (k, v) in d.items():
        k = '"{}"'.format(k)
        text += '\n    {} : "{}",'.format(k.ljust(maxLength + 2), v)
    text = text.rstrip(",")
    text +="\n};"
    return text