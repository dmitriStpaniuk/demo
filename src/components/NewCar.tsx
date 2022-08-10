// import { useState } from 'react';

export type NewCarProps = {
  createCar: (car: { name: string, color: string }) => void,
  nameChange:string,
  colorChange:string,
  setNameChange:(e:HTMLInputElement['value'])=>void,
  setColorChange:(e:HTMLInputElement['value'])=>void
};

export const NewCar = ({ createCar, nameChange, setNameChange, colorChange, setColorChange }: NewCarProps) => {
  return (
    <div className='input__wrapper'>
      <input type="text" name="name" onChange={e => setNameChange(e.target.value)} value={nameChange } />
      <input type='color' onChange={e => setColorChange(e.target.value)} value={colorChange}/>
      <button onClick={() => {
        createCar({
          name: nameChange,
          color: colorChange,
        });
      }}>Create</button>
    </div>
  );
};
