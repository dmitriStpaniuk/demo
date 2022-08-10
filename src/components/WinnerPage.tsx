import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseUrl } from './Garage';
import { SvgTelega } from './SvgTelega';
import { WinnerType } from './WinnerTitle';

type SortInfo = {
  field: keyof WinnerType,
  order: 'ASC' | 'DESC'
};
type GetCarsParams = {
  page: number;
  field: keyof WinnerType | null
  order: 'ASC' | 'DESC' | null
}; 


const allCars = async (id: number) => {
  return (await axios.get(baseUrl + 'garage/' + id)).data;
};
export const WinnerPage = () => {
  const [win, setWin] = useState<WinnerType[]>([]);
  const [winLength, setWinLength] = useState<WinnerType[]>([]);
  const [sortInfo, setSortInfo] = useState<SortInfo | null>(null);
  const [count, setCount] = useState(1);
  const lenggthCars = async () => {
    const length = await (await axios.get(baseUrl + 'winners')).data;
    setWinLength(length);
  };

  const allCarsWin = async ({ page, field, order }: GetCarsParams) => {
    const winWithParam = await (await axios.get(baseUrl + 'winners', {
      params: {
        _limit: 10,
        _page: page,
        _sort: field,
        _order: order,
      },
    })).data;
    const winCarsForUnited = await Promise.all(winWithParam.map((w: { id: number; }) => allCars(w.id)));
    const winFullParmCar = winWithParam.map((winCar: WinnerType, winIndex: number) => ({ ...winCar, ...winCarsForUnited[winIndex] }));
    setWin(winFullParmCar);
  };

  useEffect(() => { lenggthCars(); }, []);

  const handleSort = (field: keyof WinnerType) => {
    if (sortInfo?.order === 'ASC') {
      setSortInfo({ field, order: 'DESC' });
    } else {
      setSortInfo({ field, order: 'ASC' });
    }
  };

  useEffect(() => {
    allCarsWin({ page: count, order: sortInfo?.order || 'ASC', field: sortInfo?.field || 'id' });
  }, [count, sortInfo]);

  const increment = () => { setCount(count + 1); };
  const decrement = () => { setCount(count - 1); };
  return (
    <div>
      <div>Winners {winLength.length}</div>
      <div className="container-winner">
        <h1>Пагес {String(count)}</h1>
        <div className="label-winner">
          <div>Number</div>
          <div>Car</div>
          <div>Name</div>
          <button onClick={() => handleSort('wins')}>Wins</button>
          <button onClick={() => handleSort('time')}>Best time</button>
        </div>
        {win.map((w, index) =>
          <div className="item-winner" key={w.id}>
            <div>{(index - 9) + count * 10}</div>
            <div>
              <SvgTelega color={w.color || ''} />
            </div>
            <div>{w.name}</div>
            <div>{w.wins}</div>
            <div>{w.time} sec</div>
          </div>)
        }
        <button disabled={count === 1} onClick={decrement}>prev</button>
        <button disabled={count >= (winLength.length / 10)  } onClick={increment}>next</button>
      </div>
    </div>
  );
};