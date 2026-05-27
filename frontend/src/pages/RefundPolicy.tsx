import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ClipboardList, AlertOctagon, Lock, Clock } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  const points = [
    {
      id: 1,
      icon: <ShieldCheck size={22} />,
      title: "MONEY BACK GUARANTEE",
      paragraphs: [
        "We guarantee you at least 3 - 8 confirmed bookings which if does not happen within your subscription period, you may either take a refund or choose to stay with us for lifetime."
      ]
    },
    {
      id: 2,
      icon: <Mail size={22} />,
      title: "NOTIFYING US ABOUT CLAIM",
      paragraphs: [
        "You must contact our Customer Support team using the contact form, quoting \"Money Back Guarantee\" in the subject line within the thirty(30) day period prior to the end of the twelve(12) month term of your listing to make a request for refund under the Money Back Guarantee."
      ]
    },
    {
      id: 3,
      icon: <ClipboardList size={22} />,
      title: "QUALIFICATIONS",
      paragraphs: [
        "The Money Back Guarantee is available only for the first property advertised on the site by a new advertiser. Existing advertisers who add a new property do not qualify. To qualify, advertisers must meet the following additional criteria:"
      ],
      listItems: [
        "Property must be available for rent at least Six(6) months during the twelve(12) month listing cycle",
        "The guarantee is not valid if the property is sold during the listing period or is leased on a long let basis for more than 3 months",
        "Rental rates must be displayed on the listing at least twelve(12) months in advance of open dates",
        "Listing must have a minimum of 7 photos provided on site",
        "Listing must be 90% complete based on the fields provided in listing build",
        "Guarantee valid for the annual subscription fee of our standard advert, as paid at the time of order."
      ]
    },
    {
      id: 4,
      icon: <AlertOctagon size={22} />,
      title: "RESTRICTIONS",
      paragraphs: [
        "If after eleven(11) months of advertising on our site, you have failed to receive atleast 3 - 8 confirmed booking through our site, you may request a refund, knowing that:"
      ],
      listItems: [
        "You will be excluded from advertising the property again on the site",
        "You will not be eligible for a “Money Back Guarantee” offer on any other Associated, Inc. site",
        "This offer is limited to one refund per advertiser (regardless of the number of accounts used by the advertiser)"
      ]
    },
    {
      id: 5,
      icon: <Lock size={22} />,
      title: "VERIFICATION OF REQUESTS FOR REFUND",
      paragraphs: [
        "All requests for refund are subject to verification by our company will not verify any request that it believes, in its sole discretion, is made fraudulently or in bad faith. Verified requests will receive a credit to the credit card used for the purchase of the listing within approximately fifteen(15) days of verification."
      ]
    },
    {
      id: 6,
      icon: <Clock size={22} />,
      title: "VALID DATES",
      paragraphs: [
        "Guarantee valid for new listings from first time advertisers purchased from 16th March 2015 at 9 a.m. GMT (Greenwich Mean Time)."
      ]
    }
  ];

  // Helper function to replace "Customer Support team" with a mailto link
  const renderParagraph = (text: string) => {
    if (text.includes("Customer Support team")) {
      const parts = text.split("Customer Support team");
      return (
        <>
          {parts[0]}
          <a href="mailto:info@holidayhavenhomes.com" className="support-link">
            Customer Support team (info@holidayhavenhomes.com)
          </a>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <div className="refund-page">
      <Navbar />

      <main className="refund-main">
        
        {/* Sleek Minimal Header */}
        <section className="refund-hero">
          <div className="hero-mesh-overlay">
            <div className="refund-blob-indigo" />
            <div className="refund-blob-cyan" />
          </div>
          <div className="container refund-hero-content">
            <div className="refund-badge">
              <ShieldCheck size={14} className="refund-badge-icon" />
              <span>Advertiser Security Guarantee</span>
            </div>
            <h1 className="refund-title">Refund Policy</h1>
            <p className="refund-subtitle">
              Learn about our 12-month Money Back Guarantee, qualification checklists, and verification procedures for advertisers.
            </p>
            <div className="refund-meta">
              <span>Effective Date: March 16, 2015</span>
              <span className="meta-divider">•</span>
              <span>Updated: May 18, 2026</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="refund-content-section">
          <div className="container refund-container-centered">
            
            {/* Direct Stack of Cards */}
            <div className="refund-clauses-wrapper">
              {points.map((point, index) => (
                <motion.div
                  key={point.id}
                  className="refund-clause-card"
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

                    {/* Sub-Lists */}
                    {point.listItems && (
                      <ul className="refund-list">
                        {point.listItems.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <span className="list-marker-index">{itemIdx + 1}.</span>
                            <span className="list-item-content">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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
        .refund-page {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #334155;
          overflow-x: hidden;
        }

        .refund-main {
          padding-bottom: 100px;
        }

        /* 1. Refund Hero */
        .refund-hero {
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

        .refund-blob-indigo {
          position: absolute;
          width: 320px;
          height: 320px;
          background: rgba(59, 130, 246, 0.15);
          filter: blur(120px);
          top: -20px;
          left: 15%;
          border-radius: 50%;
        }

        .refund-blob-cyan {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(249, 115, 22, 0.08);
          filter: blur(120px);
          bottom: -30px;
          right: 15%;
          border-radius: 50%;
        }

        .refund-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .refund-badge {
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

        .refund-badge-icon {
          color: #93c5fd;
        }

        .refund-title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #ffffff 60%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .refund-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 650px;
          margin: 0 auto 25px;
        }

        .refund-meta {
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
        .refund-content-section {
          padding: 70px 0;
        }

        .refund-container-centered {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 3. Detailed Clauses Stack */
        .refund-clauses-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .refund-clause-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 35px 40px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.015);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .refund-clause-card:hover {
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

        .refund-clause-card:hover .clause-header-icon {
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

        /* Sub-Lists styled */
        .refund-list {
          margin: 18px 0;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .refund-list li {
          list-style: none;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .list-marker-index {
          color: #3b82f6;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .list-item-content {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #475569;
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
          .refund-hero {
            padding: 140px 0 70px;
          }
          .refund-title {
            font-size: 2.25rem;
          }
          .refund-subtitle {
            font-size: 0.975rem;
          }
          .refund-clause-card {
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

export default RefundPolicy;
