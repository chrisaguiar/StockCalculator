const apiKey = '5Eh4KkNVkaBFWowAUy4z6WTO_pe1J_Iq';
// Function to allow data to be entered by pressing the ENTER key and not just by clicking the search button.
let input = document.getElementById("symbol");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});

function toggle(elem) {

  let button = document.getElementsByClassName('button');
  
  for (let i = 0; i < button.length; i++) {
    button[i].classList.remove('active-button');
  }
  
  elem.classList.add('active-button');
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
// Get Info function (Also gets other data from the API)
function getInfo() {
  const symbol = document.getElementById("symbol").value;
  const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${apiKey}`;

  // Make div visible to display info
  var element = document.getElementById("parent");
  element.classList.remove("invisible");

  // Ask API for data
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // GET data
      const closePrice = data.results[0].c;
      const openPrice = data.results[0].o;
      const volume = data.results[0].v;
      const high = data.results[0].h;
      const low = data.results[0].l;
      // Update website with the data
      document.getElementById("openPrice").innerHTML = `${symbol}'s last opening price was: $${openPrice}`;
      document.getElementById("closePrice").innerHTML = `${symbol}'s last closing price was: $${closePrice}`;
      document.getElementById("Volume").innerHTML = `${symbol}'s trading volume was: ${volume}`;
      document.getElementById("High").innerHTML = `${symbol}'s highest price was: $${high}`;
      document.getElementById("Low").innerHTML = `${symbol}'s lowest price was: $${low}`;
      document.getElementById("Error").innerHTML = ``;
    })
    .catch(error => {
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
      document.getElementById("buy-sell").innerHTML = ``;
      document.getElementById("type").innerHTML = ``;
      document.getElementById("order-info").innerHTML = ``;
      // document.getElementById("Error").innerHTML = `An unexpected error has occured.`;
    })
  // Left Side Done //

  // Right Side Start //
  document.getElementById("stock").innerHTML = `Stock: ${symbol}`;

  // document.getElementById("buy-sell").innerHTML = `${symbol}'s last closing price was: $${closePrice}`;
  document.getElementById("quantity").innerHTML = `Quantity`;
  document.getElementById("type").innerHTML = `${symbol}'s trading volume was: ${volume}`;
  document.getElementById("order-info").innerHTML = `${symbol}'s highest price was: $${high}`;
  document.getElementById("Error2").innerHTML = `An unexpected error has occured`;
  

}