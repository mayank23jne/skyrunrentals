import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { Mail, Headphones, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackToTop from '../components/BackToTop';
import bannerImg from '../assets/banner_bg.jpg';
import api from '../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSuccessMsg('');
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await api.post('/admin/contacts/submit', formData);
      setSuccessMsg('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', address: '', message: '' });
      setErrors({});
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMsg('Failed to send message. Please try again later.');
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero Banner */}
      <section className="contact-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bannerImg})` }}>
        <div className="container">
          <h1 className="hero-title">Contact</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span className="active">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <MapPin size={28} />
              </div>
              <h3>Our Location</h3>
              <p>2029 Century Park East, Suite 400N, Los Angeles, CA 90067</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Mail size={28} />
              </div>
              <h3>Email Us</h3>
              <p>info@skyrunrentals.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Headphones size={28} />
              </div>
              <h3>Phone Number</h3>
              <p>+1 603-333-8490</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="contact-form-map-section">
        <div className="container">
          <div className="form-map-grid">
            {/* Map Column */}
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3225.568341680573!2d-115.1752174234125!3d36.06144880918731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c946f0411a7b%3A0xe541c9f4d76f8e7b!2s3600%20Las%20Vegas%20Blvd%20S%2C%20Las%20Vegas%2C%20NV%2089109!5e0!3m2!1sen!2sus!4v1715598000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>

            {/* Form Column */}
            <div className="form-wrapper">
              <div className="section-header">
                <span className="section-subtitle">Get in Touch</span>
                <h2 className="section-title">Send us a Message</h2>
              </div>

              {successMsg && (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, border: '1px solid #fecaca', textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" placeholder="Name" value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); setErrors(prev => ({ ...prev, name: '' })); }} className={errors.name ? 'input-error' : ''} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Email" value={formData.email} onChange={e => { setFormData({ ...formData, email: e.target.value }); setErrors(prev => ({ ...prev, email: '' })); }} className={errors.email ? 'input-error' : ''} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                </div>

                <div className="form-group full">
                  <textarea placeholder="Message" rows={5} value={formData.message} onChange={e => { setFormData({ ...formData, message: e.target.value }); setErrors(prev => ({ ...prev, message: '' })); }} className={errors.message ? 'input-error' : ''}></textarea>
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <div className="form-submit">
                  <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Sending...' : 'Send Message'} {!isSubmitting && <Send size={18} />}
                  </button>
                </div>
              </form>
            </div>


          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />

      <style>{`
        .contact-page {
          background-color: #ffffff;
          padding-top: 135px;
        }
        @media (max-width: 992px) {
          .contact-page {
            padding-top: 10px !important;
          }
        }


        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Banner Styles */
        .contact-hero {
          height: 335px;
          background-size: cover;
          background-position: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ffffff;
          position: relative;
          padding: 120px 0;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
          font-family: var(--titlefont);
          letter-spacing: -1px;
        }

        .breadcrumb {
          background: #2e80ec;
          padding: 10px 30px;
          border-radius: 50px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 16px;
          color: #ffffff;
        }

        .breadcrumb a {
          color: #ffffff;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .breadcrumb a:hover {
          opacity: 0.8;
        }

        .breadcrumb .active {
          color: #ffffff;
          opacity: 0.9;
        }

        /* Info Cards Styles */
        .contact-info-section {
          padding: 100px 0 50px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .info-card {
          background: #f8fafc;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .info-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          background: #ffffff;
          border-color: #2e80ec;
        }

        .info-icon {
          width: 70px;
          height: 70px;
          background: rgba(46, 128, 236, 0.1);
          color: #2e80ec;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          transition: all 0.3s ease;
        }

        .info-card:hover .info-icon {
          background: #2e80ec;
          color: #ffffff;
        }

        .info-card h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #1e293b;
          font-family: var(--titlefont);
        }

        .info-card p {
          color: #64748b;
          line-height: 1.6;
          font-weight: 500;
        }

        /* Form & Map Section Styles */
        .contact-form-map-section {
          padding: 50px 0 100px;
        }

        .form-map-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: stretch;
        }

        .form-wrapper {
          background: #ffffff;
          padding: 50px;
          border-radius: 30px;
          box-shadow: 0 30px 60px rgba(57, 84, 204, 0.05);
          border: 1px solid #2f80ec;
        }

        .map-wrapper {
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          min-height: 500px;
        }

        .section-header {
          margin-bottom: 40px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 18px 25px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          font-family: var(--titlefont);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #2e80ec;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(46, 128, 236, 0.1);
        }

        .input-error {
          border-color: #dc2626 !important;
        }

        .field-error {
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
          margin-top: 5px;
          display: block;
        }

        .submit-btn {
          background: #fe9d3d;
          color: #ffffff;
          padding: 18px 45px;
          border-radius: 99px;
          font-size: 18px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #e68a30;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(254, 157, 61, 0.3);
        }

        @media (max-width: 992px) {
          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-map-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 42px; }
          .info-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .form-wrapper { padding: 40px 25px; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
