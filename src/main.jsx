import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Meetings from './pages/Meetings.jsx'
import Ministries from './pages/Ministries.jsx'
import MinisterioDetalle from './pages/MinisterioDetalle.jsx'
import Cells from './pages/Cells.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Library from './pages/Library.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminMembers from './pages/admin/AdminMembers.jsx'
import AdminCelulas from './pages/admin/AdminCelulas.jsx'
import AdminMinisterios from './pages/admin/AdminMinisterios.jsx'
import AdminBlog from './pages/admin/AdminBlog.jsx'
import AdminLibrary from './pages/admin/AdminLibrary.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<About />} />
          <Route path="/reuniones" element={<Meetings />} />
          <Route path="/ministerios" element={<Ministries />} />
          <Route path="/ministerios/:id" element={<MinisterioDetalle />} />
          <Route path="/celulas" element={<Cells />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/biblioteca" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/miembros" element={<AdminMembers />} />
            <Route path="/admin/celulas" element={<AdminCelulas />} />
            <Route path="/admin/ministerios" element={<AdminMinisterios />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/biblioteca" element={<AdminLibrary />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
