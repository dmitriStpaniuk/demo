import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CarList } from './components/CarList';
import { WinnerPage } from './components/WinnerPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(

  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='garage' element={<CarList />} />
        <Route path='winner' element={<WinnerPage />} />
        <Route path="/" element={<Navigate to="/garage" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
 
);

