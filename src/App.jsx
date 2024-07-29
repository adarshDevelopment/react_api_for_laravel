
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Pages/Layout'
import Home from './Pages/Home'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'
import { useContext } from 'react'
import { AppContext } from './Context/AppContext'


function App() {

  const { user } = useContext(AppContext);
  console.log('user from app: ', user);

  return <BrowserRouter>
    <Routes>

      <Route path='/' element={<Layout />} >

        <Route index element={<Home />} />

        <Route path='/register' element={user ? <Home /> : <Register />} />
        <Route path='/login' element={user ? <Home /> : <Login />} />



      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
