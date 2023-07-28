import React, { useEffect, useState } from 'react'
import Progress from '../../components/Progress';
import {SvgIcons} from '../../icons';
import { LayoutContext } from '../../context/layout.context';
import { useContext } from 'react';
import Navbar from '../../components/merchant/Navbar';
import SidebarNav from '../../components/merchant/sidebar/SidebarNav';

function Reports() {
  const layout = useContext(LayoutContext)

  useEffect(()=>{
    
    layout.setLayout({
      showNav : false,
      showFooter: false,

    })
  },[])


  return (
    <div className='d-flex'>
    <SidebarNav />
    <div className='component w-100'>
      <h4  className = 'Heading22B color-heading'>
          Reports
        </h4>

    </div>
    
    </div>
    )
}

export default Reports