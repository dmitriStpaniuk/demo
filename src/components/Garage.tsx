import axios from 'axios';
import { useEffect, useState } from 'react';
export const baseUrl = 'http://localhost:3000/';

type EngineStatus = 'started' | 'stopped' | 'drive';

type Engine = {
  velocity: number;
  distance: number;
};
export type CarType = {
  name: string,
  color: string,
  id:number,
};

export type CarWithEngine = CarType & { engine?: Engine, isMoving: boolean, isBroken:boolean };

const getCars = async (page: number)=>{
  const response = await axios.get<CarType[]>(baseUrl + 'garage', { params: { _page: page, _limit : 7 } } );
  return response.data.map(car => ({ ...car, isMoving: false, isBroken: false }));
};

export const startStopCarEngine = async (id: number, status: EngineStatus) => {
  const response = await axios.patch<Engine>(
    baseUrl + 'engine',
    {},
    { params: { id, status } },
  );
  return response.data;
};

export const useGarage = (currentPage: number)=>{
  const [cars, setCars] = useState<CarWithEngine[]>([]);
  
  useEffect(()=>{
    getCars(currentPage).then(setCars);
  }, [currentPage]);

  return  [cars, setCars] as [CarWithEngine[], React.Dispatch<React.SetStateAction<CarWithEngine[]>>];
  
};