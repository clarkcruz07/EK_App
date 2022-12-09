import React, {useEffect, useState} from 'react'
export const Footer = ({popup}) =>{
     
    

    const showModal = () => {
        console.log(popup)
        localStorage.setItem('modalCheck', popup)
    }
    return (
        <div className="row">
            <div className="support-footer d-flex justify-content-end align-items-center position-fixed">
                <button className="btn btn-success" onClick={() => showModal()}>Support</button>
            </div>
        </div>
       
    )
}

export default Footer