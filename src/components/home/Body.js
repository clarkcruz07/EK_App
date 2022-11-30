import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import lockerFree from '../../assets/img/lockerFree.svg'
import lockerOccupied from '../../assets/img/lockerOccupied.svg'
import swal from 'sweetalert2'
import eyeIcon from '../../assets/img/eyeIcon.svg'
import { Player } from '@lottiefiles/react-lottie-player';
import dataLoading from '../../assets/json/ekLoader.json'
import QRCode from "qrcode.react";
import { useNavigate } from 'react-router-dom'

export const Body = () =>{
    const navigate = useNavigate();
    const [listDoors, fetchDoors] = useState([])
    const [doorID, setDoorID] = useState('')
    const [overlay, setOverlay] = useState('')
    const [modal, setModal] = useState('')
    const [modalUpdate, setUpdateModal] = useState('')
    const [newmodal, setNewModal] = useState('')
    const getDoorUrl = 'http://localhost:9090/api/lockercontroller/doors'
  
    const [cart, setCart] = useState([]);
    const [input, setInput] = useState([])
    const [disable, setDisable] = useState(false)
    const [point, setPoint] = useState('')

    const [disableNewPin, setDisableNewPin] = useState(false)
    const [pointNewPin, setPointNewPin] = useState('')

    const [showPin, setShowText] = useState('')

    const [postNewpin, setPin] = useState('')
    const [checkoutURL, setcheckoutURL] = useState('')
    const [loader, setLoader] = useState('')

    const [doorStatus, setDoorStatus] = useState('')
    const [errorStatus, setErrorStatus] = useState('')

    const [alias, setAlias] = useState('')
    const APIUrl = 'http://localhost:3000/LockerDetails'
    const doorURL = 'http://localhost:9090/api/lockercontroller/door/'
    let url = ""
    let dataInterval = ""
    let transID = ""
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
        /*
            
*/

        
    }
    const postData = (key,status) => {
        setOverlay('hidden')
        setModal('hidden')
        setDoorID(key)
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
                        const status = response.data.attributes.status 
                        if(status == 'paid'){
                            const api = doorURL+doorID+'/open'
                            axios.get(api).then(res => {
                                
                            axios.patch('http://localhost:3000/LockerDetails/'+doorID, {
                                doorStatus: 1,
                                paymentStatus: 'paid',
                                payType: process.env.REACT_APP_PAYTYPE,
                                doorOpenCount: 1,
                                mpin: cart,
                                timeIn: new Date().toLocaleString(),
                                timeOut: '',
                                img_url: lockerOccupied,
                                alias: alias

                            }).then(resp => {
                                console.log(resp.data);
                                fetchData()
                            }).catch(error => {
                                console.log(error);
                            });
                                
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

    const goHome = (pin, doorid) => {
        axios.get('http://localhost:3000/LockerDetails/?id='+doorid+'&&mpin='+pin).then(res => {
            if(res.data.length == 1){
                const api = doorURL+doorid+'/open'
                axios.get(api).then(res => {
                    axios.patch('http://localhost:3000/LockerDetails/'+doorid, {
                        doorStatus: 0,
                        doorOpenCount: 1,
                        mpin: cart,
                        timeOut: new Date().toLocaleString(),
                        img_url: lockerFree

                    }).then(resp => {
                        console.log(resp.data);
                        fetchData()
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(err => { 
                    console.log(err)
                });
                setOverlay('')
                setModal('')
                setDoorID(0)
                setCart('')
                setInput('')
                setNewModal('')
            }
            else {
                setErrorStatus('Wrong Mpin, cannot open door!')
            }
            
        })
    }
    const reopenDoor = (pin,doorid) => {
        console.log(pin + "-"+doorid)
            axios.get('http://localhost:3000/LockerDetails/?id='+doorID+'&&mpin='+pin).then(res => {
                if(res.data.length == 1){
                    const api = doorURL+doorid+'/open'
                    axios.get(api).then(res => {
                        
                    }).catch(err => { 
                        console.log(err)
                    });
                    setOverlay('')
                    setModal('')
                    setDoorID(0)
                    setCart('')
                    setInput('')
                    setNewModal('')
                }
                else {
                    setErrorStatus('Wrong Mpin, cannot open door!')
                }
                
            })
        /**/
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
                <div className="modal-title pt-3 color-green">Set pin for door #{doorID} </div>
                <div className="modal-body modal-title mx-3 py-2">Status: 
                {
                    (() => {
                        if(doorStatus == 0) {
                            const status = <span className="door-status color-green"> Free</span>
                            return status
                        }
                        else if(doorStatus == 1){
                            const status = <span className="door-status color-red"> Occupied</span>
                            return status
                        }   
                    })()  
                }  

                {
                    (() => {
                        if(doorStatus == 0) {
                            const status = <div className="txt-pin col-md-11 mx-auto mt-3 px-3 position-relative "><input type="text" placeholder='Set locker nickname' maxLength={12} onChange={(e) => setAlias(e.target.value)}/></div>
                            return status
                        }  
                    })()  
                }  

                    
                    <div className={showPin  ? 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative ' : 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative password'} id="number-input" onChange={saveInput}>{cart}
                    <div className="eye-icon" id="eye-icon" onClick={showText}><img src={eyeIcon} /></div>  
                    </div>  
                    <div className="px-3"><h6 className="color-red">{errorStatus}</h6></div>
                    
                </div>

              
            </div>

            <div className={newmodal ? 'modal modal-first' : 'modal hidden'}>
                <div className="modal-title pt-3">Door {doorID} </div>
                <div className="modal-body modal-title mx-3 py-2">
                    <div className="text-center py-4">Scan to pay</div>
                    <div className="qr-border d-flex justify-content-center align-items-center mx-auto"><QRCode value={checkoutURL}/></div> 
                    <div className="text-center py-4">{process.env.REACT_APP_LOCKER_PRICE}</div>
                    <div className="text-center">Whole day or until final checkout</div>
                    <div className="text-center lottie"> <Player src={loader} loop autoplay /> </div>
                    <div className="text-center"> Waiting for payment </div>
                    <div className="text-center btn-cancel pt-5"><button onClick={cancelTransaction}>Cancel</button></div>
                </div>

              
            </div>

            <div className={modal ? 'modal second' : 'modal hidden second'}>
                <div className="py-2">Tap to set pin</div>
                <div className="modal-number-section d-flex justify-content-evenly align-items-center flex-wrap">
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
                    {
                    (() => {
                        if(doorStatus == 0) {
                            const status = <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-success' : 'my-2 btn btn-success'} onClick={() => postPin(cart,doorID)}>Set pin</button></div>
                            return status
                        }
                        else if(doorStatus == 1){
                            const status = <div><div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-success' : 'my-2 btn btn-success'} onClick={() => reopenDoor(cart,doorID)}>Open locker</button></div>
                            <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-danger' : 'my-2 btn btn-danger'} onClick={() => goHome(cart,doorID)}>Going home</button></div></div>
                            
                            return status
                        }   
                    })()  
                    }  
                        
                        <div className="my-2"><button onClick={cancelTransaction} className="btn btn-default text-dark">Cancel</button></div>
                                                
                    </div>
                
            </div>
            
            <div className="position-relative rounded-big col-md-12 mx-auto body-content d-flex justify-content-start flex-wrap">
            
        

            {
                listDoors
                    .map(
                        item => 
                        {
                            if(item.doorStatus == 1){
                                const doorStats = <div key={item.id} className="col-md-3 d-flex justify-content-center align-items-center px-2 py-2" onClick={() => postData(item.id, item.doorStatus)}>
                                     
                                <h2 className="position-absolute color-white">
                                   {item.id}               
                                </h2>
                                <img src={item.img_url} />
                                <h5 className="color-white position-absolute mt-5">{item.alias}</h5> 
                                </div>
                                return doorStats   
                            }
                            else {
                                const doorStats = <div key={item.id} className="col-md-3 d-flex justify-content-center align-items-center px-2 py-2" onClick={() => postData(item.id, item.doorStatus)}>
                                     
                                <h2 className="position-absolute">
                                   {item.id}               
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