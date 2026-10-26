import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import WhatsAppFAB from './components/WhatsAppFAB.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-secondary text-carbon">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
