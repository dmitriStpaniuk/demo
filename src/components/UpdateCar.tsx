
import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseUrl, CarType } from './Garage';

type UpdateCarType = {
  id: number;
  name:string,
  color:string,
  
};

type UpdateCarProps = {
  carForUpdate: CarType | null;
  updateOldCar:(car: CarType)=>void
};

const updateCar = async ({ name, color, id }: UpdateCarType)=>{
  await axios.put(baseUrl + `garage/${id}`, { name, color });
};

export const UpdateCar = ({ carForUpdate, updateOldCar }: UpdateCarProps) => {
  const [nameChange, setNameChange] = useState('');
  const [colorChange, setColorChange] = useState('');
  useEffect(() => {
    setNameChange(carForUpdate?.name || '');
    setColorChange(carForUpdate?.color || '#0055ff');
  }, [carForUpdate]);

  return (
    <div className='input__wrapper'>
      <input type="text" name="name" onChange={e => setNameChange(e.target.value)} value={nameChange}/>
      <input type='color' onChange={e => setColorChange(e.target.value)} value={colorChange}/>
      <button onClick={() => {
        updateCar({
          name: nameChange,
          color: colorChange,
          id: carForUpdate?.id || 1,
        }).then(()=>updateOldCar({
          name: nameChange,
          color: colorChange,
          id: carForUpdate?.id || 1,
        }));
      }}>Update</button>
    </div>
  );
};
