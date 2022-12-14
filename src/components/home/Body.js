import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import lockerFree from '../../assets/img/lockerFree.svg'
import lockerOccupied from '../../assets/img/lockerOccupied.svg'
import eyeIcon from '../../assets/img/eyeIcon.svg'
import { Player } from '@lottiefiles/react-lottie-player';
import dataLoading from '../../assets/json/ekLoader.json'

import gohome from '../../assets/json/goHomeLottie.json'
import reopen from '../../assets/json/lockDoorLottie.json'
import QRCode from "qrcode.react";

import { useNavigate } from 'react-router-dom'

export const Body = ({setPopup}) =>{
    const navigate = useNavigate()
    const [listDoors, fetchDoors] = useState([])
    const [doorID, setDoorID] = useState(0)
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

    const [showPin, setShowText] = useState('')
    const [disableBtn, setDisableBtn] = useState(true)
    const [postNewpin, setPin] = useState('')
    const [checkoutURL, setcheckoutURL] = useState(null)
    const [loader, setLoader] = useState('')

    const [doorStatus, setDoorStatus] = useState('')
    const [errorStatus, setErrorStatus] = useState('')
 
    const [activeHome, setHome] = useState('')
    const [activeReopen, setActive] = useState('')
    const [alias, setAlias] = useState('')
    const [activeLottie, setActiveLottie] = useState(0)
    const [urlSet, setURL] = useState('')
    const APIUrl = 'http://localhost:3000/LockerDetails'
    const doorURL = 'http://localhost:9090/api/lockercontroller/door/'
    
    let dataInterval = ""
    let newarr = []
    const fetchData = () => {
        axios.get(APIUrl).then((res) => {
            
            if(res.data.length == 0){
                axios
                .get(getDoorUrl)
                .then((response) => {
                newarr = response.data.data.doors
                    {Object.keys(response.data.data.doors).map((key) => {
                        fetch(APIUrl, {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                transID: "",
                                lockerLocation: process.env.REACT_APP_LOCKER_LOCATION,
                                doorSize: "S",
                                doorStatus: 0,
                                paymentStatus: '',
                                payType: '',
                                amount: process.env.REACT_APP_LOCKER_PRICE,
                                doorOpenCount: "",
                                mpin: "",
                                timeIn: "",
                                timeOut: "",
                                img_url: lockerFree,
                                alias:""
                            })
                        })
                    })}
                    
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            else {
                fetchDoors(res.data)
            }
        })

        
    }

    const checkDoors = () => {
        axios.get(APIUrl).then((res) => {
            fetchDoors(res.data)
        })
    }
    const postData = (key,status, timein, aliasData) => {
        
        setOverlay('hidden')
        setModal('hidden')
        
        setDoorID(key)
        localStorage.setItem('doorID',key)
        localStorage.setItem('timein',timein)
        localStorage.setItem('alias',aliasData)
        setDoorStatus(status)
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
        setActiveLottie(0)
        setHome('')
        setActive('')
        document.getElementById('lottie-wrapper').classList.add('opacity')
        document.getElementById('lottie-multiple').classList.add('pointer')
        document.getElementById('lottie-multiple').classList.remove('active')
    }
    const postPin = (pin, doorNumber) => {
        
        axios.get(APIUrl+'/?alias='+alias).then((res) => {
            console.log(res.data.length)
            if(res.data.length == 1){
                setErrorStatus('Duplicate alias is not allowed')
                
            }else {
                
                setModal('')
                setNewModal('hidden')
                postPayment(pin,doorNumber)
            }
        })
            
    }
    const changeHome = () => {
        setActive('')
        setHome('active')
        setActiveLottie(2)
    }
    const changeActive = () => {
        setActive('active')
        setHome('')
        setActiveLottie(1)
    }
  
    const cancelTransaction = () => {
        setOverlay('')
        setModal('')
        setDoorID(0)
        setCart('')
        setInput('')
        setNewModal('')
        setErrorStatus('')
        setActiveLottie(0)
        setHome('')
        setActive('')
        setAlias('')
        setPin('')
        setShowText('')
        setcheckoutURL('')
        localStorage.removeItem('transID')
        localStorage.removeItem('doorID')
        localStorage.removeItem('timein')
        localStorage.removeItem('alias')
        if(localStorage.getItem('modalCheck') != 1){
            document.getElementById('alias-text').value = ""
        }
        
        localStorage.removeItem('modalCheck')
        
     
    }
    function keyDown(e) { 
        var x = document.getElementById("alias-text").value;
        document.getElementById("alias-text").value=x.replace(/[^a-zA-Z0-9]/g, "");

    }
    const postPayment = (pin,door_number) => {
        setURL('')
        //localStorage.removeItem('transID')
                const options = {
                    method: 'POST',
                    headers: {
                      accept: 'application/json',
                      'content-type': 'application/json',
                      //authorization: 'Basic c2tfbGl2ZV9hQ1g4cExSaUR1WFFnZ21BVUtzREh3RVo6'
                      authorization: 'Basic c2tfdGVzdF9adDVGZVlhcVBmZmp3VWF1U3Y4RUVURFA6'
                    },
                    body: JSON.stringify({
                      data: {
                        attributes: {
                          amount: 10000,
                          redirect: {
                            success: 'https://qubesmartlocker.onrender.com/',
                            failed: 'https://qubesmartlockers.com/'
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
                        setLoader(dataLoading)

                        dataInterval = setInterval(()=> {
                            fetchPaymentStatus(
                                pin,door_number,
                                response.data.id, 
                                response.data.attributes.redirect.checkout_url
                                )
                        },1000)
                       
                        setcheckoutURL(response.data.attributes.redirect.checkout_url)
                        setURL('1')
                        document.getElementById('qr').classList.remove('hidden')
                         return () => clearInterval(dataInterval) 
        
                    })
                    .catch((err)=> {
                        console.log(err)
                    })
            
      
       
           

    }

    const fetchPaymentStatus = (pin,door_number,transactionID, checkoutUrl) => {
        
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              //authorization: 'Basic c2tfbGl2ZV9hQ1g4cExSaUR1WFFnZ21BVUtzREh3RVo6'
              authorization: 'Basic c2tfdGVzdF9adDVGZVlhcVBmZmp3VWF1U3Y4RUVURFA6'
            }
          };
          
          fetch('https://api.paymongo.com/v1/sources/'+transactionID, options)
         
            .then(response => response.json())
            .then(response => {
                
                
                const options1 = {
                    method: 'POST',
                    headers: {
                      accept: 'application/json',
                      'content-type': 'application/json',
                      //authorization: 'Basic c2tfbGl2ZV9hQ1g4cExSaUR1WFFnZ21BVUtzREh3RVo6'
                      authorization: 'Basic c2tfdGVzdF9adDVGZVlhcVBmZmp3VWF1U3Y4RUVURFA6'
                      
                    },
                    body: JSON.stringify({
                      data: {
                        attributes: {
                          amount: 10000,
                          description: "Payment for Locker Location " + process.env.REACT_APP_LOCKER_LOCATION + ", with mpin # " + pin,
                          source: {type: 'source', id: transactionID},
                          currency: 'PHP',
                        }
                      }
                    })
                  };
                  
                  fetch('https://api.paymongo.com/v1/payments', options1)
                    .then(response => response.json())
                    .then(response => {
                        const status = response.data.attributes.status 
                        console.log(pin+ " === " + door_number + " === " + transactionID + " === " +checkoutUrl + '=== ' + status)
                        if(status == 'paid'){
                            //console.log(checkoutUrl + ' - ' + door_number + ' - ' + pin)
                            axios.patch('http://localhost:3000/LockerDetails/'+door_number, {
                                doorStatus: 1,
                                paymentStatus: 'paid',
                                payType: process.env.REACT_APP_PAYTYPE,
                                doorOpenCount: 1,
                                mpin: pin,
                                timeIn: new Date().toLocaleString(),
                                timeOut: '',
                                img_url: lockerOccupied,
                                alias: alias

                            }).then(resp => {
                                const api = doorURL+door_number+'/open'
                                axios.get(api).then(res => {
                                }).catch(err => { 
                                    console.log(err)
                                });

                                cancelTransaction()
                                fetchData()
                                clearInterval(dataInterval) 
                            }).catch(error => {
                                console.log(error);
                            });
                                
                            /**/
                        }
                        
                        
                    })
                    .catch(err => console.error(err));
                
                  
            })
            .catch(err => console.error(err));
    }

    const reopenDoor = (pin,doorid) => {
        console.log(alias)
       if(activeLottie == 1){
            axios.get('http://localhost:3000/LockerDetails/?id='+doorid+'&&mpin='+pin).then(res => {
                if(res.data.length == 1){
                    const api = doorURL+doorid+'/open'
                    axios.get(api).then(res => {
                        
                    }).catch(err => { 
                        console.log(err)
                    });
                   cancelTransaction()
                    
                }
                else {
                    setErrorStatus('Wrong Mpin, cannot open door!')
                    setPin('')
                    setCart('')
                }
                
            })
       }
       else if(activeLottie == 2) {
            fetch('http://localhost:3000/LocalData', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transID: doorid,
                    lockerLocation: process.env.REACT_APP_LOCKER_LOCATION,
                    doorSize: "S",
                    doorStatus: 1,
                    paymentStatus: 'paid',
                    payType: 'gcash',
                    amount: process.env.REACT_APP_LOCKER_PRICE,
                    doorOpenCount: 1,
                    mpin: pin,
                    alias: localStorage.getItem('alias'),
                    timeIn: localStorage.getItem('timein'),
                    timeOut: new Date().toLocaleString(),
                    img_url: lockerFree
                })
            })
            axios.get('http://localhost:3000/LockerDetails/?id='+doorid+'&&mpin='+pin).then(res => {
               
            if(res.data.length == 1){
                    const api = doorURL+doorid+'/open'
                    
                    axios.get(api).then(res => {
                        axios.patch('http://localhost:3000/LockerDetails/'+doorid, {
                            transID: "",
                            lockerLocation: process.env.REACT_APP_LOCKER_LOCATION,
                            doorSize: "S",
                            doorStatus: 0,
                            paymentStatus: "",
                            payType: process.env.REACT_APP_PAYTYPE,
                            amount: process.env.REACT_APP_LOCKER_PRICE,
                            doorOpenCount: "",
                            mpin: "",
                            timeIn: "",
                            timeOut: "",
                            img_url: "/static/media/lockerFree.405b616d76d7e3fa8a26558893d947c8.svg",
                            alias: ""

                        }).then(resp => {
                                                        
                            fetchData()
                            cancelTransaction()
                        }).catch(error => {
                            console.log(error);
                        });
                    }).catch(err => { 
                        console.log(err)
                    });
                    
                }
                else {
                    setErrorStatus('Wrong Mpin, cannot open door!')
                    setPin('')
                    setCart('')
                }
                
            })
       }
        
            
        /**/
    }

    const loginAdmin = () => {
        if(cart == process.env.REACT_APP_STAFF_PIN){
           window.location.href="/admin"
        }
        else{
            setErrorStatus('not matched')
        }
    }
    useEffect(() => {
        fetchData()  
       /* const dataInterval = setInterval(()=> {
            checkDoors()
        },500)*/

       setPopup(modalPopup)
       localStorage.removeItem('modalCheck')
        //return () => clearInterval(dataInterval)  
         
    },[])
    const modalPopup = 1
    const numberorder = useRef(null);
    useEffect((e) => {
       if(doorStatus == 0){
            if(cart.length < 6 || alias.length == 0){
                setPointNewPin('pointer')
                setDisableNewPin(true)
            }
            else {
                setPointNewPin('')
                setDisableNewPin(false)
            }
       }
       else if(doorStatus == 1){
            if(activeLottie == 0 || cart.length < 4){
                setPointNewPin('pointer')
                setDisableNewPin(true)
            }else {
                setPointNewPin('')
                setDisableNewPin(false)
               
            }
       }


       

        if(cart.length > 5 && localStorage.getItem('modalCheck') != 1 ){
            setDisable(true)
            setPoint('pointer')
            if(doorStatus ==1){
                document.getElementById('lottie-wrapper').classList.remove('opacity')
                document.getElementById('lottie-multiple').classList.remove('pointer')
            }
           
        }
        else if(cart.length < 4 && localStorage.getItem('modalCheck') != 1){
            setDisable(false)
            setPoint('')
            setHome('')
            setActive('')
           // document.getElementById('lottie-wrapper').classList.add('opacity')
           // document.getElementById('lottie-multiple').classList.add('pointer')
        }

        else if(cart.length > 15 && localStorage.getItem('modalCheck') == 1 ){
            setDisable(true)
            setPoint('pointer')
            setPointNewPin('')
            setDisableNewPin(false)
        }
        else{
            setDisable(false)
            setPoint('')
            setHome('')
            setActive('')
        }
       
        if(localStorage.getItem('modalCheck') == 1){
            
            setModal('hidden')
            setOverlay('hidden')
            if (numberorder.current) {
                numberorder.current.focus();
              }
        }
        
        
    })


    return (
        <div className="row">
             
            <div className={overlay ? 'overlay' : 'overlay hidden'}></div>
            <div className={modal ? 'modal' : 'modal hidden'}>
                
                
                {
                    (() => {
                        if(localStorage.getItem('modalCheck') != 1) {
                            const status = <div className="modal-title pt-3 color-green">Set pin for door #{doorID} </div>
                            return status
                        }
                        else{
                            const status = <div className="modal-title pt-3 color-green">Admin Tool</div>
                            return status
                        }
                    })()  
                } 

                
                
                <div className="modal-body modal-title mx-3 py-2">
                {
                    (() => {
                        if(localStorage.getItem('modalCheck') != 1) {
                            const status = <span>Status: </span>
                            return status
                        }  
                    })()  
                } 
                
                {
                    (() => {
                        if(doorStatus == 0 && localStorage.getItem('modalCheck') != 1) {
                            const status = <span className="door-status color-green"> Free</span>
                            return status
                        }
                        else if(doorStatus == 1 && localStorage.getItem('modalCheck') != 1){
                            const status = <span className="door-status color-red"> Occupied</span>
                            return status
                        }  
                        else{
                            const status = <span className="door-status color-green"></span>
                            return status
                        } 
                    })()  
                }  

                {
                    (() => {
                        if(doorStatus == 0 && localStorage.getItem('modalCheck') != 1) {
                            const status = <div className="txt-pin col-md-11 mx-auto mt-3 px-3 position-relative "><input type="text" autoComplete='off' placeholder='Set locker nickname' id="alias-text" maxLength={6} onChange={(e) => setAlias(e.target.value.toUpperCase())} onKeyDown={keyDown}/>
                            </div>
                            return status
                        }  
                    })()  
                }  

                    
                    <div className={showPin  ? 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative ' : 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative password'} id="number-input" onChange={saveInput} >{cart}
                  
                        <div className="eye-icon" id="eye-icon" onClick={showText}><img src={eyeIcon} /></div> 
                    
                    </div>  
                    <div className="px-3"><h6 className="color-red">{errorStatus}</h6></div>
                    
                </div>

              
            </div>

            <div className={newmodal ? 'modal modal-first' : 'modal hidden'}>
                <div className="modal-title pt-3">Door {doorID} </div>
                <div className="modal-body modal-title mx-3 py-2">
                    <div className="text-center py-4">Scan to pay</div>

                    

                    <div className="qr-border d-flex justify-content-center align-items-center mx-auto hidden" id="qr">
                    {/* <QRCode value={checkoutURL}/> */ }
                        {
                            (() => {
                                if(urlSet == ""){
                                    const loading = <Player src={loader} loop autoplay />
                                    return loading
                                }
                                else {
                                    const loading = <QRCode value={checkoutURL}/>
                                    return loading
                                }   
                            })()  
                        } 
                    </div>  
                    <div className="text-center py-4">{process.env.REACT_APP_LOCKER_PRICE}</div>
                    <div className="text-center">Whole day or until final checkout</div>
                    <div className="text-center lottie"> <Player src={loader} loop autoplay /> </div>
                    <div className="text-center"> Waiting for payment </div>
                    <div className="text-center btn-cancel pt-5"><button onClick={cancelTransaction}>Close Window</button></div>
                </div>

              
            </div>






            
            {
                    (() => {
                        if(doorStatus == 0 && localStorage.getItem('modalCheck') != 1) {
                            const status = 
                            <div className={modal ? 'modal second free' : 'modal hidden second free'} id="modal-second">
                            <div className="py-2">Tap to set pin</div>
                            <div className="modal-number-section d-flex justify-content-start align-items-center flex-wrap">
                                <div onClick={() => handleClick(1)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>1</div>
                                <div onClick={() => handleClick(2)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>2</div>
                                <div onClick={() => handleClick(3)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>3</div>
                                <div onClick={() => handleClick(4)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>4</div>
                                <div onClick={() => handleClick(5)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>5</div>
                                <div onClick={() => handleClick(6)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>6</div>
                                <div onClick={() => handleClick(7)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>7</div>
                                <div onClick={() => handleClick(8)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>8</div>
                                <div onClick={() => handleClick(9)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>9</div>
                                
                                <div onClick={() => handleClick(0)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>0</div>
                                <div onClick={()=>clearAll()} className="btn btn-danger mx-2 clear d-flex justify-content-center align-items-center">Clear pin</div>
                                <input type="hidden" value={cart} id="hidden-text" onChange={(e) => setPin(e.target.value)} ref={numberorder}/>
                               
                                <div className="modal-button">
                               <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-success' : 'my-2 btn btn-success'} onClick={() => postPin(cart,doorID)}>Set pin</button></div>
                                       
                                    <div className="my-2"><button onClick={cancelTransaction} className="btn btn-default text-dark">Close Window</button></div>
                                                
                                </div>
                            </div>
                                
                            
                        </div>
                            return status
                        }
                        else if(doorStatus == 1 && localStorage.getItem('modalCheck') != 1){
                            const status = 
                            <div className={modal ? 'modal second occupied' : 'modal hidden second occupied'} id="modal-second">
                            <div className="py-2">Tap to set pin</div>
                            <div className="modal-number-section d-flex justify-content-start align-items-center flex-wrap">
                                <div onClick={() => handleClick(1)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>1</div>
                                <div onClick={() => handleClick(2)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>2</div>
                                <div onClick={() => handleClick(3)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>3</div>
                                <div onClick={() => handleClick(4)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>4</div>
                                <div onClick={() => handleClick(5)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>5</div>
                                <div onClick={() => handleClick(6)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>6</div>
                                <div onClick={() => handleClick(7)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>7</div>
                                <div onClick={() => handleClick(8)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>8</div>
                                <div onClick={() => handleClick(9)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>9</div>
                                
                                <div onClick={() => handleClick(0)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>0</div>
                                <div onClick={()=>clearAll()} className="btn btn-danger mx-2 clear d-flex justify-content-center align-items-center">Clear pin</div>
                                <input type="hidden" value={cart} id="hidden-text" onChange={(e) => setPin(e.target.value)}/>
                                <div className="text-dark position-absolute lottie-wrapper  opacity" id="lottie-wrapper" >How would you like to open your locker?
                                    <div className={activeReopen ? "col-md-12 border-radius my-3 lottie-multiple d-flex justify-content-around align-items-center  active" : "col-md-12 border-radius my-3 lottie-multiple d-flex justify-content-around align-items-center"} onClick={changeActive} id="lottie-multiple">
                                        <div><Player src={reopen} loop autoplay /></div>
                                        <div>Open and play at EK
                                            <div><small>Re-open and lock your locker to use again later</small></div>
                                        </div>
                                        
                                    </div>
                                    <div className={activeHome ? 'col-md-12 border-radius my-3 lottie-multiple d-flex justify-content-around align-items-center  active' : "col-md-12 border-radius my-3 lottie-multiple d-flex justify-content-around align-items-center"} onClick={changeHome} id="lottie-multiple">
                                        <div><Player src={gohome} loop autoplay /></div>
                                        <div>Open and go home
                                            <div><small>Get your items and checkout when leaving EK</small></div>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <div className="modal-button">
                                <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-success' : 'my-2 btn btn-success'} onClick={() => reopenDoor(cart,doorID)}>Open locker</button></div>
                                    
                                    <div className="my-2"><button onClick={cancelTransaction} className="btn btn-default text-dark">Close Window</button></div>
                                    {/* <div className="sync-data position-absolute"><button className=" btn btn-danger"> Sync Data</button></div> */ }              
                                </div>
                            </div>
                                
                            
                        </div>
                            return status
                        }   

                        else{
                            const status = 
                            <div className={modal ? 'modal second admin' : 'modal hidden second admin'} id="modal-second">
                            <div className="py-2">Tap to set pin</div>
                            <div className="modal-number-section d-flex justify-content-start align-items-center flex-wrap">
                                <div onClick={() => handleClick(1)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>1</div>
                                <div onClick={() => handleClick(2)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>2</div>
                                <div onClick={() => handleClick(3)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>3</div>
                                <div onClick={() => handleClick(4)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>4</div>
                                <div onClick={() => handleClick(5)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>5</div>
                                <div onClick={() => handleClick(6)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>6</div>
                                <div onClick={() => handleClick(7)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>7</div>
                                <div onClick={() => handleClick(8)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>8</div>
                                <div onClick={() => handleClick(9)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>9</div>
                                
                                <div onClick={() => handleClick(0)} disabled={disable} id="btn-number" className={point ? 'pointer' : ''}>0</div>
                                <div onClick={()=>clearAll()} className="btn btn-danger mx-2 clear d-flex justify-content-center align-items-center">Clear pin</div>
                                <input type="hidden" value={cart} id="hidden-text" onChange={(e) => setPin(e.target.value)}/>
                               
                                
                                <div className="modal-button">
                                <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-success' : 'my-2 btn btn-success'} onClick={() => loginAdmin(cart)}>Login as admin</button></div>
                                    
                                    <div className="my-2"><button onClick={cancelTransaction} className="btn btn-default text-dark">Close Window</button></div>
                                    {/* <div className="sync-data position-absolute"><button className=" btn btn-danger"> Sync Data</button></div> */ }              
                                </div>
                            </div>
                                
                            
                        </div>
                            return status
                        }
                    })()  
                }  
            
            
            <div className="position-relative rounded-big col-md-12 mx-auto body-content d-flex justify-content-start flex-wrap">
            
            
            
                {
                listDoors
                    .map(
                        item => 
                        {
                            
                            if(item.doorStatus == 1){
                                const doorStats = <div key={item.id} className="col-door col-md-2 d-flex justify-content-center align-items-center px-2 py-2" onClick={() => postData(item.id, item.doorStatus,item.timeIn, item.alias)}>
                                     
                                <h2 className="position-absolute color-white">
                                {item.lockerLocation}{item.id}               
                                </h2>
                                <img src={item.img_url} />
                                <h5 className="color-white position-absolute mt-5">{item.alias}</h5> 
                                </div>
                                return doorStats   
                            }
                            else {
                                const doorStats = <div key={item.id} className="col-door col-md-2 d-flex justify-content-center align-items-center px-2 py-2" onClick={() => postData(item.id, item.doorStatus, item.timeIn)}>
                                     
                                <h2 className="position-absolute">
                                   {item.lockerLocation}{item.id}               
                                </h2>
                                <img src={item.img_url} /> 
                                </div>
                                
                                return doorStats   
                            }
                                
                        }
                    )
                    
                }
               
            </div>
        </div>
    )
}

export default Body