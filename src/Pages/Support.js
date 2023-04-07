import React from 'react'
import Sidebar from '../Components/Sidebar'
import Nav from '../Components/Nav'
import Swal from 'sweetalert2'

function Support() {

    const sendmessege = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Messege sent To Admin Successfully',
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
                                <div>
                                </div>					<div>
                                </div>					<div className="mb-5 row p-md-3">
                                    <div className="shadow col-12 p-md-2">
                                        <div className="col-12 text-center bg-light p-3">
                                            <h1 className="title1 text-dark">Newellfinance Support</h1>
                                            <div className="sign-up-row widget-shadow text-dark">
                                                <h4 className="text-dark">For inquiries, suggestions or complains. Mail us</h4>
                                                <h1 className="mt-3 text-primary"> <a href="mailto:support@Newellfinance.com">support@Newellfinance.com</a> </h1>
                                            </div>
                                        </div>
                                        <div className="pb-5 col-md-8 offset-md-2">
                                            <form >
                                                <input type="hidden" name="name" defaultValue="Osita Stephen" />
                                                <div className="form-group">
                                                    <input type="hidden" name="email" defaultValue="monumentaleworks@gmail.com" />
                                                </div>
                                                <div className="form-group">
                                                    <h5 htmlFor className="text-dark">Message<span className=" text-danger">*</span></h5>
                                                    <textarea name="message" className="form-control text-dark bg-light" rows={5} defaultValue={""} />
                                                </div>
                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                <div className onClick={sendmessege}>
                                                    <input type="button" className="py-2 btn btn-primary btn-block" defaultValue="Send" />
                                                </div>
                                            </form>
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

export default Support