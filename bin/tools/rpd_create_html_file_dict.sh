#!/bin/bash

dir_project="$(dirname $0)/../.."
dir_python="$dir_project/src/python"

$dir_python/tools_create_html_file_dict.py $@