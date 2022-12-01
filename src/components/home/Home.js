import React,{useState} from 'react'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import { Player } from '@lottiefiles/react-lottie-player';
import loader from '../../assets/json/ekIdle.json'
import BG from '../../assets/json/ekBG.json'
import {Link} from 'react-router-dom'
import useAutoLogout from "./IdleTimeout";
export const Home = () =>{
    const videoBg = './assets/gradientBG.mp4'
    let timer = useAutoLogout(100);

    //const [loading, setLoader] = useState(loader)
    if(timer == 0){
        document.getElementById('lottie-player').classList.remove('hidden')
    }
    const lottieEnd = () => {
        document.getElementById('lottie-player').classList.add('hidden')
    }
    return (
        <div className="container">
            <div className="home hidden" id="lottie-player" onClick={lottieEnd}>
            <Player 
                src={loader}
                loop
                autoplay
            />
            </div>
           
            <Link to="/">
                <div className="bg">
                    <Player 
                    src={BG}
                    loop
                    autoplay
                     />
                </div>
            
            <Header /> 
            <Body />
            <Footer />   
            </Link>    
        </div>
    )
}

export default Home