/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home/>}/>  
  </Route>
)

export default routes
