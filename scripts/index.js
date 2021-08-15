let invoiceInProgress;
function fetchInvoices() {
  // Fetches the invoices from localStorage
  const invoices = JSON.parse(localStorage.getItem('invoices'));
  // If there are no invoices, return an empty array
  if (invoices === null) {
    return [];
  }
  // Otherwise, return the invoices
  return invoices;
}
function renderInvoices() {
  // Fetches the invoices from localStorage
  const invoices = fetchInvoices();
  // If there are no invoices, return an empty array
  if (invoices.length === 0) {
    return;
  }
  // Otherwise, render the invoices
  const invoicesList = document.getElementById('invoices');
  invoicesList.innerHTML = ''
  invoices.forEach(function (invoice, index) {
    const invoiceElement = document.createElement('li');
    invoiceElement.innerHTML = `<button class='sidebar__invoices__invoice' onclick="showSelectedInvoice(${invoice.id})" id="invoice-${invoice.id}">
    <div class="sidebar__invoices__invoice__top-row">
            <h4>
              Inv. #${index + 1} ${invoice.id}
            </h4>
            <time class="sidebar__invoices__invoice__top-row__time">${generateFormattedDateTimeString(new Date(invoice.date))}</time>
          </div>
          <div class="sidebar__invoices__invoice__bottom-row">
            <div class="sidebar__invoices__invoice__bottom-row__left">
              <p>Items - ${invoice.items.length}</p>
              <p class="sidebar__invoices__invoice__bottom-row__left__name">${invoice.customer.name || 'N.A.'}</p>
            </div>
            <p class="sidebar__invoices__invoice__bottom-row__amount">${moneyFormatter(invoice.amount)}</p>
          </div></button>`;
    invoicesList.appendChild(invoiceElement);
  });
}

