import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Mail, Phone, BarChart2, Send, Lock, AlertTriangle, EyeOff, MessageSquare } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const points = [
    {
      id: 1,
      icon: <Database size={22} />,
      title: "COLLECTION OF INFORMATION AND IT'S PROTECTION",
      paragraphs: [
        "We collect information like email addresses or other personal information required for authentication of property owners. This information is either collected through email communication or a direct phone call. This information is strictly used for owner identification and future correspondences only. We do not get involved in any information selling processes. Privacy of the information is our first priority.",
        "Entire property details, photos and other information is provided by the property owners. holidayhavenhomes.com is not responsible for any data duplicacy or authenticity as it is owners copyright and their responsibilty."
      ]
    },
    {
      id: 2,
      icon: <Mail size={22} />,
      title: "EMAIL MARKETING & MESSAGES",
      paragraphs: [
        "We do not entertain spamming and are strictly against it. All our email messages and promotions are either to our registered owners or travelers that inquire on a property and those who have subscribed for our newsletter to receive such promotions. If you do not wish to receive emails or promotions from us, please contact SUPPORT"
      ]
    },
    {
      id: 3,
      icon: <Phone size={22} />,
      title: "TELEPHONE CALLS",
      paragraphs: [
        "In addition to collecting data online, we may also speak to our users on phone. This can either be for customer support or any promotional marketing which we want to explain to our users. If you wish to unsubscribe from these calls, please contact us at SUPPORT or inform the telephone representative about the same. We follow strict DNC rules."
      ]
    },
    {
      id: 4,
      icon: <BarChart2 size={22} />,
      title: "SURVEYS",
      paragraphs: [
        "We do feedback surveys from time to time and we request users to input their valuable comments on our services or their experience with us. The decision to answer the survey is solely with the user. User may or may not fill in the details depending on their discretion."
      ]
    },
    {
      id: 5,
      icon: <Send size={22} />,
      title: "RENTAL INQUIRIES",
      paragraphs: [
        "Travelers send inquiries through email contact forms on listing pages. Once a traveler choose to send an inquiry, he/she should understand that the personal information filled in the form, like email, phone and other information, will be shared with the property owner. We request users not to enter any financial information like credit card numbers or bank account information in our email contact forms."
      ]
    },
    {
      id: 6,
      icon: <Lock size={22} />,
      title: "SECURITY OF INFORMATION",
      paragraphs: [
        "Guarantee valid for new listings from first time advertisers purchased from 16th March 2015 at 9 a.m. GMT (Greenwich Mean Time)."
      ]
    },
    {
      id: 7,
      icon: <AlertTriangle size={22} />,
      title: "PHISHING OR FALSE EMAILS",
      paragraphs: [
        "If you receive an unsolicited email requesting personal information like credit card, bank account, date of birth or even your account credentials with us, please be informed that this must be from someone trying to gain access to your information unlawfully. We do not request for such information in emails. Please contact SUPPORT if you receive something like this."
      ]
    },
    {
      id: 8,
      icon: <EyeOff size={22} />,
      title: "OPTING OUT OF RECEIVING MARKETING MESSAGES",
      paragraphs: [
        "As a part of marketing, we may contact you through email or phone.",
        "You can opt out of these marketing communications by following ways -: Contact us at SUPPORT"
      ]
    },
    {
      id: 9,
      icon: <MessageSquare size={22} />,
      title: "CONTACT US",
      paragraphs: [
        "If you have any questions about our Terms & Conditions, Privacy Policy, Process of marketing etc, you may contact us at SUPPORT."
      ]
    }
  ];

  // Helper function to replace "SUPPORT" string with a styled link
  const renderParagraph = (text: string) => {
    if (text.includes("SUPPORT")) {
      const parts = text.split("SUPPORT");
      return (
        <>
          {parts[0]}
          <a href="mailto:info@holidayhavenhomes.com" className="support-link">
            SUPPORT (info@holidayhavenhomes.com)
          </a>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <div className="policy-page">
      <Navbar />

      <main className="policy-main">
        
        {/* Sleek Minimal Header */}
        <section className="policy-hero">
          <div className="hero-mesh-overlay">
            <div className="policy-blob-indigo" />
            <div className="policy-blob-cyan" />
          </div>
          <div className="container policy-hero-content">
            <div className="policy-badge">
              <ShieldCheck size={14} className="policy-badge-icon" />
              <span>Trust & Safety Portal</span>
            </div>
            <h1 className="policy-title">Privacy & Policy</h1>
            <p className="policy-subtitle">
              Please read our core privacy guidelines to understand how Holiday Haven Homes collects, utilizes, and secures your platform information.
            </p>
            <div className="policy-meta">
              <span>Effective Date: March 16, 2015</span>
              <span className="meta-divider">•</span>
              <span>Updated: May 18, 2026</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="policy-content-section">
          <div className="container policy-container-centered">
            
            {/* Direct Stack of Cards */}
            <div className="policy-clauses-wrapper">
              {points.map((point, index) => (
                <motion.div
                  key={point.id}
                  className="policy-clause-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <div className="clause-header">
                    <div className="clause-header-left">
                      <span className="clause-number-badge">
                        {String(point.id).padStart(2, '0')}
                      </span>
                      <span className="clause-header-icon">{point.icon}</span>
                      <h2 className="clause-title">{point.title}</h2>
                    </div>
                  </div>
                  <div className="clause-body">
                    {point.paragraphs.map((pText, pIdx) => (
                      <p key={pIdx}>
                        {renderParagraph(pText)}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

      </main>

      <Footer />
      <BackToTop />

      <style>{`
        .policy-page {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #334155;
          overflow-x: hidden;
        }

        .policy-main {
          padding-bottom: 100px;
        }

        /* 1. Policy Hero */
        .policy-hero {
          position: relative;
          padding: 180px 0 90px;
          background: #0f172a; /* Sleek dark theme */
          color: #ffffff;
          overflow: hidden;
          text-align: center;
        }

        .hero-mesh-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .policy-blob-indigo {
          position: absolute;
          width: 320px;
          height: 320px;
          background: rgba(59, 130, 246, 0.15);
          filter: blur(120px);
          top: -20px;
          left: 15%;
          border-radius: 50%;
        }

        .policy-blob-cyan {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(249, 115, 22, 0.08);
          filter: blur(120px);
          bottom: -30px;
          right: 15%;
          border-radius: 50%;
        }

        .policy-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .policy-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #93c5fd;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .policy-badge-icon {
          color: #93c5fd;
        }

        .policy-title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #ffffff 60%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .policy-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 650px;
          margin: 0 auto 25px;
        }

        .policy-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .meta-divider {
          color: #475569;
        }

        /* 2. Content Layout centered container */
        .policy-content-section {
          padding: 70px 0;
        }

        .policy-container-centered {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 3. Detailed Clauses Stack */
        .policy-clauses-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .policy-clause-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 35px 40px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.015);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .policy-clause-card:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.25);
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.03);
        }

        .clause-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1.5px dashed #f1f5f9;
        }

        .clause-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .clause-number-badge {
          font-size: 0.85rem;
          font-weight: 800;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.08);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .clause-header-icon {
          color: #64748b;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .policy-clause-card:hover .clause-header-icon {
          color: #3b82f6;
        }

        .clause-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.4px;
          line-height: 1.4;
        }

        .clause-body {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #475569;
        }

        .clause-body p {
          margin-top: 0;
          margin-bottom: 14px;
        }

        .clause-body p:last-child {
          margin-bottom: 0;
        }

        /* Styled Actionable Support Mailto Links */
        .support-link {
          color: #3b82f6;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1.5px solid rgba(59, 130, 246, 0.25);
          transition: all 0.2s ease;
          padding: 0 2px;
        }

        .support-link:hover {
          color: #1d4ed8;
          border-bottom-color: #1d4ed8;
          background: rgba(59, 130, 246, 0.04);
          border-radius: 4px;
        }

        /* Responsive Layouts */
        @media (max-width: 768px) {
          .policy-hero {
            padding: 140px 0 70px;
          }
          .policy-title {
            font-size: 2.25rem;
          }
          .policy-subtitle {
            font-size: 0.975rem;
          }
          .policy-clause-card {
            padding: 24px;
          }
          .clause-title {
            font-size: 1.05rem;
          }
          .clause-header-left {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
