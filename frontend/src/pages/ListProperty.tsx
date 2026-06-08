import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import {
  Users, Percent, Globe, Award, ShieldCheck,
  Mail, Layout, Headphones, Briefcase,
  Upload, Share2, TrendingUp, Check,
  Rocket
} from 'lucide-react';
import bannerBg from '../assets/banner_bg.jpg';
import exposureBg from '../assets/hero-bg.png';
import lightbulbImg from '../assets/nesletter.png';
import { useQuery } from '@tanstack/react-query';
import { planService, type SubscriptionPlan } from '../services/planService';

const ListProperty: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'online' | 'offline'>('offline');
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const data = await planService.getPlans();
      return data.map((plan: SubscriptionPlan) => {
        const features = [];
        for (let i = 1; i <= 13; i++) {
          const desc = (plan as any)[`description${i}`];
          if (typeof desc === 'string' && desc.trim() !== '' && desc.trim() !== '-----') {
            features.push(desc);
          }
        }

        let color = '#1a1a1a';
        const pName = (plan.planName || '').toLowerCase();
        if (pName.includes('gold')) color = '#f59e0b';
        else if (pName.includes('silver')) color = '#94a3b8';
        else if (pName.includes('bronze')) color = '#d97706';

        return {
          name: plan.planName || 'Unnamed Plan',
          price: plan.price ? `$${plan.price}` : '$0',
          duration: 'Annual Listing',
          features,
          color
        };
      });
    },
  });

  const uniqueFeatures = useMemo(() => {
    if (!plans || plans.length === 0) return [];
    const all = plans.flatMap(p => p.features);
    return Array.from(new Set(all)).filter(f => f && f !== '-----');
  }, [plans]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    if (params.get('scrollToPlans') === 'true') {
      const el = document.getElementById('pricing-plans');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  return (
    <div className="list-property-page">
      <Navbar />

      <main className="lp-main">
        {/* Why Choose Us */}
        <section className="lp-why">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="lp-title">Why <span>SkyrunRentals.com</span></h2>
              <p className="lp-subtitle">Sign up in minutes and join millions of global travelers.</p>
            </motion.div>

            <div className="lp-benefits-grid">
              {[
                { icon: <Users size={40} />, title: 'Direct Connection', desc: 'Connect directly with owners on our marketplace.' },
                { icon: <Percent size={40} />, title: 'Zero Fees', desc: 'Save up to 10% compared to other platforms.' },
                { icon: <Globe size={40} />, title: 'Leading Platform', desc: 'The world\'s most trusted vacation rental experts.' }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="benefit-card-premium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="benefit-icon-wrapper">{benefit.icon}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="lp-guarantee">
          <div className="guarantee-bg" style={{ backgroundImage: `url(${bannerBg})` }}></div>
          <div className="guarantee-overlay"></div>
          <div className="container guarantee-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="guarantee-glass-card"
            >
              <div className="guarantee-badge">OUR PROMISE</div>
              <h3>THE 3-8 BOOKING GUARANTEE</h3>
              <div className="guarantee-icon-pulse">
                <ShieldCheck size={80} />
              </div>
              <p>We guarantee a minimum of <strong>3–8 bookings</strong> within the 12-month subscription period. If this target is not achieved, you can choose either a full refund or complimentary lifetime access to our services—the choice is entirely yours.</p>
              <div className="guarantee-shine"></div>
            </motion.div>
          </div>
        </section>

        {/* Marketing Strategies */}
        <section className="lp-marketing">
          <div className="container">
            <div className="section-header">
              <h2 className="lp-title">Next-Gen <span>Marketing Strategies</span></h2>
              <p className="lp-subtitle">Elevating your property's visibility across every channel.</p>
            </div>

            <div className="marketing-toggle-container">
              <div className="marketing-pill">
                {['offline', 'online'].map((tab) => (
                  <button
                    key={tab}
                    className={`pill-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Marketing
                  </button>
                ))}
              </div>
            </div>

            <div className="marketing-showcase-v2">
              <AnimatePresence mode="wait">
                {activeTab === 'offline' ? (
                  <motion.div
                    key="offline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="showcase-grid-v2"
                  >
                    <div className="showcase-side">
                      <div className="showcase-card-v2">
                        <div className="s-icon-v2"><Mail /></div>
                        <h4>Newsletter</h4>
                        <p>Our 5,00,000 registered users get access to new accommodation grows you potential reach to all customers.</p>
                      </div>
                      <div className="showcase-card-v2">
                        <div className="s-icon-v2"><Layout /></div>
                        <h4>Exhibitions</h4>
                        <p>Giving exposure with various platforms in Magazines, Newspapers, Flight Search Engines, Travel Portals.</p>
                      </div>
                    </div>

                    <div className="showcase-visual">
                      <div className="visual-circle">
                        <motion.img
                          src={lightbulbImg}
                          alt="Innovation"
                          animate={{ y: [0, -20, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        <div className="orbit orbit-1"></div>
                        <div className="orbit orbit-2"></div>
                      </div>
                    </div>

                    <div className="showcase-side">
                      <div className="showcase-card-v2">
                        <div className="s-icon-v2"><Briefcase /></div>
                        <h4>Booking Experts</h4>
                        <p>Our team of dedicated experts provide suggestions regarding your upcoming plans and offer the best deals.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="online"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="showcase-grid-v2 online-view"
                  >
                    <div className="showcase-side">
                      <div className="showcase-item-minimal">
                        <div className="minimal-number">1.</div>
                        <h4>Blog</h4>
                      </div>
                      <div className="showcase-item-minimal">
                        <div className="minimal-number">2.</div>
                        <h4>Newsletter Feature</h4>
                      </div>
                      <div className="showcase-item-minimal">
                        <div className="minimal-number">3.</div>
                        <h4>Digital Marketing</h4>
                      </div>
                    </div>

                    <div className="showcase-visual">
                      <div className="laptop-frame">
                        <img src={exposureBg} alt="Online Marketing" className="laptop-img" />
                        <div className="laptop-overlay">
                          <h3>MARKETING</h3>
                        </div>
                      </div>
                    </div>

                    <div className="showcase-side">
                      <div className="showcase-item-minimal">
                        <div className="minimal-number">4.</div>
                        <h4>Social Media Optimization</h4>
                      </div>
                      <div className="showcase-item-minimal">
                        <div className="minimal-number">5.</div>
                        <h4>SEO/SEM Campaign</h4>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Exposure Section */}
        <section className="lp-exposure">
          <div className="exposure-bg" style={{ backgroundImage: `url(${exposureBg})` }}></div>
          <div className="exposure-overlay-v2"></div>
          <div className="container exposure-content-v2">
            <motion.h2
              className="exposure-title-v2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              Maximum Exposure <br />
              <span>Reach 20M+ Travelers Yearly</span>
            </motion.h2>

            <div className="exposure-steps-v2">
              {[
                { title: 'Upload & Optimize', desc: 'Submit your property details in 3 simple, guided steps.', icon: <Upload /> },
                { title: 'Partner Network', desc: 'Sync across 100+ premier travel websites automatically.', icon: <TrendingUp /> },
                { title: 'Secure Deals', desc: 'Receive high-quality inquiries and start booking instantly.', icon: <Award /> }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="exposure-step-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="step-number">{i + 1}</div>
                  <div className="step-icon-v2">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="lp-pricing" id="pricing-plans">
          <div className="container">
            <div className="section-header">
              <h2 className="lp-title">Choose Your <span>Growth Plan</span></h2>
              <p className="lp-subtitle">Scalable solutions tailored for every property type.</p>
            </div>

            {/* Premium Pill Switcher */}
            <div className="pricing-view-toggle">
              <div className="view-pill">
                <button
                  className={`view-pill-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                >
                  Card View
                </button>
                <button
                  className={`view-pill-btn ${viewMode === 'comparison' ? 'active' : ''}`}
                  onClick={() => setViewMode('comparison')}
                >
                  Feature Comparison
                </button>
              </div>
            </div>

            <div className="pricing-content-wrapper">
              {isLoading ? (
                <div className="loading-state" style={{ textAlign: 'center', padding: '100px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Rocket size={40} color="var(--secondary)" />
                  </motion.div>
                  <p style={{ marginTop: '20px', fontWeight: 600, color: '#64748b' }}>Fetching best plans for you...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {viewMode === 'cards' ? (
                    <motion.div
                      key="cards"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -25 }}
                      transition={{ duration: 0.3 }}
                      className="pricing-grid-v2"
                    >
                      {plans.map((plan, i) => (
                        <motion.div
                          key={i}
                          className={`pricing-card-v2 ${plan.name === 'Gold' ? 'featured' : ''}`}
                          style={{ '--plan-color': plan.color } as any}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -15 }}
                        >
                          {plan.name === 'Gold' && <div className="popular-tag">MOST POPULAR</div>}
                          <div className="plan-header-v2">
                            <h3>{plan.name}</h3>
                            <div className="price-tag">
                              <span className="currency">$</span>
                              <span className="amount">{plan.price.replace('$', '')}</span>
                            </div>
                            <p className="duration">{plan.duration}</p>
                          </div>

                          <div className="plan-body-v2">
                            <ul>
                              {plan.features.map((feature: string, idx: number) => (
                                <li key={idx} className={feature === '-----' ? 'empty' : ''}>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <button className="plan-btn-premium" onClick={() => {
                              if (isLoggedIn) navigate(`/payment?plan=${plan.name}`);
                              else openAuthModal('register', '', `/payment?plan=${plan.name}`);
                            }} style={{ width: isLoggedIn ? 'auto' : '140px', padding: isLoggedIn ? '12px 20px' : '12px 24px' }}>
                              {isLoggedIn ? 'Continue with this package' : 'Sign Up'}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="comparison"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -25 }}
                      transition={{ duration: 0.3 }}
                      className="comparison-table-wrapper"
                    >
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th className="feature-header">Features</th>
                            {plans.map((plan, i) => (
                              <th key={i} className="plan-column-header" style={{ '--plan-color': plan.color } as any}>
                                <div className="th-plan-name">{plan.name}</div>
                                <div className="th-plan-price">{plan.price}</div>
                                <button className="th-plan-btn" onClick={() => {
                                  if (isLoggedIn) navigate(`/payment?plan=${plan.name}`);
                                  else openAuthModal('register', '', `/payment?plan=${plan.name}`);
                                }} style={{ maxWidth: isLoggedIn ? '100%' : '130px' }}>
                                  {isLoggedIn ? 'Continue' : 'Sign Up'}
                                </button>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uniqueFeatures.map((feature, idx) => (
                            <tr key={idx}>
                              <td className="feature-name">{feature}</td>
                              {plans.map((plan, i) => {
                                const hasFeature = plan.features.includes(feature);
                                return (
                                  <td key={i} className="feature-check-cell">
                                    {hasFeature ? (
                                      <div className="check-badge" style={{ '--plan-color': plan.color } as any}>
                                        <Check size={14} strokeWidth={3} />
                                      </div>
                                    ) : (
                                      <span className="no-feature">—</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      <style>{`
        .lp-main { padding-top: 135px; overflow-x: hidden; }
         @media (max-width: 992px) {
          .lp-main {
            padding-top: 10px !important;
          }
        }

        .lp-title { font-size: 3.5rem; font-weight: 900; color: #1a1a1a; line-height: 1.1; }
        .lp-title span { background: linear-gradient(90deg, var(--secondary), #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @media (max-width: 992px) {
          .lp-title {
            font-size: 2.5rem;
          }
        }

        .lp-subtitle { font-size: 1.2rem; color: #6b7280; margin-top: 15px; }

        /* Premium Benefit Cards */
        .lp-why { padding: 120px 0; background: #fff; }
        .lp-benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 80px; }
        .benefit-card-premium { padding: 50px 40px; background: #f8fafc; border-radius: 40px; border: 1px solid #f1f5f9; text-align: center; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .benefit-card-premium:hover { background: #fff; box-shadow: 0 40px 80px rgba(0,0,0,0.06); }
        .benefit-icon-wrapper { width: 90px; height: 90px; background: #fff; border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; color: var(--secondary); box-shadow: 0 15px 30px rgba(58, 134, 255, 0.1); }
        .benefit-card-premium h3 { font-size: 1.5rem; font-weight: 800; color: #1a1a1a; margin-bottom: 15px; }
        .benefit-card-premium p { color: #6b7280; line-height: 1.6; }

        /* Parallax Guarantee */
        .lp-guarantee { position: relative; height: 700px; display: flex; align-items: center; overflow: hidden; }
        .guarantee-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transform: scale(1.1); }
        .guarantee-overlay { position: absolute; inset: 0; background: linear-gradient(45deg, rgba(15, 23, 42, 0.9), rgba(58, 134, 255, 0.4)); }
        .guarantee-glass-card { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; padding: 70px; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.2); color: white; text-align: center; }
        .guarantee-badge { display: inline-block; padding: 8px 20px; background: var(--secondary); border-radius: 50px; font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 30px; }
        .guarantee-glass-card h3 { font-size: 2.5rem; font-weight: 900; margin-bottom: 30px; letter-spacing: -1px; }
        .guarantee-icon-pulse { margin-bottom: 30px; color: #fbbf24; filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5)); animation: pulse 2s infinite; }
        .guarantee-glass-card p { font-size: 1.5rem; line-height: 1.5; font-weight: 500; }
        .guarantee-glass-card p strong { color: #fbbf24; }

        /* Showcase V2 */
        .lp-marketing { padding: 120px 0; background: radial-gradient(circle at bottom left, #f8fafc, #ffffff); }
        .marketing-toggle-container { display: flex; justify-content: center; margin-bottom: 80px; }
        .marketing-pill { background: #f1f5f9; padding: 8px; border-radius: 100px; display: flex; gap: 10px; }
        .pill-btn { padding: 15px 40px; border-radius: 100px; font-weight: 800; transition: all 0.3s; color: #64748b; }
        .pill-btn.active { background: #1a1a1a; color: white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        .showcase-grid-v2 { display: grid; grid-template-columns: 1fr 1.2fr 1fr; align-items: center; gap: 50px; }
        .showcase-visual { position: relative; display: flex; justify-content: center; }
        .visual-circle { position: relative; width: 400px; height: 400px; display: flex; align-items: center; justify-content: center; }
        .visual-circle img { width: 80%; z-index: 2; }
        .orbit { position: absolute; border: 2px dashed rgba(58, 134, 255, 0.2); border-radius: 50%; animation: rotate 20s linear infinite; }
        .orbit-1 { width: 100%; height: 100%; }
        .orbit-2 { width: 80%; height: 80%; animation-direction: reverse; }

        .showcase-card-v2 { padding: 30px; background: white; border-radius: 30px; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 30px; transition: all 0.3s; }
        .showcase-card-v2:hover { border-color: var(--secondary); transform: scale(1.02); }
        .s-icon-v2 { width: 50px; height: 50px; background: #f1f5f9; border-radius: 15px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--secondary); }
        .showcase-card-v2 h4 { font-size: 1.2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; }
        .showcase-card-v2 p { font-size: 0.95rem; color: #6b7280; line-height: 1.6; }

        /* Online View Specifics */
        .showcase-item-minimal { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding: 20px; background: white; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s; }
        .showcase-item-minimal:hover { transform: translateX(10px); color: var(--secondary); }
        .minimal-number { width: 40px; height: 40px; background: #1a1a1a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem; flex-shrink: 0; }
        .showcase-item-minimal h4 { font-size: 1.1rem; font-weight: 700; margin: 0; }

        .laptop-frame { position: relative; width: 100%; max-width: 450px; border-radius: 30px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
        .laptop-img { width: 100%; display: block; filter: brightness(0.7); }
        .laptop-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .laptop-overlay h3 { color: white; font-size: 3rem; font-weight: 900; letter-spacing: 5px; text-shadow: 0 10px 20px rgba(0,0,0,0.3); }

        /* Exposure Section */
        .lp-exposure { position: relative; padding: 150px 0; display: flex; align-items: center; }
        .exposure-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
        .exposure-overlay-v2 { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8)); }
        .exposure-content-v2 { position: relative; z-index: 2; text-align: center; color: white; }
        .exposure-title-v2 { font-size: 3rem; font-weight: 900; margin-bottom: 100px; }
        .exposure-title-v2 span { color: var(--secondary); }
        .exposure-steps-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .exposure-step-card { position: relative; padding: 50px 40px; background: rgba(255,255,255,0.05); border-radius: 40px; border: 1px solid rgba(255,255,255,0.1); }
        .step-number { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background: var(--secondary); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; border: 4px solid #1a1a1a; }
        .step-icon-v2 { color: var(--secondary); margin-bottom: 25px; margin-top: 10px; }
        .exposure-step-card h4 { font-size: 1.4rem; font-weight: 800; margin-bottom: 15px; }
        .exposure-step-card p { font-size: 1.05rem; opacity: 0.7; line-height: 1.6; }

        /* Pricing Grid V2 */
        .lp-pricing { padding: 150px 0; background: #f8fafc; }
        .pricing-grid-v2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 80px; align-items: stretch; }
        .pricing-card-v2 { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; min-height: 950px; transition: all 0.3s; position: relative; }
        .pricing-card-v2.featured { border-color: #1e293b; border-width: 2px; }
        .pricing-card-v2::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: var(--plan-color); }
        .popular-tag { display: none; }
        
        .plan-header-v2 { padding: 50px 20px; color: #1a1a1a; text-align: center; border-bottom: 1px solid #f1f5f9; background: #fff !important; }
        .plan-header-v2 h3 { font-size: 1.6rem; font-weight: 700; color: #64748b; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .price-tag { display: flex; align-items: flex-start; justify-content: center; margin-bottom: 5px; color: var(--plan-color); }
        .price-tag .currency { font-size: 1.8rem; font-weight: 700; margin-top: 10px; }
        .price-tag .amount { font-size: 4.5rem; font-weight: 900; letter-spacing: -2px; }
        .plan-header-v2 .duration { font-size: 0.95rem; color: #1e293b; font-weight: 700; margin-top: -10px; }
        
        .plan-body-v2 { padding: 30px 0; flex-grow: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }
        .plan-body-v2 ul { list-style: none; padding: 0; margin: 0; width: 100%; text-align: center; }
        .plan-body-v2 li { padding: 15px 10px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #1e293b; font-weight: 500; height: 50px; display: flex; align-items: center; justify-content: center; }
        .plan-body-v2 li:last-child { border-bottom: none; }
        .plan-body-v2 li.empty { display: none; }
        
        .plan-btn-premium { width: 140px; padding: 12px 24px; background: #4a7ab5; color: white; border-radius: 8px; font-weight: 700; font-size: 0.95rem; margin-top: auto; align-self: center; transition: all 0.3s ease; }
        .plan-btn-premium:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30, 41, 59, 0.15); }

        /* Pricing View Toggle */
        .pricing-view-toggle { display: flex; justify-content: center; margin-bottom: 50px; }
        .view-pill { background: #f1f5f9; padding: 6px; border-radius: 100px; display: flex; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .view-pill-btn { padding: 12px 30px; border-radius: 100px; font-weight: 800; font-size: 0.95rem; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); color: #64748b; border: none; background: transparent; cursor: pointer; }
        .view-pill-btn.active { background: #1e3a8a; color: white; box-shadow: 0 6px 15px rgba(30, 58, 138, 0.2); }

        /* Comparison Table Matrix styling */
        .comparison-table-wrapper { 
          background: #ffffff; 
          border-radius: 24px; 
          border: 1px solid #e2e8f0; 
          overflow-x: auto; 
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05); 
          margin-top: 20px;
          -webkit-overflow-scrolling: touch;
        }

        .comparison-table { 
          width: 100%; 
          border-collapse: collapse; 
          text-align: left; 
          min-width: 800px;
        }

        .comparison-table th, .comparison-table td { 
          padding: 20px 24px; 
          border-bottom: 1px solid #f1f5f9; 
          vertical-align: middle;
        }

        /* Feature Column (Left) */
        .feature-header { 
          font-size: 1.1rem; 
          font-weight: 800; 
          color: #0f172a; 
          background: #f8fafc;
          position: sticky;
          left: 0;
          z-index: 10;
        }
        
        .feature-name { 
          font-size: 0.95rem; 
          font-weight: 600; 
          color: #334155; 
          background: #ffffff;
          position: sticky;
          left: 0;
          z-index: 9;
          border-right: 1px solid #f1f5f9;
        }

        /* Plan Column Header */
        .plan-column-header { 
          text-align: center; 
          background: #f8fafc;
          border-top: 4px solid var(--plan-color);
          min-width: 170px;
        }

        .th-plan-name { 
          font-size: 1.1rem; 
          font-weight: 800; 
          color: #0f172a; 
          text-transform: uppercase; 
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .th-plan-price { 
          font-size: 1.6rem; 
          font-weight: 900; 
          color: var(--plan-color);
          margin-bottom: 12px;
        }

        .th-plan-btn { 
          width: 100%; 
          max-width: 130px; 
          padding: 8px 16px; 
          background: var(--plan-color); 
          color: #ffffff; 
          border: none; 
          border-radius: 8px; 
          font-weight: 700; 
          font-size: 0.85rem; 
          cursor: pointer; 
          transition: all 0.3s ease; 
        }
        
        .th-plan-btn:hover { 
          filter: brightness(0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        /* Checkmark cells styling */
        .feature-check-cell { 
          text-align: center; 
        }

        .check-badge { 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          width: 28px; 
          height: 28px; 
          background: rgba(16, 185, 129, 0.1); 
          color: #10b981; 
          border-radius: 50%; 
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.1);
        }

        .no-feature { 
          color: #94a3b8; 
          font-weight: 300; 
        }

        /* Row Highlight Hover effect */
        .comparison-table tbody tr { 
          transition: background-color 0.2s ease; 
        }
        
        .comparison-table tbody tr:hover { 
          background-color: rgba(59, 130, 246, 0.03); 
        }
        
        .comparison-table tbody tr:hover .feature-name {
          background-color: #f8fafc;
        }

        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1200px) {
          .pricing-grid-v2 { grid-template-columns: repeat(2, 1fr); }
          .showcase-grid-v2 { grid-template-columns: 1fr; }
          .showcase-visual { display: none; }
          .exposure-steps-v2 { grid-template-columns: 1fr; }
          .lp-benefits-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .pricing-grid-v2 { grid-template-columns: 1fr; }
          .pricing-card-v2 { min-height: auto; }
          
          .lp-guarantee { height: auto; padding: 80px 20px; }
          .guarantee-glass-card { padding: 40px 20px; border-radius: 30px; }
          .guarantee-glass-card h3 { font-size: 1.8rem; margin-bottom: 20px; }
          .guarantee-glass-card p { font-size: 1.1rem; }
          
          .view-pill { flex-direction: column; width: 100%; border-radius: 20px; }
          .view-pill-btn { width: 100%; text-align: center; border-radius: 15px; }
        }
      `}</style>
    </div>
  );
};

export default ListProperty;
