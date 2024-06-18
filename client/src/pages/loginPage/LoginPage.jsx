import React from 'react';
import {  Card } from 'react-bootstrap';
import styles from './LoginPage.module.css';
import  LoginForm  from '../../components/common/LoginForm';

function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginCard}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          <LoginForm />
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;