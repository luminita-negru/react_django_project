// src/component/FAQPage.jsx
import React, { useState } from 'react';
const faqData = [
  {
    question: "What is this trading simulator?",
    answer: "Our trading simulator allows you to practice trading stocks with virtual money. It's a safe environment to learn and test trading strategies without risking real money."
  },
  {
    question: "How do I get started?",
    answer: "To get started, simply create an account by clicking on the 'Open Account' button on the home page. Once registered, you can start trading with $10,000 of virtual money."
  },
  {
    question: "Is it free to use?",
    answer: "Yes, our trading simulator is completely free to use. You can practice trading without any cost."
  },
  {
    question: "Can I lose real money using the simulator?",
    answer: "No, you cannot lose real money while using the simulator. All trading is done with virtual money."
  },
  {
    question: "What data is used in the simulator?",
    answer: "The simulator uses real-time market data to provide a realistic trading experience. You can also back-test trading strategies using historical market data."
  },
  {
    question: "Can I access the simulator from my mobile device?",
    answer: "Yes, the simulator is accessible from any device with an internet connection, including mobile phones and tablets."
  }
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      {faqData.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggleFAQ(index)}>
            <h2>{faq.question}</h2>
            <span>{openIndex === index ? '-' : '+'}</span>
          </div>
          {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}

export default FAQPage;
