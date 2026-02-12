import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="desktopFooter">
        <div className="footerInner">

          <div>
            <h3>Bartanwala</h3>
            <p>Wholesale Steel & Aluminium Utensils Supplier</p>
            <p>All India Delivery Available</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p>Categories</p>
            <p>Orders</p>
            <p>Contact</p>
          </div>

          <div>
            <h4>Contact</h4>
            <p>Phone: 98736XXXX</p>
            <p>Email: support@bartanwala.in</p>
          </div>

        </div>

        <div className="footerBottom">
          © {new Date().getFullYear()} Bartanwala. All Rights Reserved.
        </div>
      </footer>

      <style jsx>{`
        .desktopFooter {
          display: none;
          background: #111827;
          color: #ffffff;
          padding: 40px 80px;
          margin-top: 40px;
        }

        .footerInner {
          display: flex;
          justify-content: space-between;
        }

        h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        h4 {
          font-size: 14px;
          margin-bottom: 8px;
        }

        p {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .footerBottom {
          margin-top: 30px;
          border-top: 1px solid #374151;
          padding-top: 15px;
          font-size: 12px;
          text-align: center;
          color: #9ca3af;
        }

        @media (min-width: 1024px) {
          .desktopFooter {
            display: block;
          }
        }
      `}</style>
    </>
  );
    }
