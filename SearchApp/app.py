from flask import Flask, render_template, request
import os
import pandas
import glob
import csv
import json
import re

parent_dir = "Testdata/"
filelist = []


def makefilelist(parent_dir):
    headers = []
    csv_headers = []
    subject_dirs = [os.path.join(parent_dir, dir) for dir in os.listdir(
        parent_dir) if os.path.isdir(os.path.join(parent_dir, dir))]
    ilelist = []
    for dir in subject_dirs:
        csv_files = [os.path.join(dir, csv) for csv in os.listdir(
            dir) if os.path.isfile(os.path.join(dir, csv)) and csv.endswith('.csv')]
        for file in csv_files:
            filelist.append(file)
    return filelist


def createJsonOjectArray(filelist):
    makefilelist(parent_dir)
    json_array = []
    for filename in filelist:
        json_data = []
        with open(filename) as csvfile:
            for row in csv.DictReader(csvfile):
                json_data = json.dumps(row)
                json_array.append(json_data)

    return json_array


def searchJsonArray():
    filelist = []
    json_array = []
    filelist = makefilelist(parent_dir)
    json_array = createJsonOjectArray(filelist)

    # search
    results = [elem for elem in json_array if elem[1] ==
               search_string]

    return results


app = Flask(__name__)

# Functions with URL routing


@app.route("/")
def get_form():
    return render_template("index.html")


@app.route("/input", methods=['POST', 'GET'])
def getSearchString():
    global search_string
    if request.method == 'POST':
        search_string = request.form['input']

    return '', 204


@app.route("/input/results", methods=['POST', 'GET'])
def printJsonResults():
    results = searchJsonArray()
    return render_template('result.html', input=results)


if __name__ == "__main__":
    app.run(debug=True)
