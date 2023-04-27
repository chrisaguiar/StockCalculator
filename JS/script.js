const apiKey = '5Eh4KkNVkaBFWowAUy4z6WTO_pe1J_Iq';
// Function to allow data to be entered by pressing the ENTER key and not just by clicking the search button.
let input = document.getElementById("symbol");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});
let choice = 1; // Buy = 1, Sell = 0

function toggle(elem) {

  let button = document.getElementsByClassName('button');

  for (let i = 0; i < button.length; i++) {
    button[i].classList.remove('active-button');
  }
  elem.classList.add('active-button');
  let choiceHTML = document.getElementById("choice");

  choice = elem.value; // Buy = 1, Sell = 0
  if (choice == 0) {
    choiceHTML.innerHTML = `Sell`;
  }
  else if (choice == 1) {
    choiceHTML.innerHTML = `Buy`;
  }
  console.log(choice); // Debugging
}

function getNews() {
  const apiUrl = `https://api.polygon.io/v2/reference/news?limit=10&apiKey=${apiKey}`;
  const newsList = document.getElementById('news-list');

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `
      <div class="article">
      <img src="${article.image_url}" alt="No Image Given" id="images-news">
      <h2>${article.title}</h2>
      <p>${article.description}</p>
      <p>Source: ${article.author}</p>
      <br>
      <button><a href="${article.article_url}" target="_blank">Read More</a></button>
      </div>
      `;
        newsList.appendChild(li);
      });
    })
    .catch(error => console.error(error));
}

let dataArr = [ {} ];
let closingPrice = 0;
let nameOfStock = "";
// Get Info function (Also gets other data from the API)
function getInfo() {
  const symbol = document.getElementById("symbol").value;
  const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${apiKey}`;

  // Make div visible to display info
  let element = document.getElementById("parent");
  element.classList.remove("invisible");
  let form = document.getElementById("quan");

  // Ask API for data
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // GET data
    nameOfStock = `${symbol}`;
    let closePrice = data.results[0].c;
    closingPrice = closePrice;
    let openPrice = data.results[0].o;
    let volume = data.results[0].v;
    let high = data.results[0].h;
    let low = data.results[0].l;
      // Update website with the data
      document.getElementById("openPrice").innerHTML = `${symbol}'s last opening price was: $${openPrice}`;
      document.getElementById("closePrice").innerHTML = `${symbol}'s last closing price was: $${closePrice}`;
      document.getElementById("Volume").innerHTML = `${symbol}'s trading volume was: ${volume}`;
      document.getElementById("High").innerHTML = `${symbol}'s highest price was: $${high}`;
      document.getElementById("Low").innerHTML = `${symbol}'s lowest price was: $${low}`;
      document.getElementById("Error").innerHTML = ``;
      form.classList.remove("invisible");
    })
    .catch(error => {
      form.classList.add("invisible");
      // If an error occurs, display it and hide all previous data
      console.log(error);
      document.getElementById("Error").innerHTML = `An unexpected error has occured`;
      document.getElementById("openPrice").innerHTML = ``;
      document.getElementById("closePrice").innerHTML = ``;
      document.getElementById("Volume").innerHTML = ``;
      document.getElementById("High").innerHTML = ``;
      document.getElementById("Low").innerHTML = ``;
      // Set things on right to null aswell
      document.getElementById("stock").innerHTML = ``;
      document.getElementById("quantity").innerHTML = ``;
      document.getElementById("buy-sell").innerHTML = ``;
      document.getElementById("type").innerHTML = ``;
      document.getElementById("order-info").innerHTML = ``;
      document.getElementById("Error2").innerHTML = `An unexpected error has occured.`;
    })
  // Left Side Done //

  // Right Side Start //
  document.getElementById("stock").innerHTML = `Stock: ${symbol}`;
  document.getElementById("quantity").innerHTML = `Quantity`;
  // document.getElementById("type").innerHTML = `${symbol}'s trading volume was: ${volume}`;
  // document.getElementById("order-info").innerHTML = `${symbol}'s highest price was: $${high}`;
  // document.getElementById("Error2").innerHTML = `An unexpected error has occured`;
}

// TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  TABLE CREATION  
// Create a table element

function enter() {
  let quantity = document.getElementById("quan").value;
  let value = closingPrice * quantity;
  
  // Check if the stock name is already in the data array
  let existingStock = dataArr.find(stock => stock.nameOfStock === nameOfStock);
  if (existingStock && choice == 1) {
    // If the stock is already in the array, update the quantity and value
    existingStock.quantity += parseInt(quantity);
    existingStock.value += value;
  
    // Check if the value is negative and set quantity and value to zero
    if (existingStock.value < 0) {
      existingStock.quantity = 0;
      existingStock.value = 0;
    }
  } else if(existingStock && choice == 0){
    existingStock.quantity -= parseInt(quantity);
    existingStock.value -= value;
  
    // Check if the value is negative and set quantity and value to zero
    if (existingStock.value < 0) {
      existingStock.quantity = 0;
      existingStock.value = 0;
    }
  } else if(!existingStock && choice == 0) {
    quantity = 0;
    value = 0;
  } else {
    dataArr.push({ nameOfStock, closingPrice, quantity: parseInt(quantity), value });
  }

  let stockDataDiv = document.getElementById("stock-data");
  let existingTable = stockDataDiv.querySelector("table");
  if (existingTable) {
    existingTable.remove();
  }

  let table = document.createElement("table");
  // Create a table header row
    let headerRow = table.insertRow();
    let headers = ["Stock Name", "Price", "Quantity", "Value"];
    for (let i = 0; i < headers.length; i++) {
      let th = document.createElement("th");
      th.innerText = headers[i];
      headerRow.appendChild(th);
    }
  
  // Create a row for each item in the data array
  let totalValue = 0; // Initialize the total value to 0
  for (let i = 1; i < dataArr.length; i++) {
    if (dataArr[i].quantity > 0) { // Check if quantity is greater than 0
      let row = table.insertRow();
      let stockName = row.insertCell();
      stockName.innerText = dataArr[i].nameOfStock;
      let price = row.insertCell();
      price.innerText = `$` + dataArr[i].closingPrice;
      let quantity = row.insertCell();
      quantity.innerText = dataArr[i].quantity;
      let value = row.insertCell();
      value.innerText = dataArr[i].value.toFixed(2);
      totalValue += dataArr[i].value; // Add the value of the stock to the total value
    }
  }
  
  // Create a row for the total value
  let totalRow = table.insertRow();
  let totalHeader = totalRow.insertCell();
  let totalHeader2 = totalRow.insertCell();
  totalHeader.innerText = "Total Value";
  totalHeader2.colSpan = 2; // Span the cell across all three columns
  let totalValueCell = totalRow.insertCell();
  totalValueCell.innerText = `$` + totalValue.toFixed(2);
  
  // Get the div with the ID "stock-data" and append the table to it
  stockDataDiv.appendChild(table);
  
  // Get the div with the ID "stock-data" and append the table to it

  stockDataDiv.appendChild(table);
}