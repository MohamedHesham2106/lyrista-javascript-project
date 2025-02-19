 function toggleDropdown(event) {
        var menu = document.getElementById("dropdownMenu");
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
        if (!event.target.matches('input[type="button"]')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                dropdowns[i].style.display = "none";
            }
        }
    }
    
    window.addEventListener('click', function(event){
       toggleDropdown(event);
    });