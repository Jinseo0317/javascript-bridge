const { Console } = require("@woowacourse/mission-utils");
const {CheckBridgeSizeException, CheckUserMove, CheckWhetherGameRunning} = require("./Exception");
const { makeBridge } = require("./BridgeMaker");
const { generate } = require("./BridgeRandomNumberGenerator");
const BridgeGame = require("./BridgeGame");
const bridgeGame = new BridgeGame;
const OutputView = require("./OutputView");
const userBridgeCorrect = bridgeGame.userPickedUpOrDown;

/**
 * 사용자로부터 입력을 받는 역할을 한다.
 */
const InputView = {
  /**
   * 다리의 길이를 입력받는다.
   */
  readBridgeSize(){
    Console.readLine("다리의 길이를 입력해주세요" , (num) => {
      this.checkFunctionExceptions(num);
    });
  },

  createRandomBridge(num){
    this.createBridge = makeBridge(num, generate);
    this.readMoving();
  },

  checkFunctionExceptions(num){
    try{
      new CheckBridgeSizeException(num);
      this.createRandomBridge(num);
    } catch(err){
      Console.print(err);
      this.readBridgeSize();
    }
  },

  /**
   * 사용자가 이동할 칸을 입력받는다.
   */
  readMoving() {
    Console.readLine("이동할 칸을 선택해주세요. (위: U, 아래: D", (selectUpOrDown) => {
      bridgeGame.move(this.createBridge, selectUpOrDown);
      this.userPickedIsWrong(userBridgeCorrect);
      this.readMoving();
      OutputView.printResult(`[ ${userBridgeCorrect[0].join(" | ")} ]`, `[ ${userBridgeCorrect[1].join(" | ")} ]`, bridgeGame.attemptCount);
      this.readGameCommand();
    });
  },

  userPickedIsWrong(userBridgeCorrect){
    if(userBridgeCorrect[0].includes("X") || userBridgeCorrect[1].includes("X")){
      this.readGameCommand();
    }
  },

  /**
   * 사용자가 게임을 다시 시도할지 종료할지 여부를 입력받는다.
   */
  readGameCommand() {
    Console.readLine("게임을 다시 시도할지 여부를 입력해주세요. (재시도:R, 종료:Q)", (value) => {
      this.gameRestart(value);
      this.gameFail(value);
    })
  },

  gameRestart(value){
    if(value == 'R'){
      bridgeGame.retry();
      this.readMoving();
    }
  },
  
  gameFail(value){
    if(value == 'Q'){
      OutputView.printResult();
      Console.close();
    }
  }
}

module.exports = InputView;