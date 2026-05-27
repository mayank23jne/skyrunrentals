import React from 'react';
import { motion } from 'framer-motion';
import { User, Bookmark } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800',
    date: '9 Mar, 2025',
    author: 'Admin',
    category: 'Tent, Traveling',
    title: 'Your Epic Southwest USA Road Trip Itinerary',
    desc: 'Located in Montecito, California, Rosewood Miramar Beach is accessible from various nearby cities.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    date: '5 Jan, 2025',
    author: 'Admin',
    category: 'Tent, Traveling',
    title: 'Ride the Wave of Thought with the Surfing Man',
    desc: 'Located in Montecito, California, Rosewood Miramar Beach is accessible from various nearby cities.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    date: '5 Jan, 2025',
    author: 'Admin',
    category: 'Tent, Traveling',
    title: 'Top 5 Destinations to Fuel Your Wanderlust',
    desc: 'Located in Montecito, California, Rosewood Miramar Beach is accessible from various nearby cities.'
  }
];

const RecentBlog: React.FC = () => {
  return (
    <section className="recent-blog-section">
      <div className="container">
        <div className="section-header">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="section-subtitle"
          >
            Latest Blog
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            News & Views From SkyRunRentals
          </motion.h2>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="blog-card"
            >
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} className="blog-img" />
                <div className="date-badge">{post.date}</div>
              </div>
              
              <div className="blog-content">
                <div className="blog-meta">
                  <div className="meta-item">
                    <User size={16} color="#f97316" />
                    <span>By {post.author}</span>
                  </div>
                  <div className="meta-item">
                    <Bookmark size={16} color="#f97316" />
                    <span>{post.category}</span>
                  </div>
                </div>
                
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-desc">{post.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .recent-blog-section {
          padding: 100px 0;
          background: #ffffff;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }


        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .blog-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .blog-image-wrapper {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .blog-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .blog-img {
          transform: scale(1.05);
        }

        .date-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #3b82f6;
          color: white;
          padding: 6px 18px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 700;
        }

        .blog-content {
          padding: 30px;
        }

        .blog-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
        }

        .blog-title {
          font-size: 24px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 15px;
          line-height: 1.3;
          font-family: 'Outfit', sans-serif;
        }

        .blog-desc {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          font-weight: 500;
        }

        @media (max-width: 1100px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .header-title { font-size: 32px; }
          .blog-grid { grid-template-columns: 1fr; }
          .blog-content { padding: 20px; }
          .blog-title { font-size: 20px; }
        }
      `}</style>
    </section>
  );
};

export default RecentBlog;
