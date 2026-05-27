import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'WHAT IS HOLIDAYHAVENHOMES.COM ?',
    answer: 'www.holidayhavenhomes.com is a Web portal diffusing and promoting on - line offers of vacation rentals.Our role is to bring together vacationers and property owners wishing to rent directly a vacation home.'
  },
  {
    id: 2,
    question: 'HOLIDAYHAVENHOMES.COM - IS A FREE SERVICE TO VACATIONERS.',
    answer: 'The contact made by the vacationer with the owner is FREE.To contact a property owner by e - mail, simply use the form provided for this use in his advert or else you can e - mail us directly to acquire other contact information.'
  },
  {
    id: 3,
    question: 'HOLIDAYHAVENHOMES.COM IS A SECURE USER SERVICE',
    answer: 'The rentals listed on the site have detailed descriptions and are accompanied by numerous photos.All this combined is meant to help you with your search and assist you in making the right choice.We maintain that by simply creating a trustworthy environment between our members relationships will be established!'
  },
  {
    id: 4,
    question: 'WHAT ARE VACATION RENTAL HOMES ?',
    answer: 'In simple words these are homes which are rented out to travelers as an alternative to hotels.Vacation homes have become hugely popular as it saves the vacationer lot of money and provides them with the privacy also.As an example an average 2 person Hotel room in Switzerland, Zurich will cost you around $200 / day whereas a house for 4 - 6 person $500 a week and most probably you would be able to cook your own meals.'
  },
  {
    id: 5,
    question: 'CHECKLIST TO BOOK A PRIVATE HOLIDAY ACCOMMODATION ?',
    answer: '1. Check availability calendar, Check rates for nightly, weekly stays\n2. Check for the Necessities and amenities requirements like Kitchen equipment, pets, swimming pool etc.\n3. Complete any formalities like signing a rental agreement between you and the owner, Check from whom to get the keys when you arrive, Check if the owner is offering any discount if you book the property for a longer period.\n4. Check the amount you need to deposit with the owner before you use the rental, Check mode of payment.You can pay directly through wire transfer or through PayPal or Credit card.Confirm with the owner.\n5.Check the owner’s refund policy for the deposit if you decide to cancel the trip at the last moment.'
  },
  {
    id: 6,
    question: 'CAN I UPLOAD MY PROPERTY DETAILS AS SOON AS I REGISTER ?',
    answer: 'Yes, you can upload your property details and preview your advert immediately or if you have already paid our web designing team will do this for you “Free of Charge”. Your listing will not become active on our website for people to see until you validate that your email address is correct and a manual review will be done from our team to check for any obscene material.'
  },
  {
    id: 7,
    question: 'DO YOU OFFER ANY DISCOUNT FOR MULTIPLE VACATION RENTAL PROPERTIES ?',
    answer: 'Yes, we do provide discounts to home owner with multiple properties contact directly at info @holidayhavenhomes.com to get a customized price according to your needs and conditions.'
  },
  {
    id: 8,
    question: 'WHAT ARE YOUR ADVERTISING RATES ?',
    answer: 'Please see Advertise with us'
  },
  {
    id: 9,
    question: 'IS THE SUBSCRIPTION AUTO - RENEWAL ?',
    answer: 'No, the service is not auto - renewal we will send you reminder E - mails and make phone calls for the same, If in case you are no more interested in continuing our services or forget to renew your subscription it automatically gets deleted from our database.'
  },
  {
    id: 10,
    question: 'ADDING ANOTHER LISTING TO YOUR ACCOUNT',
    answer: '1.Log into your account.\n2.At the top left corner, click on “Create New Listing”.\n3.Enter property details by filling given forms.\n4.Select Package(Standard / Classic / Premium).\n5.To get property live, click on “Pay” button or you can go to “Dashboard” for Preview Listing and pay later(property will be saved in draft)'
  },
  {
    id: 11,
    question: 'RESETTING YOUR PASSWORD',
    answer: '1.Go to the homepage.\n2.Click Owner Login at the top right\n3.Click Forgot Password.\n4.Enter the email address that you used to sign up for your Holiday Haven Homes account.\n5.Check the email account for a customer support email with the password, If you do not receive the password in your email shortly, please check your junk mail / spam folder.'
  },
  {
    id: 12,
    question: 'CAN I MAKE CHANGES TO MY ADVERT LISTING AFTER SUBMISSION ?',
    answer: 'You can update / edit your entire Advert including photos 24 hours a day.As soon as you update or edit any information through Owner’s Login, Your changes are updated to your holiday home rental listing immediately.'
  },
  {
    id: 13,
    question: 'WHAT IS VAT AND DO I NEED TO PAY ?',
    answer: 'VAT is an acronym for Value Added Tax, and is a sales tax added to a product or material.Depending on the country of residence, VAT can have different values.You do not have to worry about the VAT charges they are already covered in your listing and are taken care by us.'
  },
  {
    id: 14,
    question: 'HOW DO I GET A “FEATURED PROPERTY”?',
    answer: '“Featured Property” is a service where you may see properties advertised on the Home Page in a horizontal strip and give them an added exposure'
  },
  {
    id: 15,
    question: 'UNSUBSCRIBING FROM EMAILS ?',
    answer: 'You can Anytime unsubscribe from e - mails or define the amount of E - mails you wish to receive / weekly / daily by simply emailing at info @holidayhavenhomes.com and subject “Newsletter” Owners and property managers will still receive transactional emails such as order receipts and inquiries.'
  }
];

