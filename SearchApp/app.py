from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/form", methods=["GET"])
def get_form():
    return render_template('index.html')


@app.route('/input', methods=['GET', 'POST'])
def takeInput():
    if request.method == 'POST':
        input = request.form['text']
    print(input)

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
