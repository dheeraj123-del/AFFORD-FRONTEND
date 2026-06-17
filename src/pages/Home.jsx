import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Shield, Layers, HelpCircle } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badgeWrapper}>
          <div className={styles.announcementBadge}>
            <Sparkles size={14} className={styles.sparkleIcon} />
            <span>Premium E-Commerce Comparison Engine</span>
          </div>
        </div>
        <h1 className={styles.heroTitle}>
          Discover the Top Products across <span className="gradient-text">Multiple Platforms</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Aggregate, filter, and sort products from leading e-commerce providers instantly. Built with performance, responsiveness, and state-of-the-art aesthetics.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/dashboard" className="premium-btn premium-btn-primary">
            <span>Launch Dashboard</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="premium-btn premium-btn-secondary">
            <span>Setup API Credentials</span>
          </Link>
        </div>
      </section>

      {/* Floating Decorative Elements */}
      <div className={styles.glow1}></div>
      <div className={styles.glow2}></div>

      {/* Feature Grid */}
      <section className={styles.features}>
        <h2 className={styles.sectionHeading}>Engineered for Excellence</h2>
        <div className={styles.grid}>
          {/* Card 1 */}
          <div className={`glass ${styles.featureCard}`}>
            <div className={`${styles.iconContainer} ${styles.violet}`}>
              <Zap size={22} />
            </div>
            <h3>Real-time Aggregation</h3>
            <p>Simultaneously poll records from multiple marketplaces including AMZ, FLP, MYN, SNP, and AZO, providing instant unified comparison.</p>
          </div>

          {/* Card 2 */}
          <div className={`glass ${styles.featureCard}`}>
            <div className={`${styles.iconContainer} ${styles.cyan}`}>
              <Layers size={22} />
            </div>
            <h3>Deep Categorization</h3>
            <p>Explore distinct categories like Laptops, Phones, Smart TVs, Chargers, and Audio headsets with matching spec sheets.</p>
          </div>

          {/* Card 3 */}
          <div className={`glass ${styles.featureCard}`}>
            <div className={`${styles.iconContainer} ${styles.emerald}`}>
              <Shield size={22} />
            </div>
            <h3>API Fallback System</h3>
            <p>Our intelligent middleware automatically swaps to high-fidelity local mockup caches if mock servers encounter rate-limits or are down.</p>
          </div>
        </div>
      </section>

      {/* Help Section / Info Banner */}
      <section className={`glass ${styles.infoBanner}`}>
        <div className={styles.infoContent}>
          <HelpCircle size={36} className={styles.infoIcon} />
          <div>
            <h3>Need to test the live API?</h3>
            <p>Head to the API Registration tab to enter your details, simulate token acquisition, and establish connections with the test servers.</p>
          </div>
        </div>
        <Link to="/login" className={`premium-btn premium-btn-primary ${styles.bannerBtn}`}>
          <span>Get Started</span>
        </Link>
      </section>
    </div>
  );
}
