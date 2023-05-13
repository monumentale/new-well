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

function Myinvestments() {


    const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
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






    const investments = [
        {
            id: "1",
            name: "BASIC PLAN",
            minimum: "50",
            Maximum: "15000",
            profits: "2",
            duration: "6"
        },
        {
            id: "2",
            name: "STANDARD PLAN ",
            minimum: "15000",
            Maximum: "40000",
            profits: "2.5",
            duration: "6"
        },
        {
            id: "3",
            name: "PREMIUM PLAN",
            minimum: "40000",
            Maximum: "80000",
            profits: "3.5",
            duration: "6"
        },
        {
            id: "4",
            name: "COMPOUND PLAN",
            minimum: "20000",
            Maximum: "1000000000000000",
            profits: "4",
            duration: "60"
        }
    ]
    const reffralCheck = () => {
        if (userdetails.referreduserid == "nnnnn") {
            console.log("np reffreal")
        } else {
            //increament referreduserid balance with 5% of invested amount
            var washingtonRef = db.collection("users").doc(userdetails.referreduserid);
            const increment = firebase.firestore.FieldValue.increment((5 * parseInt(amount)) / 100);
            washingtonRef
                .update({
                    balance: increment
                })
                .then(function () {
                    var userid = f.auth().currentUser;
                    var userids = userid.uid;
                    var washingtonRef2 = db.collection("users").doc(userids);
                    // set referreduserid to "nnnnn" 
                    washingtonRef2
                        .update({
                            referreduserid: "nnnnn"
                        })

                })
                .catch(function (error) {
                    console.log("Error updating balance");

                });
        }
    }

    const planactivation = (value) => {
        let SelectedInvestment = investments.find(o => o.id === value);
        // console.log(obj)
        if (amount !== "") {
            if (userdetails.currentSubscription == null) {



                Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you relly want to invest in ${SelectedInvestment.name}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, continue'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (
                            parseInt(userdetails.balance) !== 0 &&
                            parseInt(amount) <= parseInt(userdetails.balance)
                        ) {

                            if (parseInt(amount) >= SelectedInvestment.minimum && parseInt(amount) <= SelectedInvestment.Maximum) {
                                let amount1 = parseInt(amount);
                                // if (value == "1" && amount1 >= 300 && amount1 <= 10000) {
                                let bal = parseInt(userdetails.balance);
                                const newbal = bal - amount1;
                                // 92 no of days 1.8 is percent 
                                let due = (parseFloat(SelectedInvestment.duration) * ((parseFloat(SelectedInvestment.profits) / 100) * amount1)) + amount1;
                                let myDate = new Date();
                                // multiply number of days with 24
                                const d2 = addHoursToDate(myDate, (parseFloat(SelectedInvestment.duration) * 24)).getTime()
                                var cap = new Date(d2);
                                console.log(cap.toString());
                                const subscription = {
                                    amount: amount1,
                                    currentPlan: SelectedInvestment.name,
                                    dueAmount: due,
                                    dueDate: d2,
                                    dateSubscribed: new Date().getTime(),
                                };
                                updateUserBalanceAndSub(newbal, subscription, SelectedInvestment.name, due);
                                reffralCheck()
                                Swal.fire({
                                    icon: 'success',
                                    title: "Investment has been activated",
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                // handleClick2("activation of BASIC was successful");
                                // }
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'You selected the wrong investment for selected amount',
                                    footer: '<a href="">Why do I have this issue?</a>'
                                })
                            }

                        } else {

                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'you dont have enough balance proceed to funding section to credit your account!',
                                footer: '<a href="">Why do I have this issue?</a>'
                            })
                            //   handleClick();
                            //show toast
                        }
                    }
                })


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You Have Plan Running Currently!',
                })

            }
            //check this
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'fill in the requied fields!',
                footer: '<a href="">Why do I have this issue?</a>'
            })
            //show toast
        }
    };

    const CreatUserObj = async (obj, subsription) => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        let uobj = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            fullname: userdetails.fullname,
            email: userdetails.email,
            userid: userids,
            info: obj,
            subsription: subsription

        };
        const userdetail1 = await db
            .collection("investments")
            .add(uobj)
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    };


    const updateUserBalanceAndSub = (bal, subsription, plans, intrest) => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        var washingtonRef = db.collection("users").doc(userids);
        const increment = firebase.firestore.FieldValue.increment(intrest);
        washingtonRef
            .update({
                balance: bal,
                currentSubscription: subsription,
                totalearnings: increment,
                Investments: firebase.firestore.FieldValue.arrayUnion({
                    date: Date.now(),
                    plan: plans,
                    amount: amount,
                }),
            })
            .then(function () {
                console.log("Document successfully updated!");
                CreatUserObj(
                    {
                        date: Date.now(),
                        plan: plans,
                        amount: amount,
                    },
                    subsription

                )
            })
            .catch(function (error) {
                console.error("Error updating document: ", error);
            });
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
                        {/* Logo Header */}
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
                                    <h1 className="title1 text-dark">Available packages</h1>
                                </div>
                                <div>


                                    {/* show if plan is not running */}

                                    {/* userdetails.currentSubscription.dueDate */}
                                    {
                                        userdetails.currentSubscription == null && (
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="alert alert-danger alert-dismissable">
                                                        <button type="button" className="close" data-dismiss="alert" aria-hidden="true"></button>
                                                        <i className="fa fa-info-circle" /> You do not have a package at the moment
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        userdetails.currentSubscription != null && (
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="alert alert-success alert-dismissable">
                                                        <button type="button" className="close" data-dismiss="alert" aria-hidden="true"></button>
                                                        <i className="fa fa-info-circle" />{userdetails.currentSubscription.currentPlan}  is running<br />
                                                        <i className="fa fa-info-circle" />it will expire on {new Date(userdetails.currentSubscription.dueDate).toDateString()}<br />
                                                        <i className="fa fa-info-circle" />Current Profit is ${userdetails.totalearnings}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }




                                </div>					<div>
                                </div>
                                <section class="section">
                                    <div class="container">


                                        <div class="row align-items-stretch">
                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span>&nbsp;</span>
                                                    <h3>BASIC PLAN</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : EUR 50</li>
                                                        <li>Maximum: EUR 51,000</li>
                                                        <li>Profits: 2% daily</li>

                                                        <li>ROI:12%</li>
                                                        <li>REFERRAL COMMISSION:5%</li>

                                                        <li>Trading Period:6 Days</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="€1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("1") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">2% Daily Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>




                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center popular">
                                                    <span class="popularity">Most Popular</span>
                                                    <h3>STANDARD PLAN </h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : EUR 15,000</li>
                                                        <li>Maximum: EUR 40,000</li>
                                                        <li>Profits: 2.5% daily</li>
                                                        <li>ROI:15%</li>
                                                        <li>REFERRAL COMMISSION:5%</li>
                                                        <li>Trading Period:6 Days</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="€1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("2") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">2.5% Daily Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span class="popularity">Best Value</span>
                                                    <h3>PROFESSIONAL PLAN</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : EUR 40,000</li>
                                                        <li>Maximum: EUR 80,000</li>
                                                        <li>Profits: 3.5%</li>
                                                        <li>ROI:21%</li>
                                                        <li>REFERRAL COMMISSION:5%</li>
                                                        <li>Trading Period:6 days</li>


                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="€1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("3") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">3.5% Daily Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>




                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span>&nbsp;</span>
                                                    <h3>BUSINESS PLAN</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : EUR 25,000</li>
                                                        <li>Maximum: EUR UNLIMITED</li>
                                                        <li>Profits: 4% daily</li>
                                                        <li>ROI:240%</li>
                                                        <li>REFERRAL COMMISSION:10%</li>
                                                        <li>Trading Period: 60 days</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="€1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("4") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">4% Daily Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>









                                        </div>
                                    </div>
                                </section>
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

export default Myinvestments