function showSelectedInvoice(invoiceId) {
  const invoice = fetchInvoiceById(invoiceId)
  const invoiceButton = document.querySelector(`#invoice-${invoiceId}`)
  invoiceButton.classList.add('sidebar__invoices__invoice--selected')
  const invoiceButtons = document.querySelectorAll('.sidebar__invoices__invoice')
  invoiceButtons.forEach(function (button) {
    if (button !== invoiceButton) {
      button.classList.remove('sidebar__invoices__invoice--selected')
    }
  })
  const invoiceDetailArea = document.getElementById('printable-area');
  let itemRowsHTMLString = '';

  invoice.items.forEach(function (item) {
    itemRowsHTMLString += returnItemHTMLString(item)
  })
  const customerDataHTMLString = returnCustomerDataString(invoice.customer)
  invoiceDetailArea.innerHTML = `<div class="invoice__details">
        <div class="invoice__details__top-row">
          <div class="invoice__details__top-row__left">
            <h3 class="invoice__details__top-row__left__title">Invoice</h3>
            <p># ${invoice.id}</p>
            <time class="invoice__details__top-row__left__time">${generateFormattedDateTimeString(invoice.date)}</time>
          </div>
          <div class="invoice__details__top-row__right">
${customerDataHTMLString}
            <button class="invoice__details__top-row__right__button"
              onclick="onclick=printJS({printable:'printable-area',type:'html',css:'./styles/index.css'})">
              <p>PRINT</p> <img src="./assets/printer-blue@3x.png" alt="Printer Icon"
                class="invoice__details__top-row__right__button__image">
            </button>
          </div>
        </div>
        <table class="table">
          <thead class="table__head">
            <tr>
              <th class="table__head__item table__head__item--align-left">ITEM</th>
              <th class="table__head__item table__head__item--align-center">QUANTITY
              </th>
              <th class="table__head__item table__head__item--align-center">UNIT
                PRICE</th>
              <th class="table__head__item table__head__item--align-right">TOTAL
              </th>
            </tr>
          </thead>
          <tbody class="table__body">
          ${itemRowsHTMLString}
          </tbody>
        </table>
        <div class="invoice__details__summary">
          <div class="invoice__details__summary__row">
            <h3 class="invoice__details__summary__row__title">Sub Total</h3>
            <p class="invoice__details__summary__row__value">${moneyFormatter(invoice.amount)}</p>
          </div>
          <div class="invoice__details__summary__row">
            <h3 class="invoice__details__summary__row__title">Tax (${invoice.taxRate}%)</h3>
            <p class="invoice__details__summary__row__value">${moneyFormatter(invoice.tax)}</p>
          </div>
          <div class="invoice__details__summary__row">
            <h3 class="invoice__details__summary__row__title">Discount ${invoice.discountRate}%</h3>
            <p class="invoice__details__summary__row__value">${moneyFormatter(invoice.discount)}</p>
          </div>
        </div>
        <div class="invoice__details__total">
          <div class="invoice__details__total__row">
            <h3 class="invoice__details__total__row__title">Grand Total</h3>
            <p class="invoice__details__total__row__value">${moneyFormatter(invoice.total)}</p>
          </div>
        </div>
      </section>`
}
function returnItemHTMLString(item) {
  return `<tr>
    <td class="table__body__item table__body__item--align-left">${item.item}</td>
    </td>
    <td class="table__body__item table__body__item--align-center">${item.quantity}</td>
    <td class="table__body__item table__body__item--align-center">${moneyFormatter(item.price)}</td>
    </td>
    <td class="table__body__item table__body__item--align-right">${moneyFormatter(item.price * item.quantity)}</td>
  </tr>`
}
function returnCustomerDataString(customer) {
  return `<article class="customer-info">
    <p class="customer-info__title">Customer Details</p>
    <p class="customer-info__name">${customer.name || 'N.A.'}</p>
    <a href="mail:${customer.email || 'N.A.'}" class="customer-info__email">
      ${customer.email || 'N.A.'}
    </a>
  </article>`
}
function fetchInvoiceById(id) {
  const invoices = fetchInvoices()
  return invoices.find(function (invoice) {
    return invoice.id === id;
  });
}
function moneyFormatter(amount) {
  if (Intl) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  } else {
    return `₹${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  }
}

function toggleDialog() {
  const dialog = document.querySelector('#dialog')
  dialog.classList.toggle('dialog--open')
  // Check if dialog is open
  if (dialog.classList.contains('dialog--open')) {
    // Set focus on the first input element
    showStep1()
    showOrderNo();
    dialog.querySelector('input').focus()
  }
  else {
    init()
  }
}
function submitCustomerDetails(skip = false) {
  const form = document.querySelector('#customer-details-form')
  const invoices = fetchInvoices()
  let invoice = {
    id: invoices.length + 1,
    date: new Date(),
    customer: {
      name: document.querySelector('#name').value,
      email: document.querySelector('#email').value,
      phone: document.querySelector('#phone').value,
      address: document.querySelector('#address').value,
      pincode: document.querySelector('#pincode').value
    },
    items: [],
    amount: 0,
    tax: 0,
    discount: 0,
    total: 0,
    taxRate: 0,
    discountRate: 0
  }
  if (skip) {
    invoice.customer.name = undefined;
    invoice.customer.email = undefined;
    invoice.customer.phone = undefined;
    invoice.customer.address = undefined;
    invoice.customer.pincode = undefined;
    showStep2(invoice)
  }
  else {
    const isValidForm = form.reportValidity();
    if (isValidForm) {
      invoices.push(invoice)
      showStep2(invoice)
    }
  }
}
function saveInvoices(invoices) {
  localStorage.setItem('invoices', JSON.stringify(invoices))
}
function addElementToInvoice(event) {
  event.preventDefault()
  const item = {
    item: document.querySelector('#item-name').value,
    quantity: document.querySelector('#quantity').value,
    price: document.querySelector('#price').value,
    id: `${invoiceInProgress.id}${invoiceInProgress.items.length + 1}`
  }
  // Reset form element values
  document.querySelector('#item-name').value = ''
  document.querySelector('#quantity').value = ''
  document.querySelector('#price').value = ''
  invoiceInProgress.items.push(item)
  invoiceInProgress.amount += item.price * item.quantity
  invoiceInProgress.tax += item.price * item.quantity * (invoiceInProgress.taxRate / 100)
  invoiceInProgress.discount += item.price * item.quantity * (invoiceInProgress.discountRate / 100)
  invoiceInProgress.total += item.price * item.quantity + invoiceInProgress.tax - invoiceInProgress.discount
  renderItemInStep2InvoiceBody(item)
  renderInvoiceSummaryInStep2(invoiceInProgress)
}
function renderItemInStep2InvoiceBody(item) {
  const itemHTML = returnItemHTMLString(item)
  const bodyElement = document.querySelector(`#invoice-body`)
  bodyElement.innerHTML += itemHTML
}
function renderInvoiceSummaryInStep2(invoice) {
  const taxValueElement = document.querySelector(`#tax`)
  const discountElement = document.querySelector(`#discount`)
  const totalElement = document.querySelector(`#total`)
  const subtotalElement = document.querySelector(`#sub-total`)
  totalElement.innerHTML = moneyFormatter(invoice.total)
  taxValueElement.innerHTML = moneyFormatter(invoice.tax)
  discountElement.innerHTML = moneyFormatter(invoice.discount)
  subtotalElement.innerHTML = moneyFormatter(invoice.amount)
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
function showStep2(invoice) {
  const step1 = document.querySelectorAll('.step-1')
  for (let i = 0; i < step1.length; i++) {
    step1[i].classList.add('hidden')
  }
  const step2 = document.querySelectorAll('.step-2')
  for (let i = 0; i < step2.length; i++) {
    step2[i].classList.remove('hidden')
  }
  invoiceInProgress = invoice
  renderStep2CustomerInfo(invoice.customer)
}
function renderStep2CustomerInfo(customer) {
  const customerData = document.querySelector('#step-2-customer-info')
  customerData.innerHTML = returnCustomerDataString(customer)
}
function generateFormattedDateTimeString(date) {
  const formattedDate = new Date(date).toLocaleDateString()
  const formattedTime = new Date(date).toLocaleTimeString()
  return `${formattedTime} ${formattedDate}`
}
function init() {
  const invoices = fetchInvoices()
  if (invoices.length > 0) {
    renderInvoices()
    showSelectedInvoice(fetchInvoices()[0].id)
    hideNoInvoicesExist()
  } else {
    showNoInvoicesExist()
  }
  showInvoicesCount()
}
function showNoInvoicesExist() {
  const noInvoicesExistElements = document.querySelectorAll('.no-invoices-exist')
  for (let i = 0; i < noInvoicesExistElements.length; i++) {
    noInvoicesExistElements[i].classList.remove('hidden')
  }
}
function hideNoInvoicesExist() {
  const noInvoicesExistElements = document.querySelectorAll('.no-invoices-exist')
  for (let i = 0; i < noInvoicesExistElements.length; i++) {
    noInvoicesExistElements[i].classList.add('hidden')
  }
}
function showInvoicesCount() {
  const invoices = fetchInvoices()
  const invoicesCount = document.querySelector('#invoice-count')
  invoicesCount.innerHTML = `${invoices.length || 0}`
}
function showOrderNo() {
  const invoices = fetchInvoices()
  const orderNo = document.querySelector('#order-no')
  orderNo.innerHTML = `${invoices.length + 1}`
}
function updateTaxRate() {
  const taxRateElement = document.querySelector('#tax-rate')
  const taxRate = taxRateElement.value
  invoiceInProgress.taxRate = taxRate
  invoiceInProgress.tax = invoiceInProgress.amount * (invoiceInProgress.taxRate / 100)
  invoiceInProgress.total = invoiceInProgress.amount + invoiceInProgress.tax - invoiceInProgress.discount
  renderInvoiceSummaryInStep2(invoiceInProgress)
}
function updateDiscountRate() {
  const discountRateElement = document.querySelector('#discount-rate')
  const discountRate = discountRateElement.value
  invoiceInProgress.discountRate = discountRate
  invoiceInProgress.discount = invoiceInProgress.amount * (invoiceInProgress.discountRate / 100)
  invoiceInProgress.total = invoiceInProgress.amount + invoiceInProgress.tax - invoiceInProgress.discount
  renderInvoiceSummaryInStep2(invoiceInProgress)
}
function submitInvoice() {
  const invoices = fetchInvoices()
  invoices.push(invoiceInProgress)
  saveInvoices(invoices)
  invoiceInProgress = undefined
  toggleDialog()
}
init()
