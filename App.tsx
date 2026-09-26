import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
import PackageDetails from './pages/PackageDetails';
import MyBookings from './pages/MyBookings';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import { PackageProvider } from './contexts/PackageContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { AuditLogProvider } from './contexts/AuditLogContext';
import { BookingProvider } from './contexts/BookingContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <CurrencyProvider>
        <PackageProvider>
          <ReviewProvider>
            <AuthProvider>
              <BookingProvider>
                <AuditLogProvider>
                  <PaymentProvider>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/destinations" element={<Destinations />} />
                          <Route path="/packages" element={<Packages />} />
                          <Route path="/packages/:id" element={<PackageDetails />} />
                          <Route path="/my-bookings" element={<MyBookings />} />
                          <Route path="/gallery" element={<Gallery />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/payment" element={<Payment />} />
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route 
                            path="/admin/dashboard" 
                            element={
                              <ProtectedRoute>
                                <AdminDashboard />
                              </ProtectedRoute>
                            } 
                          />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </PaymentProvider>
                </AuditLogProvider>
              </BookingProvider>
            </AuthProvider>
          </ReviewProvider>
        </PackageProvider>
      </CurrencyProvider>
    </HashRouter>
  );
};

export default App;