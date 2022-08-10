import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';


function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [carForUpdate, setCarForUpdate] = useState();
  const [nameChange, setNameChange] = useState();
  const [colorChange, setColorChange] = useState('#ffff00');
  return (
    <div className='App'>
      <button>
        <Link to='/garage'>Garage</Link>
      </button>
      <button>
        <Link to='/winner'>Winner</Link>
      </button>
      <div >
        <Outlet context={
          [
            currentPage, 
            setCurrentPage, 
            carForUpdate, 
            setCarForUpdate, 
            nameChange, 
            setNameChange, 
            colorChange, 
            setColorChange,
          ]} />
      </div>

    </div>
  );
}

export default App;