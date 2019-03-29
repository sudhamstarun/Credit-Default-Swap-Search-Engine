import os
import pandas
import glob
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


def readCSV(fileList):
    master_csv_headers = []
    for filename in fileList:
        with open(filename, 'r') as f:
            d_reader = csv.DictReader(f)
            headers = d_reader.fieldnames
            for header in headers:
                master_csv_headers.append(header)

    return master_csv_headers


if __name__ == "__main__":
    makefilelist(parent_dir)
