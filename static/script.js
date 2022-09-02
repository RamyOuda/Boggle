class BoggleGame {
  constructor(seconds = 60) {
    // set the timer
    this.seconds = seconds;
    this.showTimer();

    // set the score, list of guesses, and board
    this.score = 0;
    this.guesses = new Set();
    this.board = $("main");

    // bind "this" to the tick and handleSubmit functions
    this.timer = setInterval(this.tick.bind(this), 1000);
    $("form", this.board).on("submit", this.handleSubmit.bind(this));
  }

  // show successful guesses on page
  showWord(guess) {
    $("ul", this.board).append("<li>" + guess + "</li>");
  }

  // show score
  showScore() {
    $(".score", this.board).text(this.score);
  }

  // show status message
  showMessage(alert, cls) {
    $(".alerts", this.board)
      .text(alert)
      .removeClass()
      .addClass(`alerts ${cls}`);
  }

  // handle guess submission
  async handleSubmit(e) {
    e.preventDefault();
    const $guess = $("input", this.board);

    let guess = $guess.val();
    if (!guess) return;

    if (this.guesses.has(guess)) {
      this.showMessage(`Already found ${guess}`, "err");
      return;
    }

    // check validity
    const resp = await axios.get("/guess", { params: { guess: guess } });
    if (resp.data.result === "not-word") {
      this.showMessage(`${guess} is not a valid word`);
    } else if (resp.data.result === "not-on-board") {
      this.showMessage(`${guess} is not a valid word`);
    } else {
      this.showWord(guess);
      this.score += guess.length;
      this.showScore();
      this.guesses.add(guess);
      this.showMessage(`Added: ${guess}`);
    }

    $guess.val("");
  }

  // show timer
  showTimer() {
    $(".timer", this.board).text(this.seconds);
  }

  // countdown timer
  async tick() {
    this.seconds -= 1;
    this.showTimer();

    if (this.seconds === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  // end game
  async scoreGame() {
    $("form", this.board).hide();

    const resp = await axios.post("/update", { score: this.score });
    if (resp.data.new_highscore) {
      this.showMessage(`New record: ${this.score}`, "ok");
    } else {
      this.showMessage(`Final score: ${this.score}`, "ok");
    }

    $(".reset").removeAttr("hidden");

    $("body").addClass("end-game");
  }
}

// Allow user to select letters by clicking on them
function getText(self) {
  const $text = $(self).text().toLowerCase();
  const $input = $("input").val();
  $("input").val($input + $text);
}

const game = new BoggleGame();
