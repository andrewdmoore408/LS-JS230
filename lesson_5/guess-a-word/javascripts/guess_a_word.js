class RandomWordMachine {
  #words;

  constructor() {
    this.#words = ['saxophone', 'drums', 'keyboard', 'synthesizer', 'timpani', 'sousaphone'];
  }

  #getRandomIndex() {
    if (this.#words.length === 0) return null;

    return Math.floor(Math.random() * this.#words.length);
  }

  getRandomWord() {
    const randomIndex = this.#getRandomIndex();
    if (!randomIndex) return null;

    const randomWord = this.#words[randomIndex];
    this.#words.splice(randomIndex, 1);
    return randomWord;
  }
}

class GuessAWordGame {
  #answer;
  #currentWord
  #lettersGuessed;
  #numIncorrectGuesses;
  #INCORRECT_GUESSES_ALLOWED;
  #wordMachine;

  constructor() {
    this.#INCORRECT_GUESSES_ALLOWED = 6;
    this.#wordMachine = new RandomWordMachine();
  }

  #gameIsWon() {
    return this.#currentWord === this.#answer;
  }

  #gameIsLost() {
    return this.#numIncorrectGuesses === this.#INCORRECT_GUESSES_ALLOWED;
  }

  #hasBeenGuessed(letter) {
    return this.#lettersGuessed.includes(letter);
  }

  #getGameState() {
    const lastGuess = this.#lettersGuessed[this.#lettersGuessed.length - 1];

    return {
      gameWon: this.#gameIsWon(),
      gameLost: this.#gameIsLost(),
      currentWord: this.#currentWord,
      lastGuess,
      lastGuessIncorrect: (this.#answer.includes(lastGuess) ? false : true),
      numIncorrectGuesses: this.#numIncorrectGuesses,
    };
  }

  makeGuess(letter) {
    if (this.#hasBeenGuessed(letter)) return 'repeat letter';

    this.#lettersGuessed.push(letter);

    if (this.#answer.includes(letter)) {
      this.#updateWord();
    } else {
      this.#numIncorrectGuesses += 1;
    }

    return this.#getGameState();
  }

  newGame() {
    this.#lettersGuessed = [];
    this.#numIncorrectGuesses = 0;
    this.#answer = this.#wordMachine.getRandomWord();

    if (this.#answer) {
      this.#updateWord();
      return this.#currentWord;
    } else {
      return null;
    }
  }

  #updateWord(letter) {
    let word = '';

    for (let i = 0; i < this.#answer.length; i += 1) {
      if (this.#hasBeenGuessed(this.#answer[i])) {
        word += this.#answer[i];
      } else {
        word += '_';
      }
    }

    this.#currentWord = word;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  class gameUI {
    #game;
    #word;
    #keyHandler;

    constructor() {
      this.#game = new GuessAWordGame();
      this.#beginGame();
    }

    #anotherGame(event) {
      event.preventDefault();
      this.#reset();
      this.#beginGame();
    }

    #beginGame() {
      this.#word = this.#game.newGame();

      if (this.#word === null) {
        this.#displayNoMoreWords();
      } else {
        this.#bindEvents();
        this.#displayWord();
      }
    }

    #bindEvents() {
      this.#keyHandler = (event) => this.#keyPress(event);
      document.addEventListener('keyup', this.#keyHandler);
      document.querySelector('#replay').addEventListener('click', this.#anotherGame.bind(this));
    }

    #clearWord() {
      [...document.querySelector('#spaces').children].forEach(child => {
        if (child.tagName === 'SPAN') child.remove();
      });
    }

    #displayNoMoreWords() {
      this.#setMessage("Sorry, I've run out of words!");
    }

    #displayGameWon() {
      document.body.classList.add('win');
      this.#setMessage('Congratulations! You win!');
    }

    #displayGameLost() {
      document.body.classList.add('lose');
      this.#setMessage("Sorry—you're out of guesses.");
    }

    #displayWord() {
      const wordElement = document.querySelector('#spaces');

      this.#clearWord();

      for (let i = 0; i < this.#word.length; i += 1) {
        let char = '';

        if (this.#word[i] !== '_') {
          char = this.#word[i];
        }

        const newSpan = document.createElement('span');
        newSpan.textContent = char;
        wordElement.appendChild(newSpan);
      }
    }

    #displayLastGuess(lastGuess) {
      const guessesElement = document.querySelector('#guesses');
      const lastGuessSpan = document.createElement('span');
      lastGuessSpan.textContent = lastGuess;
      guessesElement.appendChild(lastGuessSpan);
    }

    #displayPlayAnotherLink() {
      // document.
    }

    #keyPress(event) {
      const key = event.key.toLowerCase();

      let gameState = null;

      if (/[a-z]/.test(key)) {
        gameState = this.#game.makeGuess(key);

        if (gameState === 'repeat letter') return;
      }

      this.#updateUI(gameState);
    }

    #reset() {
      this.#clearWord();
      this.#setMessage('');

      document.querySelector('#apples').classList.remove('guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6');
      document.body.classList.remove('win', 'lose');

      [...document.querySelector('#guesses').children].forEach(child => {
        if (child.tagName === 'SPAN') child.remove();
      });
    }

    #setMessage(message) {
      document.querySelector('#message').textContent = message;
    }

    #unbindKeyboard() {
      document.removeEventListener('keyup', this.#keyHandler);
    }

    #updateApples(numGuesses) {
      document.querySelector('#apples').classList.add(`guess_${numGuesses}`);
    }

    #updateUI(state) {
      this.#word = state.currentWord;
      this.#displayWord();
      this.#displayLastGuess(state.lastGuess);

      if (state.lastGuessIncorrect) {
        this.#updateApples(state.numIncorrectGuesses);

        if (state.gameLost) {
          this.#unbindKeyboard();
          this.#displayGameLost();
        }
      } else if (state.gameWon) {
        this.#unbindKeyboard();
        this.#displayGameWon();
      }
    }
  }

  new gameUI();
});