import React from 'react';
import styles from './LegalPages.module.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>
      <p>Last updated: August 2025</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email, and usage data to improve
          our services.
        </p>
      </section>

      <section>
        <h2>2. How We Use Information</h2>
        <p>
          The information we collect is used to provide and enhance our services, communicate with
          you, and ensure security.
        </p>
      </section>

      <section>
        <h2>3. Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with trusted partners or as
          required by law.
        </p>
      </section>

      <section>
        <h2>4. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to improve user experience and analyze usage
          patterns.
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your data, but no method is 100%
          secure.
        </p>
      </section>

      <section>
        <h2>6. Changes to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Continued use of our services indicates
          acceptance of the changes.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please reach out to us.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
