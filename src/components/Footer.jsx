import React from 'react';
import LiveClock from './LiveClock';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-bottom-only">
          <div className="copyright">
            © 2026 ALETHEIA · CASEMIND AI. All rights reserved. Sovereign Law Enforcement Intelligence System.
          </div>
          <LiveClock />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
