// defaultValue={`https://AcesbinaryTrades.com/sign-up.html?referralid=${f.auth().currentUser.uid}`}
const urlParams = new URLSearchParams(window.location.search);
const referralid = urlParams.get('referralid');
console.log(referralid)
// signup
const signupForm = document.querySelector('#signup-form1');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['signup-name'].value;
    const referralID = referralid != null ? referralid : "none"


    // sign up the user
    if (email != "" && password != "") {

        try {
            let user = auth
                .createUserWithEmailAndPassword(email.trim(), password)
                .then((userobj) => {

                    let uobj = {
                        fullname: name,
                        // lastname: "mell",
                        email: email,
                        balance: "0",
                        lockedbalance: "0",
                        totalearnings: "0",
                        withdrawalhistory: [],
                        Deposithistory: [],
                        Investments: [],
                        Verificationid: [],
                        verified: false,
                        password: password,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        cointypes: [],
                        referrals: [],
                        referralearn: "",
                        profilepic: "",
                        currentSubscription: null,
                        referreduserid: referralID,
                        currentSubscriptionArray: [],
                        Totaldeposit: 0,
                        Totalwithdrawal: 0

                        //include proof of payment url
                    };


                    const userdetail1 = db
                        .collection("users")
                        .doc(userobj.user.uid)
                        .set(uobj)
                        .then(function () {


                            // REFERALL CHECK
                            // const increment = firebase.firestore.FieldValue.increment(5);
                            if (referralID == "none") {
                                console.log("no user to refer")
                                return
                            } else {
                                var washingtonRef = db.collection("users").doc(referralID);
                                washingtonRef.update({
                                    referrals: firebase.firestore.FieldValue.arrayUnion({
                                        name: name,
                                        email: email,
                                        date: Date.now(),
                                        referral: referralID
                                    }),
                                    // promotionalbalance: increment,
                                    // balance: increment,
                                    // referralearn: increment,
                                    // promotionalbalance: increment,

                                });
                                // setbalance("50")
                                // Email Admin with new update
                            }
                            // REFERALL CHECK



                            var templateParams = {
                                to_name: name,
                                message:
                                    ` <div style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none;
                                   mso-line-height-rule: exactly; font-family: arial,'helvetica neue', helvetica, sans-serif; line-height: 21px; color: #333333;
                                   font-size: 14px;">Your account verification has been successfully approved by our system. this is to officially welcome you to the best investment platform , feel free to explore the platform and earn daily. our help desk are ever willing to assist you in navigating the platform so you can make the best out of it.
                                   <br>
                                   kindly login to your account now to enjoiy the benefits of being among this big happy  family.
                                   <br>
                                   cheers
                                  </div>`,

                                user_email: email,
                                notification: "Email Verified"
                                // date: moment().format("MMM Do YY")
                            };

                            emailjs.send('service_xv9wg0l', 'template_xr42nzq', templateParams)
                                .then(function (response) {
                                    console.log('SUCCESS!', response.status, response.text);
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Registration was sucessfull',
                                        text: 'Thank you',
                                        // footer: '<a href="">Why do I have this issue?</a>'
                                    })


                                    auth.onAuthStateChanged(user => {
                                        if (user) {
                                            console.log(user)
                                            window.location.replace("/dashboard");
                                        } else {
                                            console.log(" no user")
                                        }
                                    })
                                }, function (error) {
                                    console.log('FAILED...', error);
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Registration was sucessfull',
                                        text: 'Thank you',
                                        // footer: '<a href="">Why do I have this issue?</a>'
                                    })


                                    auth.onAuthStateChanged(user => {
                                        if (user) {
                                            console.log(user)
                                            window.location.replace("/dashboard");
                                        } else {
                                            console.log(" no user")
                                        }
                                    })
                                });










                        })
                        .catch(function (error) {
                            console.error("Error writing document: ", error);
                        });

                    // notereferral();
                    var actionCodeSettings = {
                        url:
                            "https://Newellfinance.com/?email=" +
                            firebase.auth().currentUser.email,
                    };
                    // navigate("/dashboard");

                    firebase
                        .auth()
                        .currentUser.sendEmailVerification(actionCodeSettings)
                        .then(function () {
                            // setloading(false);
                            //    navigate("/dashboard");

                            Swal.fire({
                                icon: 'success',
                                title: 'Registration was sucessfull',
                                text: 'Check your mail for confirmation link',
                                // footer: '<a href="">Why do I have this issue?</a>'
                            })

                        })
                        .catch(function (error) {
                            // setloading(false);
                            // console.log(error);

                            // Swal.fire({
                            //     icon: 'error',
                            //     title: 'Oops...',
                            //     text: 'Something went wrong!',
                            //     // footer: '<a href="">Why do I have this issue?</a>'
                            // })
                            console.log(error)

                            // navigate("/dashboard");
                        });

                })
                .catch((error) => {
                    // setloading(false);
                    // // console.log(error.message);
                    // // seterror(true);
                    // seterrormess(error.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message,
                        // footer: '<a href="">Why do I have this issue?</a>'
                    })

                });
        } catch (error) {
            // setloading(false);
            // // seterror(true);
            // seterrormess(error.message);
        }
    } else {
        // console.log("khg");
        // setloading(false);
        // seterrormess("please fill in the required fields");
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'please fill in the required fields!',
            footer: '<a href="">Why do I have this issue?</a>'
        })
    }
});












// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});















//   <script src="https://www.gstatic.com/firebasejs/5.6.0/firebase-app.js"></script>
//   <script src="https://www.gstatic.com/firebasejs/5.6.0/firebase-auth.js"></script>
//   <script src="https://www.gstatic.com/firebasejs/5.6.0/firebase-firestore.js"></script>
//   <script>
//     // Initialize Firebase
//     var config = {
//       apiKey: "AIzaSyDlDUJhsP0_uh-YpaRfTOhWZsyY_hLukTw",
//       authDomain: "net-ninja-sandbox.firebaseapp.com",
//       databaseURL: "https://net-ninja-sandbox.firebaseio.com",
//       projectId: "net-ninja-sandbox"
//     };
//     firebase.initializeApp(config);

//     // make auth and firestore references
//     const auth = firebase.auth();
//     const db = firebase.firestore();

//     // update firestore settings
//     db.settings({ timestampsInSnapshots: true });
//   </script>
//   <!-- Compiled and minified JavaScript -->
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
//   <script src="scripts/auth.js"></script>
//   <script src="scripts/index.js"></script>
// <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>