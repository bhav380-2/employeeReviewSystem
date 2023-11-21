
(function () {

    //__________________________________________provides load more functionality_________________________________
    function loadmore() {

        let loadMoreBtn = document.querySelector('.custom-btn');
        let currentItem = 4;   //current visible items
        loadMoreBtn.onclick = () => {  // makes 4 more items visible
            let boxes = [...document.querySelectorAll('.review')];
            for (var i = currentItem; i < currentItem + 4 && i < boxes.length; i++) {
                boxes[i].style.display = 'block';
            };
            currentItem += 4;
            if (currentItem >= boxes.length) {  // if all items are shown hides loadmore button
                loadMoreBtn.style.display = 'none';

            }
        }
    }

    //_________________________showNotification : used to show response message of ajax req as notification ___________________________
    function showNotification(type, message) {
        new Noty({
            theme: 'relax',
            text: message,
            type: type,
            layout: 'topRight',
            timeout: 1500

        }).show();
    }


    //_____________________________________sending ajax put request to update employee review_______________________________________________
    // hides save button after update review form submission
    function removeSaveButton(reveiwForm) {

        let reviewInput = $(reveiwForm).find('textarea').get(0);
        reviewInput.disabled = true
        reviewInput.style.outline = 'none';

        $(reveiwForm).find('.save-changes-btn').css('display', 'none');
    }

    //sends ajax req to submit form
    function updateEmployeeReview(reviewForm) {

        $(reviewForm).on('submit', (e) => {

            e.preventDefault();
            $.ajax({
                type: 'put',
                url: $(reviewForm).attr('action'),
                data: $(reviewForm).serialize(),

                success: function (data) {

                    showNotification('success', data.message);
                    removeSaveButton(reviewForm);  // hides save button from dom
                },

                error: function (error) {
                    console.log(error);
                }
            })
        })
    }

    //iterates over each employee review and calls updateEmployeeReview() function
    function handleUpdateEmployeeReview() {

        let reviewForms = $('.review-form');

        for (let reviewForm of reviewForms) {

            updateEmployeeReview(reviewForm);
        }
    }

    // ______________________________ on clicking pen icon removes disabled attribute from input tags in employee review form and makes saves button visible____________________________
    function editOption(button) {

        button.onclick = (e) => {  //handling click on  update btn
            e.preventDefault();
            let reviewId = button.getAttribute('data-reviewId')
            let reviewInput = document.querySelector(`.review #review-form-${reviewId} .info textarea`)
            reviewInput.removeAttribute('disabled');  // remove disabled attribute from review input
            reviewInput.style.outline = 'auto';
            let saveChanges = document.querySelector(`#save-changes-btn-${reviewId}`)
            saveChanges.style.display = 'inline-block';  // makes save button visible
        }
    }

    //iterates over each edit button(pen icon) and calls editOption
    function editEmployeeReviews() {

        let updateButtons = document.querySelectorAll('.buttons .update-btn');  // fetching updated btn of each employee

        for (let button of updateButtons) {
            editOption(button);
        }
    }


    //__________________________________sending ajax delete req to delete employee review____________________________________________
    function deleteEmployeeReview(delBtn) {

        $(delBtn).click((e) => {
            e.preventDefault();

            $.ajax({
                type: 'delete',
                url: $(delBtn).attr('href'),

                success: function (data) {
                    showNotification('success', data.message);

                    $(`#review-${data.data.reviewId}`).remove(); //removes deleted review from dom

                    if ($('.review').length == 0) {  // if no review present  hides reviews container and shows no reviews !!! message in DOM

                        $('#reviews-container').css('display', 'none');

                        let noReviewsElement = `
                            <div id="no-reviews">
                                <span>No </span><span>Reviews </span> <span>!!!</span>
                            </div>`

                        $('#hidden').append(noReviewsElement);
                    }
                },

                error: function (error) {
                    console.log(error);
                }
            })
        })
    }

    //iterates over each delete review button and calls deleteEmployeeReview()
    function handleDeleteEmployeeReview() {

        let deleteButtons = $('.delete-btn');

        for (let delBtn of deleteButtons) {
            deleteEmployeeReview(delBtn);
        }
    }

    //__________________________________send ajax post req to add employee review (by admin)_______________________________________________
    //creates new review element
    function newReviewDOM(reviewText, reviewBy) {

        return $(` <li id="review-${reviewBy.id}" class="review">
            <form action="/admin/save-updated-review/${reviewBy.id}" method="post" class="review-form"
                id="review-form-${reviewBy.id}">
                <div class="info">
                    <textarea name="review_text" class="review-text" type="text" disabled>${reviewText}
                    </textarea>
                    <div>
                        <div>
                            <i class="fa-regular fa-user"></i>
                            ${reviewBy.name} <br>
                        </div>

                        <div>
                            <i class="fa-regular fa-envelope"></i>
                            <span class="email">
                            ${reviewBy.email}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="buttons">
                    <a href="" data-reviewId="${reviewBy.id}" class="update-btn"><i
                            class="fa-solid fa-pencil"></i></a>
                    <a href="/admin/delete-review/${reviewBy.id}" class="delete-btn"><i
                            class="fa-regular fa-trash-can"></i></a>
                    <button type="submit" id="save-changes-btn-${reviewBy.id}"
                        class="save-changes-btn">save</button>
                </div>
            </form>
        </li>`);
    }

    //sends ajax req to add employee review
    function handleAddEmployeeRview() {

        $('#add-review-form').on('submit', (e) => {  //on form submission
            e.preventDefault();

            $.ajax({  //sends ajax req
                type: 'post',
                url: $('#add-review-form').attr('action'),
                data: $('#add-review-form').serialize(),

                success: function (data) {
                    showNotification('success', data.message);

                    let review = data.data.review;

                    if (data.data.isNewReview) {   // if new review is added

                        if ($('#reviews-list').length == 0) {  //refreshes page , if reviews-list was empty before submission of add-review form 
                            window.location.reload();

                        } else {

                            let reviewText = review.review;
                            let reviewBy = review.reviewBy;

                            let newReviewElement = newReviewDOM(reviewText, reviewBy);  //creates new review element

                            $('#reviews-list').prepend(newReviewElement);  //prepends new review element in reviews-list


                            let delBtn = $(newReviewElement).find('.delete-btn').get(0);  // fetches deleteBtn of newReviewElement
                            let reviewForm = $(newReviewElement).find('.review-form').get(0);  //fetches update-review-form of newReviewElemnt

                            //handling update and delete employee review with ajax
                            deleteEmployeeReview(delBtn);
                            updateEmployeeReview(reviewForm);

                        }

                    } else {       // if reviewee was already reviewed by admin ,previous review is updated
                        $(`#review-${data.data.review._id} textarea`).val(review.review);  //changes previous review textarea value in DOM
                    }

                    $('#add-review-form textarea').val(''); //resets textarea of add-review-form
                },

                error: function (error) {
                    console.log(error);
                }
            })
        })
    }

    //__________________________________________calling function________________________________

    loadmore();

    editEmployeeReviews();  // enables input tags and make save button visbile on clicking edit review button (pen icon)
    handleUpdateEmployeeReview();  // updateEmployeeREview form submission with ajax


    handleDeleteEmployeeReview();  // sends ajax req to delete employee review

    handleAddEmployeeRview();  // sends ajax req to add employee review

})();