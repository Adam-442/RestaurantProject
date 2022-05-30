// #################     Cart    #################

function open_cart_modal(){
   document.getElementById('modal').classList.add('modal-open');
   document.getElementById('modal').classList.remove('modal-close');
}

function close_cart_modal(){
   document.getElementById('modal').classList.remove('modal-open');
   document.getElementById('modal').classList.add('modal-close');
}

// ################# detail.HTML #################

let temp_counter = 1;
const btn_counter_value = document.getElementById('counter-value');

function add(number) {
   temp_counter += number;
   temp_counter = (temp_counter < 1)? 1: temp_counter;
   btn_counter_value.innerText = temp_counter;
   document.getElementById('count').value = temp_counter;
}

// Review Section
function showFields() {
   document.getElementById('review-section').classList.toggle("view");
}

// Review Counter
const review_el = document.getElementById('review');
if(review_el !=null){
   review_el.onkeyup = function () {
      document.getElementById('review-error').style.display = "none";
      document.getElementById('word-count').innerHTML = (this.value.length) + "/500";
   };
}

function validReview() {
   if (document.getElementById('review').value.length == 0) {
      document.getElementById('review-error').style.display = "block";
      return false;
   }

   if (document.getElementById('name').value == "") {
      document.getElementById('name').value = "Customer";
   }

   return true;
}

// async function submitReview(mealId) {   
//    let data = {
//       reviewer_name: document.getElementById('name').value,
//       city: getNull(document.getElementById('city').value),
//       date: new Date().toLocaleString(),
//       rating: Number(document.getElementById('rate_food').value)/20,
//       image: getNull(document.getElementById('image').value),
//       review: document.getElementById('review').value,
//       meal_id: mealId
//    };

//    const response = await fetch("/" + mealId + "/reviews", {
//       method: 'POST',
//       headers: {
//          'Accept': 'application/json',
//          'enctype-type': 'multipart/form-data',
//          'Content-Type': 'application/json;charset=UTF-8'
//       },
//       body: JSON.stringify(data)
//    })
//    if (response.ok) {
//       const responseJson = await response.json();
//       console.log(responseJson);
//    }
// }