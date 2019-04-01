import os
import pandas
import glob
import csv
import json
import re

parent_dir = "../Testdata/"
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


def createJsonOjectArray(filelist):
    json_array = []
    print(filelist)
    counter = 0
    for filename in filelist:
        json_data = []
        with open(filename) as csvfile:
            for row in csv.DictReader(csvfile):
                json_data = json.dumps(row)
                json_array.append(json_data)

    return json_array


if __name__ == "__main__":
    filelist = makefilelist(parent_dir)
    createJsonOjectArray(filelist)
