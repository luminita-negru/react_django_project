// src/component/FAQPage.jsx
import React, { useState } from 'react';
const faqData = [
  {
    question: "What is this trading simulator?",
    answer: "Our trading simulator allows you to practice trading stocks with virtual money. It's a safe environment to learn and test trading strategies without risking real money. The simulator provides comprehensive data to support your trading decisions, including real-time news updates about stocks and detailed graphical representations of market trends and stock performance. This enables users to stay informed about the latest developments in the financial markets and analyze market movements effectively."
  },
  {
    question: "How do I get started?",
    answer: "To get started, simply create an account by clicking on the 'Open Account' button on the home page. During the registration process, you'll need to provide some basic information including the name of your portfolio, your risk tolerance, and your trading objectives. Once registered, you will have a free account and can start trading with $10,000 of virtual money."
  },
  {
    question: "Is it free to use?",
    answer: "Yes, our trading simulator is completely free to use. You can practice trading without any cost. This allows you to explore different trading strategies and learn how the financial markets work without any financial risk. We believe in providing an accessible platform for everyone, regardless of their experience level or financial background. By using our simulator, you can gain valuable insights and skills that can help you make informed decisions in real-life trading. Additionally, you will have access to real-time market data, financial news, and graphical analysis tools, all at no cost."
  },
  {
    question: "Can I lose real money using the simulator?",
    answer: "No, you cannot lose real money while using the simulator. All trading is done with virtual money. This ensures that you can experiment with different trading strategies and techniques without any financial risk. Our simulator is designed to provide a realistic trading experience, allowing you to understand the dynamics of the financial markets without the pressure of losing real funds. It's an excellent way to build your confidence and develop your skills before engaging in real-money trading. Additionally, the use of virtual money enables you to learn from your mistakes and refine your approach, ensuring that you are well-prepared for actual market conditions."
  },
  {
    question: "What data is used in the simulator?",
    answer: "The simulator uses real-time market data to provide a realistic trading experience. We use data fetched from Yahoo Finance. This ensures that you are trading with the most up-to-date information available, closely mirroring actual market conditions. By using real-time data, you can practice making timely decisions and learn how to respond to market movements as they happen."
  },
  {
    question: "How accurate is the data provided by the financial market simulator?",
    answer: "Our financial market simulator aims to provide data that closely mirrors real-time market conditions. The data is sourced from reputable financial data providers to ensure accuracy and reliability. However, it is important to note that while we strive to offer the most accurate data possible, there may be slight delays or discrepancies due to the nature of real-time data processing. The simulator is designed primarily for educational purposes, and while it provides a realistic trading environment, it should not be used as a sole resource for making actual investment decisions."
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
