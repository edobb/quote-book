// Quote Book 2017
// Team Obile
if (window.attachEvent) { window.attachEvent('onload', load); }
else if (window.addEventListener) { window.addEventListener('load', load, false); }
else { document.addEventListener('load', load, false); }
function load() {
    /** Firebase Initialization Code */
    var config = {
        apiKey: "AIzaSyD4l7ohr0vT2IO8HoLQktw68zqTHhkyvck",
        authDomain: "quote-book-64374.firebaseapp.com",
        databaseURL: "https://quote-book-64374.firebaseio.com",
        projectId: "quote-book-64374",
        storageBucket: "",
        messagingSenderId: "460460843556"
    };
    firebase.initializeApp(config);
    /** A handle for the firebase database. */
    var database = firebase.database();
    var quoteAuthor;
    var quoteText;
    var quoteApp = {
        /** The div for displaying quote cards. */
        quoteDisplay: document.getElementById('quote-display'),
        /** An array for holding the cards that are in the display. This will can be sorted and used to re display cards in the view. */
        quoteCards: [],
        pullDatabaseQuotes: function (callback) {
            database.ref("/quotes").on("value", function (snap) {
                snap.forEach(function (childSnap) {
                    quoteApp.quoteCards.push(childSnap.val());
                });
                callback();
            });
        },
        displayQuotes: function () {
            console.log(quoteApp.quoteCards.length);
            for (var i = 0; i < quoteApp.quoteCards.length; i++) {
                quoteApp.createAndDisplayCard(quoteApp.quoteCards[i]);
            }
        },
        /** Creates card element and adds it to the view.
         * @param {Object} quote
         * @param {string} quote.quote
         * @param {string} quote.author
         * @param {number} quote.likes
         * @param {number} quote.dislikes
         * @param {string} quote.wikiLink
         * Data about the quote for creating a card to be displayed to the view.
         * - The actual text content of the quote.
         * - The author of the quote.
         * - The number of likes for the quote.
         * - The number of dislikes for the quote.
         * - The link to the wikipedia page for this quote.
         */
        createAndDisplayCard: function (quote) {
            var newRow = document.createElement("div");
            newRow.className = "row justify-content-center";
            var newCard = document.createElement("div");
            newCard.className = "card col-sm-7 cardWrapper";
            var cardBody = document.createElement("div");
            cardBody.className = "card-body";
            var quoteText = document.createElement("h4");
            quoteText.className = "card-title";
            quoteText.innerHTML = quote.quote;
            cardBody.appendChild(quoteText);
            var quoteAuthor = document.createElement("p");
            quoteAuthor.className = "card-text";
            quoteAuthor.innerHTML = "- " + quote.author;
            cardBody.appendChild(quoteAuthor);
            newCard.appendChild(cardBody);
            var cardFooter = document.createElement("div");
            cardFooter.className = "card-header cardFooter";
            var wikiLink = document.createElement("a");
            wikiLink.className = "wikiLink";
            wikiLink.href = quote.wikiLink;
            wikiLink.innerHTML = "Wikipedia";
            cardFooter.appendChild(wikiLink);
            var thumbsUp = document.createElement("img");
            thumbsUp.className = "thumbsImg";
            thumbsUp.src = "assets/images/icons/thumbsUp.png";
            cardFooter.appendChild(thumbsUp);
            var likesSpan = document.createElement("span");
            likesSpan.innerHTML = quote.likes;
            cardFooter.appendChild(likesSpan);
            var thumbsDown = document.createElement("img");
            thumbsDown.className = "thumbsImg";
            thumbsDown.src = "assets/images/icons/thumbsDown.png";
            cardFooter.appendChild(thumbsDown);
            var disLikesSpan = document.createElement("span");
            disLikesSpan.innerHTML = quote.dislikes;
            cardFooter.appendChild(disLikesSpan);
            newCard.appendChild(cardFooter);
            newRow.appendChild(newCard);
            quoteApp.quoteDisplay.appendChild(newRow);
        },
        quoteGenerator: function () {
            $.ajax({
                url: "https://api.forismatic.com/api/1.0/",
                jsonp: "jsonp",
                dataType: "jsonp",
                data: {
                    method: "getQuote",
                    lang: "en",
                    format: "jsonp"
                }
            }).done(function (response) {


                $('#quote').text(response.quoteText);
                $('#author').text(response.quoteAuthor);


                quoteAuthor = response.quoteAuthor;

                quoteText = response.quoteText;

            });
        }
    };

    $('#author-input').autocomplete({
        minLength: 3,
        delay: 50,
        appendTo: '#authorSearchContainer',
        source: function (request, response) {
            $.ajax({
                dataType: "json",
                type: 'Get',
                url: 'https://api.datamuse.com/sug?k=demo&s=' + encodeURIComponent(request.term),
                success: function (data) {
                    response($.map(data, function (item) {
                        return item["word"];
                    }))
                },
            });
        }
    });

    //Random Quote generated from API
    $('#random-quote-button').click(function () {
        quoteApp.quoteGenerator();
        
        
    });
    $("#save-random-quote").on("click", function () {
        database.ref("/quotes").push({
            quoteAuthor: quoteAuthor,
            quoteText: quoteText
        });
        
    });
    $("#add-quote-btn").on("click", function (event) {
        event.preventDefault();
        var author = $("#author-input").val().trim();
        var actualQuote = $("#quote-input").val().trim();
        console.log(author + " " + actualQuote);
        database.ref("/quotes").push({
            quoteAuthor: author,
            quoteText: actualQuote
        });
    });
    // Method calls
    quoteApp.quoteGenerator();
    quoteApp.pullDatabaseQuotes(function () {
        quoteApp.displayQuotes();
    });
}