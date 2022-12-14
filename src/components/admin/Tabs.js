import React,{useEffect,useState, useRef} from 'react'
import axios from 'axios'
import lockerFree from '../../assets/img/lockerFree.svg'
import lockerOccupied from '../../assets/img/lockerOccupied.svg'
import eyeIcon from '../../assets/img/eyeIcon.svg'
import swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
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
    const [countForSync, setCountForSync] = useState(0)
    const [doors, setDoors] = useState([])
    const numberorder = useRef(null);
    const [sync, setSync] = useState('')
    const [syncCheck, setSyncCheck] = useState(0)
    const APIurl = 'http://localhost:3000/LockerDetails'
    const doorURL = 'http://localhost:9090/api/lockercontroller/door/'


    const [checkboxList, setCheckboxList] = useState([])


    const [filteredResults, setFilteredResults] = useState([]);
    
    let columnsForgot = []
    let dataForgot = []
    let columnsRebook = []
    let dataRebook = []
    let columnSessions = []
    const toggleTab = (indexTab) => {
        setIndex(indexTab)

        if(indexTab == 1) {
            fetchRebookData()
        }
        else if(indexTab == 2) {
            fetchOpenDoors()
        }
        else if(indexTab == 3) {
            fetchOpenDoors()
        }
        else if(indexTab == 4) {
            fetchRebookData()
        }
        
    }

    const fetchRebookData = () => {
        axios.get('http://localhost:3000/LocalData').then((res) => {
           
            setrebookDoor(res.data)
            if(res.data.length == 0) {
                document.getElementById('sync-data').disabled = true
            }
            setCountForSync(res.data.length)
            
            
        })
        .catch((err) => {

        })
    }

    const fetchOpenDoors = () => {
       
        axios.get(APIurl + '/?doorStatus=1').then((res) => {
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
            swal.fire({
                position: 'center',
                icon: 'success',
                title: 'You have successfully changed your door PIN',
                showConfirmButton: false,
                timer: 3000
              })
            cancelTransaction()
        }).catch(error => {
            console.log(error);
        });
            
    }

    const rebookData = (doorid,timeout) => {

                axios.get('http://localhost:3000/LockerDetails/'+doorid).then((res) => {
                
                if(res.data.timeIn){
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Door already booked, try approaching EK Staff for unclaimed items',
                        showConfirmButton: false,
                        timer: 3000
                      })
                }
                else{
                    const api = doorURL+doorid+'/open'
                    axios.get(api).then(res => {
                        
                        axios.get('http://localhost:3000/LocalData/?transID='+doorid).then(res => {
                            
                            const door_id = res.data[0].transID
                            const time_in = res.data[0].timeIn
                            const mpin = res.data[0].mpin
                            const __alias = res.data[0].alias

                            axios.patch('http://localhost:3000/LockerDetails/'+door_id, {
                            transID: "",
                            lockerLocation: process.env.REACT_APP_LOCKER_LOCATION,
                            doorSize: "S",
                            doorStatus: 1,
                            paymentStatus: "paid",
                            payType: process.env.REACT_APP_PAYTYPE,
                            amount: process.env.REACT_APP_LOCKER_PRICE,
                            doorOpenCount: 1,
                            mpin: mpin,
                            alias: __alias,
                            timeIn: time_in,
                            timeOut: "",
                            img_url: lockerOccupied,
                            id: door_id

                            }).then(resp => {

                                axios.get('http://localhost:3000/LocalData/?transID='+door_id+"&&timeOut="+timeout).then(resp => {
                                    const id = resp.data[0].id

                                    axios.delete('http://localhost:3000/LocalData/' + id).then(response => {
                                        console.log('deleted....')
                                    })

                                    swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Door is rebooked',
                                        showConfirmButton: false,
                                        timer: 3000
                                      })

                                      fetchRebookData()
                                }).catch(error => {
                                    console.log(error);
                                });

                            }).catch(error => {
                                console.log(error);
                            });

                        })
                        
                    }).catch(err => { 
                        console.log(err)
                    });
                }

            })
            .catch((err) => {
                console.log(err)
            })
     
    }


    const getCheckedValues = () => {
        return Array.from(document.getElementsByName('chk'))
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
      }
    const checkAll = () => {
       const selectAll = document.getElementById('select-all')
       
       const isChecked = selectAll.checked

       Array.from(document.getElementsByName('chk')).forEach(element =>{
        element.checked = isChecked;
       })

       const resultEl = document.getElementsByName('chk');
       resultEl.value = getCheckedValues();
       setDoors(getCheckedValues())
       //console.log(getCheckedValues())
    }
    const check = () => {
        const selectAll = document.getElementById('select-all')
        Array.from(document.querySelectorAll('input[type="checkbox"]:not(#select-all)')).forEach(
            element => {
                selectAll.checked = false
            })

            const resultEl = document.getElementsByName('chk');
            resultEl.value = getCheckedValues();
            setDoors(getCheckedValues())
            //console.log(getCheckedValues())
           /* const checkboxes = document.querySelectorAll('input[type=checkbox]');
            if(document.getElementById('select-all').checked == true){
                checkboxes.forEach((cb) => 
                {                 
                    cb.checked = true; 
                })
            }
           else{
                checkboxes.forEach((cb) => 
                {                 
                    cb.checked = false; 
                })
           }

        const resultEl = document.getElementsByName('chk');
        resultEl.value = getCheckedValues();
        setDoors(getCheckedValues())*/
        
     } 



    const endSession = () => {
        let newarr = []
        /*** TODO  ***/
        //axios.get('http://localhost:9090/api/lockercontroller/getAll').then(() => {
        if(getCheckedValues().length == 0) {

        }
        else {
            axios
            .get('http://localhost:3000/LockerDetails')
            .then((response) => {
            newarr = response.data
                {Object.values(newarr).map((key) => {
                    axios.get('http://localhost:3000/LockerDetails/'+doors, {
                      

                    }).then(resp => {
                        {Object.values(resp).map((val) => {
                            console.log(val.lockerLocation)
                            /*axios.patch('http://localhost:3000/LockerDetails/'+ val.id, {
                                    transID: "",
                                    lockerLocation: val.lockerLocation,
                                    doorSize: "S",
                                    doorStatus: 1,
                                    paymentStatus: val.paymentStatus,
                                    payType: val.payType,
                                    amount: val.amount,
                                    doorOpenCount: "",
                                    mpin: val.mpin,
                                    timeIn: val.timeIn,
                                    timeOut: "",
                                    img_url: val.img_url,
                                    alias: val.alias
                                })*/
                        })}
                        
                        fetchOpenDoors()
                        const selectAll = document.getElementById('select-all')
                        Array.from(document.querySelectorAll('input[type="checkbox"]:not(#select-all)')).forEach(
                            element => {
                                selectAll.checked = false
                            })
                    }).catch(error => {
                        console.log(error);
                    });
                    
                })}
                
            })
            .catch((err) => {
                console.log(err)
            })
        }
            


        //})
        
   
    }
    
 const syncData = (sync) => {
    
    let arr = []
    let consArr = []
    
    setSync('Syncing local data to dashboard')
    document.getElementById('sync-data').disabled = true
    axios.get('http://localhost:3000/LocalData').then((res) => {
           arr = res.data
            {Object.values(arr).map((key) => {

            axios.get('http://localhost:3000/LocalData/'+key.id).then((res) => {
                const idArr = res.data.id
                    axios.post('https://ek-qubelocker.onrender.com/api/post/transDatas/', {
                    
                            lockerLocation: res.data.lockerLocation,
                            payType: res.data.payType,
                            amount: res.data.amount,
                            timeIn: res.data.timeIn,
                            timeOut: res.data.timeOut
                        
                    }).then((res) => {
                            console.log(idArr)
                            axios.delete('http://localhost:3000/LocalData/'+idArr).then((res)=> {
                                setSync('Sync local data')                            
                                setSyncCheck(1)
                                document.getElementById('sync-data').disabled = false
                            })
                           
                    })
            }).then(() => {
                
            })

            })}
        }).then((res)=> {
        })
        .catch((err) => {

        })
 }

    useEffect(() => {
        setSync('Sync local data')
        toggleTab(1)

    },[])

    useEffect(() => {
       
        if(index == 1){
            document.getElementById('forgot').classList.remove('active')
            document.getElementById('session').classList.remove('active')
            document.getElementById('sync').classList.remove('active')
            document.getElementById('rebook').classList.add('active') 
            //fetchRebookData()
        }
        else if(index == 2){
            document.getElementById('forgot').classList.add('active')
            document.getElementById('session').classList.remove('active')
            document.getElementById('sync').classList.remove('active')
            document.getElementById('rebook').classList.remove('active')
            //fetchOpenDoors()
        }
        else if(index == 3){
            document.getElementById('forgot').classList.remove('active')
            document.getElementById('session').classList.add('active')
            document.getElementById('sync').classList.remove('active')
            document.getElementById('rebook').classList.remove('active')
            //fetchOpenDoors()
           /* if(getCheckedValues().length == 0){
                document.getElementById('end-session').disabled = true
               }
               else {
                document.getElementById('end-session').disabled = false
               }
               */
        }
        else if(index == 4){
            document.getElementById('forgot').classList.remove('active')
            document.getElementById('session').classList.remove('active')
            document.getElementById('sync').classList.add('active')
            document.getElementById('rebook').classList.remove('active')
            //fetchRebookData()
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

    
      const options = {
        filterType: "dropdown",
        responsive: "vertical"
      };
      columnsForgot = ["Door Number", "Alias", " "]
      columnsRebook = ["Door Number", "Alias", "Time Out", " "]
      columnSessions = [' ','Door Number', 'Alias']
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
                                    <div className="col-md-12 bg-light py-3 px-3 rounded mb-3"><span className="text-danger"><strong>NOTE:</strong></span> If the user accidentally pressed the <strong>go home button</strong>, use this function to rebook door without payment.</div>
                                    <span className="text-dark">Rebook Door</span>
                                    
                                    
                                    <MUIDataTable
                                        data= {
                                            rebookDoor
                                                .map(
                                                    item => 
                                                    {
                                                        
                                                        dataRebook = [
                                                            item.transID,
                                                            item.alias,
                                                            item.timeOut,
                                                            <button className="btn btn-danger" onClick={() => rebookData(item.transID, item.timeOut)}>Rebook</button>
                                                        ]  
                                                        return dataRebook
                                                    }
                                                    
                                                )
                                                
                                            }  
                                        columns= {columnsRebook} 
                                        options={options}
                                    />

                                    
                                </div>
                            return status
                        } 
                        if(index == 2) {

                            const status = <div className="tab-content py-3 mx-auto">
                                    <div className="col-md-12 bg-light py-3 px-3 rounded mb-3"><span className="text-danger"><strong>NOTE:</strong></span> If the user forgot their pin, use this function to create a new pin.</div>
                                    <span className="text-dark">Forgot Pin</span>
                                   
                                    <MUIDataTable
                                        data= {
                                            pinData
                                                .map(
                                                    item => 
                                                    {
                                                        
                                                        dataForgot = [
                                                            item.id,
                                                            item.alias,
                                                            <button className="btn btn-danger" onClick={() => popup(item.id)}>Change pin</button>
                                                        ]  
                                                        return dataForgot
                                                    }
                                                    
                                                )
                                                
                                            }  
                                        columns= {columnsForgot} 
                                        options={options}
                                    />
                                </div>
                            return status
                        }  
                        if(index == 3) {
                            const status = <div className="tab-content py-3 mx-auto">
                                <div className="col-md-12 bg-light py-3 px-3 rounded mb-3"><span className="text-danger"><strong>NOTE:</strong></span> Use this to end the sessions. This will open <strong>all doors</strong> and clear all selected sessions.</div>
                                    <div><span className="text-dark">Sessions</span></div>
                                    
                                    <button className="btn btn-danger end-session mx-5" onClick={()=> endSession()} id='end-session' disabled={disable}>Test door and end selected session/s</button>
                                    <div id="select-all-wrapper"> <input type="checkbox" id="select-all" onClick={() => checkAll()}/><span>Select All</span> </div>
                                   
                                    <MUIDataTable
                                        data= {
                                            pinData
                                                .map(
                                                    item => 
                                                    {
                                                        
                                                        dataForgot = [
                                                            <input
                                                            type="checkbox"
                                                            value={item.id}
                                                            id="checkbox"
                                                            name="chk"
                                                            onClick={() => check()}
                                                            />,
                                                            item.id,
                                                            item.alias,
                                                            
                                                        ]  
                                                        return dataForgot
                                                    }
                                                    
                                                )
                                                
                                            }  
                                        columns= {columnSessions} 
                                        options={options}
                                    />
                                    
                                </div>
                            return status
                        }  
                        if(index == 4) {
                            const status = <div className="tab-content py-3 mx-auto">
                                <div className="col-md-12 bg-light py-3 px-3 rounded mb-3"><span className="text-danger"><strong>NOTE:</strong></span> Data are stored locally. Sync the data to forward it to the dashboard. Internet connectivity is required for this function.</div>
                                    <span className="text-dark">Sync data</span>
                                    {
                                        (() => {
                                            if(syncCheck == 0) {
                                                const status = <div className="mx-auto py-3"> </div>
                                                return status
                                            }
                                            else{
                                                const status = <div className="mx-auto py-3 col-md-12 error"> <h4 className="text-success">Synching of local transactions posted to server</h4></div>
                                                return status
                                            }
                                            
                                        })()  
                                    } 

                                    {
                                        (() => {
                                            if(countForSync == 0) {
                                                const status = <div className="mx-auto py-3 error "> <span className="text-danger">No transactions to sync </span></div>
                                                return status
                                            }
                                            else if(countForSync == 1){
                                                const status = <div className="mx-auto py-3 col-md-12 error"> <span className="text-danger">There is {countForSync} data to sync</span></div>
                                                return status
                                            }
                                            else{
                                                const status = <div className="mx-auto py-3 col-md-12 error"> <span className="text-danger">There are {countForSync} data to sync</span></div>
                                                return status
                                            }
                                            
                                        })()  
                                    } 
                                    
                                    <div className="mx-auto py-3">
                                    <button className="btn btn-danger" id="sync-data" onClick={() => syncData(1)}>{sync}</button>
                                    </div>
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