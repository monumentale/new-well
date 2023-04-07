import React, { useState, useContext, useEffect } from 'react'
import Nav from '../Components/Nav'
import Sidebar from '../Components/Sidebar'
import Swal from 'sweetalert2'
import { GlobalContext } from "../Globalstate";
import { useNavigate } from "react-router-dom";
import { f, database, storage, auth } from "../config";
import db from "../config";
import firebase from 'firebase';


function Seettings() {

    const history = useNavigate();
    const [{ userdetails, loggedin, tradingpair, depositinfo }, dispatch] = useContext(GlobalContext);
    const [loading, setloading] = useState(false)
    const [password, setpassword] = useState("")
    const [password2, setpassword2] = useState("")

    const changepassword = () => {

        if (password == "") {
            Swal.fire(
                'No Selected Passowrd?',
                'Please Select A Valid Password',
            )
            return

        }

        if (password != password2) {
            Swal.fire(
                'Password does not match?',
                'Password must match',
            )
            return
        }
        setloading(true)
        var user = f.auth().currentUser;
        user
            .updatePassword(password)
            .then(function () {
                setloading(false)
                Swal.fire({
                    icon: 'success',
                    title: 'password changed',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(function (error) {
                console.log(error)
                setloading(false)
                Swal.fire(
                    'Something went wrong',
                    `${error.message}`,
                )

            });
    };

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

    const sendmessege = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Account Updated Successfully',
            showConfirmButton: false,
            timer: 1500
        })
    }

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
                    </div>
                    {/* Stored in resources/views/child.blade.php */}
                    {/* Sidebar */}
                    <Sidebar />
                    {/* End Sidebar */}
                    <div className="main-panel bg-light">
                        <div className="content bg-light">
                            <div className="page-inner">
                                <div>
                                </div>                    <div>
                                </div>					<div>
                                </div>					<div className="row profile">
                                    <div className="p-2 col-md-12">
                                        <div className="card p-md-5 p-1 shadow-lg bg-light">
                                            <ul className="nav nav-pills">
                                                <li className="nav-item">
                                                    <a href="#per" className="nav-link active" data-toggle="tab">Personal Settings</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a href="#set" className="nav-link" data-toggle="tab">Withdrawal Settings</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a href="#pas" className="nav-link" data-toggle="tab">Password/Security</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a href="#sec" className="nav-link" data-toggle="tab">Other Settings</a>
                                                </li>
                                            </ul>
                                            <div className="tab-content">
                                                <div className="tab-pane fade show active" id="per">
                                                    <form method="POST" action="javascript:void(0)" id="updateprofileform">
                                                        <input type="hidden" name="_token" />    <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Fullname</h5>
                                                                <input type="text" className="form-control bg-light text-dark" name="name" />
                                                            </div>
                                                            {/* <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Email Address</h5>
                                                                <input type="email" className="form-control bg-light text-dark" name="email" readOnly />
                                                            </div> */}
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Phone Number</h5>
                                                                <input type="text" className="form-control bg-light text-dark" name="phone" />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Date of Birth</h5>
                                                                <input type="date" defaultValue className="form-control bg-light text-dark" name="dob" />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Nationality</h5>
                                                                <textarea className="form-control bg-light text-dark" placeholder="Full Address" name="address" row={3} />
                                                            </div>
                                                        </div>
                                                        <button type="button" className="btn btn-primary" onClick={sendmessege}>Update Profile</button>
                                                    </form>
                                                </div>
                                                <div className="tab-pane fade" id="set">
                                                    <form id="updatewithdrawalinfo">
                                                        <input type="hidden" name="_token" />    <input type="hidden" name="_method" />    <fieldset>
                                                            <legend>Bank Account</legend>
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark">Bank Name</h5>
                                                                    <input type="text" name="bank_name" defaultValue className="form-control text-dark bg-light" placeholder="Enter bank name" />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark">Account Name</h5>
                                                                    <input type="text" name="account_name" defaultValue className="form-control  text-dark bg-light" placeholder="Enter Account name" />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark">Account Number</h5>
                                                                    <input type="text" name="account_no" defaultValue className="form-control text-dark bg-light" placeholder="Enter Account Number" />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark">Swift Code</h5>
                                                                    <input type="text" name="swiftcode" defaultValue className="form-control text-dark bg-light" placeholder="Enter Swift Code" />
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset className="mt-2">
                                                            <legend>Cryptocurrency</legend>
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark">Bitcoin</h5>
                                                                    <input type="text" name="btc_address" defaultValue className="form-control text-dark bg-light" placeholder="Enter Bitcoin Address" />
                                                                    <small className="text-dark">Enter your Bitcoin Address that will be used to withdraw your funds</small>
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark">Ethereum</h5>
                                                                    <input type="text" name="eth_address" defaultValue className="form-control text-dark bg-light" placeholder="Enter Etherium Address" />
                                                                    <small className="text-dark">Enter your Ethereum Address that will be used to withdraw your funds</small>
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <h5 className="text-dark bg-light">Litecoin</h5>
                                                                    <input type="text" name="ltc_address" defaultValue className="form-control text-dark bg-light" placeholder="Enter Litcoin Address" />
                                                                    <small className="text-dark">Enter your Litecoin Address that will be used to withdraw your funds</small>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <button type="button" onClick={sendmessege} className="px-5 btn btn-primary">Save</button>
                                                    </form>
                                                </div>
                                                <div className="tab-pane fade" id="pas">
                                                    <form method="POST" action="https://binary.smartbtchub.com/account/dashboard/updatepass">
                                                        <input type="hidden" name="_token" />    <input type="hidden" name="_method" />    <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Old Password</h5>
                                                                <input type="password" name="current_password" className="form-control text-dark bg-light" required />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">New Password</h5>
                                                                <input type="password" name="password" onChange={(e) => { setpassword(e.target.value) }} className="form-control text-dark bg-light" required />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <h5 className="text-dark">Confirm New Password</h5>
                                                                <input type="password" name="password_confirmation" onChange={(e) => { setpassword2(e.target.value) }} className="text-dark bg-light form-control" required />
                                                            </div>
                                                        </div>
                                                        <button type="button" onClick={changepassword} className="btn btn-primary">Update Password</button>
                                                    </form>
                                                    <div className="mt-4">
                                                        <a href="https://binary.smartbtchub.com/account/dashboard/manage-account-security" className="text-decoration-none">Advance Account Settings <i className="fas fa-arrow-right" /> </a>
                                                    </div>									</div>
                                                <div className="tab-pane fade" id="sec">
                                                    <form method="POST" action="javascript:void(0)" id="updateemailpref">
                                                        <input type="hidden" name="_token" />    <input type="hidden" name="_method" />    <div className="row">
                                                            {/* <div className="mb-3 col-md-6">
                                                                <h5 className="text-dark">Send confirmation OTP to my email when withdrawing my funds.</h5>
                                                                <div className="selectgroup">
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="otpsend" id="otpsendYes" className="selectgroup-input" defaultChecked />
                                                                        <span className="selectgroup-button">Yes</span>
                                                                    </label>
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="otpsend" id="otpsendNo" className="selectgroup-input" />
                                                                        <span className="selectgroup-button">No</span>
                                                                    </label>
                                                                </div>
                                                            </div> */}
                                                            <div className="mb-3 col-md-6">
                                                                <h5 className="text-dark">Send me email when i withdraw</h5>
                                                                <div className="selectgroup">
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="roiemail" id="roiemailYes" className="selectgroup-input" defaultChecked />
                                                                        <span className="selectgroup-button">Yes</span>
                                                                    </label>
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="roiemail" id="roiemailNo" className="selectgroup-input" />
                                                                        <span className="selectgroup-button">No</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3 col-md-6">
                                                                <h5 className="text-dark">Alert me when my plan is activated</h5>
                                                                <div className="selectgroup">
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="invplanemail" id="invplanemailYes" className="selectgroup-input" defaultChecked />
                                                                        <span className="selectgroup-button">Yes</span>
                                                                    </label>
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="invplanemail" id="invplanemailNo" className="selectgroup-input" />
                                                                        <span className="selectgroup-button">No</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 col-12">
                                                                <button type="button" onClick={sendmessege} className="px-5 btn btn-primary">Save</button>
                                                            </div>
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

export default Seettings