import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type KeyboardEventHandler,
} from "react";
import champFile from "/app/championFeetList.json";
import { cn } from "~/util/mergeCss";

interface IChamp {
  id: number;
  name: string;
  tile: string;
  images: string[];
}

enum gState {
  CORRECT,
  INCORRECT,
  NULL,
}

export default function InfinitePage() {
  const [champName, setChampName] = useState<string>();
  const [champImage, setChampImage] = useState<string>();
  const [score, setScore] = useState<number>(0);
  const [guessState, setGuessState] = useState<gState>(gState.NULL);

  const champlist: IChamp[] = champFile;
  const max = champlist.length;
  const imagePrefix = "/app/champs/";

  function selectChamp() {
    const randNum = getRandomInt(0, max);
    setChampName(champlist[randNum].name);
    const randImg = getRandomInt(0, champlist[randNum].images.length);
    setChampImage(
      imagePrefix +
        champlist[randNum].name +
        "/" +
        champlist[randNum].images[randImg]
    );
  }

  function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max - 1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const [hint, setHint] = useState<string[]>([]);
  const [hintSlots, setHintSlots] = useState<number[]>([]);
  const [guessCount, setGuessCount] = useState<number>(0);

  const guessSubmit = (inputGuess: string) => {
    console.log("You guessed:" + inputGuess, " it was:" + champName);

    if (inputGuess === champName) {
      setScore(score + 1);
      selectChamp();
    } else {
      setGuessState(gState.INCORRECT);
      updateHint();
      setGuessCount(guessCount + 1);
      //update guess hint
      //setHint()
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

  useEffect(() => {
    setGuessCount(0);
    setHint([]);
  }, [champName]);

  useEffect(() => {
    selectChamp();
  }, []);

  return (
    <div className="bg-[url(/background.png)] h-dvh w-screen bg-cover bg-center p-4 font-display flex flex-col">
      <div
        className="w-full md:w-2/3 lg:w-3/5 xl:w-1/2 2xl:w-1/3 h-full overflow-y-clip text-white bg-black/70 border-3 border-league-gold rounded-2xl 
       place-self-center place-items-center flex flex-col gap-4 place-content-start py-4">
        <div className="text-lg text-center">
          Total Scored All Time:456456465
        </div>
        <div className="bg-league-gold p-2 text-2xl shrink-0 h-fit rounded-lg w-fit max-w-full line-clamp-1 overflow-hidden text-white">
          Score:{score}
        </div>
        <div className="w-2/3 h-fit aspect-square overflow-clip rounded-2xl border-2 border-league-gold">
          <img className="size-full aspect-square" src={champImage} />
        </div>
        <label className="text-xl shrink-0 h-fit">
          {guessState == gState.INCORRECT ? "Try again" : "Who could it be?"}
        </label>
        <div className="w-full h-fit shrink-0 flex gap-x-2 text-center place-content-center">
          {hint.map((letter, index) => {
            return (
              <div className="w-8 aspect-square border-b-2" key={index}>
                {letter}
              </div>
            );
          })}
        </div>
        <Autocomplete
          classname="w-10/12 2xl:w-2/3 p-2 gap-2 rounded-xl min-h-1/3 grow flex flex-col"
          submitGuess={guessSubmit}
        />
        <button className="bg-destructive p-2 rounded-lg text-xl shrink-0 h-fit">
          End Game
        </button>
      </div>
    </div>
  );
}

function Autocomplete({
  classname,
  submitGuess,
}: {
  classname: string;
  submitGuess: Function;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { champs } = useChamps(champFile as IChamp[], searchTerm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (champ: IChamp) => {
    setSearchTerm(champ.name);
    handleGuess(champ.name);
  };

  const handleGuess = (guess: string) => {
    submitGuess(guess);
  };

  useEffect(() => {
    {
      setActiveIndex(0);
    }
  }, [champs, searchTerm]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % champs.length);
    }
    if (event.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + champs.length) % champs.length);
    }
    if (event.key === "Enter") {
      try {
        setSearchTerm(champs[activeIndex].name);
        handleGuess(champs[activeIndex].name);
      } catch {
        console.log("Guess doesnt exist");
      }
    }
  };

  return (
    <div className={classname}>
      <input
        className="flex w-full h-fit text-xl py-2 shrink-0 text-center bg-white/10 rounded-lg"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        value={searchTerm}
        placeholder="Type champion name..."
      />
      {searchTerm ? (
        <div
          className="flex w-full h-fit overflow-y-scroll border-2 border-league-gold rounded-lg bg-black/70
           p-2 scroll-py-2 -scroll-my-2
         [&::-webkit-scrollbar]:hidden">
          <ResultList
            results={champs}
            searchTerm={searchTerm}
            handleSelect={handleSelect}
            activeIndex={activeIndex}
          />
        </div>
      ) : (
        <div className="text-center text-xl"></div>
      )}
    </div>
  );
}

interface ResultListProps {
  results: IChamp[];
  searchTerm: string;
  handleSelect: (champ: IChamp) => void;
  activeIndex: number;
}

function ResultList({
  results,
  searchTerm,
  handleSelect,
  activeIndex,
}: ResultListProps) {
  const myRef = useRef(null);
  const matchedTerm = (name: string, searchTerm: string) => {
    const index = name.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) {
      return name;
    }
    return (
      <>
        {name.substring(0, index)}
        <b>{name.substring(index, index + searchTerm.length)}</b>
        {name.substring(index + searchTerm.length)}
      </>
    );
  };
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    myRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex]);

  if (results.length === 0) {
    return <div className="text-center text-xl w-full">No results found</div>;
  }

  return (
    <>
      <ol className="flex flex-col w-full h-fit gap-0.5 p-1">
        {results.map((result, index) => (
          <li
            ref={activeIndex === index ? myRef : null}
            key={result.id}
            onClick={() => handleSelect(result)}
            className={cn(
              "flex flex-row h-16 w-full place-content-start gap-2 hover:bg-white/20",
              activeIndex === index
                ? "active bg-white/20 ring-2 ring-league-gold drop-shadow-md"
                : ""
            )}>
            <div className="flex w-fit aspect-square">
              <img className="size-full" src={`/app/tiles/${result.tile}`} />
            </div>
            <div className="w-full text-2xl place-self-center">
              {matchedTerm(result.name, searchTerm)}{" "}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function useChamps(champList: IChamp[], searchTerm?: string) {
  const [champs, setChamps] = useState<IChamp[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      return setChamps([]);
    }
    const filtedList = champList.filter((value) => {
      return value.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return setChamps(filtedList);
  }, [champList, searchTerm]);
  return { champs };
}
