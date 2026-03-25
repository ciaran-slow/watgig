/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import AddEvent from './components/AddEvent'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home/>}/>
    <Route path='/add-event' element={<AddEvent/>}/>    
  </Route>
)

export default routes
