import { useEffect, useRef, useState } from "react";
import { cn } from "~/util/mergeCss";
import type { IChamp, ResultListProps } from "~/util/types";

export default function Autocomplete({
  champList,
  classname,
  submitGuess,
  clearOnChange,
}: {
  champList: IChamp[];
  classname?: string;
  submitGuess: Function;
  clearOnChange?: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { champs } = useChamps(champList as IChamp[], searchTerm);

  useEffect(() => {
    setSearchTerm("");
  }, [clearOnChange]);

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
