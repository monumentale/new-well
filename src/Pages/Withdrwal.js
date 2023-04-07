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
import axios from "axios"


// //. remember   
// Totaldeposit: "0",
// Totalwithdrawal: "0"

function Withdrwal() {
    const [stage2, setstage2] = useState(false)
    const [Amount, setAmount] = useState("")
    const [Coinequivalent, setCoinequivalent] = useState("")
    const [coin, setcoin] = useState("")
    const [wallet, setwallet] = useState("")
    const [loading, setloading] = useState(true)
    const [investmentselected, setinvestmentselected] = useState("")
    const navigate = useNavigate()
    const [{ userdetails, loggedin, tradingpair, selectedinvestment }, dispatch] = useContext(GlobalContext);

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

    const [open, setOpen] = React.useState(false);

    const updateUserBalance = async (bal) => {
        const newEarings = parseFloat(userdetails.balance) - parseFloat(Amount);
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        var washingtonRef = await db.collection("users").doc(userids);
        washingtonRef
            .update({
                balance: newEarings,
            })
            .then(function () {
                console.log("Document successfully up2dated!");
                // alert("withdrawal was successful we will get back to you");
                Swal.fire({
                    icon: 'success',
                    title: 'withdrawal was successful we will get back to you!',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        // fetchuserdata();
    };
    const CreatWithdrawalObj = async () => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        const d1 = new Date();
        let uobj = {
            fullname: userdetails.fullname,
            email: userdetails.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userid: userids,
            info: {
                amt: Amount,
                date: d1.getTime(),
                mode: "withdrawal",
                wallet: wallet,
                coin: coin,
                status: "pending",
                investment: investmentselected

            }
        };
        const userdetail1 = await db
            .collection("withdrawals")
            .add(uobj)
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    };
    const updatewithdrawalhistory = async () => {

        if (coin == "" || Amount == "" || investmentselected == "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Select wallet, investment , and Amount to procecced withdrawal",
                footer: '<a href="">Why do I have this issue?</a>'
            })
            return 0
        }
        // console.log(cointype)
        setloading(true)
        const newBal = parseFloat(userdetails.balance); /*- parseFloat(Amount);*/
        const newEarings = parseFloat(userdetails.balance) - parseFloat(Amount);
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        const d1 = new Date();
        const increment = firebase.firestore.FieldValue.increment(parseInt(Amount));
        var washingtonRef = db.collection("users").doc(userids);
        await washingtonRef.update({

            Totalwithdrawal: increment,
            withdrawalhistory: firebase.firestore.FieldValue.arrayUnion({
                amt: Amount,
                date: d1.getTime(),
                mode: "withdrawal",
                wallet: wallet,
                coin: coin,
                status: "pending",
                investment: investmentselected

            }),
        });

        await SendMailtoClient()
        await updateUserBalance()
        await CreatWithdrawalObj()
    };

    const SendMailtoClient = async () => {
        var templateParams = {
            to_name: userdetails.fullname,
            message:
                ` <div style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none;
               mso-line-height-rule: exactly; font-family: arial,'helvetica neue', helvetica, sans-serif; line-height: 21px; color: #333333;
               font-size: 14px;">we wish to inform you that the following transaction occured on your account
                  <br ></br>
                  Your Withdrawal of ${Coinequivalent == "" ? Amount : parseFloat(Amount) / parseFloat(Coinequivalent)} ${coin} ($${Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}) has been processed
                  <br ></br>
                  Transaction Type: Withdrawn from ${investmentselected}
                  <br ></br>
                  <br ></br>
                  Amount:$${Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  <br ></br>
                  <br ></br>
                  Description: Fund Withdrawal BY ${userdetails.fullname}
                  <br ></br>
                  ${coin}:(${wallet})
                  <br ></br>
                  <br ></br>
                  Transaction Status:Pending
              </div>`,

            user_email: userdetails.email,
            // date: moment().format("MMM Do YY")
        };

        setloading(false)
        emailjs
            .send(
                "service_xv9wg0l",
                "template_xr42nzq",
                templateParams,
                "YNYcydGbTc2kU6LkM"
            )
            .then(
                function (response) {
                    setloading(false)


                },
                function (err) {
                    emailjs
                        .send(
                            "service_j65c2i3",
                            "template_qdy2w4q",
                            templateParams,
                            "m26d9Dc2HdsUq8B7n"
                        )
                        .then(
                            function (response) {
                                setloading(false)

                            },
                            function (err) {
                                setloading(false)
                                alert("FAILED...", err);
                                console.log(err)
                            }
                        );
                    console.log(err)
                }
            );
    }

    const confirmWitdrawal = async () => {

        setOpen(true);
        if (Amount != "") {
            console.log(Amount)
            console.log(userdetails.balance)
            if (parseFloat(userdetails.balance) < parseFloat(Amount)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "balance not enough",
                    footer: '<a href="">Why do I have this issue?</a>'
                })
            } else {
                await updatewithdrawalhistory()
                // setOpen(false);
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "no Amount selected",
                footer: '<a href="">Why do I have this issue?</a>'
            })
        }
    }




    const ProceedToWithdrwal = async (value) => {
        // "ethereum", "bitcoin", "tron", " dogecoin"
        if (value == "Ethereum") {
            const secfetch = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
            );
            console.log(secfetch.data[Object.keys(secfetch.data)[0]].usd)
            setCoinequivalent(parseFloat(secfetch.data[Object.keys(secfetch.data)[0]].usd))

        } else if (value == "Bitcoin") {
            const secfetch = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
            );
            console.log(secfetch.data[Object.keys(secfetch.data)[0]].usd)
            setCoinequivalent(parseFloat(secfetch.data[Object.keys(secfetch.data)[0]].usd))

        } else if (value == "Tron") {
            const secfetch = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd`
            );
            console.log(secfetch.data[Object.keys(secfetch.data)[0]].usd)
            setCoinequivalent(parseFloat(secfetch.data[Object.keys(secfetch.data)[0]].usd))

        } else if (value == "Doge") {
            const secfetch = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd`
            );
            console.log(secfetch.data[Object.keys(secfetch.data)[0]].usd)
            setCoinequivalent(parseFloat(secfetch.data[Object.keys(secfetch.data)[0]].usd))
        }

        setstage2(true)
        setcoin(value)
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
                        {/* End Navbar */}
                    </div>
                    {/* Stored in resources/views/child.blade.php */}
                    {/* Sidebar */}
                    <Sidebar />
                    {/* End Sidebar */}

                    {
                        !stage2 && (

                            <div className="main-panel bg-light">
                                <div className="content bg-light">
                                    <div className="page-inner">
                                        <div className="mt-2 mb-4">
                                            <h1 className="title1 text-dark">Request for Withdrawal</h1>
                                        </div>
                                        <div>
                                        </div>					<div>
                                        </div>					<div className="mb-5 row">

                                            <div className="col-lg-4">
                                                <div className="p-3 rounded card bg-light">
                                                    <div className="card-body border-danger">
                                                        <h2 className="card-title mb-3 text-dark"> Bitcoin</h2>
                                                        <h4 className="text-dark">Minimum amount: <strong style={{ float: 'right' }}> $10</strong></h4><br />
                                                        <h4 className="text-dark">Maximum amount:<strong style={{ float: 'right' }}> $10,000,000</strong></h4><br />
                                                        <h4 className="text-dark">Charge Type:<strong style={{ float: 'right' }}>percentage</strong></h4><br />
                                                        <h4 className="text-dark">Charges Amount:
                                                            <strong style={{ float: 'right' }}>
                                                                0%
                                                            </strong>
                                                        </h4><br />
                                                        <h4 className="text-dark">Duration:<strong style={{ float: 'right' }}> Instant</strong></h4><br />
                                                        <div className="text-center">
                                                            <form >
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />											<div className="form-group">
                                                                    <input type="hidden" defaultValue="Bitcoin" name="method" />
                                                                    <button className="btn btn-primary" type="button" onClick={() => { ProceedToWithdrwal("Bitcoin") }}><i className="fa fa-plus" /> Request withdrawal</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            <div className="col-lg-4">
                                                <div className="p-3 rounded card bg-light">
                                                    <div className="card-body border-danger">
                                                        <h2 className="card-title mb-3 text-dark"> Ethereum</h2>
                                                        <h4 className="text-dark">Minimum amount: <strong style={{ float: 'right' }}> $10</strong></h4><br />
                                                        <h4 className="text-dark">Maximum amount:<strong style={{ float: 'right' }}> $10,000,000</strong></h4><br />
                                                        <h4 className="text-dark">Charge Type:<strong style={{ float: 'right' }}>percentage</strong></h4><br />
                                                        <h4 className="text-dark">Charges Amount:
                                                            <strong style={{ float: 'right' }}>
                                                                0%
                                                            </strong>
                                                        </h4><br />
                                                        <h4 className="text-dark">Duration:<strong style={{ float: 'right' }}> Instant</strong></h4><br />
                                                        <div className="text-center">
                                                            <form >
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />											<div className="form-group">
                                                                    <input type="hidden" defaultValue="Bitcoin" name="method" />
                                                                    <button className="btn btn-primary" type="button" onClick={() => { ProceedToWithdrwal("Ethereum") }} ><i className="fa fa-plus" /> Request withdrawal</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>




                                            <div className="col-lg-4">
                                                <div className="p-3 rounded card bg-light">
                                                    <div className="card-body border-danger">
                                                        <h2 className="card-title mb-3 text-dark"> Doge</h2>
                                                        <h4 className="text-dark">Minimum amount: <strong style={{ float: 'right' }}> $10</strong></h4><br />
                                                        <h4 className="text-dark">Maximum amount:<strong style={{ float: 'right' }}> $10,000,000</strong></h4><br />
                                                        <h4 className="text-dark">Charge Type:<strong style={{ float: 'right' }}>percentage</strong></h4><br />
                                                        <h4 className="text-dark">Charges Amount:
                                                            <strong style={{ float: 'right' }}>
                                                                0%
                                                            </strong>
                                                        </h4><br />
                                                        <h4 className="text-dark">Duration:<strong style={{ float: 'right' }}> Instant</strong></h4><br />
                                                        <div className="text-center">
                                                            <form >
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />											<div className="form-group">
                                                                    <input type="hidden" defaultValue="Bitcoin" name="method" />
                                                                    <button className="btn btn-primary" type="button" onClick={() => { ProceedToWithdrwal("Doge") }} ><i className="fa fa-plus" /> Request withdrawal</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>





                                            <div className="col-lg-4">
                                                <div className="p-3 rounded card bg-light">
                                                    <div className="card-body border-danger">
                                                        <h2 className="card-title mb-3 text-dark"> Tron</h2>
                                                        <h4 className="text-dark">Minimum amount: <strong style={{ float: 'right' }}> $10</strong></h4><br />
                                                        <h4 className="text-dark">Maximum amount:<strong style={{ float: 'right' }}> $10,000,000</strong></h4><br />
                                                        <h4 className="text-dark">Charge Type:<strong style={{ float: 'right' }}>percentage</strong></h4><br />
                                                        <h4 className="text-dark">Charges Amount:
                                                            <strong style={{ float: 'right' }}>
                                                                0%
                                                            </strong>
                                                        </h4><br />
                                                        <h4 className="text-dark">Duration:<strong style={{ float: 'right' }}> Instant</strong></h4><br />
                                                        <div className="text-center">
                                                            <form >
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />											<div className="form-group">
                                                                    <input type="hidden" defaultValue="Bitcoin" name="method" />
                                                                    <button className="btn btn-primary" type="button" onClick={() => { ProceedToWithdrwal("Tron") }} ><i className="fa fa-plus" /> Request withdrawal</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-4">
                                                <div className="p-3 rounded card bg-light">
                                                    <div className="card-body border-danger">
                                                        <h2 className="card-title mb-3 text-dark"> USDT ERC20</h2>
                                                        <h4 className="text-dark">Minimum amount: <strong style={{ float: 'right' }}> $10</strong></h4><br />
                                                        <h4 className="text-dark">Maximum amount:<strong style={{ float: 'right' }}> $10,000,000</strong></h4><br />
                                                        <h4 className="text-dark">Charge Type:<strong style={{ float: 'right' }}>percentage</strong></h4><br />
                                                        <h4 className="text-dark">Charges Amount:
                                                            <strong style={{ float: 'right' }}>
                                                                0%
                                                            </strong>
                                                        </h4><br />
                                                        <h4 className="text-dark">Duration:<strong style={{ float: 'right' }}> Instant</strong></h4><br />
                                                        <div className="text-center">
                                                            <form >
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />											<div className="form-group">
                                                                    <input type="hidden" defaultValue="Bitcoin" name="method" />
                                                                    <button className="btn btn-primary" type="button" onClick={() => { ProceedToWithdrwal("USDT ERC20") }}><i className="fa fa-plus" /> Request withdrawal</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="col-lg-4">
                                                <div className="p-3 rounded card bg-light">
                                                    <div className="card-body border-danger">
                                                        <h2 className="card-title mb-3 text-dark"> USDT TRC 20</h2>
                                                        <h4 className="text-dark">Minimum amount: <strong style={{ float: 'right' }}> $10</strong></h4><br />
                                                        <h4 className="text-dark">Maximum amount:<strong style={{ float: 'right' }}> $10,000,000</strong></h4><br />
                                                        <h4 className="text-dark">Charge Type:<strong style={{ float: 'right' }}>percentage</strong></h4><br />
                                                        <h4 className="text-dark">Charges Amount:
                                                            <strong style={{ float: 'right' }}>
                                                                0%
                                                            </strong>
                                                        </h4><br />
                                                        <h4 className="text-dark">Duration:<strong style={{ float: 'right' }}> Instant</strong></h4><br />
                                                        <div className="text-center">
                                                            <form >
                                                                <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />											<div className="form-group">
                                                                    <input type="hidden" defaultValue="Bitcoin" name="method" />
                                                                    <button className="btn btn-primary" type="button" onClick={() => { ProceedToWithdrwal("USDT TRC 20") }}><i className="fa fa-plus" /> Request withdrawal</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        {/* Withdrawal Modal */}
                                        <div id="withdrawdisabled" className="modal fade" role="dialog">
                                            <div className="modal-dialog">
                                                {/* Modal content*/}
                                                <div className="modal-content">
                                                    <div className="modal-header bg-light">
                                                        <h4 className="modal-title text-dark">Withdrawal Status</h4>
                                                        <button type="button" className="close text-dark" data-dismiss="modal">×</button>
                                                    </div>
                                                    <div className="modal-body bg-light">
                                                        <h4 className="text-dark">Withdrawal is Disabled at the moment, Please check back later</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /Withdrawals Modal */}
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
                        )
                    }
                    {
                        stage2 && (
                            <div className="main-panel bg-light">
                                <div className="content bg-light">
                                    <div className="page-inner">
                                        <div className="mt-2 mb-4">
                                            <h1 className="title1 d-inline text-dark">Request for Withdrawal</h1>
                                            <div className="d-inline">
                                                {/* <div className="float-right btn-group">
                                                    <a className="btn btn-primary btn-sm" href="/getotp"> <i className="fa fa-envelope" /> Request OTP</a>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="mb-5 row">
                                            <div className="col-sm-12 col-lg-8 offset-md-2">
                                                <div className="p-md-4 p-2 rounded card bg-light">
                                                    <div className="card-body">
                                                        <div className="mb-3 alert alert-success">
                                                            <h4 className="text-dark">Your Payment Method is <strong>{coin}</strong></h4>
                                                        </div>
                                                        <form >
                                                            <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />                                        <div className="form-group">
                                                                <h5 className="text-dark">Enter Amount to withdraw</h5>
                                                                <input className="form-control text-dark bg-light" placeholder="Enter Amount" type="number" onChange={(e) => { setAmount(e.target.value) }} name="amount" required />
                                                            </div>
                                                            <input defaultValue="Bitcoin" type="hidden" name="method" />
                                                            <div className="form-group">
                                                                <h5 className="text-dark">Enter your {coin} wallet address</h5>
                                                                <input className="form-control text-dark bg-light" placeholder="Enter your wallet address" type="text" name="otpcode" onChange={(e) => { setwallet(e.target.value) }} required />
                                                                {/* <small className="text-dark">OTP will be sent to your email when you request</small> */}
                                                            </div>
                                                            <div className="form-group">
                                                                <h5 className="text-dark">Select Investment plan to withdraw</h5>
                                                                <select className="form-control text-dark bg-light" onChange={(e) => { setinvestmentselected(e.target.value) }} required>
                                                                    <option value="Standard Plan">Standard Plan</option>
                                                                    <option value="PREMIUM PLAN">PREMIUM PLAN</option>
                                                                    <option value="GOLD PLAN">GOLD PLAN</option>
                                                                    <option value="MINING PLAN">MINING PLAN</option>
                                                                    <option value="OIL AND GAS CONTRACT">OIL AND GAS CONTRACT</option>
                                                                    <option value="GOLD MINING CONTRACT">GOLD MINING CONTRACT</option>
                                                                    <option value="REAL ESTATE CONTRACT">REAL ESTATE CONTRACT</option>
                                                                </select>

                                                                {/* <small className="text-dark">OTP will be sent to your email when you request</small> */}
                                                            </div>
                                                            <div className="form-group">
                                                                <button className="btn btn-primary" type="button" onClick={confirmWitdrawal}>Complete Request</button>
                                                            </div>
                                                        </form>
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
                        )
                    }


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

export default Withdrwal