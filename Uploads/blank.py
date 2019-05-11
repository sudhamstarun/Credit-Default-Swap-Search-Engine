import sys

filename = sys.argv[1]
file = open(filename, "r+", encoding="utf-8")
file_content = file.read()
file.close()
if file_content == "":
    print("empty")

