// import { useState } from 'react'
// import './App.css'
// import 'vite/modulepreload-polyfill'

// function App() {
//   const [count, setCount] = useState(0)
//   const reactLogo = "/static/react.svg"
//   const viteLogo = "/static/vite.svg"


//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React + Django</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/login";
import {Home} from "./component/home";
import {Navigation} from './component/navigation';
import {Logout} from './component/logout';
// import {Register} from './component/register';
import {StockDataComponent} from './component/StockDataComponent';
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

function App() {
    return (
      <BrowserRouter>
        <Navigation />
        <StockTicker />
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/frontend/login" element={<Login/>}/>
          <Route path="/frontend/logout" element={<Logout/>}/>
          {/* <Route path="/frontend/register" element={<Register/>}/> */}
          <Route path="/frontend/stock" element={<StockChecker/>}/>
          <Route path="/frontend/news" element={<FinancialNews/>}/>
          <Route path="/frontend/trade" element={<Trade/>}/>
          <Route path="/frontend/register" element={<RegisterForm/>}/>
          <Route path="/frontend/portfolio" element={<Portfolio/>}/>
          <Route path="/frontend/faq" element={<FAQPage />} />
          <Route path="/frontend/contact" element={<ContactPage />} />
          <Route path="/frontend/donate" element={<DonatePage />} />
        </Routes>
      </BrowserRouter>
    )
        
}
export default App;