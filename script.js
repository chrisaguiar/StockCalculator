function getPrice() {
    const symbol = document.getElementById("symbol").value;
    const apiKey = "5Eh4KkNVkaBFWowAUy4z6WTO_pe1J_Iq";
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${apiKey}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const price = data.results[0].c;
        document.getElementById("price").innerHTML = `Last close price: $${price}`;
      })
      .catch(error => console.log(error));
  }
  