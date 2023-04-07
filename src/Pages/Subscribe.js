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


function Subscribe() {
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
        console.log(addHoursToDate(myDate, 1).getTime())
        console.log(myDate)
        console.log(addHoursToDate(myDate, 1))

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
            name: "STANDARD PLAN",
            minimum: "50",
            Maximum: "1000",
            profits: "20",
            duration: "1"
        },
        {
            id: "2",
            name: "PREMIUM PLAN ",
            minimum: "2000",
            Maximum: "4000",
            profits: "30",
            duration: "2"
        },
        {
            id: "3",
            name: "GOLD PLAN",
            minimum: "6000",
            Maximum: "10000",
            profits: "50",
            duration: "3"
        },
        {
            id: "4",
            name: "MINING PLAN",
            minimum: "20000",
            Maximum: "1000000000000",
            profits: "200",
            duration: "7"
        },
        {
            id: "5",
            name: "OIL AND GAS CONTRACT ",
            minimum: "30000",
            Maximum: "1000000",
            duration: "30",
            profits: "65"
        },
        {
            id: "6",
            name: "GOLD MINING CONTRACT",
            minimum: "20000",
            Maximum: "70000",
            duration: "30",
            profits: "53"
        },
        {
            id: "7",
            name: "REAL ESTATE CONTRACT",
            minimum: "5000",
            Maximum: "50000",
            duration: "30",
            profits: "40"
        },
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

                                </div>					<div>
                                </div>
                                <section class="section">
                                    <div class="container">

                                        <div class="row align-items-stretch">

                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span>&nbsp;</span>
                                                    <h3>STANDARD PLAN</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 50</li>
                                                        <li>Maximum: USD 1,000</li>
                                                        <li>Profits: 20%</li>
                                                        <li>Referral bonus=5%</li>
                                                        <li>After 24hours</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("1") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">20% Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>




                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center popular">
                                                    <span class="popularity">Most Popular</span>
                                                    <h3>PREMIUM PLAN </h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 2,000</li>
                                                        <li>Maximum: USD 4,000</li>
                                                        <li>Profits: 30%</li>
                                                        <li>Referral bonus=5%</li>
                                                        <li>After 48hours</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("2") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">30% Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span class="popularity">Best Value</span>
                                                    <h3>GOLD PLAN</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 6,000</li>
                                                        <li>Maximum: USD 1o,000</li>
                                                        <li>Profits: 50%</li>
                                                        <li>Referral bonus=5%</li>
                                                        <li>After 4 days</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("3") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">50% Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>




                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span>&nbsp;</span>
                                                    <h3>MINING PLAN</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 20,000</li>
                                                        <li>Maximum: USD unlimited</li>
                                                        <li>Profits: 200%</li>
                                                        <li>Referral bonus=5%</li>
                                                        <li>After 7 days</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("4") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">200% Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center popular">
                                                    <span class="popularity">Most Popular</span>
                                                    <h3>OIL AND GAS CONTRACT </h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 30,000</li>
                                                        <li>Maximum: USD 1,000,000</li>
                                                        <li>intrest after 30 days</li>
                                                        <li>+100% capital realese at the expiration of contract</li>
                                                        <li>10% Referral commission</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("5") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">65% Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>


                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center">
                                                    <span class="popularity">Best Value</span>
                                                    <h3>GOLD MINING CONTRACT</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 20,000</li>
                                                        <li>Maximum: USD 70,000</li>
                                                        <li>intrest after 30 days</li>
                                                        <li>+100% capital realese at the expiration of contract</li>
                                                        <li>10% Referral commission</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("6") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">53% Profit</strong>
                                                        {/* <p><a href="#" class="btn btn-white">Choose Plan</a></p> */}
                                                    </div>
                                                </div>
                                            </div>


                                            <div class="col-lg-4 mb-4 mb-lg-0">
                                                <div class="pricing h-100 text-center popular">
                                                    <span class="popularity">Most Popular</span>
                                                    <h3>REAL ESTATE CONTRACT</h3>
                                                    <ul class="list-unstyled">
                                                        <li>Minimun : USD 5,000</li>
                                                        <li>Maximum: USD 50,000</li>
                                                        <li>intrest after 30 days</li>
                                                        <li>+100% capital realese at the expiration of contract</li>
                                                        <li>10% Referral commission</li>
                                                        <li>
                                                            <form >
                                                                <h5 className="text-dark">Insert Amount to invest</h5>
                                                                <input type="number" min={950} max={1000} onChange={(e) => { setamount(e.target.value) }} name="iamount" placeholder="$1000" className="form-control text-dark bg-light" /> <br />
                                                                <input type="hidden" name="duration" defaultValue="5 Months" />
                                                                <input type="hidden" name="id" defaultValue={5} />
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />
                                                                <input className="btn btn-block pricing-action btn-primary" defaultValue="Join plan" onClick={() => { planactivation("7") }} />
                                                            </form>
                                                        </li>
                                                    </ul>
                                                    <div class="price-cta">
                                                        <strong class="price">40% Profit</strong>
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

export default Subscribe