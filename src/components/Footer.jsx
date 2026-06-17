import React from 'react';
import { ShoppingBag } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`glass ${styles.footer}`}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <ShoppingBag size={18} />
            </div>
            <span className={styles.brandName}>
              Top<span className="gradient-text">Products</span>
            </span>
          </div>
          <p className={styles.tagline}>
            Compare and analyze top products across leading e-commerce engines in real-time.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomSection}>
          <p className={styles.copy}>
            &copy; {currentYear} TopProducts Platform. All rights reserved.
          </p>
          <div className={styles.links}>
            <span className={styles.link}>Evaluation Sandbox</span>
            <span className={styles.dot}>&middot;</span>
            <span className={styles.link}>Terms &amp; Specs</span>
            <span className={styles.dot}>&middot;</span>
            <span className={styles.link}>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
