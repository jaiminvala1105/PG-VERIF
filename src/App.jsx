import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import Footer from './components/Footer'

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Outlet/>
      {location.pathname !== '/pg' && <Footer />}
    </>
  )
}

export default App
