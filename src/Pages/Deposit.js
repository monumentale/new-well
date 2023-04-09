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

// //. remember   
// Totaldeposit: "0",
// Totalwithdrawal: "0"
function Deposit() {
    const history = useNavigate();
    const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
    const [stage2, setstage2] = useState(false)
    const [CoinInfo, setCoinInfo] = useState({})
    const [Amount, setAmount] = useState(0)
    const [loading, setloading] = useState(true)


    const [image, setimage] = useState(null);
    const [url, seturl] = useState("");
    const [progress, setprogress] = useState(0);
    const [imagepresnt, setimagepresent] = useState(false);
    const [prevfile, setprevFile] = useState("")


    const SetCoinInfo = (value) => {
        if (value == 1) {
            // bitcoin
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Selected Bitcoin as Payment Method',
                showConfirmButton: false,
                timer: 1500
            })

            setCoinInfo({
                name: "Bitcoin",
                address: "bc1qa0whllqsjuftmxl6p3g4tfwm4f2c6cdrsqyfym",
                img: "https://img.icons8.com/color/48/000000/bitcoin--v1.png"
            })
        } else if (value == 2) {
            //ethereum
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Selected Ethereum as Payment Method',
                showConfirmButton: false,
                timer: 1500
            })

            setCoinInfo({
                name: "Ethereum",
                address: "0xda09411713cd87363f2900BDe45146EaFeEd1330",
                img: "https://img.icons8.com/ios/452/ethereum.png"
            })

        } else if (value == 3) {
            //dodge
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Selected Doge as Payment Method',
                showConfirmButton: false,
                timer: 1500
            })
            setCoinInfo({
                name: "Doge",
                address: "D6Z6JvqG3z8FbUJ1PAd7F5BzXMdKEboCRr",
                img: "https://img.icons8.com/ios-filled/344/dogecoin.png"
            })

        } else if (value == 4) {
            //tron
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Selected Tron as Payment Method',
                showConfirmButton: false,
                timer: 1500
            })
            setCoinInfo({
                name: "Tron",
                address: "THZu81uaNZ4ywfEQhzfe5y9aNFn3pEoht4",
                https: "https://img.icons8.com/cotton/344/tron.png"
            })

        } else if (value == 5) {
            //usdterc20
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Selected Usdt ERC20 as Payment Method',
                showConfirmButton: false,
                timer: 1500
            })
            setCoinInfo({
                name: "Usdt ERC20",
                address: "0xda09411713cd87363f2900BDe45146EaFeEd1330",
                https: "https://img.icons8.com/cotton/344/tether--v1.png"
            })

        } else if (value == 6) {
            //usdtTrc20
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Selected USDT TRC20 as Payment Method',
                showConfirmButton: false,
                timer: 1500
            })
            setCoinInfo({
                name: "USDT TRC20",
                address: "THZu81uaNZ4ywfEQhzfe5y9aNFn3pEoht4",
                https: "https://img.icons8.com/color/344/tether--v2.png"
            })

        }
    }
    const copyAlert = () => {
        navigator.clipboard.writeText(CoinInfo.address);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${CoinInfo.name} Address Was Copied Please Proceed To Payment`,
            showConfirmButton: false,
            timer: 1500
        })
    }


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setimage(e.target.files[0]);
            setimagepresent(true);
            setprevFile(URL.createObjectURL(e.target.files[0]))
        }
    };

    const handleUpload = () => {
        if (!imagepresnt) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No Image Was Selected!',
            })
            return
        }
        //check wether amt is empty or file is not selected
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setprogress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        seturl(url);
                        updatehistory(url);
                        setprogress(0);
                        setimagepresent(false)
                        // sendAdminMaiil()
                        Amminalert()

                        Swal.fire(
                            'Succesful Transaction!',
                            'Your account will be credited once the payment is recieved.',
                            'success'
                        )
                        // alert("we will we credit your balance shortly");
                        setimage(null);
                        // history("/dashboard")
                    });
            }
        );
    };

    const Amminalert=()=>{
        var templateParams = {
            message:`A DEPOSIT REQUEST WAS RECENTLY SENT TO YOUR SITE. PLEASE VERIFY THE TRANSACTION`,
          };
    
          emailjs
            .send(
              "service_w17bgdc",
              "template_4syi4ko",
              templateParams,
              "user_iXcCK92pX9hoRsCO9CPnk"
            )
            .then(
              function (response) {
                console.log("SUCCESS!", response.status, response.text);
              },
              function (err) {
                console.log("FAILED...", err);
              }
            );
    }
    const sendAdminMaiil = async () => {
        var templateParams = {
            message: `${userdetails.email} have successfully Deposited €${Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  check admin dashboard to verify`,
        };

        // setloading(false)
        //handleClick1()

        await emailjs
            .send(
                "service_xv9wg0l",
                "template_xr42nzq",
                templateParams,
                "YNYcydGbTc2kU6LkM"
            )
            .then(
                function (response) {
                    // setloading(false)
                },
                function (err) {
                    // setloading(false)
                    alert("FAILED...", err);
                }
            );
    }

    const CreatUserObj = async (obj) => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        let uobj = {
            fullname: userdetails.fullname,
            email: userdetails.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userid: userids,
            info: obj

        };

        const userdetail1 = await db
            .collection("deposits")
            .add(uobj)
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    };
    const updatehistory = async (urls) => {
        var userid = f.auth().currentUser;
        var userids = userid.uid;
        const increment = firebase.firestore.FieldValue.increment(parseInt(Amount));
        CreatUserObj({
            image: urls,
            date: Date.now(),
            amt: Amount,
            mode: "Deposit",
            coin: CoinInfo.name
        })
        var washingtonRef = db.collection("users").doc(userids);
        await washingtonRef.update({
            Totaldeposit: increment,
            Deposithistory: firebase.firestore.FieldValue.arrayUnion({
                image: urls,
                date: Date.now(),
                amt: Amount,
                mode: "Deposit",
                coin: CoinInfo.name
            }),
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

                        {
                            !stage2 && (

                                <div className="main-panel bg-light">
                                    <div className="content bg-light">
                                        <div className="page-inner">
                                            <div className="mt-2 mb-4">
                                                <h1 className="title1 text-dark">Fund Your Account</h1>
                                            </div>
                                            <div>
                                            </div>					<div>
                                            </div>					<div className="row">
                                                <div className="col-md-12">
                                                    <div className="card bg-light">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <form id="submitpaymentform">
                                                                        <input type="hidden" name="_token" defaultValue="k5vo0JWch7ewX2NZkBqtZPDrs6Nhx9DZ9Jv32oG6" />												<div className="row">

                                                                            <div className="mb-4 col-md-12">
                                                                                <h5 className="card-title text-dark">Enter Amount</h5>
                                                                                <input className="form-control text-dark bg-light" onChange={(e) => { setAmount(e.target.value) }} placeholder="Enter Amount" type="number" name="amount" required />
                                                                            </div>


                                                                            <div className="mb-4 col-md-12">
                                                                                <input type="hidden" name="payment_method" id="paymethod" />
                                                                            </div>
                                                                            <div className="mt-2 mb-1 col-md-12">
                                                                                <h5 className="card-title text-dark">Choose Payment Method from the list below</h5>
                                                                            </div>
                                                                            <div className="mb-2 col-md-6" onClick={() => { SetCoinInfo(1) }}>
                                                                                <a style={{ cursor: 'pointer' }} data-method="Bitcoin" id={1} className="text-decoration-none" >
                                                                                    <div className="rounded shadow bg-light">
                                                                                        <div className="card-body">
                                                                                            <span className="text-dark">
                                                                                                <img src="https://img.icons8.com/color/48/000000/bitcoin--v1.png" alt="" className style={{ width: '25px' }} />
                                                                                                Bitcoin
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>
                                                                            <div className="mb-2 col-md-6" onClick={() => { SetCoinInfo(2) }}>
                                                                                <a style={{ cursor: 'pointer' }} data-method="Bitcoin" id={1} className="text-decoration-none" >
                                                                                    <div className="rounded shadow bg-light">
                                                                                        <div className="card-body">
                                                                                            <span className="text-dark">
                                                                                                <img src="https://img.icons8.com/ios/452/ethereum.png" alt="" className style={{ width: '25px' }} />
                                                                                                Ethereum

                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>

                                                                            <div className="mb-2 col-md-6" onClick={() => { SetCoinInfo(3) }}>
                                                                                <a style={{ cursor: 'pointer' }} data-method="Bitcoin" id={1} className="text-decoration-none" >
                                                                                    <div className="rounded shadow bg-light" >
                                                                                        <div className="card-body">
                                                                                            <span className="text-dark">
                                                                                                <img src="https://img.icons8.com/ios-filled/344/dogecoin.png" alt="" className style={{ width: '25px' }} />
                                                                                                Doge
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>
                                                                            <div className="mb-2 col-md-6" onClick={() => { SetCoinInfo(4) }}>
                                                                                <a style={{ cursor: 'pointer' }} data-method="Bitcoin" id={1} className="text-decoration-none" >
                                                                                    <div className="rounded shadow bg-light">
                                                                                        <div className="card-body">
                                                                                            <span className="text-dark">
                                                                                                <img src="https://img.icons8.com/cotton/344/tron.png" alt="" className style={{ width: '25px' }} />
                                                                                                Tron
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>

                                                                            <div className="mb-2 col-md-6" onClick={() => { SetCoinInfo(5) }}>
                                                                                <a style={{ cursor: 'pointer' }} data-method="Bitcoin" id={1} className="text-decoration-none" >
                                                                                    <div className="rounded shadow bg-light">
                                                                                        <div className="card-body">
                                                                                            <span className="text-dark">
                                                                                                <img src="https://img.icons8.com/color/344/tether--v2.png" alt="" className style={{ width: '25px' }} />
                                                                                                USDT Erc20
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>

                                                                            <div className="mb-2 col-md-6" onClick={() => { SetCoinInfo(6) }}>
                                                                                <a style={{ cursor: 'pointer' }} data-method="Bitcoin" id={1} className="text-decoration-none" >
                                                                                    <div className="rounded shadow bg-light">
                                                                                        <div className="card-body">
                                                                                            <span className="text-dark">
                                                                                                <img src="https://img.icons8.com/cotton/344/tether--v1.png" alt="" className style={{ width: '25px' }} />
                                                                                                USDT Trc20
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </div>


                                                                            {
                                                                                Amount != 0 && CoinInfo != {} && (
                                                                                    <div className="mt-2 mb-1 col-md-12" onClick={() => { setstage2(true) }}>
                                                                                        <input type="button" className="px-5 btn btn-primary btn-lg" defaultValue="Procced to Submission" />
                                                                                    </div>
                                                                                )
                                                                            }



                                                                        </div>
                                                                    </form>
                                                                </div>
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

                            )
                        }













                        {
                            stage2 && (

                                <div className="main-panel bg-light">
                                    <div className="content bg-light">
                                        <div className="page-inner">
                                            <div className="mt-2 mb-1 col-md-12" onClick={() => { setstage2(false) }}>
                                                <input type="Back" className="px-5 btn btn-primary btn-lg" defaultValue="Back" />
                                            </div>
                                            <div className="mt-2 mb-4">
                                                <h1 className="title1 text-dark">Make Payment</h1>
                                            </div>
                                            <div>
                                            </div>					<div>
                                            </div>					<div>
                                            </div>					<div className="row">
                                                <div className="col-md-8 offset-md-2">
                                                    <div className="card bg-light shadow-lg p-2 p-md-4">
                                                        <div className="card-body">
                                                            <div>
                                                                <h4 className="text-dark">You are to make payment of <strong>${Amount}</strong> using your selected payment method. Screenshot and upload the proof of payment</h4>
                                                                <h4>
                                                                    <img src={CoinInfo.img} alt="" className="w-25" />
                                                                    <strong className="text-dark">{CoinInfo.name}</strong>
                                                                </h4>
                                                            </div>
                                                            <div className="mt-5">
                                                                <h3 className="text-dark">
                                                                    <strong>{CoinInfo.name} Address:</strong>
                                                                </h3>
                                                                <div className="form-group">
                                                                    <div className="mb-3 input-group">
                                                                        <input type="text" className="form-control myInput readonly text-dark bg-light" defaultValue={CoinInfo.address} id="myInput" readOnly />
                                                                        <div className="input-group-append">
                                                                            <button className="btn btn-outline-secondary" onclick="myFunction()" type="button" id="button-addon2"><i className="fas fa-copy" onClick={copyAlert} /></button>
                                                                        </div>
                                                                    </div>
                                                                    <small className="text-dark"><strong>Network Type:</strong> {CoinInfo.name} </small>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <form>
                                                                    <input type="hidden" name="_token" defaultValue="zn8v4I2d4bZyK4wpUA2IxCApAntbf4ODlmrnGzIz" />													<div className="form-group">
                                                                        <h5 className="text-dark">Upload Payment proof after payment.</h5>
                                                                        <input type="file" name="proof" onChange={handleChange} className="form-control col-lg-4 bg-light text-dark" required />
                                                                    </div>
                                                                    <input type="hidden" name="amount" defaultValue={1000} />
                                                                    <input type="hidden" name="paymethd_method" defaultValue="Bitcoin" />
                                                                    <div className="form-group">


                                                                        {
                                                                            imagepresnt && (
                                                                                <>
                                                                                    <progress id="file" value={progress} max="100"> {progress} </progress>
                                                                                    <input type="button" className="btn btn-dark" defaultValue="Submit Payment" onClick={handleUpload} />
                                                                                </>

                                                                            )
                                                                        }
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

                            )
                        }

                    </div>
                </div>
            </div>







            {/* <Nav /> */}

        </div>
    )
}

export default Deposit