import React,{useEffect,useState, useRef} from 'react'
import axios from 'axios'

import eyeIcon from '../../assets/img/eyeIcon.svg'
export const Tabs = () =>{
    const [index,setIndex] = useState(1)

    const [pinData, setPinData] = useState([])
    const [rebookDoor, setrebookDoor] = useState([])

    const [overlay, setOverlay] = useState('')
    const [modal, setModal] = useState('')

    const [cart, setCart] = useState([]);
    const [showPin, setShowText] = useState('')

    const [input, setInput] = useState([])
    const [errorStatus, setErrorStatus] = useState('')

    const [disable, setDisable] = useState(false)
    const [point, setPoint] = useState('')

    const [disableNewPin, setDisableNewPin] = useState(false)
    const [pointNewPin, setPointNewPin] = useState('')

    const [postNewpin, setPin] = useState('')
    const [doorID, setDoorID] = useState(0)
    
    const numberorder = useRef(null);
    const APIurl = 'http://localhost:3000/LockerDetails'
    const toggleTab = (indexTab) => {
        setIndex(indexTab)
    }

    const fetchRebookData = () => {
        axios.get('http://localhost:3000/LocalData').then((res) => {
           
            setrebookDoor(res.data)
        })
        .catch((err) => {

        })
    }

    const fetchForgotPin = () => {
        axios.get(APIurl + '/?doorStatus=1').then((res) => {
            //console.log(res.data)
            setPinData(res.data)
        })
        .catch((err) => {

        })
    }

    const popup = (doorID) => {
        setOverlay('hidden')
        setModal('hidden')
        setDoorID(doorID)
    }

    const saveInput = (e) => {
        setInput(e.target.value);
      };

    const showText = () => {
        setShowText('password')
        if(document.getElementById('number-input').classList.contains('password')){
            setShowText('password')
        }
        else{
            setShowText('')
        }
    }

    const handleClick = (e) => {
        setCart(prevState => [...prevState, e].join('')); 
    };
    const clearAll = () => {     
        setCart('')
        setInput('')
    } 

    const cancelTransaction = () => {
        setOverlay('')
        setModal('')
        setCart('')
        setInput('')
        setErrorStatus('')
        setShowText('')
             
     
    }

    const postPin = () => {
        console.log(doorID)
        axios.patch('http://localhost:3000/LockerDetails/'+doorID, {
            mpin: cart
        }).then(resp => {
            cancelTransaction()
        }).catch(error => {
            console.log(error);
        });
            
    }
    useEffect(() => {
        if(index == 1){
            document.getElementById('forgot').classList.remove('active')
            document.getElementById('session').classList.remove('active')
            document.getElementById('sync').classList.remove('active')
            document.getElementById('rebook').classList.add('active') 
            fetchRebookData()
        }
        else if(index == 2){
            document.getElementById('forgot').classList.add('active')
            document.getElementById('session').classList.remove('active')
            document.getElementById('sync').classList.remove('active')
            document.getElementById('rebook').classList.remove('active')
            fetchForgotPin()
        }
        else if(index == 3){
            document.getElementById('forgot').classList.remove('active')
            document.getElementById('session').classList.add('active')
            document.getElementById('sync').classList.remove('active')
            document.getElementById('rebook').classList.remove('active')
        }
        else if(index == 4){
            document.getElementById('forgot').classList.remove('active')
            document.getElementById('session').classList.remove('active')
            document.getElementById('sync').classList.add('active')
            document.getElementById('rebook').classList.remove('active')
        }

        if(cart.length > 5){
            setDisable(true)
            setPoint('pointer')
            
        }
        else{
            setDisable(false)
            setPoint('')
        }
        if(cart.length < 4){
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
             <div className="modal-title pt-3 color-green">Set new pin for door # {doorID}</div>                
                
                <div className="modal-body modal-title mx-3 py-2">
               
                    <div className={showPin  ? 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative ' : 'txt-pin col-md-11 mx-auto mt-3 px-3 position-relative password'} id="number-input" onChange={saveInput} >{cart}
                  
                        <div className="eye-icon" id="eye-icon" onClick={showText}><img src={eyeIcon} /></div> 
                    
                    </div>  
                    <div className="px-3"><h6 className="color-red">{errorStatus}</h6></div>
                    
                </div>

              
            </div>
            <div className={modal ? 'modal second free admin' : 'modal hidden second free'} id="modal-second">
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
                               <div className="my-2"><button disabled={disableNewPin} className={pointNewPin ? 'my-2 pointer btn btn-success' : 'my-2 btn btn-success'} onClick={() => postPin(cart)}>Set pin</button></div>
                                       
                                    <div className="my-2"><button onClick={cancelTransaction} className="btn btn-default text-dark">Close Window</button></div>
                                                
                                </div>
                            </div>
                                
                            
                        </div>
            <div className="wrapper z-index d-flex justify-content-between align-items-center position-relative col-md-12 py-3">
                <div className="tab-title rounded mx-2 bg-light height d-flex justify-content-center align-items-center active" id="rebook" onClick={() => toggleTab(1)}>
                    <span>Rebook</span>
                </div>
                <div className="tab-title rounded mx-2 bg-light height d-flex justify-content-center align-items-center" id="forgot" onClick={() => toggleTab(2)}>
                    <span>Forgot pin</span>
                </div>
                <div className="tab-title rounded mx-2 bg-light height d-flex justify-content-center align-items-center" id="session" onClick={() => toggleTab(3)}>
                    <span>Sessions</span>
                </div>
                <div className="tab-title rounded mx-2 btn-success height d-flex justify-content-center align-items-center text-light" id="sync" onClick={() => toggleTab(4)}>
                    <span>Sync</span>
                </div>
            </div>

            <div className="wrapper z-index bg-white d-flex justify-content-start align-items-center mx-auto tab-wrapper rounded mt-5">
                {
                    (() => {
                        if(index == 1) {
                            const status = <div className="tab-content py-3 z-index text-center">
                                    Rebook door

                                    <div className="textbox-admin py-4"><input type="text" className="rounded" maxLength="16" placeholder='Search alias or door number' /></div>
                                    {
                                    rebookDoor
                                        .map(
                                            item => 
                                            {
                                                
                                                const doorStats = <div key={item.id}>{item.id} , {item.alias}</div>
                                                return doorStats
                                                
                                            }
                                        )
                                        
                                    }
                                </div>
                            return status
                        } 
                        if(index == 2) {
                            const status = <div className="tab-content py-3 mx-auto">
                                    Forgot Pin
                                    <div className="textbox-admin py-4"><input type="text" className="rounded" maxLength="16" placeholder='Search alias or door number'/></div>
                                    <table className="table mx-auto">
                                        <thead>
                                        <tr>
                                            <th>Door number</th>
                                            <th>Alias</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                    {
                                    pinData
                                        .map(
                                            item => 
                                            {
                                                
                                                const doorStats = <tr key={item.id}>
                                                    <td className="col-md-4">{item.id}</td>
                                                    <td className="col-md-4">{item.alias}</td>
                                                    <td className="col-md-4"><button className="btn btn-danger" onClick={() => popup(item.id)}>Change pin</button></td>
                                                </tr>
                                                return doorStats
                                                
                                            }
                                        )
                                        
                                    }
                                        </tbody>
                                    </table>
                                </div>
                            return status
                        }  
                        if(index == 3) {
                            const status = <div className="tab-content py-3 mx-auto">
                                    Sessions
                                    <div className="textbox-admin py-4"><input type="text" className="rounded" maxLength="16" placeholder='Search alias or door number' /></div>
                                </div>
                            return status
                        }  
                        if(index == 4) {
                            const status = <div className="tab-content py-3 mx-auto">
                                    Sync
                                </div>
                            return status
                        }   
                    })()  
                } 
                
            </div>
            
        </div>
        
    )
}

export default Tabs