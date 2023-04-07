const LetsLogin = document.querySelector('#signup-form');
LetsLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = LetsLogin['login-email'].value;
    const password = LetsLogin['login-password'].value;


    // auth.signInWithEmailAndPassword(email, password).then((cred) => {
    //     // close the signup modal & reset form
    //     const modal = document.querySelector('#modal-login');
    //     M.Modal.getInstance(modal).close();
    //     LetsLogin.reset();
    // });

    if (email != "" && password != "") {
        try {
            // log the user in
            auth.signInWithEmailAndPassword(email, password).then((cred) => {
                // close the signup modal & reset form
                auth.onAuthStateChanged(user => {
                    if (user) {
                        console.log(user)
                        window.location.replace("/dashboard");
                    } else {
                        console.log(" no user")
                    }
                })
                LetsLogin.reset();
            }).catch((error) => {
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
            // handleClick1();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                footer: '<a href="">Why do I have this issue?</a>'
            })
            // // alert(error)
        }
    } else {
        // setloading(false);
        // seterrormess("please fill in the required fields");
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'please fill in the required fields!',
            footer: '<a href="">Why do I have this issue?</a>'
        })
        // handleClick1();
    }

});


// signup
const signupForm = document.querySelector('#signup-form1');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    if (email != "" && password != "") {

        try {
            let user = auth
                .createUserWithEmailAndPassword(email.trim(), password)
                .then((userobj) => {

                    let uobj = {
                        firstname: "nall",
                        lastname: "mell",
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
                        referreduserid: "nnnnn"


                        //include proof of payment url
                    };


                    const userdetail1 = db
                        .collection("users")
                        .doc(userobj.user.uid)
                        .set(uobj)
                        .then(function () {
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

                        })
                        .catch(function (error) {
                            console.error("Error writing document: ", error);
                        });

                    // notereferral();
                    var actionCodeSettings = {
                        url:
                            "https://nftcapitalfx.com/login/?email=" +
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