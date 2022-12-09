import React,{useEffect, useState,useRef} from 'react'

import { Player } from '@lottiefiles/react-lottie-player';
import loader from '../../assets/json/ekIdle.json'
import BG from '../../assets/json/ekBG.json'
import {Link} from 'react-router-dom'
import useAutoLogout from "../home/IdleTimeout";
import Tabs from './Tabs'
import { useNavigate } from 'react-router-dom';
export const Home = () =>{
    const videoBg = './assets/gradientBG.mp4'
    const navigate = useNavigate()
    let timer = useAutoLogout(100);

    const exitAdmin = () => {
        localStorage.removeItem('modalCheck')
        navigate('/')
    }
   useEffect(() => {
    if(localStorage.getItem('modalCheck') == '' || localStorage.getItem('modalCheck') == null)
    {
        navigate('/')
    }
   })

    //const [loading, setLoader] = useState(loader)
    if(timer == 0){
        document.getElementById('lottie-player').classList.remove('hidden')
    }
    const lottieEnd = () => {
        document.getElementById('lottie-player').classList.add('hidden')
    }
    return (
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-end align-items-center position-relative z-index col-md-12 py-5"><button className="btn btn-danger mx-2" onClick={() => exitAdmin()}>Exit admin tool</button></div>
            </div>
            
            <Tabs />
            <div className="home hidden" id="lottie-player" onClick={lottieEnd}>
            <Player 
                src={loader}
                loop
                autoplay
            />
            </div>
           
            <Link to="/admin">
                <div className="bg">
                    <Player 
                    src={BG}
                    loop
                    autoplay
                     />
                </div>
            
            </Link> 
            
        </div>
    )
}

export default Home