import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Car, deleteCar, deleteCarWinner } from './Car';
import { baseUrl, CarType, CarWithEngine, startStopCarEngine, useGarage } from './Garage';
import { GenerateCars } from './GenerateCars';
import { NewCar } from './NewCar';
import { Pagination } from './Pagination';
import { UpdateCar } from './UpdateCar';
import { WinnerTitle } from './WinnerTitle';
import { useOutletContext } from 'react-router-dom';

type CreateCarType = {
  name: string,
  color: string,
};

export type PageData = [
  number,  
  React.Dispatch<React.SetStateAction<number>>, 
  CarType, 
  React.Dispatch<React.SetStateAction<CarType>>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
];

export const createCar = async (car: CreateCarType) => {
  const newCarData = await axios.post<CreateCarType, AxiosResponse<CarType>>(baseUrl + 'garage', car);
  return {
    ...newCarData.data,
    isMoving: false,
    isBroken: false,
  };
};


const getLengthGarage = async () => {
  const result = await axios.get(baseUrl + 'garage', { params: { _limit: 7 } });
  return +result.headers['x-total-count'];
};

export const CarList = () => {
  const [currentPage, setCurrentPage, carForUpdate, setCarForUpdate, nameChange, setNameChange, colorChange, setColorChange] = useOutletContext<PageData>();
  const [cars, setCars] = useGarage(currentPage);
  const [leaderboard, setLeaderboard] = useState<CarWithEngine[]>([]);
  const [isStartRace, setIsStartRace] = useState(false);
  const [lengthGarage, setLengthGarage] = useState(0);

  useEffect(() => {
    getLengthGarage().then(setLengthGarage);
  }, []);
  const addCarToLeaderboard = (driverCar: CarWithEngine) => {
    setLeaderboard((oldState) => oldState.concat({ ...driverCar }));
  };
  const handleSetCarForUpdate = (id: number) => {
    const stateCar = cars.find(car => car.id === id);
    if (stateCar) setCarForUpdate(stateCar);
  };
  const updateOldCar = (updateCar: CarType) => {
    setCars(cars.map(car => car.id === updateCar.id ? { ...car, ...updateCar } : car));
  };
  const handleCreateCar = (car: CreateCarType) => {
    createCar(car)
      .then((newCar) => setCars((oldCars) => oldCars.concat(newCar)))
      .then(() => setLengthGarage((old) => old + 1));
  };
  const handleSetCarForDelete = (id: number) => {
    setCars(cars.filter(car => car.id !== id));
    setLengthGarage(old => old - 1);
    deleteCar(id);
    deleteCarWinner(id);
  };
  const startRide = async (id: number) => {
    const engine = await startStopCarEngine(id, 'started');
    setCars((c) => c.map((car) => car.id === id ? { ...car, engine, isMoving: true } : car));
    startStopCarEngine(id, 'drive').catch(() => {
      setCars(c => c.map((car) => car.id === id ? { ...car, isBroken: true } : car));
    });
  };
  const restartRide = async (id: number) => {
    await startStopCarEngine(id, 'stopped');
    setCars((c) => c.map((car) => car.id === id ? { ...car, isMoving: false, isBroken: false } : car));
  };
  const startAllCars = async () => {
    const enginesData = await Promise.all(cars.map(car => startStopCarEngine(car.id, 'started')));
    const carsWithEngines = cars.map((car, carIndex) => ({ ...car, engine: enginesData[carIndex], isMoving: true, isBroken: false, isRestart: false }));
    setCars(carsWithEngines);
    cars.map(car => startStopCarEngine(car.id, 'drive').catch(() => {
      setCars(c => c.map((carError) => carError.id === car.id ? ({ ...carError, isBroken: true }) : carError));
    }));
    setIsStartRace(true);
  };

  const stopAllCars = async () => {
    setCars((oldCars) => oldCars.map((car) => ({ ...car, isBroken: true })));
    cars.forEach(({ id }) => restartRide(id));
    setIsStartRace(false);
    setLeaderboard([]);
  };
  return (
    <div>
      <h1>Катачка</h1>
      <h2>Garage {lengthGarage}</h2>
      <NewCar createCar={handleCreateCar} nameChange={nameChange} setNameChange={setNameChange} colorChange={colorChange} setColorChange={setColorChange}/>
      <UpdateCar carForUpdate={carForUpdate} updateOldCar={updateOldCar} />
      <button disabled={isStartRace} onClick={startAllCars}>Start all</button>
      <button onClick={stopAllCars}>Stop all</button>
      <GenerateCars createCar={handleCreateCar} />
      <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} lengthGarage={lengthGarage}/>
      {cars.map((car) => <Car addCarToLeaderboard={addCarToLeaderboard} isStartRace={isStartRace} car={car} key={car.id} startRide={startRide} restartRide={restartRide} handleSetCarForUpdate={handleSetCarForUpdate} handleSetCarForDelete={handleSetCarForDelete} />)}
      <WinnerTitle leaderboard={leaderboard}/>
    </div>
  );
};


