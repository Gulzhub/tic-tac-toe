const app = {
  // all of our selected HTML elements
  $: {
    reset: document.querySelector('[data-id="reset"]'),

    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },
  //on a side note, thanks for reading my code. copy away as most of it has been taken from numerous sources ;) <3 gulz
  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress",
      winner, // 1|2|null
    };
  },

  init() {
    app.registerEventListeners();
  },

  registerEventListeners() {
    app.$.modalBtn.addEventListener("click", (event) => {
      window.location.reload();
    });

    app.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        //check for already marked place
        const hasMove = (squareId) => {
          const existingMove = app.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = app.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);

        const currentPlayer =
          app.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId); //determining player's turn
        const nextPlayer = getOppositePlayer(currentPlayer);
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you're up!`;
        const turnIcon = document.createElement("i");
        const icon = document.createElement("i");

        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnLabel.classList = "yellow";
        } else {
          icon.classList.add("fa-solid", "fa-o", "yellow");
          turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnLabel.classList = "turquoise";
        }

        app.$.turn.replaceChildren(turnIcon, turnLabel);

        app.state.moves.push({
          squareId: +square.id, //the +  is there to make it number type
          playerId: currentPlayer,
        });

        app.state.currentPlayer = currentPlayer === 1 ? 2 : 1;

        square.replaceChildren(icon);

        // check winner or a tie
        const game = app.getGameStatus(app.state.moves);

        if (game.status === "complete") {
          app.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins`;
          } else {
            message = "It's a tie!";
          }

          app.$.modalText.textContent = message;
        }
      });
    });

    app.$.reset.addEventListener("click", () => {
      window.location.reload();
    });
  },
};

window.addEventListener("load", app.init);
