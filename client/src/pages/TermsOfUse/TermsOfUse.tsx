import React from 'react';
import styles from './LegalPages.module.scss';

const TermsOfUse: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Terms of Use</h1>
      <p>Last updated: August 2025</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our services, you agree to be bound by these Terms of Use. Please
          read them carefully.
        </p>
      </section>

      <section>
        <h2>2. Use of Services</h2>
        <p>You may use our services only for lawful purposes and in accordance with these Terms.</p>
      </section>

      <section>
        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account information and
          all activities under your account.
        </p>
      </section>

      <section>
        <h2>4. Intellectual Property</h2>
        <p>
          All content, logos, and materials are owned by us or our licensors and are protected by
          intellectual property laws.
        </p>
      </section>

      <section>
        <h2>5. Limitation of Liability</h2>
        <p>
          We are not liable for any indirect, incidental, or consequential damages arising from the
          use of our services.
        </p>
      </section>

      <section>
        <h2>6. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of our services constitutes
          acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
      </section>
    </div>
  );
};

export default TermsOfUse;
