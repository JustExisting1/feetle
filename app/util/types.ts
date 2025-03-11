export interface IChamp {
  id: number;
  name: string;
  tile: string;
  images: string[];
}

export interface ResultListProps {
  results: IChamp[];
  searchTerm: string;
  handleSelect: (champ: IChamp) => void;
  activeIndex: number;
}