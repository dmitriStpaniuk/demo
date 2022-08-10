import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import '../css/car.css';
import { baseUrl, CarWithEngine } from './Garage';
import { SvgComponent } from './SvgComponent';

export type CarsType = {
  car: CarWithEngine;
  startRide: (id: number) => void,
  restartRide: (id: number) => Promise<void>;
  handleSetCarForUpdate: (id: number) => void
  handleSetCarForDelete: (id: number) => void
  isStartRace: boolean
  addCarToLeaderboard: (name: CarWithEngine) => void
};

export type EngineData = {
  velocity: number;
  distance: number;
};

export const deleteCar = async (id: number) => {
  await axios.delete(baseUrl + `garage/${id}`);
};
export const deleteCarWinner = async (id: number) => {
  await axios.delete(baseUrl + `winners/${id}`);
};
export const Car = ({ addCarToLeaderboard, car, startRide, restartRide, handleSetCarForUpdate, handleSetCarForDelete, isStartRace }: CarsType) => {
  const [isRestartDisabled, setIsRestartDisabled] = useState(true);
  const carRef = useRef<CarWithEngine>(car);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setIsRestartDisabled(!car.isMoving);
  }, [car]);

  useEffect(() => {
    if (isStartRace && car.engine) {
      timer.current = setTimeout(() => {

        if (!carRef.current.isBroken) addCarToLeaderboard(car);

      }, car.engine.distance / car.engine.velocity);
    }
    if (!isStartRace && timer.current) {
      clearTimeout(timer.current);
    }
    return () => clearTimeout(timer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car, isStartRace]);

  useEffect(() => {
    carRef.current = car;
  }, [car]);

  return (
    <div className="post">
      <div className="post-content">
        <div>
          <strong>
            {car.id}. {car.name}{' '}
          </strong>
          <button disabled={car.isMoving} onClick={() => startRide(car.id)}>S</button>
          <button disabled={isRestartDisabled} onClick={() => {
            setIsRestartDisabled(true);
            restartRide(car.id).then(() => setIsRestartDisabled(false));
          }}>D</button>
          <button onClick={() => handleSetCarForUpdate(car.id)}>select</button>
          <button onClick={() => handleSetCarForDelete(car.id)}>delete</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SvgComponent
            engineData={car.engine}
            carColor={car.color}
            isBroken={car.isBroken}
            isMoving={car.isMoving}
          />
          <div className='finish'>F</div>
        </div>
      </div>
    </div>
  );
};

