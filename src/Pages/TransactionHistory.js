import React, { useEffect, useRef, useState, useContext } from 'react'
import { f, database, storage, auth } from "../config";
import db from "../config";
import { GlobalContext } from "../Globalstate";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2'
import firebase from 'firebase';
import Nav from '../Components/Nav'
import Sidebar from '../Components/Sidebar'

function TransactionHistory() {
    const [{ userdetails, loggedin, tradingpair, openorders }, dispatch] = useContext(GlobalContext);
    const history = useNavigate();
    const [loading, setloading] = useState(true)
    const [dataready, setdataready] = useState(false)
    useEffect(() => {
        if (loggedin) {
            console.log(userdetails);
            console.log(userdetails.email);
            setloading(false)
        } else {
            f.auth().onAuthStateChanged(function (user) {
                if (user) {
                    var userid = f.auth().currentUser;
                    var userids = userid.uid;
                    fetchuserdata(userids);
                    setloggedin(true);

                } else {
                    setloggedin(false);
                    setloading(false)
                    history("/");
                }
            });
        }
    }, []);

    const fetchuserdata = async (userid) => {
        var docRef = db.collection("users").doc(userid);
        const fetching = await docRef
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    setdetails(doc.data());
                    setloading(false)
                    setdataready(true)
                } else {
                    console.log("No such document!");
                    setloading(false)
                }
            })
            .catch(function (error) {
                console.log("Error getting document:", error);
            });
    };

    const setdetails = (data) => {
        dispatch({ type: "setuserdetails", snippet: data });
    };

    const setloggedin = (data) => {
        dispatch({ type: "setloggedin", snippet: data });
    };

    return (
        <div>
            {
                loading && (
                    <div class="preloader js-preloader">
                        <div class="loader loader-inner-1">
                            <div class="loader loader-inner-2">
                                <div class="loader loader-inner-3">
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
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
                                <div className="mt-2 mb-4">
                                    <h1 className="title1 text-dark">Transactions on your account</h1>
                                </div>
                                <div>
                                </div>					<div>
                                </div>					<div className="mb-5 row">
                                    <div className="col text-center card p-4 bg-light">
                                        <nav>
                                            <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                                <h4 className="pt-3 nav-item nav-link active " id="nav-home-tab" data-toggle="tab" href="#1" role="tab" aria-controls="nav-home" aria-selected="true"> Deposits</h4>
                                                <h4 className="pt-3 nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#2" role="tab" aria-controls="nav-profile" aria-selected="false">Withdrawals</h4>
                                                <h4 className="pt-3 nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#3" role="tab" aria-controls="nav-contact" aria-selected="false">Others</h4>
                                            </div>
                                        </nav>
                                        <div className="px-3 py-3 tab-content px-sm-0" id="nav-tabContent">
                                            <div className="tab-pane fade show active bg-light card p-3" id={1} role="tabpanel" aria-labelledby="nav-home-tab">
                                                <div className="bs-example widget-shadow table-responsive" data-example-id="hoverable-table">
                                                    <table id="UserTable" className="UserTable table table-hover text-dark">
                                                        <thead>
                                                            <tr>
                                                                <th>Amount</th>
                                                                <th>Payment mode</th>
                                                                <th>Date created</th>
                                                                <th>Status</th>

                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {
                                                                dataready && (
                                                                    userdetails.Deposithistory.map((obj, i) => (

                                                                        <tr className="del237">
                                                                            <td>€ {obj.amt}</td>
                                                                            <td>{obj.coin}</td>
                                                                            <td>{new Date(obj.date).toDateString()}</td>
                                                                            <td>{obj.mode}</td>
                                                                        </tr>

                                                                    ))

                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade p-3 bg-light" id={2} role="tabpanel" aria-labelledby="nav-profile-tab">
                                                <div className="bs-example widget-shadow table-responsive" data-example-id="hoverable-table">
                                                    <table id="UserTable" className="UserTable table table-hover text-dark">
                                                        <thead>
                                                            <tr>
                                                                <th>Amount requested</th>
                                                                {/* <th>Amount + charges</th> */}
                                                                <th>Date created</th>
                                                                <th>Status</th>
                                                                <th>Payment mode</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataready && (
                                                                    userdetails.withdrawalhistory.map((obj, i) => (

                                                                        <tr className="del237">
                                                                            <td>€ {obj.amt}</td>

                                                                            <td>{new Date(obj.date).toDateString()}</td>
                                                                            <td>{obj.status}</td>
                                                                            <td>{obj.coin}</td>
                                                                            {/* <td>{obj.mode}</td>  */}
                                                                        </tr>

                                                                    ))

                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade p-3 bg-light" id={3} role="tabpanel" aria-labelledby="nav-contact-tab">
                                                <div className="bs-example widget-shadow table-responsive" data-example-id="hoverable-table">
                                                    <table id="UserTable" className="UserTable table table-hover text-dark">
                                                        <thead>
                                                            <tr>
                                                                <th>Amount</th>
                                                                <th>Type</th>
                                                                <th>Plan/Narration</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>€0</td>
                                                                <td>Bonus</td>
                                                                <td>SignUp Bonus</td>

                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Submit MT4 MODAL modal */}
                        <div id="submitmt4modal" className="modal fade" role="dialog">
                            <div className="modal-dialog">
                                {/* Modal content*/}
                                <div className="modal-content">
                                    <div className="modal-header bg-light">
                                        <h4 className="modal-title text-dark">Subscribe to subscription Trading</h4>
                                        <button type="button" className="close text-dark" data-dismiss="modal">×</button>
                                    </div>
                                    <div className="modal-body bg-light">
                                        <form role="form" method="post" action="https://binary.smartbtchub.com/account/dashboard/savemt4details">
                                            <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />							<div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark">Subscription Duration</h5>
                                                    <select className="form-control bg-light text-dark" onchange="calcAmount(this)" name="duration" id="duratn">
                                                        <option value="default">Select duration</option>
                                                        <option>Monthly</option>
                                                        <option>Quaterly</option>
                                                        <option>Yearly</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark">Amount to Pay</h5>
                                                    <input className="form-control subamount bg-light text-dark" type="text" id="amount" disabled /><br />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark ">MT4 ID*:</h5>
                                                    <input className="form-control bg-light text-dark" type="text" name="userid" required />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark ">MT4 Password*:</h5>
                                                    <input className="form-control bg-light text-dark" type="text" name="pswrd" required />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark ">Account Type:</h5>
                                                    <input className="form-control bg-light text-dark" placeholder="E.g. Standard" type="text" name="acntype" required />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark ">Currency*:</h5>
                                                    <input className="form-control bg-light text-dark" placeholder="E.g. USD" type="text" name="currency" required />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark ">Leverage*:</h5>
                                                    <input className="form-control bg-light text-dark" placeholder="E.g. 1:500" type="text" name="leverage" required />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <h5 className="text-dark ">Server*:</h5>
                                                    <input className="form-control bg-light text-dark" placeholder="E.g. HantecGlobal-live" type="text" name="server" required />
                                                </div>
                                                <div className="form-group col-12">
                                                    <small className="text-dark">Amount will be deducted from your Account balance</small>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input id="amountpay" type="hidden" name="amount" />
                                                    <input type="submit" className="btn btn-primary" defaultValue="Subscribe Now" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /plans Modal */}
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

export default TransactionHistory