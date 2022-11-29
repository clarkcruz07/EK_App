import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import lockerFree from '../../assets/img/lockerFree.svg'
import lockerOccupied from '../../assets/img/lockerOccupied.svg'
import swal from 'sweetalert2'
import eyeIcon from '../../assets/img/eyeIcon.svg'
import { Player } from '@lottiefiles/react-lottie-player';
import dataLoading from '../../assets/json/ekLoader.json'
import QRCode from "qrcode.react";
export const Body = () =>{
    const [listDoors, fetchDoors] = useState([])
    const [doorID, setDoorID] = useState('')
    const [overlay, setOverlay] = useState('')
    const [modal, setModal] = useState('')
    const [newmodal, setNewModal] = useState('')
    const getDoorUrl = 'http://localhost:9090/api/lockercontroller/doors'
  
    const [cart, setCart] = useState([]);
    const [input, setInput] = useState([])
    const [disable, setDisable] = useState(false)
    const [point, setPoint] = useState('')

    const [disableNewPin, setDisableNewPin] = useState(false)
    const [pointNewPin, setPointNewPin] = useState('')

    const [indexing, setIndex] = useState('')
    const [showPin, setShowText] = useState('')

    const [postNewpin, setPin] = useState('')
    const [checkoutURL, setcheckoutURL] = useState('')
    const [loader, setLoader] = useState('')

    const [imgURL, setImgUrl] = useState(false)
    const APIUrl = 'http://localhost:3000/LockerDetails'
    const doorURL = 'http://localhost:9090/api/lockercontroller/door/'
    let url = ""
    let dataInterval = ""
    let transID = ""
    const fetchData = () => {
    
        axios
        .get(getDoorUrl)
        .then((response) => {
           
            fetchDoors(response.data.data.doors)

            {Object.keys(response.data.data.doors).map((key) => {
                axios
                .get(APIUrl+'/?doorNumber='+key)
                .then((res) => {
                    console.log(res)
                   
                
                })
                .catch((err) => {
                    console.log(err)
                })
            })}

            
            
                
            
                /**/
            
        })
        .catch((err) => {
            console.log(err)
        })
    }
    const postData = (key) => {
        setOverlay('hidden')
        setModal('hidden')
        setDoorID(key)
    }
    const showText = () => {
        setShowText('password')
        if(document.getElementById('number-input').classList.contains('password')){
            setShowText('password')
        }
        else{
            setShowText('')
        }
    }

    const saveInput = (e) => {
        setInput(e.target.value);
      };

    const handleClick = (e) => {
        setCart(prevState => [...prevState, e].join(''));

        
      }; 
    const clearAll = () => {     
        setCart('')
        setInput('')
    }
    const deleteEach = (e) => {
       
    }
    const postPin = (pin, doorNumber) => {
        
            postPayment()
            setModal('')
            setNewModal('hidden')
    }
    const cancelTransaction = () => {
        setOverlay('')
        setModal('')
        setDoorID(0)
        setCart('')
        setInput('')
        setNewModal('')
    }

    const postPayment = () => {
        
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: 'Basic c2tfdGVzdF9adDVGZVlhcVBmZmp3VWF1U3Y4RUVURFA6'
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  amount: 25000,
                  redirect: {
                    success: 'https://pandora-v2.onrender.com/api/success/',
                    failed: 'https://pandora-v2.onrender.com/api/success/'
                  },
                  type: 'gcash',
                  currency: 'PHP'
                }
              }
            })
          };
          
          fetch('https://api.paymongo.com/v1/sources', options)
            .then(response => response.json())
            .then(response => {                
                setcheckoutURL(response.data.attributes.redirect.checkout_url)
                localStorage.setItem('transID', response.data.id)

                dataInterval = setInterval(()=> {
                    fetchPaymentStatus()
                },1000)
                setLoader(dataLoading)
                //console.log(timerData)
                return () => clearInterval(dataInterval) 


            })
            .catch(err => console.error(err));
           

    }

    const fetchPaymentStatus = () => {
        const id = localStorage.getItem('transID')
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              authorization: 'Basic c2tfdGVzdF9adDVGZVlhcVBmZmp3VWF1U3Y4RUVURFA6'
            }
          };
          
          fetch('https://api.paymongo.com/v1/sources/'+id, options)
            .then(response => response.json())
            .then(response => {

                
                const options = {
                    method: 'POST',
                    headers: {
                      accept: 'application/json',
                      'content-type': 'application/json',
                      authorization: 'Basic c2tfdGVzdF9adDVGZVlhcVBmZmp3VWF1U3Y4RUVURFA6'
                    },
                    body: JSON.stringify({
                      data: {
                        attributes: {
                          amount: 25000,
                          source: {type: 'source', id: localStorage.getItem('transID')},
                          currency: 'PHP'
                        }
                      }
                    })
                  };
                  
                  fetch('https://api.paymongo.com/v1/payments', options)
                    .then(response => response.json())
                    .then(response => {
                        console.log(process.env.REACT_APP_LOCKER_LOCATION)
                        const status = response.data.attributes.status 
                        if(status == 'paid'){
                            const api = doorURL+doorID+'/open'
                            axios.get(api).then(res => {
                                fetch('http://localhost:3000/LockerDetails', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        transID: "",
                                        lockerLocation: process.env.REACT_APP_LOCKER_LOCATION,
                                        doorSize: "S",
                                        doorNumber: doorID,
                                        doorStatus: 1,
                                        paymentStatus: 'paid',
                                        payType: 'gcash',
                                        amount: '250.00',
                                        doorOpenCount: "",
                                        mpin: cart,
                                        timeIn: new Date().toLocaleString(),
                                        timeOut: ""
                                    })
                                })

                                setOverlay('')
                                setModal('')
                                setDoorID(0)
                                setCart('')
                                setInput('')
                                setNewModal('') 
                            }).catch(err => { 
                                console.log(err)
                            });
                            localStorage.removeItem('transID') 
                            clearInterval(dataInterval)
                        }
                        
                    })
                    .catch(err => console.error(err));
                
                  
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchData()       
    },[])
    useEffect((e) => {
        
        if(cart.length > 5){
            setDisable(true)
            setPoint('pointer')
        }
        else{
            setDisable(false)
            setPoint('')
        }

       if(cart.length < 4) {
            setPointNewPin('pointer')
            setDisableNewPin(true)
       }
       else {
            setPointNewPin('')
            setDisableNewPin(false)
       }
        
    })


    return (
        <div className="row">
            <div className={overlay ? 'overlay' : 'overlay hidden'}></div>
            <div className={modal ? 'modal' : 'modal hidden'}>
                <div className="modal-title pt-3"> Door {doorID} </div>
                <div className="modal-body modal-title mx-3 py-2">Status: <span className="door-status">Free</span>
                    <div className={showPin  ? 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative ' : 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative password'} id="number-input" onChange={saveInput}>{cart}
                    <div className="eye-icon" id="eye-icon" onClick={showText}><img src={eyeIcon} /></div>  
                    </div>  
                    
                    
                </div>

              
            </div>

            <div className={newmodal ? 'modal modal-first' : 'modal hidden'}>
                <div className="modal-title pt-3"> Door {doorID} </div>
                <div className="modal-body modal-title mx-3 py-2">
                    <div className="text-center py-4">Scan to pay</div>
                    <div className="qr-border d-flex justify-content-center align-items-center mx-auto"><QRCode value={checkoutURL}/></div> 
                    <div className="text-center py-4">{process.env.REACT_APP_LOCKER_PRICE}</div>
                    <div className="text-center">Whole day or until final checkout</div>
                    <div className="text-center"> <Player src={loader} loop autoplay /> </div>
                    <div className="text-center"> Waiting for payment </div>
                    <div className="text-center btn-cancel pt-5"><button onClick={cancelTransaction}>Cancel</button></div>
                </div>

              
            </div>

            <div className={modal ? 'modal second' : 'modal hidden second'}>
                
                <div className="modal-number-section d-flex justify-content-evenly align-items-center flex-wrap pt-2">
                    <div onClick={() => handleClick(1)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>1</div>
                    <div onClick={() => handleClick(2)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>2</div>
                    <div onClick={() => handleClick(3)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>3</div>
                    <div onClick={() => handleClick(4)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>4</div>
                    <div onClick={() => handleClick(5)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>5</div>
                    <div onClick={() => handleClick(6)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>6</div>
                    <div onClick={() => handleClick(7)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>7</div>
                    <div onClick={() => handleClick(8)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>8</div>
                    <div onClick={() => handleClick(9)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>9</div>
                    <div onClick={()=>deleteEach()}>Delete</div>
                    <div onClick={() => handleClick(0)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>0</div>
                    <div onClick={()=>clearAll()}>Clear all</div>
                    <input type="hidden" value={cart} id="hidden-text" onChange={(e) => setPin(e.target.value)}/>
                    
                </div>
                    <div className="modal-button">
                        <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer' : 'my-2'} onClick={() => postPin(cart,doorID)}>Set new pin</button></div>
                        <div className="my-2"><button onClick={cancelTransaction}>Cancel</button></div>
                                                
                    </div>
                
            </div>
            
            <div className="position-relative rounded-big col-md-12 mx-auto body-content d-flex justify-content-start flex-wrap">
            
                {Object.keys(listDoors).map((key, value) => {
                  
                    return (
                    <div key={key} className="col-md-3 d-flex justify-content-center align-items-center px-2 py-2" onClick={() => postData(key)}>
                        <h2 className="position-absolute">
                        {key}                        
                        </h2>
                        
                        <img src={lockerFree} />
                    </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Body