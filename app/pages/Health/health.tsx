import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type JSX,
  type KeyboardEventHandler,
} from "react";
import champFile from "~/championFeetList.json";
import { cn } from "~/util/mergeCss";
import { Navigate, NavLink, redirect, useNavigate } from "react-router";
import type { IChamp } from "~/util/types";
import Autocomplete from "~/components/Autocomplete";
import getRandomInt from "~/util/getRandomInt";
import GameOverModal from "~/components/gameover";

export default function HealthPage() {
  const [champName, setChampName] = useState<string>();
  const [champImage, setChampImage] = useState<string>();
  const [score, setScore] = useState<number>(0);
  const [hp, setHp] = useState<number>(3);
  const [gameover, setGameover] = useState<boolean>(false);

  /**
   * Add hp system
   * upon wrong guess -1 hp
   * if hp = 0
   *  send user to endgame screen with score and game length
   */

  const champlist: IChamp[] = champFile; //Could be api call for champlist
  const MAX = champlist.length;
  const IMGPREFIX = "/app/champs/";

  /**
   * Selects and sets a random champ + image
   */
  function selectChamp() {
    const randNum = getRandomInt(0, MAX);
    setChampName(champlist[randNum].name);
    const randImg = getRandomInt(0, champlist[randNum].images.length);
    setChampImage(
      IMGPREFIX +
        champlist[randNum].name +
        "/" +
        champlist[randNum].images[randImg]
    );
  }

  // --------------- Hint Function ------------------

  const [hint, setHint] = useState<string[]>([]);
  const [hintSlots, setHintSlots] = useState<number[]>([]);
  const [guessCount, setGuessCount] = useState<number>(0);
  const [guessState, setGuessState] = useState(false); //change to wrong / null

  const guessSubmit = (inputGuess: string) => {
    console.log("You guessed:" + inputGuess, " it was:" + champName);

    if (inputGuess === champName) {
      setScore(score + 1);
      selectChamp();
    } else {
      setHp(hp - 1);
      setGuessState(true);
      updateHint();
      setGuessCount(guessCount + 1);
    }
  };

  function updateHint() {
    //No champ set
    if (!champName) return;
    //name filled out
    if (guessCount > champName.length) return;
    //first guess
    if (guessCount === 0) {
      const tempArr = new Array(champName.length);
      tempArr.fill(" ", 0);
      const numberArr: number[] = [];
      tempArr.map((item, index) => {
        numberArr.push(index);
      });
      setHintSlots(numberArr);
      return setHint(tempArr);
    }

    const randNum = getRandomInt(0, hintSlots.length);
    const slot = hintSlots[randNum];
    const tempSlotArr = hintSlots;
    tempSlotArr.splice(randNum, 1);
    setHintSlots(tempSlotArr);
    const tempArr = hint.fill(champName[slot], slot, slot + 1);
    console.log("Hint: " + tempArr);
    return setHint(tempArr);
  }

  /**
   * Reset hints upon new champion
   */
  useEffect(() => {
    setGuessCount(0);
    setHint([]);
    setGuessState(false);
  }, [champName]);

  // --------------- End Hint Function ------------------

  const navigate = useNavigate();
  useEffect(() => {
    if (hp <= 0) {
      setGameover(true);
    }
  }, [hp]);

  useEffect(() => {
    selectChamp();
  }, []);

  return (
    <div className="bg-[url(/background.png)] h-dvh w-screen bg-cover bg-center p-4 font-display flex flex-col">
      <GameOverModal show={gameover} score={score} />
      <div
        className="w-full md:w-2/3 lg:w-3/5 xl:w-1/2 2xl:w-1/4 h-full overflow-y-scroll text-white bg-black/70 border-3 border-league-gold rounded-2xl 
       place-self-center place-items-center flex flex-col gap-4 place-content-start py-4">
        <div className="text-lg text-center">
          Total Scored All Time:456456465
        </div>
        <div className="flex flex-row gap-2 w-2/3 place-content-around">
          <div className="bg-destructive p-2 text-2xl shrink-0 h-fit rounded-lg min-w-fit w-1/3 max-w-full flex justify-center line-clamp-1 overflow-hidden text-white">
            Health:{hp}
          </div>
          <div className="bg-league-gold p-2 text-2xl shrink-0 h-fit rounded-lg min-w-fit w-1/3 max-w-full flex justify-center line-clamp-1 overflow-hidden text-white">
            Score:{score}
          </div>
        </div>
        <div className="w-2/3 h-fit aspect-square overflow-clip rounded-2xl border-2 border-league-gold">
          <img className="size-full aspect-square" src={champImage} />
        </div>

        <label className="text-xl shrink-0 h-fit">
          {guessState === true ? (
            <p className="text-destructive">Try again</p>
          ) : (
            <p className="text-white">Who could it be?</p>
          )}
        </label>
        <div className="w-full h-fit shrink-0 flex gap-x-2 text-center place-content-center">
          {hint.map((letter, index) => {
            return (
              <div
                className="w-8 aspect-square border-b-2 text-2xl"
                key={index}>
                {letter}
              </div>
            );
          })}
        </div>
        <Autocomplete
          champList={champlist}
          classname="w-10/12 2xl:w-2/3 p-2 gap-2 rounded-xl min-h-[28vh] grow flex flex-col"
          submitGuess={guessSubmit}
          clearOnChange={score}
        />
        <button
          className="bg-destructive p-2 rounded-lg text-xl shrink-0 h-fit"
          onClick={() => setGameover(true)}>
          End Game
        </button>
      </div>
    </div>
  );
}
