let searchForm = document.querySelector('.search-form-container');
let loginForm =  document.querySelector('.login-form-container');
document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    // cart.classList.remove('active');    
    // loginForm.classList.remove('active');
    navbar.classList.remove('active');
}



let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    // cart.classList.remove('active');    
    // loginForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
}

// document.querySelector('.home').onmousemove = (e) =>{

//     let x = (window.innerWidth - e.pageX * 2) / 90;
//     let y = (window.innerHeight - e.pageY * 2) / 90;

//     document.querySelector('.home .home-parallax-img').style.transform = `translateX(${y}px) translateY(${x}px)`;
// }

// document.querySelector('.home').onmousemove = () =>{

//     document.querySelector('.home .home-parallax-img').style.transform = `translateX(0px) translateY(0px)`;
// }   

// const imgs = document.querySelectorAll('.img-select a');
// const imgBtns = [...imgs];
// let imgId = 1;

// imgBtns.forEach((imgItem) => {
//     imgItem.addEventListener('click', (event) => {
//         event.preventDefault();
//         imgId = imgItem.dataset.id;
//         slideImage();
//     });
// });

// function slideImage(){
//     const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

//     document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
// }

// window.addEventListener('resize', slideImage);

$(document).on('click','table tbody .banform',function(event){
    event.preventDefault();
    let username = $(this).find('input.username').val();
    let option = $(this).find('input.option').val()
    console.log(username,"sdd",option);   
    $.get(`/api/admin/updateAccount/${username}`,{
        option: option,
    },function(users){
        console.log(users)
        const commentTemplate = Handlebars.compile(
        document.getElementById("userAccounts-template").innerHTML);
        const commentHtml = commentTemplate(users);
        console.log(commentHtml);
        $('#tbody-userAccounts').html(commentHtml);
    })  
});