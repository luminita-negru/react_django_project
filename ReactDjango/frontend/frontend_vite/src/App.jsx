import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/login";
import {Navigation} from './component/navigation';
import {Logout} from './component/logout';
import StockChecker from './component/StockChecker';
import FinancialNews from './component/FinancialNews';
import StockTicker from './component/StockTicker';
import Trade from './component/TradingStock';
import RegisterForm from './component/RegisterForm';
import Portfolio from './component/Portfolio';
import HomePage from './component/HomePage';
import FAQPage from './component/FAQPage';
import ContactPage from './component/ContactPage';
import DonatePage from './component/DonatePage';
import Footer from './component/Footer';

function App() {
    return (
      <BrowserRouter>
        <Navigation />
        <StockTicker />
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/frontend/login" element={<Login/>}/>
          <Route path="/frontend/logout" element={<Logout/>}/>
          <Route path="/frontend/stock" element={<StockChecker/>}/>
          <Route path="/frontend/news" element={<FinancialNews/>}/>
          <Route path="/frontend/trade" element={<Trade/>}/>
          <Route path="/frontend/register" element={<RegisterForm/>}/>
          <Route path="/frontend/portfolio" element={<Portfolio/>}/>
          <Route path="/frontend/faq" element={<FAQPage />} />
          <Route path="/frontend/contact" element={<ContactPage />} />
          <Route path="/frontend/donate" element={<DonatePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    )
        
}
export default App;