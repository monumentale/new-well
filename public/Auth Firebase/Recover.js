const ResetPassword = document.querySelector('#reset-form');
ResetPassword.addEventListener('submit', (e) => {
    e.preventDefault();

    // Swal.fire({
    //     title: '<strong>HTML <u>example</u></strong>',
    //     // icon: 'info',
    //     html:
    //         '<div class="preloader js-preloader"> <div class="loader loader-inner-1"> <div class="loader loader-inner-2"><div class="loader loader-inner-3"> </div></div></div> </div>',
    //     showCloseButton: false,
    //     showCancelButton: false,
    //     focusConfirm: false,
    //     showConfirmButton: false,
    // })

    const email = ResetPassword['reset-email'].value;
    if (email != "") {
        var actionCodeSettings = {
            url:
                "https://gagesfinance.com/?email=" +
                email,
        };
        auth.sendPasswordResetEmail(email, actionCodeSettings).then(function () {
            // handleClick3() 
            Swal.fire(
                'Email sent!',
                'Check your mail for password reset link',
                'success'
            )
        }).catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                footer: '<a href="">Why do I have this issue?</a>'
            })
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'please fill in the required fields!',
            footer: '<a href="">Why do I have this issue?</a>'
        })
    }

});
