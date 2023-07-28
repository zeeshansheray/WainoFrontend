import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/cart.context'

import { LayoutContext } from '../context/layout.context'

export default function NavbarSecondary() {

    const [selected, setSelected] = useState('home')
    const layout = useContext(LayoutContext)

    useEffect(() => {
        if(window.location.pathname?.includes('waino-explorer')){
            setSelected('waino-explorer')
        }
        else if(window.location.pathname?.includes('about')){
            setSelected('about')
        }
        else if(window.location.pathname?.includes('profile')){
            setSelected('profile')
        }
        else{
            setSelected('home')
        }

    },[window.location.pathname])

    return (
        <div id="Navbar" className={`${!layout.state.showNav && 'd-none'}`}>
            <section id="secondaryHeader">
                {/* <Link to="/"><a ><img src={PngIcons.logo} height="35px" className="logo" alt="" /></a></Link> */}
                <Link to="/"></Link>
                <div>
                    <ul id="navbar" className="cp">
                        <li className='secondaryList'><Link to="/" className={`${selected == "home" && 'active'}`} href="index.html">Home</Link></li>

                        <li className='secondaryList'><Link  className={`${selected == "waino-explorer" && 'active'}`} to="/waino-explorer">Waino Explorer</Link></li>

                        <li className='secondaryList'><Link  className={`${selected == "about" && 'active'}`} to="/about">About</Link></li>

                        <li className='secondaryList'><Link  className={`${selected == "profile" && 'active'}`} to="/profile">Profile</Link></li>

                        {/* <li><Link  to="/contact" className={`${selected == "contact" && 'active'}`}>Contact</Link></li> */}
                        <Link to="" id="close"><i className="far fa-times"></i></Link>
                    </ul>
                </div>
                <div id="mobile">
                    <Link to="cart"  className={`${selected == "cart" && 'active'}`}><i className="far fa-shopping-bag"></i></Link>
                    <i id="bar" className="fas fa-outdent"></i>
                </div>
            </section>
        </div>
      )
    }
