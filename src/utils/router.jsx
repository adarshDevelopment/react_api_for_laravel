
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"

import Layout from "../Pages/Layout"


import OpenRoutes from "./OpenRoutes"
import ProtectedRoutes from "./ProtectedRoutes"

import Home from "../Pages/Home"
import Login from "../Pages/Auth/Login"
import Register from "../Pages/Auth/Register"
import Create from "../Pages/Posts/Create"
import Show from "../Pages/Posts/Show"
import PictureMultipleReact from "../Pages/Pictures/PictureMultipleReact"
import PicturesDropzone from "../Pages/Pictures/PicturesDropzone"
import Update from "../Pages/Posts/Update"
import IndexMultiple from "../Pages/Pictures/IndexMultiple"


export const createAppRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />} >
        <Route index element={<Home />} />

        {/* Open routes */}
        <Route element={<OpenRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='create' element={<Create />} />
          <Route path='posts/update/:id' element={<Update />} />
          <Route path='/posts/:id' element={<Show />} />

          {/* <Route path='/pictures' element={<PicturesIndex />} /> */}
          {/* <Route path='/pictures' element={<PictureIndexMultiple />} /> */}
          {/* <Route path='/pictures' element={<PictureMultipleReact />} /> */}

          <Route path='/pictures' element={<PicturesDropzone />} />
          {/* <Route path='/pictures' element={<IndexMultiple />} /> */}

        </Route>
      </Route>
    )
  )
}

