import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseUrl, CarWithEngine } from './Garage';
type WinnerTitleProps = {
  leaderboard: CarWithEngine[],
};
export type WinnerType = {
  name?: string;
  color?: string;
  id: number,
  wins: number,
  time: number
};

const getWinners = async () => axios.get<WinnerType[]>(baseUrl + 'winners');
const createWinner = async (winner: WinnerType) => axios.post<string>(baseUrl + 'winners', winner);
const editWinner = async (winner: WinnerType) => axios.put<string>(`${baseUrl}winners/${winner.id}`, winner);

const sendWinner = async ({ id, wins, time }: WinnerType) => {
  const a = await getWinners();
  const existingWinner = a.data.find(win => win.id === id);
  if (existingWinner) {
    editWinner({ id, wins: existingWinner.wins + 1, time: Math.min(time, existingWinner.time) });
  } else {
    createWinner({ id, wins, time });
  }
};

export const WinnerTitle = ({ leaderboard }: WinnerTitleProps) => {
  const [win, setwin] = useState<WinnerType | null>(null);
  const [active, setActive] = useState(false);
  if (leaderboard[0] && leaderboard[0].engine) {
    const sec = (((leaderboard[0].engine.distance / leaderboard[0].engine.velocity) % 60000) / 1000).toFixed(3);
    if (leaderboard[0].id !== win?.id) {
      setwin({
        id: leaderboard[0].id,
        wins: 1,
        time: +sec,
      });
    }
  }
  
  useEffect(() => {
    if (win) {
      setActive(true);
      sendWinner(win);
    }
  }, [win]);

  useEffect(() => {
    if (leaderboard.length === 0) setwin(null);
  }, [leaderboard]);

  return (
    <div >
      
        <div className={active ? 'modal active' : 'modal'} onClick={() => setActive(false)}>
          <div className='modal-content' >
            <span className='name-winner'>Победитель {leaderboard[0]?.name}</span>
            <span className='time-winner'> {win?.time} sec</span>
          </div>
        </div>
      
    </div >
  );
};