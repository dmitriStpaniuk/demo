export type PaginationsProps = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  lengthGarage: number
};
export const Pagination = ({ currentPage, setCurrentPage, lengthGarage }: PaginationsProps) => {

  return (
    <div>
      <h1>{currentPage}</h1>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage((old) => old - 1)}>Prev</button>
      <button disabled={lengthGarage / 7 <= currentPage } onClick={() => setCurrentPage((old) => old + 1)}>Next</button>
    </div>
  );
};