import React, { useState } from "react";
import TwoFactorAuth from "./TwoFactorAuth";

function LoginForm({ onLogin, users = [] }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    countryCode: '+250'
  });

  const countryCodes = [
    { code: '+250', country: 'Rwanda' },
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+254', country: 'Kenya' },
    { code: '+256', country: 'Uganda' },
    { code: '+255', country: 'Tanzania' }
  ];

  // Hardcoded admin for cross-device access
  const ADMIN_ACCOUNT = {
    username: "AmroFagiri",
    password: "K93504241Aa",
    name: "System Admin",
    role: "admin",
    tenantId: null
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    if (isRegistering) {
      // Registration
      if (!formData.name || !formData.companyName || !formData.email || !formData.phone) {
        setError("Please fill all fields.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Phone validation
      if (formData.phone.length < 9) {
        setError("Please enter a valid phone number.");
        return;
      }

      // Check if username exists in Firebase
      try {
        const { getUser, saveUser } = await import('../utils/firebase');
        const existingUser = await getUser(username);
        
        if (existingUser) {
          setError("Username already exists in the system.");
          return;
        }
        
        // Also check local users
        const localExistingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (localExistingUser) {
          setError("Username already exists.");
          return;
        }

        // Create new user with 7-day trial
        const trialStartDate = new Date();
        const trialEndDate = new Date();
        trialEndDate.setDate(trialStartDate.getDate() + 7);
        
        const newUser = {
          username,
          password,
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          role: 'super_manager',
          tenantId: Date.now().toString(),
          companyName: formData.companyName,
          licenseType: 'trial',
          subscriptionStatus: 'trial',
          trialStartDate: trialStartDate.toISOString(),
          trialEndDate: trialEndDate.toISOString(),
          createdAt: new Date().toISOString()
        };

        await saveUser(newUser);
        
        // Also create company entry
        const { saveRestaurant } = await import('../utils/firebase');
        const companyData = {
          tenantId: newUser.tenantId,
          companyName: newUser.companyName,
          ownerName: newUser.name,
          ownerUsername: newUser.username,
          ownerEmail: newUser.email,
          ownerPhone: newUser.phone,
          licenseType: 'trial',
          subscriptionStatus: 'trial',
          trialStartDate: newUser.trialStartDate,
          trialEndDate: newUser.trialEndDate,
          createdAt: new Date().toISOString()
        };
        
        await saveRestaurant(companyData);
        setPendingUser(newUser);
        setShowTwoFA(true);
      } catch (error) {
        console.error('Registration error:', error);
        setError("Registration failed. Please try again.");
      }
    } else {
      // Login
      // Check hardcoded admin first
      if (username.toLowerCase() === ADMIN_ACCOUNT.username.toLowerCase() && password === ADMIN_ACCOUNT.password) {
        setPendingUser(ADMIN_ACCOUNT);
        setShowTwoFA(true);
        return;
      }

      try {
        // Check Firebase for user
        const { getUser } = await import('../utils/firebase');
        const user = await getUser(username);

        if (user && user.password === password) {
          console.log('User authenticated from Firebase:', user.username);
          // Show 2FA for admin and super_manager roles
          if (user.role === 'admin' || user.role === 'super_manager') {
            setPendingUser(user);
            setShowTwoFA(true);
          } else {
            onLogin(user);
          }
        } else {
          // Also check local users array as fallback
          const localUser = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === password
          );
          
          if (localUser) {
            console.log('User authenticated from local storage:', localUser.username);
            if (localUser.role === 'admin' || localUser.role === 'super_manager') {
              setPendingUser(localUser);
              setShowTwoFA(true);
            } else {
              onLogin(localUser);
            }
          } else {
            setError("Invalid username or password.");
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        // Fallback to local users if Firebase fails
        const localUser = users.find(u => 
          u.username.toLowerCase() === username.toLowerCase() && 
          u.password === password
        );
        
        if (localUser) {
          console.log('User authenticated from local fallback:', localUser.username);
          if (localUser.role === 'admin' || localUser.role === 'super_manager') {
            setPendingUser(localUser);
            setShowTwoFA(true);
          } else {
            onLogin(localUser);
          }
        } else {
          setError("Login failed. Please check your credentials and try again.");
        }
      }
    }
  };

  const handleTwoFASuccess = () => {
    setShowTwoFA(false);
    onLogin(pendingUser);
    setPendingUser(null);
  };

  const handleTwoFACancel = () => {
    setShowTwoFA(false);
    setPendingUser(null);
    setError("");
  };

  return (
    <>
      {showTwoFA && (
        <TwoFactorAuth
          user={pendingUser}
          onVerifySuccess={handleTwoFASuccess}
          onCancel={handleTwoFACancel}
        />
      )}
      <div className="login-container" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto"
      }}>
      <div className="login-box" style={{
        width: "100%",
        maxWidth: "450px",
        maxHeight: "90vh",
        padding: "40px",
        backgroundColor: "var(--clr-bg-primary)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        border: "1px solid var(--clr-border)",
        boxSizing: "border-box",
        overflowY: "auto",
        margin: "auto 0"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 className="login-title" style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            margin: "0 0 10px 0"
          }}>Emporos Nexus</h1>
          <p style={{ 
            color: "var(--clr-text-secondary)", 
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            margin: "10px 0 0 0",
            lineHeight: "1.4"
          }}>Welcome back! Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
            </>
          )}
          
          {!isRegistering && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}
          
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "var(--clr-text-primary)"
                }}>📧 Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "2px solid var(--clr-border)",
                    borderRadius: "8px",
                    fontSize: "1em",
                    transition: "border-color 0.3s ease",
                    backgroundColor: "var(--clr-bg-primary)"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--clr-border)"}
                />
              </div>
              
              <div className="form-group">
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "var(--clr-text-primary)"
                }}>📱 Phone Number</label>
                <div style={{ 
                  display: 'flex', 
                  gap: 'clamp(6px, 2vw, 8px)',
                  alignItems: 'stretch',
                  width: '100%',
                  flexWrap: 'wrap'
                }}>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                    style={{ 
                      width: 'clamp(100px, 25%, 110px)',
                      minWidth: '100px',
                      padding: "12px 8px",
                      border: "2px solid var(--clr-border)",
                      borderRadius: "8px",
                      fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
                      backgroundColor: "var(--clr-bg-primary)",
                      cursor: "pointer",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--clr-border)"}
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.code} {country.country}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                    placeholder="123456789"
                    style={{ 
                      flex: 1,
                      minWidth: '150px',
                      padding: "12px 15px",
                      border: "2px solid var(--clr-border)",
                      borderRadius: "8px",
                      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                      transition: "border-color 0.3s ease",
                      backgroundColor: "var(--clr-bg-primary)",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--clr-border)"}
                  />
                </div>
              </div>
            </>
          )}
          {error && (
            <div style={{
              backgroundColor: "#ffebee",
              color: "var(--clr-danger)",
              padding: "12px 15px",
              borderRadius: "8px",
              margin: "15px 0",
              border: "1px solid #ffcdd2",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>!</span>
              {error}
            </div>
          )}
          <button 
            type="submit" 
            className="primary-btn"
            style={{
              width: "100%",
              padding: "clamp(12px, 3vw, 15px)",
              fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
              fontWeight: "600",
              marginTop: "10px",
              minHeight: "48px"
            }}
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setFormData({ name: '', companyName: '', email: '', phone: '', countryCode: '+250' });
            }}
            style={{
              width: "100%",
              padding: "clamp(10px, 2.5vw, 12px)",
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              marginTop: "15px",
              background: "transparent",
              border: "2px solid var(--clr-primary)",
              color: "var(--clr-primary)",
              borderRadius: "8px",
              cursor: "pointer",
              minHeight: "44px"
            }}
          >
            {isRegistering ? 'Back to Login' : 'Create New Account'}
          </button>

        </form>
      </div>
    </div>
    </>
  );
}

export default LoginForm;
