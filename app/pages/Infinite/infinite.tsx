import { useEffect, useState } from "react";
import champs from "/app/veri.json";

interface champion {
  champs: {
    champname: string;
    champimages: string[];
  }[];
}

export default function InfinitePage() {
  const [champName, setChampName] = useState<string>();
  const [champImage, setChampImage] = useState<string>();

  const champlist: champion = champs;
  const max = champlist.champs.length;
  const imagePrefix = "/app/champs/";

  function selectChamp() {
    const randNum = getRandomInt(0, max);
    setChampName(champlist.champs[randNum].champname);
    const randImg = getRandomInt(
      0,
      champlist.champs[randNum].champimages.length
    );
    setChampImage(
      imagePrefix +
        champlist.champs[randNum].champname +
        "/" +
        champlist.champs[randNum].champimages[randImg]
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
          <input
            className="rounded-lg w-full grow px-2 lg:w-4/6 flex text-white
          focus:outline-0"
            type="text"
            placeholder="Type champion name..."></input>
          <button className="bg-league-gold size-12 place-self-center aspect-square rounded-r-md" />
        </div>
        <div className="grow" />
        <button className="bg-destructive p-2 rounded-lg text-xl">
          End Game
        </button>
      </div>
    </div>
  );
}
