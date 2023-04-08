import React, { useEffect, useRef, useState, useContext } from 'react'
import { BrowserRouter, useNavigate, Link, Route, Routes, Switch } from "react-router-dom";
import Nav from '../Components/Nav';
import Sidebar from '../Components/Sidebar';
import { f, database, storage, auth } from "../config";
import db from "../config";
import { GlobalContext } from "../Globalstate";
import firebase from "firebase";
import Swal from 'sweetalert2'
function Dashboard() {

    const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
    const [loading, setloading] = useState(true)

    /// use profits to display earnings too and also
    const [profits, setprofits] = useState(0)

    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    function cleanDate(d) {
        var date = new Date(d);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        console.log("Date: " + date.getDate() +
            "/" + (months[date.getMonth() + 1]) +
            "/" + date.getFullYear() +
            " " + date.getHours() +
            ":" + date.getMinutes() +
            ":" + date.getSeconds());
        return `${date.getDate()} ${(months[date.getMonth()])} ${date.getFullYear()}  ${date.getHours()}  ${date.getMinutes()} ${date.getSeconds()}`
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (loggedin) {
            console.log(userdetails);
            console.log(userdetails.email);
            setOpen(!open);
            planduecheck(userdetails)
        } else {
            f.auth().onAuthStateChanged(function (user) {
                if (user) {
                    var userid = f.auth().currentUser;
                    var userids = userid.uid;
                    fetchuserdata(userids);
                    setloggedin(true);
                    setloading(false)

                } else {
                    setloggedin(false);
                    setOpen(!open);
                    navigate("/");
                }
            });
        }
    }, []);


    const fetchuserdata = async (userid) => {
        var docRef = db.collection("users").doc(userid);
        await docRef
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    setdetails(doc.data());
                    console.log(doc.data())
                    setloggedin(true)
                    setOpen(!open);
                    planduecheck(doc.data())
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
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
        const let3 = await navigate("/");
    };

    function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }

    const planduecheck = (info) => {
        const d1 = new Date();
        if (info.currentSubscription != null) {
            // && info.currentSubscription.dueDate !==null
            if (d1.getTime() >= info.currentSubscription.dueDate) {
                //plan matured send mail to admin and increment acountball with due bal
                // set info.currentSubscription to null in firebase
                const newBal =
                    parseInt(info.balance) +
                    parseInt(info.currentSubscription.dueAmount);
                //onplanmatured(newBal);

                //this
                //is
                //oanda maual method
                updateUserBalanceandSub(newBal, info.currentSubscription.dueAmount);
                console.log(info.currentSubscription.dueDate);
            } else if (d1.getTime() < info.currentSubscription.dueDate) {

                //  const subscription = {
                //      amount: amount1,
                //      currentPlan: "PREMIUM PLAN for 7 Days 6% Roi",
                //     dueAmount: due,
                //     dueDate: d2,
                //     dateSubscribed: new Date().getTime(),
                //   };

                //update user balance every seconds and add up userbalance and totalearnings
                // totalearnings: increment,
                // const increment  = firebase.firestore.FieldValue.increment(-parseInt(increase));
                // var start = new Date(2012, 6, 2); // Jul 02 2012
                // var end = new Date(2012, 8, 2); // Sep 02 2012
                var today = new Date();
                var total = info.currentSubscription.dueDate - info.currentSubscription.dateSubscribed;
                var progress = today - info.currentSubscription.dateSubscribed;

                console.log(Math.round(progress / total * 100) + "%");
                const currentprofit = ((progress / total * 100) * info.currentSubscription.dueAmount) / 100
                console.log(currentprofit)
                intrestprogress(currentprofit)
                setprofits(currentprofit)




                console.log(info.currentSubscription.dueDate - d1.getTime());
                //plan not yet matured show current progress of app
                const planprogress =
                    ((info.currentSubscription.dueDate - d1.getTime()) /
                        info.currentSubscription.dueDate) *
                    100;
                console.log(planprogress);
                let date = new Date(info.currentSubscription.dueDate);
                // alert(`your current plan matures on £{date.toString()}`)
                // setinvest(`your current plan matures on ${date.toString()}`);
                console.log(date.toString());
            }
        } else {
            console.log(info.email);
            //show invest button
        }
        // const d2=new Date().setDate(d1.getDate()+3)
        // var cap= new Date(d2)
        // console.log(cap.toString())
    };


    const intrestprogress = (bal) => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        var washingtonRef = db.collection("users").doc(userids);
        const increment = firebase.firestore.FieldValue.increment(parseInt(bal));
        washingtonRef
            .update({
                totalearnings: bal,
            })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        // fetchuserdata(userids);
    };

    const updateUserBalanceandSub = (bal, addedbal) => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        var washingtonRef = db.collection("users").doc(userids);
        washingtonRef
            .update({
                balance: bal,
                currentSubscription: null,
                totalearnings: addedbal,
            })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        // fetchuserdata(userids);
    };


    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src =
    //         "https://s3.tradingview.com/tv.js";
    //     script.innerHTML = `
    //     new TradingView.widget(
    //         {
    //                                         "width": 'auto',
    //                                         "height": 500,
    //                                         "symbol": "BITFINEX:BTCUSD",
    //                                         "interval": "1",
    //                                         "timezone": "Etc/UTC",
    //                                         "theme": "Dark",
    //                                         "style": "9",
    //                                         "locale": "en",
    //                                         "toolbar_bg": "#f1f3f6",
    //                                         "enable_publishing": false,
    //                                         "hide_side_toolbar": false,
    //                                         "allow_symbol_change": true,
    //                                         "calendar": true,
    //                                         "studies": [
    //                                           "BB@tv-basicstudies"
    //                                         ],
    //                                         "container_id": "tradingview_f933e"
    //                                       }
    //                                         );
    //     `;
    //     tradingvi.current.appendChild(script);
    // }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
        script.innerHTML = `
        "currencies": [
            "EUR",
            "USD",
            "JPY",
            "BTC",
            "ETH",
            "LTC",
            "GBP",
            "CHF",
            "AUD",
            "CAD",
            "NZD",
            "CNY"
          ],
          "isTransparent": false,
          "colorTheme": "light",
          "width": "100%",
          "height": "100%",
          "locale": "en"
        `;
        tradingvi1.current.appendChild(script);
    }, []);


    // const tradingvi = useRef();

    const tradingvi1 = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.innerHTML = `
        "symbols": [
            {
                "proName": "FOREXCOM:SPXUSD",
                "title": "S&P 500"
            },
            {
                "proName": "FOREXCOM:NSXUSD",
                "title": "Nasdaq 100"
            },
            {
                "proName": "FX_IDC:EURUSD",
                "title": "EUR/USD"
            },
            {
                "proName": "BITSTAMP:BTCUSD",
                "title": "BTC/USD"
            },
            {
                "proName": "BITSTAMP:ETHUSD",
                "title": "ETH/USD"
            }
        ],
            "showSymbolLogo": true,
            "colorTheme": "dark",
            "isTransparent": true,
            "displayMode": "adaptive",
            "locale": "en"
        `;
        tradingvi2.current.appendChild(script);
    }, []);
    const tradingvi2 = useRef();


    return (
        <div>
            {/* 
            <Nav /> */}
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

            <div>

                {/*PayPal*/}
                <div id="app">
                    {/*/PayPal*/}
                    {/*Start of Tawk.to Script*/}
                    {/*End of Tawk.to Script*/}
                    <div className="wrapper">
                        <div className="main-header">
                            {/* Logo Header */}
                            {/* End Logo Header */}
                            {/* Navbar Header */}
                            <Nav />
                            {/* End Navbar */}
                        </div>
                        {/* Stored in resources/views/child.blade.php */}
                        {/* Sidebar */}
                        <Sidebar />
                        {/* End Sidebar */}
                        <div className="main-panel bg-light">
                            <div className="content bg-light">
                                <div class="tradingview-widget-container" ref={tradingvi2}>
                                    <div class="tradingview-widget-container__widget"></div>

                                </div>
                                <div className="page-inner">
                                    <div className="mt-2 mb-4">
                                        <h2 className="text-dark pb-2">Welcome,  {userdetails.fullname}!</h2>
                                        <h5 id="ann" className="text-darkop-7 mb-4">Welcome to Newellfinance HUB</h5>
                                    </div>
                                    <div>
                                    </div>					<div>
                                    </div>                    <div className="row">
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-secondary">
                                                        <i className="fa fa-dollar-sign" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark"><b>€{userdetails.balance}</b></h5>
                                                        <small className="text-muted">Account Balance</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-success">
                                                        <i className="fa fa-coins" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark"><b>€{profits}</b></h5>
                                                        <small className="text-muted text-dark">Total Profit</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-secondary">
                                                        <i className="fa fa-gift" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark"><b>€5.00</b></h5>
                                                        <small className="text-muted text-dark">Total Bonus</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-info">
                                                        <i className="fa fa-retweet" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark"><b>€0.00</b></h5>
                                                        <small className="text-muted text-dark">Total Referral Bonus</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        {/* <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-danger">
                                                        <i className="fa fa-envelope" />
                                                    </span>
                                                    {
                                                        userdetails != {} && (
                                                            <div>
                                                                <h5 className="mb-1 text-dark"><b>{userdetails.Investments.length}</b></h5>
                                                                <small className="text-muted text-dark">Total Investment Plans</small>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div> */}




                                        {/* <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-success">
                                                        <i className="fa fa-envelope-open" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark"><b>0</b></h5>
                                                        <small className="text-muted text-dark">Total Active Investment Plans</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}


                                        <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-warning">
                                                        <i className="fa fa-download" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark">€{userdetails.Totaldeposit}</h5>
                                                        <small className="text-muted text-dark">Total Deposit</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="p-3 card bg-light shadow">
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-3 stamp stamp-md bg-danger">
                                                        <i className="fa fa-arrow-alt-circle-up" />
                                                    </span>
                                                    <div>
                                                        <h5 className="mb-1 text-dark">€{userdetails.Totalwithdrawal}</h5>
                                                        <small className="text-muted text-dark">Total Withdrawals</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* <div className="pt-1 col-12">
                                            <h3>Personal Trading Chart</h3>
                                            <div className="tradingview-widget-container" style={{ margin: '30px 0px 10px 0px' }}>
                                                <div id="tradingview_f933e" />
                                                <div ref={tradingvi} className="tradingview-widget-copyright"><a href="#" rel="noopener" target="_blank"><span className="blue-text" /> <span className="blue-text">Personal trading chart</span></a></div>
                                            </div>
                                        </div> */}
                                        <div className="white-box" style={{ height: '450px', width: '100%' }}>
                                            <h4 style={{ marginBottom: '5px' }}> Forex Market Fundamental Data</h4>
                                            {/* TradingView Widget BEGIN */}
                                            <span id="tradingview-copyright" ref={tradingvi1}><a target="_blank" href="http://www.tradingview.com" style={{ color: 'rgb(173, 174, 176)', fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif', fontSize: '13px' }} /></span>
                                        </div>
                                    </div>
                                </div>
                                {/* end of chart */}
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

        </div>
    )
}

export default Dashboard