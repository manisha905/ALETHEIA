import React, { useState } from 'react';

const HomePage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    agency: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactResponse, setContactResponse] = useState(null);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactResponse(`✅ SECURE INQUIRY TRANSMITTED. Ticket ID #ALT-INQ-${Math.floor(1000 + Math.random() * 9000)}. Department Desk will respond via encrypted email within 2 hours.`);
    setContactForm({ name: '', agency: '', email: '', phone: '', message: '' });
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section id="home" className="hero-section section-padding">
        <div className="container">
          <div className="hero-grid-v2">
            {/* LEFT COL */}
            <div className="hero-left-col">
              <div className="terminal-tag">
                <span className="tag-icon">🔒</span> CLASSIFIED // LAW ENFORCEMENT DECISION-SUPPORT PORTAL
              </div>

              <h1 className="hero-title">
                ALETHEIA <span className="glow-text">·</span> CASEMIND AI
              </h1>

              <div className="hero-motto">
                <span className="motto-text">"JUSTICE DELAYED IS JUSTICE DENIED!"</span>
              </div>

              <h2 className="hero-subtitle">
                REVEAL THE CONCEALED. SECURE MULTI-HYPOTHESIS INVESTIGATIVE INTELLIGENCE SYSTEM.
              </h2>

              <p className="hero-description">
                Investigations stall when voluminous evidence and fragmented caseloads overwhelm manual review. 
                <strong> ALETHEIA · CASEMIND AI</strong> provides an explainable decision-support environment for law enforcement departments—uncovering buried contradictions, cross-checking alibis, and unlocking cold cases.
              </p>

              <div className="forensics-banner-card">
                <div className="forensics-title-banner">
                  <span className="pulse-dot"></span> LET'S DECODE THE CASE TOGETHER
                </div>
                <div className="forensics-image-wrapper">
                  <img src="/forensics_banner.png" alt="Forensics Evidence Analysis - Let's Decode the Case Together" className="forensics-img" />
                </div>
              </div>
            </div>

            {/* RIGHT COL */}
            <div className="hero-right-col">
              <div className="banner-image-container">
                <img src="/cta_banner.png" alt="ALETHEIA Access Protocol Banner" className="static-cta-banner" />
              </div>

              <div className="impact-cards-column">
                <div className="impact-card">
                  <div className="impact-icon">⌛</div>
                  <h3>Break Cold Cases</h3>
                  <p>Prevent active leads from going cold by linking fragmented evidence across jurisdictions.</p>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🔍</div>
                  <h3>Uncover Contradictions</h3>
                  <p>Detect hidden alibi mismatches and statement discrepancies automatically.</p>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">⚖️</div>
                  <h3>Eliminate Cognitive Bias</h3>
                  <p>Synthesize alternative hypotheses to protect against confirmation bias and wrongful outcomes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION SECTION */}
      <section id="vision" className="section-padding bg-darker">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">[ FUTURE HORIZONS ]</div>
            <h2 className="section-title">OUR VISION & FUTURE GOALS</h2>
            <p className="section-subtitle">Transforming investigative intelligence into a zero-bias, precision-driven science.</p>
          </div>

          <div className="vision-grid">
            <div className="vision-card">
              <div className="vision-icon">🛰️</div>
              <h3>ZERO COLD CASES</h3>
              <p>
                Our primary goal is a world where no cold case is left unsolved due to lost leads or fragmented evidence across jurisdictional boundaries.
              </p>
            </div>

            <div className="vision-card">
              <div className="vision-icon">⚖️</div>
              <h3>PREVENT WRONGFUL CONVICTIONS</h3>
              <p>
                By rigorously testing alternative hypotheses and uncovering contradictions early, ALETHEIA protects innocent lives from confirmation bias.
              </p>
            </div>

            <div className="vision-card">
              <div className="vision-icon">🌐</div>
              <h3>INTER-AGENCY INTELLIGENCE SHARING</h3>
              <p>
                Empowering law enforcement agencies with secure, privacy-preserving cross-jurisdictional evidence matching to dismantle organized networks.
              </p>
            </div>

            <div className="vision-card">
              <div className="vision-icon">🛡️</div>
              <h3>AUDITABLE COURTROOM EVIDENTIARY INTEGRITY</h3>
              <p>
                Every finding emitted by ALETHEIA is backed by exact page-level citations and Vault encrypted signatures, guaranteeing 100% explainable judicial chain of custody.
              </p>
            </div>
          </div>

          <div className="vision-quote-box text-center">
            <blockquote className="glow-text">
              "JUSTICE DELAYED IS JUSTICE DENIED! Our ultimate vision is to empower every investigator with unyielding clarity, speed up justice for victims' families, and ensure truth always prevails."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ABOUT US & CONTACT */}
      <section id="about" className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">[ MISSION & DIRECT CONTACT ]</div>
            <h2 className="section-title">ABOUT US & HELP DESK</h2>
            <p className="section-subtitle">Dedicated to serving law enforcement agencies, judicial bodies, and investigative task forces.</p>
          </div>

          <div className="about-grid">
            <div className="about-text-box">
              <h3>WHO WE ARE & HOW WE ARE MAKING THE WORLD A BETTER PLACE</h3>
              <p>
                <strong>ALETHEIA · CASEMIND AI</strong> was created to eliminate the tragic bottleneck of unresolved cases and unmanageable evidence backlogs.
              </p>
              <p>
                Every day, dedicated investigators spend hundreds of hours manually reviewing thousands of pages of conflicting witness statements, call logs, and crime scene reports. Human cognitive limits inevitably lead to missed micro-correlations and delayed justice.
              </p>
              <p>
                By unifying unstructured evidence into structured, explainable intelligence, <strong>ALETHEIA</strong> empowers investigators to see the complete picture, protect innocent citizens, and bring long-overdue answers to families and communities.
              </p>

              <div className="contact-details-box">
                <h4>DIRECT AGENCY HELP & CONTACT DETAILS</h4>
                <ul className="contact-info-list">
                  <li>
                    <span className="info-icon">📞</span>
                    <div>
                      <strong>24/7 TACTICAL HELP HOTLINE:</strong>
                      <div>+1 (800) 555-CASE / +91 (011) 2301-ALETHEIA</div>
                    </div>
                  </li>
                  <li>
                    <span className="info-icon">✉️</span>
                    <div>
                      <strong>OFFICIAL ENCRYPTED EMAIL:</strong>
                      <div>investigations@aletheia-casemind.ai / helpdesk@aletheia.gov.in</div>
                    </div>
                  </li>
                  <li>
                    <span className="info-icon">🏢</span>
                    <div>
                      <strong>DEFENSE & INTELLIGENCE HEADQUARTERS:</strong>
                      <div>ALETHEIA Systems Tower, Cyber Command Zone, Suite 900</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="contact-form-box">
              <div className="form-header">
                <h3>SECURE INQUIRY / HELP DESK FORM</h3>
                <p>For Law Enforcement Officers, Investigators & Judicial Support</p>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>FULL NAME / RANK:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Inspector A. Kumar"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>DEPARTMENT NAME / ID:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Metro Cyber Branch / DEPT-04"
                    value={contactForm.agency}
                    onChange={(e) => setContactForm({ ...contactForm, agency: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>DEPARTMENT EMAIL ADDRESS:</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. officer@police.gov.in"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CONTACT PHONE NUMBER:</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. +91 9876543210"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>INQUIRY / HELP REQUEST DETAILS:</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Describe your inquiry or requested deployment timeframe..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-outline btn-block">
                  ⚡ TRANSMIT SECURE INQUIRY
                </button>
              </form>

              {contactResponse && (
                <div className="terminal-response-box" style={{ marginTop: '15px' }}>
                  {contactResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
