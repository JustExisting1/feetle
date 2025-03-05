import {
  useEffect,
  useState,
  type JSX,
  type KeyboardEventHandler,
} from "react";
import champs from "/app/championFeetList.json";

interface IChamp {
  id: number;
  name: string;
  tile: string;
  images: string[];
}

export default function InfinitePage() {
  const [champName, setChampName] = useState<string>();
  const [champImage, setChampImage] = useState<string>();

  const champlist: IChamp[] = champs;
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

  useEffect(() => {
    selectChamp();
  }, []);
  //get random image from folder
  //store champ name as answer
  //force input lowercase a-z

  return (
    <div className="bg-[url(/background.png)] h-dvh w-screen bg-cover bg-center p-4 font-display">
      <div
        className="w-full md:w-1/3 h-full grow text-white bg-black/70 border-3 border-league-gold rounded-2xl 
       place-self-center place-items-center flex flex-col gap-4 place-content-start py-4">
        <div className="text-lg">Total Scored All Time:456456465</div>
        <div className="bg-league-gold p-2 text-2xl rounded-lg w-fit max-w-full line-clamp-1 overflow-hidden text-white">
          Score:99999999
        </div>
        <div className="w-2/3 aspect-square overflow-clip rounded-2xl border-2 border-league-gold">
          <img className="size-full aspect-square" src={champImage} />
        </div>
        <label className="text-xl">Who could it be? HINTS</label>
        <div className="rounded-lg bg-neutral-700 w-4/5 lg:w-4/6 flex p-1 place-content-between gap-1">
          <select
            className="rounded-lg w-full grow px-2 lg:w-4/6 flex text-white
          focus:outline-0"
            autoComplete={champlist[0].name}></select>
          <button className="bg-league-gold size-12 place-self-center aspect-square rounded-r-md" />
        </div>
        <div className="grow">
          <Autocomplete />
        </div>
        <button className="bg-destructive p-2 rounded-lg text-xl">
          End Game
        </button>
      </div>
    </div>
  );
}

function Autocomplete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { champs, loading } = useChamps("/dir/to/json", searchTerm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (champ: IChamp) => {
    setSearchTerm(champ.name);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % champs.length);
    }
    if (event.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + champs.length) % champs.length);
    }
    if (event.key === "Enter") {
      setSearchTerm(champs[activeIndex].name);
    }
  };

  return (
    <div>
      <input
        onChange={handleChange}
        onKeyDown={onKeyDown}
        value={searchTerm}
        placeholder="Type champion name..."
      />
      {searchTerm ? (
        <div>
          <ResultList
            results={champs}
            searchTerm={searchTerm}
            loading={loading}
            handleSelect={handleSelect}
            activeIndex={activeIndex}
          />
        </div>
      ) : (
        <div>Start typing to search</div>
      )}
    </div>
  );
}

interface ResultListProps {
  results: IChamp[];
  searchTerm: string;
  loading: boolean;
  handleSelect: (champ: IChamp) => void;
  activeIndex: number;
}

function ResultList({
  results,
  searchTerm,
  loading,
  handleSelect,
  activeIndex,
}: ResultListProps) {
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (results.length === 0) {
    return <div>No results found</div>;
  }
  return (
    <>
      <ol>
        {results.map((result, index) => (
          <li
            key={result.id}
            onClick={() => handleSelect(result)}
            className={activeIndex === index ? "active" : ""}>
            <>
              {matchedTerm(result.name, searchTerm)} <span>{result.tile}</span>
            </>
          </li>
        ))}
      </ol>
    </>
  );
}

function useChamps(url: string, searchTerm?: string) {
  const [champs, setChamps] = useState<IChamp[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!searchTerm) {
      setLoading(false);
      return setChamps([]);
    }

    //Load from chache if possible
    const cachedData = sessionStorage.getItem(`champs_${searchTerm}`);
    if (cachedData) {
      setChamps(JSON.parse(cachedData));
      setLoading(false);
    }
    //Maybe adjust for a json file instead
    const getChamps = setTimeout(async () => {
      try {
        const response = await fetch(url + `?searchTerm=${searchTerm}`);
        const data = await response.json();
        setChamps(data);
        setLoading(false);

        sessionStorage.setItem(`champs_${searchTerm}`, JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(getChamps);
  }, [url, searchTerm]);
  return { champs, loading };
}
