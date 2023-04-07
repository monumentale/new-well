import React from 'react'
import Nav from '../Components/Nav'
import Sidebar from '../Components/Sidebar'
import Swal from 'sweetalert2'

function Kyc() {
    const sendmessege = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Documents Updated Successfully',
            showConfirmButton: false,
            timer: 1500
        })
    }
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
                    {/* End Sidebar */}
                    <div className="main-panel bg-light">
                        <div className="content bg-light">
                            <div className="page-inner">
                                <div className="mt-2 mb-5">
                                    <h1 className="title1 text-dark">Account Verification</h1> <br /> <br />
                                </div>
                                <div>
                                </div>					<div>
                                </div>                    <div className="mb-5 row">
                                    <div className="col-lg-8 offset-lg-2 card p-4 shadow-lg bg-light">
                                        <div className="py-3">
                                            <h5 className=" text-dark">KYC verification - Upload documents below to get verified.</h5>
                                        </div>
                                        <form role="form" encType="multipart/form-data">
                                            <h5 className="text-dark">Valid identity card. (e.g. Drivers licence, international passport or any government approved document).</h5>
                                            <input type="file" className="form-control bg-light text-dark" name="idcard" required /><br />
                                            <h5 className="text-dark">Passport photogragh</h5>
                                            <input type="file" className="form-control bg-light text-dark" name="passport" required /><br />
                                            <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                            <input type="button" className="btn btn-dark" defaultValue="Submit documents" onClick={sendmessege} />
                                        </form>
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

export default Kyc