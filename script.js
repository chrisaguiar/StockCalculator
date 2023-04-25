function getPrice() {
    const symbol = document.getElementById("symbol").value;
    const apiKey = "5Eh4KkNVkaBFWowAUy4z6WTO_pe1J_Iq";
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${apiKey}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const closePrice = data.results[0].c;
        const openPrice = data.results[0].o;
        const volume = data.results[0].v;
        const high = data.results[0].h;
        const low = data.results[0].l;
        document.getElementById("openPrice").innerHTML = `${symbol}'s last opening price was: $${openPrice}`;
        document.getElementById("closePrice").innerHTML = `${symbol}'s last closing price was: $${closePrice}`;
        document.getElementById("Volume").innerHTML = `${symbol}'s trading volume was: ${volume}`;
        document.getElementById("High").innerHTML = `${symbol}'s highest price was: $${high}`;
        document.getElementById("Low").innerHTML = `${symbol}'s lowest price was: $${low}`;
      })
      .catch(error => console.log(error));
  }
  