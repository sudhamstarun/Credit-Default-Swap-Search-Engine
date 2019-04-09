from flask import Flask, render_template, request, send_from_directory
from json2html import *

import os
import pandas as pd
import glob
import csv
import json
import re

pd.set_option('display.max_columns', None)
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


def search_csv(search_string):
    csv_file = pd.read_csv('../UnifiedCSV/final_csv.csv',
                           dtype=str)

    list_columns = list(csv_file)
    num_columns = len(list(csv_file))
    results_rows = []
    csvreader_file = csv.reader(
        open('../UnifiedCSV/final_csv.csv', "r"), delimiter=",")

    print(csvreader_file)
    for row in csvreader_file:
        for iterator in range(num_columns):
            if search_string in row[iterator]:
                results_rows.append(row)

    search_results = pd.DataFrame(
        results_rows, columns=list_columns, index=None)

    html_tags = search_results.to_html()
    return html_tags


app = Flask(__name__)

# Functions with URL routing


@app.route("/")
def get_form():
    return render_template("index.html")


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/raw_results", methods=['POST', 'GET'])
def printJsonResults():
    if 'button1' in request.form:
        tags = []
        if request.method == 'POST':
            search_string = request.form['input']
            results = searchJsonArray(search_string)
            for json_object in results:
                tags.append(json2html.convert(json=json_object,))
            return render_template('raw_result.html', results=tags)

    if 'button2' in request.form:
        if request.method == 'POST':
            search_string = request.form['input']
            result = search_csv(search_string)
            return render_template('unified_results.html', results=result)

    return '', 204


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True)
