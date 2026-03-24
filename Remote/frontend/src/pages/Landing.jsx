import React from "react";
import Footer from "../components/Footer";
import "./Landing.css";

const Landing = () => {
  const features = [
    {
      icon: "🍅",
      title: "Pomodoro Timer",
      description: "Boost your productivity with focused work sessions and regular breaks."
    },
    {
      icon: "📋",
      title: "Task Management",
      description: "Organize and track your tasks with our intuitive task management system."
    },
    {
      icon: "⏱️",
      title: "Time Tracking",
      description: "Monitor your time spent on different activities and projects."
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Get insights into your productivity patterns with detailed analytics."
    },
    {
      icon: "🔒",
      title: "Secure Authentication",
      description: "Keep your data safe with our secure authentication system."
    },
    {
      icon: "💬",
      title: "Team Communication",
      description: "Collaborate effectively with your team members and managers."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500+", label: "Teams" },
    { number: "1M+", label: "Tasks Completed" },
    { number: "98%", label: "User Satisfaction" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      features: [
        "Up to 5 team members",
        "Basic task management",
        "Time tracking",
        "Basic analytics",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$9",
      period: "/month",
      popular: true,
      features: [
        "Up to 50 team members",
        "Advanced task management",
        "Advanced analytics",
        "Screenshot monitoring",
        "Priority support",
        "Custom integrations"
      ]
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "/month",
      features: [
        "Unlimited team members",
        "Enterprise-grade security",
        "Custom workflows",
        "Advanced reporting",
        "24/7 phone support",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">📊</span>
              <span className="logo-text">Team Tracker</span>
            </div>
            <nav className="nav-menu">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
              <div className="auth-buttons">
                <button
                  className="login-btn"
                  onClick={() => window.location.hash = 'login'}
                >
                  Login
                </button>
                <button
                  className="signup-btn"
                  onClick={() => window.location.hash = 'login'}
                >
                  Create Account
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Remote Team <br />
                Productivity <span className="highlight">Made</span>
              </h1>
              <p>
                Team Tracker helps teams and team productivity all in one
                comprehensive remote team management system. Get the
                insights you need to boost.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => window.location.hash = 'login'}>
                  Get Started
                </button>
                <button className="btn-secondary">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hero-image">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="preview-title">Task Management</span>
                </div>
                <div className="preview-content">
                  <p>Organize and track tasks with our intuitive task management system for better productivity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need</h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-content">
            <div className="testimonial-text">
              <blockquote>
                "This team tracking tool definitely increases our team's
                productivity. We can track what each of them."
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div className="author-info">
                  <div className="author-name">John Doe</div>
                  <div className="author-title">CEO, TechCorp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    {plan.period && <span className="period">{plan.period}</span>}
                  </div>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>✓ {feature}</li>
                  ))}
                </ul>
                <button className={`plan-button ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                  {plan.name === 'Starter' ? 'Get Started' : 'Contact Sales'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Boost Your Team's Productivity?</h2>
            <p>Join thousands of teams already using Team Tracker</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.hash = 'login'}>
                Get Started
              </button>
              <button className="btn-secondary">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
