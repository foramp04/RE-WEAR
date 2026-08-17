const toggleLink = document.getElementById("toggle-link");
const title = document.getElementById("form-title");
const submit = document.getElementById("submit-btn");
const message = document.getElementById("toggle-message");
const nameGroup = document.getElementById("name-group");

let signup = false;

toggleLink.addEventListener("click", function(e){

    e.preventDefault();

    signup = !signup;

    if(signup){

        title.textContent = "Create Your Account";

        submit.textContent = "Sign Up";

        message.textContent = "Already have an account?";

        toggleLink.textContent = "Log In";

        nameGroup.style.display = "block";

    }

    else{

        title.textContent = "Welcome Back";

        submit.textContent = "Log In";

        message.textContent = "Don't have an account?";

        toggleLink.textContent = "Sign Up";

        nameGroup.style.display = "none";

    }

});
