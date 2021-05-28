$(function () {

    /*----- constants -----*/
    $(`header h1`).attr(`href`, `http://127.0.0.1:5500/index.html`)
    let stockInfo;
    let NASDAQ = `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNAS&token=c2o66caad3ie71thtb60`;

    // functions
    function search(input, arr) {
        arr.forEach(function (stock) {
            if (input !== ` `) {
                if (stock.description.match(input)) {
                    renderName(stock)
                }
            }
            else {
                // alert(`Please enter agetNEwsData stock name or symbol`)
            }
        })
    }

    function renderName(stock) {
        let stockSymbol = stock.symbol;
        let $keyData = $(`#stockName`); let description = $(`<h4>`).text(stock.description).attr({ class: `btn-primary`, symbol: stockSymbol });

        description.on(`click`, handleGetQuote);
        description.on(`click`, handleGetFinancials);
        description.on(`click`, handleGetNews);
        $keyData.append(description)
        let symbol = $(`<p>`).text(stock.displaySymbol);
        description.append(symbol)
    }

    function handleGetQuote(e) {
        e.preventDefault()
        let symbol = e.target.attributes[1].nodeValue;
        $(`h4`).unbind(`click`)
        $(`#stockName`).html(` `)
        $(`#stockName`).append(e.target)
        $.ajax({ url: `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c2o66caad3ie71thtb60` }).done(function (data) {
            displayGetQuote(data);
        })
    }

    function displayGetQuote(data) {
        $(`#quote`).html(` `)
        let $quote = $(`#quote`)
        $quote.append($(`<p>`).attr(`class`, `quoteTitle`).html(`Current: $<span class="quoteVal"> ${data.c}</span>`))
        $quote.append($(`<p>`).attr(`class`, `quoteTitle`).html(`High: $<span class="quoteVal"> ${data.h}</span>`))
        $quote.append($(`<p>`).attr(`class`, `quoteTitle`).html(`Low: $<span class="quoteVal"> ${data.l}</span>`))
        $quote.append($(`<p>`).attr(`class`, `quoteTitle`).html(`Open: $<span class="quoteVal"> ${data.o}</span>`))
    }

    function handleGetFinancials(e) {
        e.preventDefault()
        let symbol = e.target.attributes[1].nodeValue;
        $.ajax({ url: `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=c2o66caad3ie71thtb60` }).done(function (data) {
            displayFinancials(data);
        })
    }

    function displayFinancials(data) {
        $(`.info`).html(` `)
        let content = $(`.info`);
        for (let metric in data.metric) {
            const alphabet = "abcdefghijklmnopqrstuvwxyz"
            const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)]
            let id = new String(metric)
            let newId = id.replace(/[^a-z]/g, randomCharacter)
            let dataHtml = `<p>
            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${newId}" aria-expanded="false" aria-controls="${newId}">
            ${metric}
            </button>
            </p >
                <div class="collapse" id="${newId}">
                    <div class="card card-body">
                        ${data.metric[metric]}
                    </div>
                </div>`
            content.append(dataHtml)
        }
    }

    function handleGetNews(e) {
        e.preventDefault();
        let symbol = e.target.attributes[1].nodeValue
        $.ajax({ url: `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2021-03-01&to=2021-03-09&token=c2o66caad3ie71thtb60` }).done(function (data) {
            displayNews(data);
        })
    }

    function displayNews(data) {
        let $news = $(`#news`)
        $news.text(` `)
        for (let i = 0; i < 10; i++) {
            let article = data[i];
            let headlineData = article.headline;
            let imgData = article.image;
            let summaryData = article.summary;
            let urlData = article.url
            let urlButton = $(`<a href="${urlData}" class="btn btn-sm active" role="button" aria-pressed="true">Read More</a>`)
            let $div = $(`<div>`).attr(`class`, `newsContainer`);
            let $headline = $(`<h5>`).text(headlineData).attr(`class`, `newsHeadline`)
            let $summary = $(`<p>`).text(summaryData).attr(`class`, `newsSummary`)
            let $img = $(`<img>`).attr(`src`, imgData).attr(`class`, `newsImg`);
            let $url = $(`<a>`).attr(`href`, urlData).attr(`class`, `newsUrl`)
            $news.append($div)
            $div.append($headline)
            $div.append($summary)
            $div.append($img)
            $div.append(urlButton)
            $div.append($url)
        }
    }

    // This is so I can iterate over all the securities on the Nasdaq

    function handleGetData(e) {
        e.preventDefault();
        $input = $(`#search`).val().toUpperCase();
        $.ajax({ url: NASDAQ }).done(function (data) {
            search($input, data)

        }).fail(function () {
            alert(`We couldn't get the data from the server. `)
        })
        $(`#default`).remove()
    }

    // Search event listner
    $(`#getInfo`).on(`click`, handleGetData)
})
