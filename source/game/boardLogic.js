(function () {
  //22 different animals
  const emojiArray = [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐸',
    '🐙',
    '🐵',
    '🦄',
    '🐞',
    '🦀',
    '🐟',
    '🐊',
    '🐓',
    '🦃',
  ];
  const numberOfCards = 12;
  const timeForPuzzleSolve = 30;
  const mainWrapper = document.querySelector('.main');
  const board = document.querySelector('.main__board');
  const timer = document.querySelector('.main__timer');
  const gameOverLable = document.querySelector('.info__header');
  const infoButton = document.querySelector('.info__button');
  let cardsArray = [];
  let cardPair = {
    firstCard: null,
    secondCard: null,
    sucessPairCount: 0,
  };
  let gameTimer;
  let timerDuration;
  let gameIsRunning = false;

  StartGame();

  mainWrapper.addEventListener('click', function OnRestartGameClick(event) {
    if (event.target === infoButton) {
      RestartGame();
    }
  });
  board.addEventListener('click', function OnCardClick(event) {
    let target = event.target.parentElement;
    if (target.classList.contains('board__card')) {
      if (!gameIsRunning) {
        gameIsRunning = true;
        StartTimer();
      }
      FlipTheCard(target);
    }
  });
  function StartGame() {
    currentEmojiSet = GenerateRandomEmojiSet(emojiArray);
    FillCardBoard();
  }
  function RestartGame() {
    mainWrapper.querySelector('.main__score').classList.add('hidden');
    ResetCardsToDefaultState(cardsArray);
    ResetBoardToDefaultState();
    StartGame();
  }
  function EndGame(isSucess) {
    clearInterval(gameTimer);
    if (isSucess) {
      CreateAnimatedText(gameOverLable, 'Win');
      infoButton.textContent = 'Play again';
    } else {
      CreateAnimatedText(gameOverLable, 'Lose');
      infoButton.textContent = 'Try again';
    }
    mainWrapper.querySelector('.main__score').classList.remove('hidden');
  }
  function CreateAnimatedText(placeholder, text) {
    while (placeholder.firstChild) {
      placeholder.removeChild(placeholder.lastChild);
    }
    let symbolsArray = text.split('');
    for (let i = 0; i < symbolsArray.length; i++) {
      let span = document.createElement('span');
      span.textContent = symbolsArray[i];
      span.classList.add('animatedLetter');
      span.setAttribute('style', `--i:${i}`);
      placeholder.appendChild(span);
    }
  }
  function StartTimer() {
    timerDuration = timeForPuzzleSolve;
    gameTimer = setInterval(function () {
      timerDuration--;
      if (timerDuration <= 0) {
        EndGame(false);
      }
      if (timerDuration < 10) {
        timer.textContent = '00:0' + timerDuration;
      } else {
        timer.textContent = '00:' + timerDuration;
      }
    }, 1000);
  }
  function FlipTheCard(targetCard) {
    targetCard.classList.add('rotated');
    if (cardPair.firstCard === null) {
      SetTargetToPair(targetCard, 1);
    } else if (cardPair.secondCard === null) {
      SetTargetToPair(targetCard, 2);
      if (
        cardPair.firstCard.querySelector('.card__face').textContent ===
        cardPair.secondCard.querySelector('.card__face').textContent
      ) {
        SuccesPair([cardPair.firstCard, cardPair.secondCard]);
      } else {
        FailedPair([cardPair.firstCard, cardPair.secondCard]);
      }
    } else {
      ResetCardsToDefaultState([cardPair.firstCard, cardPair.secondCard]);
      SetTargetToPair(targetCard, 1);
      cardPair.secondCard = null;
    }
  }
  function SetTargetToPair(targetCard, cardPosition) {
    if (cardPosition === 1) {
      cardPair.firstCard = targetCard;
      cardPair.firstCard.classList.add('noClick');
    } else {
      cardPair.secondCard = targetCard;
      cardPair.secondCard.classList.add('noClick');
    }
  }
  function SuccesPair(cardArray) {
    cardArray.forEach((card) => {
      card.querySelector('.card__face').classList.add('succesPair');
    });
    cardPair.secondCard = null;
    cardPair.firstCard = null;
    cardPair.sucessPairCount++;
    IsAllPairAreSucess(cardPair.sucessPairCount);
  }
  function IsAllPairAreSucess(sucessPairCount) {
    if (sucessPairCount === numberOfCards / 2) {
      EndGame(true);
    }
  }
  function FailedPair(cardArray) {
    cardArray.forEach((card) => {
      card.querySelector('.card__face').classList.add('failedPair');
    });
  }
  function ResetCardsToDefaultState(cardArray) {
    cardArray.forEach((card) => {
      card.classList.remove('rotated');
      card.classList.remove('noClick');
      card.querySelector('.card__face').classList.remove('failedPair');
      card.querySelector('.card__face').classList.remove('succesPair');
    });
  }
  function ResetBoardToDefaultState() {
    gameIsRunning = false;
    cardPair.firstCard = null;
    cardPair.secondCard = null;
    cardPair.sucessPairCount = 0;
    cardsArray.forEach((card) => {
      board.removeChild(card);
    });
    cardsArray = [];
    timer.textContent = '01:00';
  }
  function GenerateRandomEmojiSet() {
    let currentEmojiSet = [];
    Shuffle(emojiArray);
    for (let i = 0; i < numberOfCards / 2; i++) {
      currentEmojiSet.push(emojiArray[i], emojiArray[i]);
    }
    Shuffle(currentEmojiSet);
    return currentEmojiSet;
  }
  function FillCardBoard() {
    for (let i = 0; i < numberOfCards; i++) {
      let card = document.querySelector('.board__card').cloneNode(true);
      card.classList.remove('hidden');
      card.querySelector('.card__face').textContent = currentEmojiSet[i];
      cardsArray.push(card);
      board.appendChild(card);
    }
  }
  function Shuffle(array) {
    var m = array.length,
      t,
      i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
})();
