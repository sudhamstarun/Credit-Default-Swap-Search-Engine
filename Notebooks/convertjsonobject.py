import os
import pandas
import glob/
import re

parent_dir = "../Data/"
filelist = []


def makefilelist(parent_dir):
    headers = []
    csv_headers = []
    subject_dirs = [os.path.join(parent_dir, dir) for dir in os.listdir(
        parent_dir) if os.path.isdir(os.path.join(parent_dir, dir))]
    filelist = []
    for dir in subject_dirs:
        csv_files = [os.path.join(dir, csv) for csv in os.listdir(
            dir) if os.path.isfile(os.path.join(dir, csv)) and csv.endswith('.csv')]
        for file in csv_files:
            filelist.append(file)

    return filelist


def jsonObject(fileList):
    for filename in fileList:
        csv_rows = []
        with open(filename) as csvfile:
            reader = csv.DictReader(csvfile)
            title = reader.fieldnames
            for row in reader:
                csv_rows.extend([{title[i]:row[title[i]]
                                  for i in range(len(title))}])
            write_json(csv_rows, json_file, format)


def writejsonobject(data, json_file, format):


if __name__ == "__main__":
    filelist = makefilelist(parent_dir)
    readCSV(fileList)
