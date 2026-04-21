/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import AddEvent from './components/AddEvent'
import Register from './components/Register'
import { ProtectedRoute } from './components/ProtectedRoute'
import EventDetails from './components/EventDetails'
import Profile from './components/Profile'
import EditEvent from './components/EditEvent'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home/>}/>
    <Route path='/add-event' element={<ProtectedRoute><AddEvent/></ProtectedRoute>}/>
    <Route path='/event/:id/edit' element={<ProtectedRoute><EditEvent/></ProtectedRoute>}/>
    <Route path='register' element={<ProtectedRoute><Register/></ProtectedRoute>}/>  
    <Route path='event/:id' element={<EventDetails/>}/>
    <Route path='profile/:id' element={<Profile/>}/>
  </Route>
)

export default routes
