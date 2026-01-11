const loadReviews = document.getElementById("loadReviews");
const reviewSection = document.getElementById("reviewSection");

const createReviewList = (reviews) => {
  if (reviews.length === 0) {
    const retVal = document.createElement("div");
    retVal.textContent =
      "Book does not have any review yet. Be the first one to rate it!";
    return retVal;
  }
  const reviewList = document.createElement("ol");
  reviewList.className = "reviews-list";
  for (const review of reviews) {
    const reviewItem = document.createElement("li");
    reviewItem.className = "review-item";
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars +=
        i < review.rating ? "<span>&#9733;</span>" : "<span>&#9734;</span>";
    }
    reviewItem.innerHTML = `        
        <article>               
            <div class="book-meta"></div>
            <p>${stars}</p>
            <p>${review.description}</p>
            <div class="review-row">
              <span>${review.username}</span>                           
            </div>
            <div class="review-actions">                
            </div>
        </article>        
    `;
    reviewList.appendChild(reviewItem);
  }
  return reviewList;
};

const loadRevforBooks = async () => {
  try {
    const response = await fetch(`/books/${loadReviews.dataset.id_b}/reviews`);
    if (response.ok) {
      const respData = await response.json();
      const reviewList = createReviewList(respData);
      reviewSection.innerHTML = "";
      reviewSection.appendChild(reviewList);
    } else {
      alert("Error occured!");
    }
  } catch (error) {
    alert("Error occured!");
  }
};

loadReviews.addEventListener("click", loadRevforBooks);
