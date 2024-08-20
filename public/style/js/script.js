'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header & back top btn active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const showElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", showElemOnScroll);



/**
 * product filter
 */

// const filterButtons = document.querySelectorAll('.filter-btn-signle');  
// const products = document.querySelectorAll('.product-list-signle li');  

// filterButtons.forEach(button => {  
//     button.addEventListener('click', () => {  
//         const filterCategory = button.dataset.filterBtn;  

//         products.forEach(product => {  
//             if (filterCategory === 'allSingle' || product.classList.contains(filterCategory)) {  
//                 product.style.display = 'block'; // Show the product  
//             } else {  
//                 product.style.display = 'none'; // Hide the product  
//             }  
//         });  

//         // Remove active class from all buttons and add to current button  
//         filterButtons.forEach(btn => btn.classList.remove('active'));  
//         button.classList.add('active');  
//     });  
// }); 
const filterBoxSingle = document.querySelector("[data-filter-single]");
const filterBtnsSingle = document.querySelectorAll("[data-filter-btn-single]");

let lastClickedFilterBtnSingle = filterBtnsSingle[0];
const filterSingle = function () {
  lastClickedFilterBtnSingle.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtnSingle = this;
  filterBoxSingle.setAttribute("data-filter", this.dataset.filterBtn)
}
addEventOnElem(filterBtnsSingle, "click", filterSingle);

const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterBox = document.querySelector("[data-filter]");
let lastClickedFilterBtn = filterBtns[0];
const filter = function () {
  lastClickedFilterBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtn = this;
  filterBox.setAttribute("data-filter", this.dataset.filterBtn)
}
addEventOnElem(filterBtns, "click", filter);