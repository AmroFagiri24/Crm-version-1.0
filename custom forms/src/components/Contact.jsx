import React from 'react';

function Contact() {
  return (
    <div className="contact-section">
      <div className="contact-header">
        <h2>Contact Us</h2>
        <p>Get in touch with our support team</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-card">
          <div className="contact-item">
            <div className="contact-icon">📧</div>
            <div className="contact-details">
              <h3>Email Support</h3>
              <a href="mailto:Emporos2025@gmail.com" className="contact-link">
                Emporos2025@gmail.com
              </a>
              <p>We'll respond within 24 hours</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div className="contact-details">
              <h3>Phone Support</h3>
              <a href="tel:+250796588929" className="contact-link">
                +250 796 588 929
              </a>
              <p>Available Monday - Friday, 9 AM - 6 PM</p>
            </div>
          </div>
        </div>
        
        <div className="contact-info">
          <h3>Need Help?</h3>
          <ul>
            <li>Technical support and troubleshooting</li>
            <li>Account and subscription inquiries</li>
            <li>Feature requests and feedback</li>
            <li>Training and onboarding assistance</li>
          </ul>
        </div>
      </div>
      
      <style jsx>{`
        .contact-section {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .contact-header h2 {
          color: var(--clr-primary);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .contact-header p {
          color: var(--clr-text-secondary);
          font-size: 1.1rem;
        }
        
        .contact-content {
          display: grid;
          gap: 2rem;
        }
        
        .contact-card {
          background: var(--clr-bg-secondary);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .contact-item:last-child {
          margin-bottom: 0;
        }
        
        .contact-icon {
          font-size: 2.5rem;
          background: var(--clr-primary);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-details h3 {
          color: var(--clr-text-primary);
          margin: 0 0 0.5rem 0;
          font-size: 1.3rem;
        }
        
        .contact-link {
          color: var(--clr-primary);
          text-decoration: none;
          font-size: 1.2rem;
          font-weight: 600;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .contact-link:hover {
          text-decoration: underline;
        }
        
        .contact-details p {
          color: var(--clr-text-secondary);
          margin: 0;
          font-size: 0.9rem;
        }
        
        .contact-info {
          background: var(--clr-bg-secondary);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .contact-info h3 {
          color: var(--clr-text-primary);
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }
        
        .contact-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .contact-info li {
          color: var(--clr-text-secondary);
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--clr-border);
          position: relative;
          padding-left: 1.5rem;
        }
        
        .contact-info li:before {
          content: "✓";
          color: var(--clr-success);
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .contact-info li:last-child {
          border-bottom: none;
        }
        
        @media (max-width: 768px) {
          .contact-section {
            padding: 1rem;
          }
          
          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .contact-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Contact;