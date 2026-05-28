import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

interface FeeData {
  bookingValue: number;
  holidayHavenHomes: number;
  airbnb: number;
  bookingCom: number;
  vrbo: number;
}

const FeeCalculator: React.FC = () => {
  const [sliderValue, setSliderValue] = useState<number>(1000);
  const [debouncedValue, setDebouncedValue] = useState<number>(1000);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(sliderValue);
    }, 150);
    return () => clearTimeout(handler);
  }, [sliderValue]);

  const { data: feeData, isLoading: loading } = useQuery({
    queryKey: ['calculate-fees', debouncedValue],
    queryFn: async () => {
      const response = await api.get(`/properties/calculate-fees?value=${debouncedValue}`);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="fee-calculator-section">
      <div className="container">
        <div className="calculator-wrapper">

          {/* Left Side: Creative Masked Image & Badges */}
          <div className="calc-left">
            <div className="deco-dots"></div>
            <div className="image-container">
              {/* Badge */}
              <div className="badge-say-no">
                <span className="badge-sub">SAY NO</span>
                <span className="badge-sub text-accent">TO</span>
                <span className="badge-main">BOOKING</span>
                <span className="badge-main">FEES</span>
              </div>
              <div className="organic-blob-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
                  alt="Beautiful pool home"
                  className="main-house-image"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Calculator Interface */}
          <div className="calc-right">
            {/* <div className="header-text">
              <span className="calc-subtitle">FEE COMPARISON</span>
              <h2>How our fees compare</h2>
              <p>
                We've estimated how much you receive if a renter pays <strong className="text-highlight">${sliderValue.toLocaleString()}</strong>.
                Our transparent 5% fee keeps more money in your pocket compared to typical high-commission platforms.
              </p>
            </div> */}

            <div className="slider-card">
              <div className="slider-header">
                <label>Booking Value</label>
                <div className="slider-value-display">{formatPrice(sliderValue)}</div>
              </div>

              <div className="slider-wrapper-inner">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="styled-slider"
                />
                <div className="slider-ticks">
                  <span>{formatPrice(0)}</span>
                  <span>{formatPrice(1000)}</span>
                  <span>{formatPrice(2000)}</span>
                  <span>{formatPrice(3000)}</span>
                  <span>{formatPrice(4000)}</span>
                  <span>{formatPrice(5000)}</span>
                </div>
              </div>

              <div className="receive-label">Your estimated earnings</div>
            </div>

            <div className="results-container">

              {/* Holiday Haven Homes (Highlight Row) */}
              <div className="result-row highlight">
                <div className="logo-col">
                  {/* Custom HHH SVG Logo */}
                  <svg viewBox="0 0 160 40" width="140" height="35" className="logo-svg">
                    <path d="M12 25 L20 18 L28 25 M14 24 L14 32 L26 32 L26 24" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                    <text x="35" y="24" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="15" fill="#1e3a8a">Skyrun Rentals</text>
                    <text x="35" y="34" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" fill="#fe9d3d" letterSpacing="1">HOMES</text>
                  </svg>
                </div>
                <div className="amount-col highlight-amt">
                  <span className="earn-amount">{feeData ? formatPrice(feeData.holidayHavenHomes) : '...'}</span>
                  <span className="earn-percent">(95% payout)</span>
                  <span className="badge-best-value">Best Value</span>
                </div>
              </div>

              {/* Airbnb Row */}
              <div className="result-row">
                <div className="logo-col">
                  {/* Custom Airbnb SVG Logo */}
                  <svg viewBox="0 0 120 32" width="100" height="26" className="logo-svg">
                    <path d="M12 20c-1.8 0-3-1.2-3-3s1.2-3 3-3 3 1.2 3 3-1.2 3-3 3zm0-8c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" fill="#FF5A5F" />
                    <text x="26" y="21" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#FF5A5F">airbnb</text>
                  </svg>
                </div>
                <div className="amount-col">
                  <span className="earn-amount">{feeData ? formatPrice(feeData.airbnb) : '...'}</span>
                  <span className="earn-percent-less">or less</span>
                </div>
              </div>

              {/* Booking.com Row */}
              <div className="result-row">
                <div className="logo-col">
                  {/* Custom Booking.com SVG Logo */}
                  <svg viewBox="0 0 150 32" width="120" height="26" className="logo-svg">
                    <rect x="2" y="2" width="28" height="28" rx="4" fill="#003580" />
                    <text x="10" y="22" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="18" fill="#ffffff">B.</text>
                    <text x="35" y="21" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#003580">Booking.com</text>
                  </svg>
                </div>
                <div className="amount-col">
                  <span className="earn-amount">{feeData ? formatPrice(feeData.bookingCom) : '...'}</span>
                  <span className="earn-percent-less">or less</span>
                </div>
              </div>

              {/* Vrbo Row */}
              <div className="result-row">
                <div className="logo-col">
                  {/* Custom Vrbo SVG Logo */}
                  <svg viewBox="0 0 100 32" width="80" height="26" className="logo-svg">
                    <text x="2" y="22" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#061e38" fontStyle="italic" letterSpacing="-1">Vrbo</text>
                  </svg>
                </div>
                <div className="amount-col">
                  <span className="earn-amount">{feeData ? formatPrice(feeData.vrbo) : '...'}</span>
                  <span className="earn-percent-less">or less</span>
                </div>
              </div>

            </div>

            <button className="learn-more-btn" onClick={() => setIsModalOpen(true)}>
              Learn more about how we calculate this
            </button>

            {/* <div className="disclaimer-text">
              *5% includes our payment fee of 3% and Stripe processing fee (typically 2%).<br />
              **Includes an estimated 2% Booking.com payments processing fee.
            </div> */}

          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fee-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="fee-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="fee-modal-header">
              <h3>How our fees compare</h3>
              <button className="fee-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <p className="fee-modal-description">
              We've estimated how much you receive if a renter pays <strong>{formatPrice(sliderValue)}</strong>. The fees are the owner and renter combined as this impacts the cost of the booking and therefore how much you can earn.
            </p>

            <div className="fee-table-container">
              <div className="fee-table-header-row">
                <div className="fee-col"></div>
                <div className="fee-col">Fees</div>
                <div className="fee-col">Amount</div>
                <div className="fee-col">Your Earn</div>
              </div>

              {/* Holiday Haven Homes */}
              <div className="fee-table-row">
                <div className="fee-col">
                  <svg viewBox="0 0 160 40" width="140" height="35" className="logo-svg">
                    <path d="M12 25 L20 18 L28 25 M14 24 L14 32 L26 32 L26 24" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                    <text x="35" y="24" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="15" fill="#1e3a8a">Skyrun Rentals</text>
                    <text x="35" y="34" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" fill="#fe9d3d" letterSpacing="1">HOMES</text>
                  </svg>
                </div>
                <div className="fee-col" data-label="Fees">5%</div>
                <div className="fee-col" data-label="Amount">{formatPrice(sliderValue * 0.05)}</div>
                <div className="fee-col" data-label="Your Earn">{formatPrice(sliderValue * 0.95)} (95%)</div>
              </div>

              {/* Airbnb */}
              <div className="fee-table-row">
                <div className="fee-col">
                  <svg viewBox="0 0 120 32" width="100" height="26" className="logo-svg">
                    <path d="M12 20c-1.8 0-3-1.2-3-3s1.2-3 3-3 3 1.2 3 3-1.2 3-3 3zm0-8c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" fill="#FF5A5F" />
                    <text x="26" y="21" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#FF5A5F">airbnb</text>
                  </svg>
                </div>
                <div className="fee-col" data-label="Fees">14-18%</div>
                <div className="fee-col" data-label="Amount">{formatPrice(sliderValue * 0.14)} - {formatPrice(sliderValue * 0.18)}</div>
                <div className="fee-col" data-label="Your Earn">{formatPrice(sliderValue * 0.82)} - {formatPrice(sliderValue * 0.86)} (82-86%)</div>
              </div>

              {/* Booking.com */}
              <div className="fee-table-row">
                <div className="fee-col">
                  <svg viewBox="0 0 150 32" width="120" height="26" className="logo-svg">
                    <rect x="2" y="2" width="28" height="28" rx="4" fill="#003580" />
                    <text x="10" y="22" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="18" fill="#ffffff">B.</text>
                    <text x="35" y="21" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#003580">Booking.com</text>
                  </svg>
                </div>
                <div className="fee-col" data-label="Fees">15-25%</div>
                <div className="fee-col" data-label="Amount">{formatPrice(sliderValue * 0.15)} - {formatPrice(sliderValue * 0.25)}</div>
                <div className="fee-col" data-label="Your Earn">{formatPrice(sliderValue * 0.75)} - {formatPrice(sliderValue * 0.85)} (75-83%)**</div>
              </div>

              {/* Vrbo */}
              <div className="fee-table-row">
                <div className="fee-col">
                  <svg viewBox="0 0 100 32" width="80" height="26" className="logo-svg">
                    <text x="2" y="22" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#061e38" fontStyle="italic" letterSpacing="-1">Vrbo</text>
                  </svg>
                </div>
                <div className="fee-col" data-label="Fees">15%+</div>
                <div className="fee-col" data-label="Amount">{formatPrice(sliderValue * 0.15)}+</div>
                <div className="fee-col" data-label="Your Earn">{formatPrice(sliderValue * 0.85)} or Less (85% or Less)</div>
              </div>
            </div>

            <div className="fee-modal-footer">
              <p>*5% includes our payment fee of 3% and Stripe processing fee (typically 2%).</p>
              <p>**includes an estimated 2% Booking.com payments processing fee.</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fee-calculator-section {
          padding: 40px 0;
          background-color: #f8fafc;
          position: relative;
          overflow: hidden;
        }
        
        .calculator-wrapper {
          display: flex;
          align-items: center;
          gap: 50px;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* LEFT SIDE */
        .calc-left {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
        }

        .deco-dots {
          position: absolute;
          top: -15px;
          right: -15px;
          width: 80px;
          height: 80px;
          background-image: radial-gradient(#cbd5e1 2px, transparent 2px);
          background-size: 10px 10px;
          opacity: 0.8;
          z-index: 1;
        }

        .image-container {
          position: relative;
          width: 100%;
          max-width: 380px;
          z-index: 2;
        }

        .organic-blob-wrapper {
          width: 100%;
          height: 380px;
          overflow: hidden;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
          border: 5px solid #ffffff;
          transition: border-radius 1s ease-in-out;
          animation: morphBlob 12s infinite alternate ease-in-out;
        }

        .organic-blob-wrapper:hover {
          animation-play-state: paused;
        }

        .main-house-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          transition: transform 0.5s ease;
        }

        .organic-blob-wrapper:hover .main-house-image {
          transform: scale(1.1);
        }

        @keyframes morphBlob {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          34% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
          67% { border-radius: 50% 60% 30% 70% / 60% 40% 70% 30%; }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
        }

        .badge-say-no {
          position: absolute;
          top: -15px;
          left: -15px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.35);
          z-index: 5;
          transform: rotate(-10deg);
          transition: transform 0.3s ease;
        }

        .badge-say-no:hover {
          transform: rotate(5deg) scale(1.05);
        }

        .badge-sub {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          opacity: 0.9;
        }
        
        .badge-sub.text-accent {
          color: #fe9d3d;
        }

        .badge-main {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        /* RIGHT SIDE */
        .calc-right {
          flex: 1.2;
          display: flex;
          flex-direction: column;
        }

        .calc-subtitle {
          color: #fe9d3d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: block;
        }

        .header-text h2 {
          font-size: 30px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .header-text p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .text-highlight {
          color: #3b82f6;
          font-weight: 800;
        }

        /* SLIDER CARD */
        .slider-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid #f1f5f9;
          margin-bottom: 20px;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .slider-header label {
          color: #64748b;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .slider-value-display {
          color: #3b82f6;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .slider-wrapper-inner {
          margin-bottom: 15px;
        }

        .styled-slider {
          width: 100%;
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
          outline: none;
          position: relative;
        }

        .styled-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .styled-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 5px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          padding: 6px 2px 0 2px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
        }

        .receive-label {
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-top: 1px solid #f1f5f9;
          padding-top: 15px;
        }

        /* RESULTS LIST */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 18px;
          border-radius: 12px;
          background-color: #ffffff;
          border: 1px solid #f1f5f9;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .result-row:hover {
          transform: translateX(4px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.03);
        }

        .result-row.highlight {
          background: linear-gradient(90deg, #eff6ff 0%, #ffffff 100%);
          border: 2px solid #3b82f6;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.06);
          transform: scale(1.01);
        }

        .result-row.highlight:hover {
          transform: scale(1.02) translateX(4px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.1);
        }

        .logo-col {
          display: flex;
          align-items: center;
        }

        .logo-svg {
          display: block;
        }

        .amount-col {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .earn-amount {
          color: #1e293b;
          font-size: 18px;
          font-weight: 800;
        }

        .highlight .earn-amount {
          color: #3b82f6;
          font-size: 22px;
        }

        .earn-percent {
          color: #10b981;
          font-size: 13px;
          font-weight: 700;
        }

        .earn-percent-less {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-best-value {
          background-color: #10b981;
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 3px 8px rgba(16, 185, 129, 0.25);
        }

        /* BUTTON & FOOTER */
        .learn-more-btn {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          width: 100%;
          margin-bottom: 15px;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .learn-more-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 12px 25px rgba(59, 130, 246, 0.35);
        }

        .learn-more-btn:active {
          transform: translateY(0);
        }

        .disclaimer-text {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.5;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }

        /* MODAL STYLES */
        .fee-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .fee-modal-content {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 30px;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .fee-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .fee-modal-header h3 {
          margin: 0;
          color: #1e3a8a;
          font-size: 22px;
          font-weight: 800;
        }

        .fee-modal-close {
          background: transparent;
          border: none;
          font-size: 28px;
          color: #64748b;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .fee-modal-close:hover {
          color: #ef4444;
        }

        .fee-modal-description {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .fee-modal-description strong {
          color: #1e293b;
          font-weight: 700;
        }

        .fee-table-container {
          width: 100%;
          margin-bottom: 25px;
        }

        .fee-table-header-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 1.2fr 1.5fr;
          gap: 15px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
          font-weight: 700;
          color: #64748b;
          font-size: 14px;
        }

        .fee-table-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 1.2fr 1.5fr;
          gap: 15px;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .fee-table-row:last-child {
          border-bottom: none;
        }

        .fee-col {
          color: #334155;
          font-size: 14px;
          font-weight: 600;
        }

        .fee-modal-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.6;
        }

        .fee-modal-footer p {
          margin: 0 0 5px 0;
        }

        @media (max-width: 768px) {
          .fee-table-header-row {
            display: none;
          }
          .fee-table-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 20px 0;
            position: relative;
          }
          .fee-col {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .fee-col::before {
            content: attr(data-label);
            font-weight: 700;
            color: #64748b;
          }
          .fee-col:first-child::before {
            display: none;
          }
          .fee-col:first-child {
            margin-bottom: 10px;
            justify-content: center;
          }
        }

        @media (max-width: 992px) {
          .calculator-wrapper {
            flex-direction: column;
            gap: 40px;
          }
          
          .calc-left, .calc-right {
            width: 100%;
          }

          .organic-blob-wrapper {
            height: 320px;
          }
          
          .badge-say-no {
            width: 95px;
            height: 95px;
            font-size: 11px;
          }
          
          .badge-main {
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeeCalculator;
