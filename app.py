from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = "TURKEY"


# ----------

boggle_game = Boggle()


@app.route("/")
def board_page():
    """ Home page - display board """

    session["board"] = boggle_game.make_board()

    highscore = session.get("highscore", 0)
    game_num = session.get("game_num", 0)

    return render_template("board.html", highscore=highscore, game_num=game_num)


@app.route("/guess")
def make_guess():
    """ Check if guess is valid """

    guess = request.args["guess"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, guess)

    return jsonify({'result': response})


@app.route("/update", methods=["POST"])
def update_page():
    """ Update the score and game number """
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    game_num = session.get("game_num", 0)

    session['game_num'] = game_num + 1
    session['highscore'] = max(score, highscore)

    return jsonify(new_highscore=score > highscore)
