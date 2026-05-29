import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import About from './pages/About';
import Cars from './pages/Cars';
import Flights from './pages/Flights';
import ListProperty from './pages/ListProperty';
import Listing from './pages/Listing';
import PropertyDetail from './pages/PropertyDetail';
import FAQ from './pages/FAQ';
import LiabilityInsurance from './pages/LiabilityInsurance';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Payment from './pages/Payment';
import ResetPassword from './pages/ResetPassword';
import TestimonialsPage from './pages/TestimonialsPage';
import ScrollToTop from './components/ScrollToTop';
import { AuthModalProvider } from './context/AuthModalContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/listing" element={<Listing />} />
              <Route path="/listing/countries/:propertyId" element={<Listing />} />
              <Route path="/listing/states/:propertyId" element={<Listing />} />
              <Route path="/listing/cities/:propertyId" element={<Listing />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/liability-insurance" element={<LiabilityInsurance />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            </Routes>
          </BrowserRouter>
        </AuthModalProvider>
        </AuthProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
