import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import { useState } from 'react'
import ContactUs from './components/ContactUs'
import Footer from './components/Footer'

function App() {
  const [showContactModal, setShowContactModal] = useState(false);
  const location = useLocation();

  return (
    <>
      <Navbar onOpenContact={() => setShowContactModal(true)}/>
      <Outlet/>
      {location.pathname !== '/pg' && <Footer />}
      
      {/* Global Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
          <ContactUs onClose={() => setShowContactModal(false)} />
        </div>
      )}
    </>
  )
}

export default App
