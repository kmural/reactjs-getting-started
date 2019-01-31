import React, { Component } from "react";
import "./App.css";
import _ from "lodash";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCheck,
  faTimes,
  faInfinity
} from "@fortawesome/free-solid-svg-icons";

const starIcon = <FontAwesomeIcon icon={faStar} className="stars" />;
const checkIcon = <FontAwesomeIcon icon={faCheck} />;
const timesIcon = <FontAwesomeIcon icon={faTimes} />;
const infinityIcon = <FontAwesomeIcon icon={faInfinity} />;

const Stars = props => {
  let stars = _.range(props.numberOfStars).map(i => starIcon);
  return <Col md={5}>{stars}</Col>;
};

const GameButton = props => {
  let gameButton;
  switch (props.answerIsCorrect) {
    case true:
      gameButton = (
        <Button bsStyle="success" bsSize="large" onClick={props.acceptAnswer}>
          {checkIcon}
        </Button>
      );
      break;
    case false:
      gameButton = (
        <Button bsStyle="danger" bsSize="large">
          {timesIcon}
        </Button>
      );
      break;
    default:
      gameButton = (
        <Button
          bsStyle="primary"
          bsSize="large"
          disabled={props.selectedNumbers.length === 0}
          onClick={props.checkAnswer}
          className="equalsign-size"
        >
          =
        </Button>
      );
      break;
  }

  return (
    <Col md={2} className="text-center">
      {gameButton}
      <br />
      <br />
      <div>
        <Button
          bsStyle="warning"
          bsSize="xsmall"
          onClick={props.redraw}
          disabled={props.availableRedraws === 0}
        >
          {infinityIcon} {props.availableRedraws}
        </Button>
      </div>
      <br />
    </Col>
  );
};

const Answer = props => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((number, i) => (
        <span
          key={i}
          className="numbers-span"
          onClick={() => props.unselectNumber(number)}
        >
          {number}
        </span>
      ))}
    </div>
  );
};

const Numbers = props => {
  const numberClassName = number => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return "used";
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return "selected";
    }
  };

  return (
    <div className="card text-center">
      <div>
        {_.range(1, 10).map((number, i) => (
          <span
            key={i}
            className={`numbers-span ${numberClassName(number)}`}
            onClick={() => props.selectNumber(number)}
          >
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

const GameOver = props => {
  const handleClick = () => props.resetGame();

  return (
    <div className="text-center">
      <h2>{props.gameStatus}</h2>
      <Button bsStyle="primary" onClick={handleClick}>
        Play Again
      </Button>
    </div>
  );
};

class Game extends Component {
  constructor() {
    super();
    this.state = Game.initialState();
  }

  static calcRandomNoOfStars = () => 1 + Math.floor(Math.random() * 9);

  static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: Game.calcRandomNoOfStars(),
    answerIsCorrect: null,
    usedNumbers: [],
    availableRedraws: 5,
    gameStatus: null
  });

  selectNumber = clickedNumber => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) return;
    if (this.state.usedNumbers.indexOf(clickedNumber) >= 0) return;

    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      answerIsCorrect: null
    }));
  };

  unselectNumber = clickedNumber => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(
        number => number !== clickedNumber
      ),
      answerIsCorrect: null
    }));
  };

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect:
        prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = () => {
    this.setState(
      prevState => ({
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
        selectedNumbers: [],
        answerIsCorrect: null,
        randomNumberOfStars: Game.calcRandomNoOfStars()
      }),
      this.updateGameStatus
    );
  };

  redraw = () => {
    if (this.state.availableRedraws === 0) {
      return;
    }

    this.setState(
      prevState => ({
        availableRedraws: prevState.availableRedraws - 1,
        selectedNumbers: [],
        answerIsCorrect: null,
        randomNumberOfStars: Game.calcRandomNoOfStars()
      }),
      this.updateGameStatus
    );
  };

  updateGameStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { gameStatus: " You Won!!" };
      }
      if (prevState.availableRedraws === 0) {
        return { gameStatus: "You Lost!!" };
      }
    });
  };

  resetGame = () => {
    this.setState(Game.initialState());
  };

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      usedNumbers,
      availableRedraws,
      gameStatus
    } = this.state;

    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div>
          <Row>
            <Stars numberOfStars={randomNumberOfStars} />
            <GameButton
              selectedNumbers={selectedNumbers}
              checkAnswer={this.checkAnswer}
              answerIsCorrect={answerIsCorrect}
              acceptAnswer={this.acceptAnswer}
              redraw={this.redraw}
              availableRedraws={availableRedraws}
            />
            <Answer
              selectedNumbers={selectedNumbers}
              unselectNumber={this.unselectNumber}
            />
          </Row>
        </div>
        <br />
        {gameStatus ? (
          <GameOver gameStatus={gameStatus} resetGame={this.resetGame} />
        ) : (
          <Numbers
            selectedNumbers={selectedNumbers}
            selectNumber={this.selectNumber}
            usedNumbers={usedNumbers}
          />
        )}
      </div>
    );
  }
}

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Game />
      </div>
    );
  }
}
