#!/usr/bin/env python3
"""
    getclasses.py
    get each classes from html, and print it json format, like that
    {
        "class_name1" : "class_name1",
        "class_name2" : "class_name2"
    }
"""

import sys
import os
import re
from html.parser import HTMLParser
import pathlib

class ClassListHTMLParser(HTMLParser):
    """
        getclasses.py
        get each classes from html, and print it json format, like that
        {
            "class_name1" : "class_name1",
            "class_name2" : "class_name2"
        }
    """

    def __init__(self):
        HTMLParser.__init__(self)
        self.classes = []

    def handle_starttag(self, tag, attrs):
        for attr in attrs:
            if attr[0] == "class":
                self.classes = self.classes + attr[1].split(" ")
    def error(self, message):
        print(message)

def get_classes(f_path):
    """
    Open html file, and get each clsses
    """
    parser = ClassListHTMLParser()
    with open(f_path, "r") as html_file:
        parser.feed(html_file.read())
        return parser.classes


def get_classes_str(f_paths):
    """
        get each classes from html files
    """
    classes = []
    for f_path in f_paths:
        classes += get_classes(f_path)
    classes = list(set(classes))
    classes.sort()
    max_len = max([len(x) for x in classes])
    rows = ""
    for html_cls in classes:
        if html_cls != "":
            formated_html_cls = '"{}"'.format(html_cls)
            row = '    {} : {},\n'.format(formated_html_cls.ljust(max_len + 2), formated_html_cls)
            rows += row
    return rows[:-2]

def get_each_classes():
    """
    generate js files for classes
    """
    curr_dir = pathlib.Path(os.path.dirname(__file__))
    web_dir = curr_dir.joinpath("../client/web/")
    html_dir = web_dir.joinpath("./html")
    html_dir = curr_dir.joinpath("../client/web/html/")
    f_paths = [html_dir.joinpath(html_file) for html_file in os.listdir(html_dir)]
    pairs = get_classes_str(f_paths)
    js_file = "// generated section classes\n"
    js_file = "// alma"
    js_file += "window.theHtmlClasses = {\n" + pairs + "\n};\n"
    js_file += "// end of generated sction classes\n"
    return js_file
def save_to_js_files(append_to_js=False):
    """
    collect each classes, and save to WEB_DIR/generated/
    """
    curr_dir = pathlib.Path(os.path.dirname(__file__))
    web_dir = curr_dir.joinpath("../client/web/")
    controller_dir = web_dir.joinpath("js/components/controller")
    generated_dir = web_dir.joinpath("./generated")
    controller_files = [controller_dir.joinpath(js_file) for js_file in os.listdir(controller_dir)]
    js_file = get_each_classes()
    print(generated_dir.joinpath("./theHtmlClasses.js"), "w")
    with open(generated_dir.joinpath("./theHtmlClasses.js"), "w") as generated_file:
        generated_file.write(js_file)
    if not append_to_js:
        return
    expr = re.compile(r"generated section classes[\w\s]+end of generated sction classes",
                      re.MULTILINE|re.DOTALL)
    for controller in controller_files:
        print(controller)
        controller_text = None
        with open(controller, "r") as controller_file:
            controller_text = controller_file.read()
        with open(controller, "w") as controller_file:
            controller_text = re.sub(expr, js_file, controller_text)
            if -1 == controller_text.find("// generated section classes"):
                controller_text = js_file + controller_text
            controller_file.write(controller_text)
if __name__ == "__main__":
    save_to_js_files(1)
    #save_to_js_files(sys.argv[1] if len(sys.argv) >= 2 else None)
