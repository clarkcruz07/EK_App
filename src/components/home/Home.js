import React from 'react'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'

import {Link} from 'react-router-dom'
export const Home = () =>{
    const videoBg = './assets/gradientBG.mp4'
    return (
        <div className="container">
            
            <Link to="/"><video autoPlay muted loop id="videoBg">
            <source src={videoBg} type="video/mp4" />
            </video>
            <Header /> 
            <Body />
            <Footer />   
            </Link>    
        </div>
    )
}

export default Home