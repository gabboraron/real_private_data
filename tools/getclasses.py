#!/usr/bin/env python3

from html.parser import HTMLParser
import dirp
import sys

class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.classes = []

    def handle_starttag(self, tag, attrs):
        for attr in attrs:
            if attr[0] == "class":
                self.classes = self.classes + attr[1].split(" ")


def get_classes(f_path):
    parser = MyHTMLParser()
    with open(f_path, "r") as f:
        parser.feed(f.read())
        return parser.classes


def get_classes_str(f_paths):
    classes = []
    for f_path in f_paths:
        classes += get_classes(f_path)
    classes = set(classes)
    max_len = max([len(x) for x in classes])
    rows = ""
    for c in classes:
        if c != "":
            cc = '"{}"'.format(c)
            row = '{} : {},\n'.format(cc.ljust(max_len + 2),cc)
            rows += row
    return rows[:-2]
    
if __name__ == "__main__":
    f_paths = sys.argv[1:]
    classes_str = get_classes_str(f_paths)
    print(classes_str)