const FAQ: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  return (
    <div className="faq-page">
      <Navbar />

      <main className="faq-main">
        <div className="container centered-layout">
          
          {/* Elegant Centered Minimal Header */}
          <div className="faq-simple-header">
            <h1 className="faq-title-centered">Frequently Asked Questions</h1>
            <p className="faq-subtitle-centered">
              Have questions? We're here to help. Find quick, clean answers about booking vacation rentals or hosting your property with Holiday Haven Homes.
            </p>
          </div>

          {/* Minimalist Stacked Accordion Rows */}
          <div className="faq-accordion-list">
            {faqs.map((faq, index) => {
              const isExpanded = expandedIndex === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  className={`faq-accordion-card ${isExpanded ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.02 }}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="faq-trigger"
                    aria-expanded={isExpanded}
                  >
                    <span className="faq-question-text">
                      <span className="faq-question-number">{String(faq.id).padStart(2, '0')}</span>
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="faq-arrow-badge"
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="faq-body-overflow"
                      >
                        <div className="faq-body-content">
                          <p className="faq-answer-text">
                            {faq.answer.split('\n').map((line, lIdx) => (
                              <span key={lIdx} style={{ display: 'block', marginBottom: '6px' }}>
                                {line}
                              </span>
                            ))}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
      <BackToTop />

      <style>{`
        .faq-page {
          background: #ffffff;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .faq-main {
          padding: 150px 0 100px;
        }

        .centered-layout {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Minimal Centered Header */
        .faq-simple-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .faq-title-centered {
          font-size: 2.25rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.8px;
          margin-bottom: 12px;
        }

        .faq-subtitle-centered {
          font-size: 1rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Stacked Accordion List (Apple / Stripe Minimal Style) */
        .faq-accordion-list {
          border-top: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }

        .faq-accordion-card {
          background: transparent;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          overflow: hidden;
          position: relative;
          transition: background-color 0.2s ease;
        }

        /* Elegant, minimal left accent line animation */
        .faq-accordion-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #3b82f6;
          transform: scaleY(0);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top;
          z-index: 2;
        }

        .faq-accordion-card:hover::before,
        .faq-accordion-card.active::before {
          transform: scaleY(1);
        }

        .faq-accordion-card:hover {
          background-color: #fafafa;
        }

        .faq-accordion-card.active {
          background-color: #ffffff;
        }

        .faq-trigger {
          width: 100%;
          padding: 24px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 16px;
        }

        .faq-question-text {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #1f2937;
          line-height: 1.5;
          text-transform: none;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: color 0.2s ease;
        }

        .faq-question-number {
          font-size: 0.95rem;
          font-weight: 400;
          color: #9ca3af;
          flex-shrink: 0;
          padding-top: 1px;
        }

        .faq-accordion-card:hover .faq-question-text {
          color: #2563eb;
        }

        .faq-accordion-card.active .faq-question-text {
          color: #111827;
          font-weight: 600;
        }

        .faq-arrow-badge {
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .faq-accordion-card:hover .faq-arrow-badge {
          color: #111827;
          transform: scale(1.05);
        }

        .faq-accordion-card.active .faq-arrow-badge {
          color: #2563eb;
        }

        .faq-body-overflow {
          overflow: hidden;
        }

        .faq-body-content {
          padding: 0 8px 24px 34px;
        }

        .faq-answer-text {
          font-size: 0.925rem;
          line-height: 1.7;
          color: #4b5563;
          font-weight: 400;
          margin: 0;
          white-space: pre-line;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .faq-main {
            padding-top: 110px;
          }
          .faq-title-centered {
            font-size: 1.8rem;
          }
          .faq-trigger {
            padding: 20px 4px;
          }
          .faq-body-content {
            padding: 0 4px 20px 24px;
          }
          .faq-question-text {
            font-size: 0.925rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;
