import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/cart.context'

import { LayoutContext } from '../context/layout.context'
import { UserContext } from '../context/user.context'

import {PngIcons} from '../icons'

import {utils} from '../utils'


export default function Navbar() {

    const [selected, setSelected] = useState('home')
    const layout = useContext(LayoutContext)

    useEffect(() => {
        if(window.location.pathname?.includes('products')){
            setSelected('products')
        }
        else if(window.location.pathname?.includes('blog')){
            setSelected('blog')
        }
        else if(window.location.pathname?.includes('contact')){
            setSelected('contact')
        }
        else if(window.location.pathname?.includes('user')){
            setSelected('user')
        }
        else if(window.location.pathname?.includes('cart')){
            setSelected('cart')
        }
        else{
            setSelected('home')
        }


    },[window.location.pathname])


    return (
        <div id="Navbar" className={`${!layout.state.showNav && 'd-none'}`}>
            <section id="header">
                {/* <Link to="/"><a ><img src={PngIcons.logo} height="35px" className="logo" alt="" /></a></Link> */}
                <Link to="/"></Link>
                <div>
                    <ul id="navbar" className="cp">
                        <li><Link to="/" className={`${selected == "home" && 'active'}`} href="index.html">Home</Link></li>

                        <li><Link to="/waino-explorer">Waino Explorer</Link></li>

                        <li><Link to="/about">About</Link></li>

                        <li><Link to="/profile">Profile</Link></li>

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
