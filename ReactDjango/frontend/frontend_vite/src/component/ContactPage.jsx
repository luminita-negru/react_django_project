import React, { useState } from 'react';
import axios from 'axios';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/contact/`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Your message has been sent successfully!');
    } catch (error) {
      setMessage('Failed to send your message. Please try again.');
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
        <div className="contact-container2">
        <img src="/contactus.png" className="contact-image"></img>
        <p>If you need assistance navigating or using our site, or if you have any questions or concerns, we're here to help. Additionally, we highly value your feedback as it helps us improve and grow. Whether you have suggestions, comments, or just want to share your experience, we want to hear from you.</p>
        <p>You can reach out to us by sending an email through the form above. Simply fill in your details and message, and our team will get back to you as soon as possible. Your input is crucial in helping us provide the best possible service and enhancing your experience with our financial market simulator.</p>
        <p>Thank you for taking the time to connect with us. We look forward to assisting you and appreciate your support and feedback!</p>
      </div>
      <p></p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary submit-button">Send Message</button>
      </form>
      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
}

export default ContactPage;
