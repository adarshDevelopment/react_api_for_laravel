import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './Context/AppContext'

/*
  Note:
    Since useContext hook cant be used outside jsx/react function, we create function object of useContext inside App functio and then pass it to the user defined function
*/
// import createAppRouter from './utils/router'
// import { createAppRouter } from './utils/router';
import { createAppRouter } from './utils/router';

function App() {

  const { user, loading } = useContext(AppContext);
  const router = createAppRouter();
  // console.log('user from app: ', user);

  return (
    <>
      <RouterProvider router={router}>

      </RouterProvider>
    </>
  )
}

export default App
