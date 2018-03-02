function Rating(element) {
    this.ratingElement = element;        
    this.rate = rate;
    this.reset = reset;
    this.rating = 0;
}

function rate(event) {
    this.rating = calculateRating(this.ratingElement, event);
    updateStars(this.ratingElement, this.rating);
}

function reset() {
    this.rating = 0;
    updateStars(this.ratingElement, this.rating);
}

/* PRIVATE/HELPER FUNCTIONS */

function calculateRating(element, event) {
    var rect = element.getBoundingClientRect();
    var size = rect.right - rect.left;
    var offset = event.clientX - rect.left;
    return Math.ceil(offset / size * 5);
}

function updateStars(element, rating) {
    // collect star elements
    var stars = [];
    var x = element.getElementsByClassName('rs');
    var y = element.getElementsByClassName('rs-on');
    var z = element.getElementsByClassName('rs-off');
    for (i = 0; i < x.length; i++) {
        stars.push(x[i]);
    }
    for (i = 0; i < y.length; i++) {
        stars.push(y[i]);
    }
    for (i = 0; i < z.length; i++) {
        stars.push(z[i]);
    }

    // depending on rating, change star classes
    if (rating == 0) {
        element.className = 'rs rs-off';
    } else {
        element.className = 'rs rs-on';
    }
    for (i = 0; i < 4; i++) {
        if (i < (rating - 1)) {
            stars[i].className = 'rs rs-on';
        } else {
            stars[i].className = 'rs rs-off';
        }
    }
    }