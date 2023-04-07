import React from 'react'
import Nav from '../Components/Nav'
import Sidebar from '../Components/Sidebar'

// //. remember   
// Totaldeposit: "0",
// Totalwithdrawal: "0"
function DepositComplete() {
    return (
        <div>
            <div id="app">
                {/*/PayPal*/}
                {/*Start of Tawk.to Script*/}
                {/*End of Tawk.to Script*/}
                <div className="wrapper">
                    <div className="main-header">
                        <Nav />
                        {/* End Navbar */}
                    </div>
                    {/* Stored in resources/views/child.blade.php */}
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="main-panel bg-light">
                        <div className="content bg-light">
                            <div className="page-inner">
                                <div className="mt-2 mb-4">
                                    <h1 className="title1 text-dark">Make Payment</h1>
                                </div>
                                <div>
                                </div>					<div>
                                </div>					<div>
                                </div>					<div className="row">
                                    <div className="col-md-8 offset-md-2">
                                        <div className="card bg-light shadow-lg p-2 p-md-4">
                                            <div className="card-body">
                                                <div>
                                                    <h4 className="text-dark">You are to make payment of <strong>$1,000</strong> using your selected payment method. Screenshot and upload the proof of payment</h4>
                                                    <h4>
                                                        <img src="https://img.icons8.com/color/48/000000/bitcoin--v1.png" alt="" className="w-25" />
                                                        <strong className="text-dark">Bitcoin</strong>
                                                    </h4>
                                                </div>
                                                <div className="mt-5">
                                                    <h3 className="text-dark">
                                                        <strong>Bitcoin Address:</strong>
                                                    </h3>
                                                    <div className="form-group">
                                                        <div className="mb-3 input-group">
                                                            <input type="text" className="form-control myInput readonly text-dark bg-light" defaultValue="bc1q5ntrkfa2ejckcsk3dsq04fvp2wx2qscnahe87u" id="myInput" readOnly />
                                                            <div className="input-group-append">
                                                                <button className="btn btn-outline-secondary" onclick="myFunction()" type="button" id="button-addon2"><i className="fas fa-copy" /></button>
                                                            </div>
                                                        </div>
                                                        <small className="text-dark"><strong>Network Type:</strong> Erc</small>
                                                    </div>
                                                </div>
                                                <div>
                                                    <form method="post" action="https://binary.smartbtchub.com/account/dashboard/savedeposit" encType="multipart/form-data">
                                                        <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />													<div className="form-group">
                                                            <h5 className="text-dark">Upload Payment proof after payment.</h5>
                                                            <input type="file" name="proof" className="form-control col-lg-4 bg-light text-dark" required />
                                                        </div>
                                                        <input type="hidden" name="amount" defaultValue={1000} />
                                                        <input type="hidden" name="paymethd_method" defaultValue="Bitcoin" />
                                                        <div className="form-group">
                                                            <input type="submit" className="btn btn-dark" defaultValue="Submit Payment" />
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="footer bg-light text-dark">
                            <div className="container-fluid">
                                <div className="text-center row copyright text-align-center">
                                    <p>All Rights Reserved © Newellfinance 2022</p>
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

export default DepositComplete