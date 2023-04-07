import React, { useEffect, useRef, useState, useContext } from 'react'
import { GlobalContext } from "../Globalstate";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../Components/Nav';
import Sidebar from '../Components/Sidebar';
import DepositComplete from './DepositComplete';
import Swal from 'sweetalert2'
import { f, database, storage, auth } from "../config";
import db from "../config";
import firebase from 'firebase';
import emailjs from "emailjs-com";

function Referral() {

    const [{ userdetails, loggedin, tradingpair, selectedinvestment }, dispatch] = useContext(GlobalContext);
    const navigate = useNavigate();
    const [loading, setloading] = useState(true)
    const [amount, setamount] = useState("")
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
                    navigate("/");
                }
            });
        }

        let myDate = new Date();
        console.log(myDate.getTime())
        console.log(addHoursToDate(myDate, 24).getTime())
        console.log(myDate)
        console.log(addHoursToDate(myDate, 1))
        new Date(new Date(myDate).setHours(myDate.getHours() + 20)).getTime()
    }, []);


    function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }

    const fetchuserdata = async (userid) => {
        var docRef = db.collection("users").doc(userid);
        const fetching = await docRef
            .onSnapshot((function (doc) {
                if (doc.exists) {
                    setdetails(doc.data());
                    console.log(doc.data())
                    setloading(false)
                } else {
                    console.log("No such document!");
                }
            })
            )

    };

    const setdetails = (data) => {
        dispatch({ type: "setuserdetails", snippet: data });
    };

    const setloggedin = (data) => {
        dispatch({ type: "setloggedin", snippet: data });
    };
    return (
        <div>

            <div id="app">
                {/*/PayPal*/}
                {/*Start of Tawk.to Script*/}
                {/*End of Tawk.to Script*/}
                <div className="wrapper">
                    <div className="main-header">
                        {/* Logo Header */}
                        <Nav />
                        {/* End Navbar */}
                    </div>
                    {/* Stored in resources/views/child.blade.php */}
                    <Sidebar />
                    {/* End Sidebar */}
                    <div className="main-panel bg-light">
                        <div className="content bg-light">
                            <div className="page-inner">
                                <div className="mt-2 mb-4">
                                    <h1 className="title1 text-dark">Refer users to Newellfinance community</h1>
                                </div>
                                <div>
                                </div>					<div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 text-center card bg-light shadow-lg p-3 text-dark">
                                        <div className="p-4 row">
                                            <div className="col-md-8 offset-md-2">
                                                <strong>You can refer users by sharing your referral link:</strong><br />
                                                {
                                                    !loading && (
                                                        <div className="mb-3 input-group">
                                                            <input type="text" className="form-control myInput readonly text-dark bg-light" defaultValue={`https://Newellfinance.com/register.html?referralid=${f.auth().currentUser.uid} `} id="myInput" readOnly />
                                                            <div className="input-group-append">
                                                                <button className="btn btn-outline-secondary" onClick={() => { navigator.clipboard.writeText(`https://Newellfinance.com/register.html?referralid=${f.auth().currentUser.uid}`); }} type="button" id="button-addon2"><i className="fas fa-copy" /></button>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                <strong>or your Referral ID</strong><br />
                                                <h4 style={{ color: 'green' }}> {userdetails.fullname}</h4> <br />
                                                <h3 className="title1">
                                                    <small>You were referred by</small><br />
                                                    <i className="fa fa-user fa-2x" /><br />
                                                    <small>null</small>
                                                </h3>
                                            </div>
                                            <div className="mt-4 col-md-12">
                                                <h2 className="title1 text-dark text-left">Your Referrals.</h2>
                                                <div className="table-responsive">
                                                    <table className="table UserTable table-hover text-dark">
                                                        <thead>
                                                            <tr>
                                                                <th>Client name</th>
                                                                <th>Ref. level</th>
                                                                <th>Parent</th>
                                                                <th>Client status</th>
                                                                <th>Date registered</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        </tbody>
                                                    </table>
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

export default Referral