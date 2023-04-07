import React from 'react'
import Sidebar from '../Components/Sidebar'
import Nav from '../Components/Nav'

// //. remember   
// Totaldeposit: "0",
// Totalwithdrawal: "0"
function WithdrawalComplete() {
    return (
        <div>
            <div id="app">
                {/*/PayPal*/}
                {/*Start of Tawk.to Script*/}
                {/*End of Tawk.to Script*/}
                <div className="wrapper">
                    <div className="main-header">
                        <Nav />
                    </div>
                    {/* Stored in resources/views/child.blade.php */}
                    {/* Sidebar */}
                    <Sidebar />
                    {/* End Sidebar */}
                    <div className="main-panel bg-light">
                        <div className="content bg-light">
                            <div className="page-inner">
                                <div className="mt-2 mb-4">
                                    <h1 className="title1 d-inline text-dark">Request for Withdrawal</h1>
                                    <div className="d-inline">
                                        <div className="float-right btn-group">
                                            <a className="btn btn-primary btn-sm" href="/getotp"> <i className="fa fa-envelope" /> Request OTP</a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                </div>					<div>
                                </div>
                                <div className="mb-5 row">
                                    <div className="col-lg-8 offset-md-2">
                                        <div className="p-md-4 p-2 rounded card bg-light">
                                            <div className="card-body">
                                                <div className="mb-3 alert alert-success">
                                                    <h4 className="text-dark">Your Payment Method is <strong>Bitcoin</strong></h4>
                                                </div>
                                                <form >
                                                    <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />                                        <div className="form-group">
                                                        <h5 className="text-dark">Enter Amount to withdraw</h5>
                                                        <input className="form-control text-dark bg-light" placeholder="Enter Amount" type="number" name="amount" required />
                                                    </div>
                                                    <input defaultValue="Bitcoin" type="hidden" name="method" />
                                                    <div className="form-group">
                                                        <h5 className="text-dark">Enter OTP</h5>
                                                        <input className="form-control text-dark bg-light" placeholder="Enter Code" type="text" name="otpcode" required />
                                                        <small className="text-dark">OTP will be sent to your email when you request</small>
                                                    </div>
                                                    <div className="form-group">
                                                        <button className="btn btn-primary" type="submit">Complete Request</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="footer bg-light text-dark">
                            <div className="container-fluid">
                                <div className="text-center row copyright text-align-center">
                                    <p>All Rights Reserved © Gagesfinance 2022</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
            {/*   Core JS Files   */}
            {/* jQuery UI */}
            {/* jQuery Scrollbar */}
            {/* jQuery Sparkline */}
            {/* Sweet Alert */}
            {/* Bootstrap Notify */}
        </div>
    )
}

export default WithdrawalComplete