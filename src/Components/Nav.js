import React, { useEffect, useRef, useState, useContext } from 'react'
import { BrowserRouter, useNavigate, Link, Route, Routes, Switch } from "react-router-dom";
import { f, database, storage, auth } from "../config";
import db from "../config";
import { GlobalContext } from "../Globalstate";
import firebase from "firebase";
import Swal from 'sweetalert2'


const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

function Nav() {


    //START AUTHOMATIC LOGOUT AFTER 10 MINUTES 600000 MILISECONDS
    let timer;
    // this function sets the timer that logs out the user after 10 secs
    const handleLogoutTimer = () => {
        timer = setTimeout(() => {
            // clears any pending timer.
            resetTimer();
            // Listener clean up. Removes the existing event listener from the window
            Object.values(events).forEach((item) => {
                window.removeEventListener(item, resetTimer);
            });
            // logs out user
            //600000 == 10 minutes
            logoutAction();
        }, 300000); // 10000ms = 10secs. You can change the time.
    };

    // this resets the timer if it exists.
    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    // when component mounts, it adds an event listeners to the window
    // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 10 secs of inactivity resets.
    // However, if none of the event is triggered within 10 secs, that is app is inactive, the app automatically logs out.
    useEffect(() => {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, () => {
                resetTimer();
                handleLogoutTimer();
            });
        });
    }, []);

    // logs out user by clearing out auth token in localStorage and redirecting url to /signin page.
    const logoutAction = () => {
        localStorage.clear();
        window.location.pathname = "/login.html";
    };
    //END AUTHOMATIC LOGOUT AFTER 10 MINUTES 600000 MILISECONDS









    const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
    const [loading, setloading] = useState(true)

    const history = useNavigate();
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
    const logout = async () => {
        const let1 = await setloggedin(false);
        const let2 = await f.auth().signOut();
        const let3 = await history("/login");
    };






    return (
        <>
            <div className="logo-header" data-background-color="blue">
                <a href="/" className="logo" style={{ fontSize: '27px', color: '#fff' }}>
                    Newellfinance
                </a>
                <button className="ml-auto navbar-toggler sidenav-toggler" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon">
                        <i class="fas fa-bars"></i>
                    </span>
                </button>
                <button className="topbar-toggler more"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>
                <div className="nav-toggle">
                    <button className="btn btn-toggle toggle-sidebar">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            <nav className="navbar navbar-header navbar-expand-lg" data-background-color="blue">
                <div className="container-fluid">
                    <div className="text-center d-md-block d-none">
                        <a href="/deposit" className="pricing-action btn btn-warning btn-sm">Fund your Account</a> &nbsp;
                        <a href="/withdrawal" className="pricing-action btn btn-danger btn-sm">Withdraw Funds</a>
                    </div>
                    <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
                        <li className="nav-item hidden-caret">
                            {/* <form action="javascript:void(0)" method="post" id="styleform" className="form-inline">
                                <div className="form-group">
                                    <label className="style_switch">
                                        <input name="style" id="style" type="checkbox" defaultValue="true" className="modes" />
                                        <span className="slider round" />
                                    </label>
                                </div>
                                <input type="hidden" name="_token" defaultValue="vg8xKARIQeTr2ZMOddTBo6RR3K7EOV1UUMIAagvp" />
                            </form> */}
                        </li>
                        <li className="nav-item hidden-caret">
                            <div id="google_translate_element" />
                        </li>
                        <li className="nav-item dropdown hidden-caret">
                            <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="false">
                                <i className="fas fa-layer-group" /><strong style={{ fontSize: '8px' }}>KYC</strong>
                            </a>
                            <div className="dropdown-menu quick-actions quick-actions-info animated fadeIn">
                                <div className="quick-actions-header">
                                    <span className="mb-1 title">KYC verification</span>
                                    <span className="subtitle op-8"><a>KYC status: </a></span>
                                </div>
                                <div className="quick-actions-scroll scrollbar-outer">
                                    <div className="quick-actions-items">
                                        <div className="m-0 row">
                                            <a href="/kyc" className="btn btn-success">Verify Account </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown hidden-caret">
                            <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="false">
                                <i className="fas fa-user" />
                            </a>
                            <ul className="dropdown-menu dropdown-user animated fadeIn">
                                <div className="dropdown-user-scroll scrollbar-outer">
                                    <li>
                                        <div className="user-box">
                                            <div className="u-text">
                                                <h4> {userdetails.fullname}</h4>
                                                <p className="text-muted"> {userdetails.email}</p><a href="/settings" className="btn btn-xs btn-secondary btn-sm">Account Settings</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown-divider" />
                                        <a className="dropdown-item" href="/deposit">Deposit</a>
                                        <a className="dropdown-item" href="/withdrawal">Withdraw</a>
                                        <a className="dropdown-item" href="/subscribe">Buy Plan</a>
                                        <div className="dropdown-divider" />
                                        <a className="dropdown-item" onClick={logout}>
                                            Logout
                                        </a>
                                        <form id="logout-form" style={{ display: 'none' }}>
                                            <input type="hidden" name="_token" defaultValue="vg8xKARIQeTr2ZMOddTBo6RR3K7EOV1UUMIAagvp" />
                                        </form>
                                    </li>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Nav