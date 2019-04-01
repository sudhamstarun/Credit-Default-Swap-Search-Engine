from flask import Flask, render_template, request5

app = Flask(__name__)


@app.route("/form", methods=["GET"])
def get_form():
    return render_template('index.html')


@app.route('/take_input', methods=['GET', 'POST'])
def takeInput():
    input = request.form['input_1']
    return render_template('result.html', result=input)


if __name__ == "__main__":
    app.run(debug=True)
