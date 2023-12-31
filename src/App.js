import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/global.scss'

import LayoutContextProvider, { LayoutContext } from './context/layout.context';
import { withToaster } from './context/Toaster.context';

import CustomToasters from './components/CustomToasters';

import {
  BrowserRouter,
  Routes,
  Route,
  withRouter,
} from "react-router-dom";

import MainPage from './pages/home/Mainpage';
import Navbar from './components/Navbar';
import WainoExplorer from './pages/home/WainoExplorer';
import { useContext, useEffect } from 'react';
import About from './pages/home/About';
import Profile from './pages/home/Profile';


function App(props) {
  const layout = useContext(LayoutContext)

  return (
    <div className="App">
        <BrowserRouter>
            <CustomToasters/>
            <Navbar/>
            <Routes>
              <Route exact path  = "/" element                     = {<MainPage/>}/>
              <Route exact path  = "waino-explorer" element                     = {<WainoExplorer/>}/>
              <Route exact path  = "about" element                     = {<About/>}/>
              <Route exact path  = "profile" element                     = {<Profile/>}/>
              <Route path="*" element={<MainPage/>} />
            </Routes>
          {/* <Footer/> */}
        </BrowserRouter>
    </div>
  );
}

export default withToaster(App);
