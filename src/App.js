import './App.css';
import Navbar from './components/Navbar';
import Login from "./components/Login";
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Bookmarks from './components/Bookmarks';
import Offers from './components/Offers';
import { ToastContainer } from 'react-toastify';
import Main from './components/Main';
import Product from './components/Product';
import NotFoundPage from './components/NotFoundPage';

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Main />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/products/add' element={<Products />} />
          <Route path='/bookmarks' element={<Bookmarks />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/products/edit/:id' element={<Products />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;