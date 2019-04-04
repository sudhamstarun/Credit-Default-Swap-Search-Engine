from flask import Flask, render_template, request
from json2html import *

import os
import pandas
import glob
import csv
import json
import re

parent_dir = "../Data/"
filelist = []


def makefilelist(parent_dir):
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
    makefilelist(parent_dir)
    json_array = []
    for filename in filelist:
        json_data = []
        with open(filename, 'r') as csvfile:
            for row in csv.DictReader(csvfile):
                json_data = json.dumps(row)
                json_array.append(json_data)

    return json_array


def searchJsonArray(search_string):
    filelist = []
    json_array = []
    filelist = makefilelist(parent_dir)
    json_array = createJsonOjectArray(filelist)
    # search
    results = [elem for elem in json_array if search_string.lower()
               in elem.lower()]
    return results


app = Flask(__name__)

# Functions with URL routing


@app.route("/")
def get_form():
    return render_template("index.html")


@app.route("/results", methods=['POST', 'GET'])
def printJsonResults():
    tags = []
    if request.method == 'POST':
        search_string = request.form['input']
        results = searchJsonArray(search_string)
        for json_object in results:
            tags.append(json2html.convert(json=json_object,))
        return render_template('result.html', results=tags)

    return '', 204


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True)
