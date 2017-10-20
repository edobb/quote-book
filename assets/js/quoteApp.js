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
    var canSave = true;
    var quotesInDatabase =[];
    /**
     * Constructor for card objects
     * @param {String} key - The key to this object in the database
     * @param {Object} data - The data in the database associated with the first parameter key.
     */
    function Card(key, data) {
        this.key = key;
        this.data = data;
    }
    /**
     * Method for adding a card field to the card objects. Contains event listeners for the like and dislike button.
     * @param {HTMLDivElement} card
     * The html data for the view of the card.
     */
    Card.prototype.addCard = function(card) {
        this.card = card;
        var footer = card.getElementsByClassName("cardFooter")[0];
        this.likeButton = footer.children[1];
        this.dislikeButton = footer.children[3];
        this.likeButton.addEventListener("click", function(e) {
            for (var i = 0; i < quoteApp.cards.length; i++) {
                if (quoteApp.cards[i].card.contains(e.target)) {
                    quoteApp.addLike(quoteApp.cards[i].key);
                    quoteApp.cards[i].addLikeToView();
                    break;
                }
            }
        }, false);
        this.dislikeButton.addEventListener("click", function(e) {
            for (var i = 0; i < quoteApp.cards.length; i++) {
                if (quoteApp.cards[i].card.contains(e.target)) {
                    quoteApp.addDislike(quoteApp.cards[i].key);
                    quoteApp.cards[i].addDislikeToView();
                    break;
                }
            }
        })
    }

    Card.prototype.addLikeToView = function() {
        this.card.getElementsByClassName("cardFooter")[0].children[2].innerHTML = parseInt(this.card.getElementsByClassName("cardFooter")[0].children[2].innerHTML) + 1;
    }

    Card.prototype.addDislikeToView = function() {
        this.card.getElementsByClassName("cardFooter")[0].children[4].innerHTML = parseInt(this.card.getElementsByClassName("cardFooter")[0].children[4].innerHTML) + 1;
    }
    /**
     * The object that contains the fields and methods for the app.
     */
    var quoteApp = {
        /** The div for displaying quote cards. */
        quoteDisplay: document.getElementById('quote-display'),
        /** An array for holding the cards that are in the display. This will can be sorted and used to re display cards in the view. */
        quoteCards: [],
        quoteCardElements: [],
        cards: [],
        /**
         * Pulls all the quotes from the database and pushes them to the [quoteCards] array.
         * @param {Function} callback
         * Callback function for when all quotes have been loaded.
         */
        pullDatabaseQuotes: function (callback) {
            database.ref("/quotes").on("value", function (snap) {
                if (quoteApp.cards.length === 0) {
                    quoteApp.clearView();
                    snap.forEach(function (childSnap) {
                        quoteApp.cards.push(new Card(childSnap.key, childSnap.val()));
                        quoteApp.quoteCards.push(childSnap.val());
                        quotesInDatabase.push(childSnap.val().quote);
                    });
                    callback();
                }
            });
        },
        /**
         * Displays the array of quotes in the [quoteCards] array.
         */
        displayQuotes: function () {
            for (var i = 0; i < quoteApp.quoteCards.length; i++) {
                quoteApp.cards[i].addCard(quoteApp.createAndDisplayCard(quoteApp.quoteCards[i]));
            }
            for (var i = 0; i < document.getElementsByClassName("quoteCard").length; i++) {
                quoteApp.quoteCardElements.push(document.getElementsByClassName("quoteCard")[i]);
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
         * @return {HTMLDivElement}
         */
        createAndDisplayCard: function (quote) {
            var newRow = document.createElement("div");
            newRow.className = "row justify-content-center quoteCard";
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
            return newRow;
        },
        redisplayCards: function(quotes) {
            // After quoteApp.quoteCards is sorted
            quoteApp.cards = [];
            quoteApp.quoteDisplay.innerHTML = "";
            // quoteApp.displayQuotes();
            for (var i = 0; i < quotes.length; i++) {
                quoteApp.createAndDisplayCard(quotes[i]);
            }
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
        },
        /**
         * Increment the likes in the database for the given key.
         * @param {String} key - The unique key for the quote.
         */
        addLike: function(key) {
            var newLikes;
            database.ref('/quotes/' + key + '/likes').once("value", function(snap) {
                newLikes = snap.val() + 1;
            });
            database.ref('/quotes/' + key + "/likes").set(newLikes);
        },
        /**
         * Increment the dislikes in the database for the given key.
         * @param {String} key - The unique key for the quote.
         */
        addDislike: function(key) {
            var newDislikes;
            database.ref('/quotes/' + key + '/dislikes').once("value", function(snap) {
                newDislikes = snap.val() + 1;
            });
            database.ref('/quotes/' + key + "/dislikes").set(newDislikes);
        },
        /**
         * Resets the cards view and the arrays associated with the view.
         */
        clearView: function() {
            quoteApp.cards = [];
            quoteApp.quoteCards = [];
            quoteApp.quoteDisplay.innerHTML = "";
        },
        //LOOK THROUGH THE DATABASE, IF THE QUOTE IS IN THE DATABASE,
        //THE QUOTE IS SAVEABLE, 
        //IF ALREADY IN THE DATABASE, THE QUOTE IS NO LONGER SAVEABLE
        checkIfQuoteIsAlreadyQueried: function(q){
                for (var i = 0; i < quotesInDatabase.length; i++){
                    if(q.toLowerCase() === quotesInDatabase[i].toLowerCase()){
                        canSave = false;
                    }
                }
        },
        authorIsUnknown: function(auth){
            if (auth.length === 0){
                return true;
            }
            else{
                return false;
            }
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
        canSave = true;
        quoteApp.checkIfQuoteIsAlreadyQueried(quoteText);
        if (canSave){
            quotesInDatabase.push(quoteText);
            console.log("can save");
            if (quoteApp.authorIsUnknown(quoteAuthor)){
                quoteAuthor = "Unknown Author";
            }
            database.ref("/quotes").push({
                quote: quoteText,
                author: quoteAuthor,
                likes: 0,
                dislikes: 0,
                wikiLink: 'https://en.wikipedia.org/wiki/' + quoteAuthor
            });
        }
        else{
            console.log("sorry already taken");

        }
    });
    $("#add-quote-btn").on("click", function (event) {
        canSave = true;
        event.preventDefault();
        var author = $("#author-input").val().trim();
        var actualQuote = $("#quote-input").val().trim();
        quoteApp.checkIfQuoteIsAlreadyQueried(actualQuote);
        if (canSave && ( author !== "" && actualQuote !== "")){
            if (quoteApp.authorIsUnknown(author)){
                author = "Unknown Author";
            }
            quotesInDatabase.push(actualQuote);
            database.ref("/quotes").push({
                quote: author,
                author: actualQuote,
                likes: 0,
                dislikes: 0,
                wikiLink: 'https://en.wikipedia.org/wiki/' + quoteAuthor,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        } else if ( author === "" && actualQuote !== "" ){ //empty quote and author data validation below
        	$("#author-input").attr('placeholder' , "Enter an author (enter 'unknown author' if author unknown");
        } else if ( actualQuote === "" && author !== "" ){
        	$("#quote-input").attr('placeholder' , "Enter a quote");
        } else if ( actualQuote === "" && author === "" ){
        	$('#author-input').attr('placeholder' , "Enter an author (enter 'Unkown Author' if author unknown)");
        	$('#quote-input').attr('placeholder' , 'Enter a Quote');
        } else {
            console.log("sorry already taken");
            $("#inputError").text("Quote already exists, please try again");
        }
    });
    function bubbleSort(array, key) {
        var myKey;
        if (key === "likes") myKey = 2;
        else if (key === "dislikes") myKey = 4;
        for(var i = 0; i < array.length; i++) {
            for(var j = 1; j < array.length; j++) {
                if(parseInt(array[j - 1].getElementsByClassName("cardFooter")[0].children[myKey].innerHTML) < parseInt(array[j].getElementsByClassName("cardFooter")[0].children[myKey].innerHTML)) {
                    var temp = array[j - 1];
                    array[j - 1] = array[j];
                    array[j] = temp;
                }
            }  
        }
        return array;
    }
    function sortByAuthors(array, key){
        var myKey = 1;
        for(var i = 0; i < array.length; i++) {
            for(var j = 1; j < array.length; j++) {
                if(array[j - 1].getElementsByClassName("card-body")[0].children[myKey].innerHTML.toLowerCase() > array[j].getElementsByClassName("card-body")[0].children[myKey].innerHTML.toLowerCase()) {
                    var temp = array[j - 1];
                    array[j - 1] = array[j];
                    array[j] = temp;
                }
            }  
        }
        return array;
    };
    function sortByDate(){
        var arr = [];
        for (var i = 0; i < quotesInDatabase.length; i++){
            database.ref('/quotes').orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
                var snap = snapshot.val();
                console.log(snap);
                arr.push(snap);
            }, function(errorObject){
                console.log("Errors handled: " + errorObject.code);
            });
        }
        return arr;
    };
    function list() {
        return Array.prototype.slice.call(arguments);
      }
    document.getElementById('likesSortButton').addEventListener("click", function() {
        var children = quoteApp.quoteDisplay.children;
        var array = bubbleSort(Array.prototype.slice.call(children), "likes");
        quoteApp.quoteDisplay.innerHTML = "";
        for (var i = 0; i < array.length; i++) {
            quoteApp.quoteDisplay.appendChild(array[i]);
        }
    }, false);
    document.getElementById('dislikesSortButton').addEventListener('click', function() {
        var children = quoteApp.quoteDisplay.children;
        var array = bubbleSort(Array.prototype.slice.call(children), "dislikes");
        quoteApp.quoteDisplay.innerHTML = "";
        for (var i = 0; i < array.length; i++) {
            quoteApp.quoteDisplay.appendChild(array[i]);
        }
    }, false);
    document.getElementById("authorSortButton").addEventListener("click", function(){
        var children = quoteApp.quoteDisplay.children;
        var array =  sortByAuthors(Array.prototype.slice.call(children), "author");
        quoteApp.quoteDisplay.innerHTML = "";
        for (var i = 0; i < array.length; i++){
            quoteApp.quoteDisplay.appendChild(array[i]);
        }
    }, false);
    document.getElementById("dateSortButton").addEventListener("click", function(){
        $("#quote-display").empty();
        quoteApp.displayQuotes();
    });
    // Method calls
    quoteApp.quoteGenerator();
    quoteApp.pullDatabaseQuotes(function () {
    	quoteApp.displayQuotes();
    });
}