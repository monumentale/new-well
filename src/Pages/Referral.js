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

    const [{ userdetails, loggedin, tradingpair, openorders }, dispatch] = useContext(GlobalContext);
    const history = useNavigate();
    const [loading, setloading] = useState(true)
    const [dataready, setdataready] = useState(false)
    const [nameOfReferral, setnameOfReferral] = useState("none")
    useEffect(() => {
        if (loggedin) {
            console.log(userdetails);
            console.log(userdetails.email);
            setloading(false)
            notereferral()
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

    const notereferral = async () => {
        if (userdetails.referreduserid == "none") {
            console.log("no user to refer")
            return
        } else {

            var docRef = await db.collection("users").doc(userdetails.referreduserid);
            await docRef
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        console.log(doc.data())
                       setnameOfReferral(doc.data().fullname                       )
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                })
                .catch(function (error) {
                    console.log("Error getting document:", error);
                });


        }
    }

    const notereferralD = async (data) => {
        if (data.referreduserid == "none") {
            console.log("no user to refer")
            return
        } else {

            var docRef = await db.collection("users").doc(data.referreduserid);
            await docRef
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        console.log(doc.data())
                       setnameOfReferral(doc.data().fullname                       )
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                })
                .catch(function (error) {
                    console.log("Error getting document:", error);
                });


        }
    }


    const fetchuserdata = async (userid) => {
        var docRef = db.collection("users").doc(userid);
        const fetching = await docRef
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    setdetails(doc.data());
                    setloading(false)
                    setdataready(true)
                    notereferralD(doc.data())
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
                                                    <small>{nameOfReferral}</small>
                                                </h3>
                                            </div>
                                            <div className="mt-4 col-md-12">
                                                <h2 className="title1 text-dark text-left">Your Referrals.</h2>
                                                <div className="table-responsive">
                                                    <table className="table UserTable table-hover text-dark">
                                                        <thead>
                                                            <tr>
                                                                <th>Client name</th>
                                                                <th>email</th>
                                                                <th>Client status</th>
                                                                <th>Date registered</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                                dataready && (
                                                                    userdetails.referrals.map((obj, i) => (

                                                                        <tr className="del237">
                                                                            <td>{obj.name}</td>
                                                                            <td>{obj.email}</td>
                                                                            <td>active</td>
                                                                            <td>{new Date(obj.date).toDateString()}</td>
                                                                        </tr>

                                                                    ))

                                                                )
                                                            }
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