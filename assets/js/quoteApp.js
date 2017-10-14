// Quote Book 2017
// Team Obile
if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    /** This data is here just as filler until there is a working database to pull information from. */
    var mockDatabase = {
        quotes: [
            {
                quote: 'Using the power of decision gives you the capacity to get past any excuse to change any and every part of your life in an instant.',
                author: 'Tony Robbins',
                likes: 45,
                dislikes: 8,
                dateAdded: 1507402387185,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'Know that although in the eternal scheme of things you are small, you are also unique and irreplaceable, as are all your fellow humans everywhere in the world.',
                author: 'Margaret Laurence',
                likes: 29,
                dislikes: 9,
                dateAdded: 1507402387285,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'Learning is a treasure that will follow its owner everywhere',
                author: 'Chinese Proverb',
                likes: 299,
                dislikes: 101,
                dateAdded: 1507402387284,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'A jug fills drop by drop.',
                author: 'Buddha',
                likes: 75,
                dislikes: 15,
                dateAdded: 1507402387283,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'Yesterday I dared to struggle. Today I dare to win.',
                author: 'Bernadette Devlin',
                likes: 8,
                dislikes: 64,
                dateAdded: 1507402387282,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'Fear not for the future, weep not for the past.',
                author: 'Percy Shelley',
                likes: 632,
                dislikes: 215,
                dateAdded: 1507402387281,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'The happiness that is genuinely satisfying is accompanied by the fullest exercise of our faculties and the fullest realization of the world in which we live.',
                author: 'Bertrand Russell',
                likes: 187,
                dislikes: 285,
                dateAdded: 1507402387280,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'There is no way to happiness, happiness is the way.',
                author: 'Thich Nhat Hanh',
                likes: 86,
                dislikes: 45,
                dateAdded: 1507402387280,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'Goals are the fuel in the furnace of achievement.',
                author: 'Brian Tracy',
                likes: 212,
                dislikes: 88,
                dateAdded: 1507402387280,
                wikiLink: 'http://www.spacex.com/'
            },
            {
                quote: 'When you have got an elephant by the hind legs and he is trying to run away, it\'s best to let him run.',
                author: 'Abraham Lincoln',
                likes: 432,
                dislikes: 636,
                dateAdded: 1507402387280,
                wikiLink: 'http://www.spacex.com/'
            }
        ]
    }
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

    var quoteApp = {
        /** The div for displaying quote cards. */
        quoteDisplay: document.getElementById('quote-display'),
        /** An array for holding the cards that are in the display. This will can be sorted and used to re display cards in the view. */
        quoteCards: [],
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
        createAndDisplayCard: function(quote) {
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
        }
    };
    /** Temporary self invoking function for displaying the mock database.*/
    (function() {
        for (var i = 0; i < mockDatabase.quotes.length; i++) {
            quoteApp.createAndDisplayCard(mockDatabase.quotes[i]);
        }
    })();

    $('#author-input').autocomplete({
        minLength: 3,
        delay: 50,
        appendTo: '#authorSearchContainer',
        source: function( request, response ) {
            $.ajax({
                dataType: "json",
                type : 'Get',
                url: 'https://api.datamuse.com/sug?k=demo&s=' + encodeURIComponent(request.term),
                success: function(data) {
                    response( $.map( data, function(item) {
                        return item["word"];
                    }))
                },
            });
        }
    });

    //Random Quote generated from API
    var quoteAuthor;
    var quoteText;
    	$.ajax({
	      url: "https://api.forismatic.com/api/1.0/",
	      jsonp: "jsonp",
	      dataType: "jsonp",
	      data: {
	        method: "getQuote",
	        lang: "en",
	        format: "jsonp"
	      }
	    }).done(function(response) {

	    	console.log(response);
      	  	console.log(response.quoteAuthor);
      	  	console.log(response.quoteText);
      	  	
      	  	$('#quote').text(response.quoteText);
	  		$('#author').text(response.quoteAuthor);

		    console.log(response);
	        quoteAuthor = response.quoteAuthor;
	        console.log(quoteAuthor);
	        quoteText = response.quoteText;

	  		});
    $('#random-quote-button').click(function() {
	  	$.ajax({
	      url: "https://api.forismatic.com/api/1.0/",
	      jsonp: "jsonp",
	      dataType: "jsonp",
	      data: {
	        method: "getQuote",
	        lang: "en",
	        format: "jsonp"
	      }
	    }).done(function(response) {

	    	console.log(response);
      	  	console.log(response.quoteAuthor);
      	  	console.log(response.quoteText);
      	  	
      	  	$('#quote').text(response.quoteText);
	  		$('#author').text(response.quoteAuthor);

		    console.log(response);
	        quoteAuthor = response.quoteAuthor;
	        console.log(quoteAuthor);
	        quoteText = response.quoteText;

	  		});



  	});  
    $("#save-random-quote").on("click", function(){
        database.ref("/quotes").push({
            quoteAuthor: quoteAuthor,
            quoteText: quoteText
        });
       
    });
}