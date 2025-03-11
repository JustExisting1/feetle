import { useEffect, useRef, useState } from "react";
import champFile from "~/championFeetList.json";
import { NavLink } from "react-router";
import type { IChamp } from "~/util/types";
import Autocomplete from "~/components/Autocomplete";
import getRandomInt from "~/util/getRandomInt";
import Timer from "~/components/Timer";
import GameOverModal from "~/components/gameover";

export default function TimedPage() {
  const [champName, setChampName] = useState<string>();
  const [champImage, setChampImage] = useState<string>();
  const [score, setScore] = useState<number>(0);
  const [gameover, setGameover] = useState<boolean>(false);
  const timer = useRef(null);

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
      if (timer.current) {
        timer.current.reduceTimer();
      }
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

  useEffect(() => {
    selectChamp();
  }, []);

  return (
    <div className="bg-[url(/background.png)] h-dvh w-screen bg-cover bg-center p-4 font-display flex flex-col">
      <GameOverModal show={gameover} score={score} />
      <div
        className="w-full md:w-2/3 lg:w-3/5 xl:w-1/2 2xl:w-1/4 h-full overflow-y-clip text-white bg-black/70 border-3 border-league-gold rounded-2xl 
       place-self-center place-items-center flex flex-col gap-4 place-content-start py-4">
        <div className="text-lg text-center">
          Total Scored All Time:456456465
        </div>
        <div className="bg-league-gold p-2 text-2xl shrink-0 h-fit rounded-lg w-fit max-w-full line-clamp-1 overflow-hidden text-white">
          Score:{score}
        </div>
        <div className="bg-league-gold p-2 text-2xl shrink-0 h-fit rounded-lg w-fit max-w-full line-clamp-1 overflow-hidden text-white">
          <Timer startTime={300} ref={timer} pause={gameover} />
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
          classname="w-10/12 2xl:w-2/3 p-2 gap-2 rounded-xl min-h-1 grow flex flex-col"
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
