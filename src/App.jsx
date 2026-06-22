import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
