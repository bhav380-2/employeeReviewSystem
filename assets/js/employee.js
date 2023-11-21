(function () {


    //___________________________adds carousel_____________________________________________________________
    function carousel() {
        //changing style if only 1 or 2 employees are to be review

        let items = $('.menu--item');
        let shift = 0;
        if (items.length <= 2) {

            items.css('width', '78%')

            if (items.length == 1) {
                shift = items.width() + 27;
            }
        }
        //variables
        const $menu = document.querySelector('.menu')
        const $items = document.querySelectorAll('.menu--item')
        const $images = document.querySelectorAll('.menu--item img')
        let menuWidth = $menu.clientWidth
        let itemWidth = $items[0].clientWidth
        let wrapWidth = $items.length * itemWidth

        let scrollSpeed = 0
        let oldScrollY = 0
        let scrollY = 0
        let y = 0


        const lerp = (v0, v1, t) => {
            return v0 * (1 - t) + v1 * t
        }

        const dispose = (scroll) => {
            gsap.set($items, {
                x: (i) => {
                    return i * itemWidth + scroll
                },
                modifiers: {
                    x: (x, target) => {
                        const s = gsap.utils.wrap(-itemWidth, wrapWidth - itemWidth, parseInt(x))
                        return `${s}px`
                    }
                }
            })
        }
        dispose(0)

        /* ********************wheel***************** */
        const handleMouseWheel = (e) => {
            scrollY -= e.deltaY * 0.9
        }

        /* ***************handling touch *************** */
        let touchStart = 0
        let touchX = 0
        let isDragging = false
        const handleTouchStart = (e) => {
            touchStart = e.clientX || e.touches[0].clientX
            isDragging = true
            $menu.classList.add('is-dragging')
        }
        const handleTouchMove = (e) => {
            if (!isDragging) return
            touchX = e.clientX || e.touches[0].clientX
            scrollY += (touchX - touchStart) * 2.5
            touchStart = touchX
        }
        const handleTouchEnd = () => {
            isDragging = false
            $menu.classList.remove('is-dragging')
        }

        /* *******************listeners ****************** */
        $menu.addEventListener('mousewheel', handleMouseWheel)

        $menu.addEventListener('touchstart', handleTouchStart)
        $menu.addEventListener('touchmove', handleTouchMove)
        $menu.addEventListener('touchend', handleTouchEnd)

        $menu.addEventListener('mousedown', handleTouchStart)
        $menu.addEventListener('mousemove', handleTouchMove)
        $menu.addEventListener('mouseleave', handleTouchEnd)
        $menu.addEventListener('mouseup', handleTouchEnd)

        $menu.addEventListener('selectstart', () => { return false })

        /* ********************resize********************* */
        window.addEventListener('resize', () => {
            menuWidth = $menu.clientWidth
            itemWidth = $items[0].clientWidth
            wrapWidth = $items.length * itemWidth
        })

        /**********************render******************** */
        const render = () => {
            requestAnimationFrame(render)
            y = lerp(y, scrollY, .1)
            dispose(y + shift);
            scrollSpeed = y - oldScrollY;
            oldScrollY = y;

            gsap.to($items, {
                skewX: -scrollSpeed * .2,
                rotate: scrollSpeed * .01,
                scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.003
            });
        }


        render();

        $('.menu').on('mousewheel DOMMouseScroll', function (e) {
            e.preventDefault();
        });
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

    //__________________________________send ajax req to submit review form__________________________________
    function submitForm(reviewForm) {

        $.ajax({
            type: 'post',
            url: $(reviewForm).attr('action'),
            data: $(reviewForm).serialize(),

            success: function (data) {

                showNotification('success', data.message);

                let empId = $(reviewForm).attr('action').slice(17);  // takes out empId of reviewee from action attribute of review form 

                $(`#menu-item-${empId}`).remove();   //removes submitted form from dom

                if ($(`.menu--item`).length == 0) {   // if no review form are present  hides review-colleouges container and adds no reivew assigned message in dom

                    $('#review-colleouges').css('display', 'none');
                    let noReviewsAssignedElement = $(`
                                    <div id="no-assigned-reviews">
                                        <span>No </span><span>Reviews </span> <span>Assigned</span> <span>!!!</span>
                                    </div>`);

                    $(`#review-colleouges-container`).append(noReviewsAssignedElement);
                }
            },

            error: function (error) {
                showNotification('error', error.responseJSON.message);
            }
        });
    }


    //iterates over each review form and adds submit form by ajax functionality
    function handleReviewFormSubmit() {

        let reviewForms = $('.review-form');

        for (let reviewForm of reviewForms) {

            $(reviewForm).on('submit', (e) => {
                e.preventDefault();
                submitForm(reviewForm);

            })
        }
    }


    //____________________________________calling functions________________________________________

    carousel();
    handleReviewFormSubmit();


})();
