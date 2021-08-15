function toggleDialog() {
  const dialog = document.querySelector('#dialog')
  dialog.classList.toggle('dialog--open')
  showStep1()
}
function submitCustomerDetails(event, skip = false) {
  event.target.preventDefault();
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const phone = document.querySelector('#phone').value
  const address = document.querySelector('#address').value
  const pincode = document.querySelector('#pincode').value
  const order = []
  const user = {
    name,
    email,
    phone,
    address,
    pincode, order
  }
  localStorage.setItem('user', JSON.stringify(user))
  showStep2()
}
function addNewOrderItem() {
  const order = JSON.parse(localStorage.getItem('user')).order
  const user = JSON.parse(localStorage.getItem('user'))
  const item = document.querySelector('#item').value
  const quantity = document.querySelector('#quantity').value
  const price = document.querySelector('#price').value
  const orderItem = {
    item,
    quantity,
    price
  }
  order.items.push(orderItem)
  user.order = order
  localStorage.setItem('user', JSON.stringify(user))
}
function showStep1() {
  const step1 = document.querySelectorAll('.step-1')
  for (let i = 0; i < step1.length; i++) {
    step1[i].classList.remove('hidden')
  }
  const step2 = document.querySelectorAll('.step-2')
  for (let i = 0; i < step2.length; i++) {
    step2[i].classList.add('hidden')
  }
}
function showStep2() {
  const step1 = document.querySelectorAll('.step-1')
  for (let i = 0; i < step1.length; i++) {
    step1[i].classList.add('hidden')
  }
  const step2 = document.querySelectorAll('.step-2')
  for (let i = 0; i < step2.length; i++) {
    step2[i].classList.remove('hidden')
  }
}