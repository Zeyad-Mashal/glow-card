import React from 'react'

const CardDetails = () => {
    return (
        <div className='CardDetails'>
            <div className='cardDetails-header'>
                <h1>Card Details</h1>
            </div>
            <div className='cardDetails-body'>
                <div className='cardDetails-body-left'>
                    <h2>Card Number</h2>
                    <p>1234 5678 9012 3456</p>
                </div>
                <div className='cardDetails-body-right'>
                    <h2>Expiry Date</h2>
                    <p>12/25</p>
                </div>
            </div>
        </div>
    )
}

export default CardDetails
