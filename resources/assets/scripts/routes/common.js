import Swiper from 'swiper'

export default {
    init() {
        // JavaScript to be fired on all pages
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fired


        jQuery(document).ready(function ($) {

            //const debug = true;

            new Swiper('.swiper-container-header', {
                init: true,
                speed: 400,
                spaceBetween: 0,
                // Disable preloading of all images
                preloadImages: false,
                centeredSlides: true,
                observer: true,
                observeParents: true,
                containerModifierClass: 'swiper-container-header-',
                slideClass: 'swiper-slide-header',
                slideActiveClass: 'swiper-slide-active-header',
                slideDuplicateActiveClass: 'swiper-slide-duplicate-active-header',
                slideVisibleClass: 'swiper-slide-visible-header',
                slideDuplicateClass: 'swiper-slide-duplicate-header',
                slideNextClass: 'swiper-slide-next-header',
                slideDuplicateNextClass: 'swiper-slide-duplicate-next-header',
                slidePrevClass: 'swiper-slide-prev-header',
                slideDuplicatePrevClass: 'swiper-slide-duplicate-prev-header',
                wrapperClass: 'swiper-wrapper-header',

                autoplay: {
                    delay: 3000,
                },
                // Enable lazy loading
                lazy: {
                    loadPrevNext: true,
                    elementClass: 'swiper-lazy-header',
                    loadingClass: 'swiper-lazy-loading-header',
                    loadedClass: 'swiper-lazy-loaded-header',
                    preloaderClass: 'swiper-lazy-preloader-header',
                },
                watchOverflow: true,
                loopedSlides: $('.swiper-slide-header').length,
                loop: true,
                slidesPerView: 'auto',
                //setWrapperSize: true,
            });

            $('.header-slide').slick({
                lazyLoad: 'ondemand',
                accessibility: false,
                adaptiveHeight: true,
                autoplay: true,
                autoplaySpeed: 3000,
                arrows: false,
                draggable: false,
                fade: true,
                speed: 600,
                centerMode: true,
                initialSlide: 0,
                pauseOnHover: true,
                slidesToShow: 1,
                slidesToScroll: 1,
            });


            //Init the swiper slideshows
            var swiper_list = [];

            $('.swiper-container').each(function () {

                const $page_id = $(this).data('slideshow');
                const $slides = $('.swiper-slide-' + $page_id);

                swiper_list.push(new Swiper('.swiper-container-' + $page_id, {
                        init: true,
                        speed: 400,
                        spaceBetween: 0,
                        // Disable preloading of all images
                        preloadImages: false,
                        centeredSlides: true,
                        observer: true,
                        observeParents: true,
                        containerModifierClass: 'swiper-container-' + $page_id + '-',
                        slideClass: 'swiper-slide-' + $page_id,
                        slideActiveClass: 'swiper-slide-active-' + $page_id,
                        slideDuplicateActiveClass: 'swiper-slide-duplicate-active-' + $page_id,
                        slideVisibleClass: 'swiper-slide-visible-' + $page_id,
                        slideDuplicateClass: 'swiper-slide-duplicate-' + $page_id,
                        slideNextClass: 'swiper-slide-next-' + $page_id,
                        slideDuplicateNextClass: 'swiper-slide-duplicate-next-' + $page_id,
                        slidePrevClass: 'swiper-slide-prev-' + $page_id,
                        slideDuplicatePrevClass: 'swiper-slide-duplicate-prev-' + $page_id,
                        wrapperClass: 'swiper-wrapper-' + $page_id,

                        /*                        pagination: {
                                                    el: '.swiper-pagination-' + $page_id,
                                                    dynamicBullets: true,
                                                    type: 'bullets',

                                                    bulletClass: 'swiper-pagination-bullet swiper-pagination-bullet-' + $page_id,
                                                    bulletActiveClass: 'swiper-pagination-bullet-active swiper-pagination-bullet-active-' + $page_id,
                                                    //modifierClass: 'swiper-pagination swiper-pagination-' + $page_id + '-',
                                                    currentClass: 'swiper-pagination-current swiper-pagination-current-' + $page_id,
                                                    totalClass: 'swiper-pagination-total swiper-pagination-total-' + $page_id,
                                                    hiddenClass: 'swiper-pagination-hidden-' + $page_id,
                                                    progressbarFillClass: 'swiper-pagination-progressbar-fill-' + $page_id,
                                                    clickableClass: 'swiper-pagination-clickable-' + $page_id,

                                                },*/
                        autoplay: {
                            delay: 3000,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next-' + $page_id,
                            prevEl: '.swiper-button-prev-' + $page_id,
                        },
                        // Enable lazy loading

                        lazy: {
                            loadPrevNext: true,
                            elementClass: 'swiper-lazy-' + $page_id,
                            loadingClass: 'swiper-lazy-loading-' + $page_id,
                            loadedClass: 'swiper-lazy-loaded-' + $page_id,
                            preloaderClass: 'swiper-lazy-preloader-' + $page_id,
                        },
                        watchOverflow: true,
                        loopedSlides: $slides.length,
                        loop: true,
                        slidesPerView: 'auto',
                        //setWrapperSize: true,
                    })
                );
            });


            //$('.nav-pills a:first').tab('show');

            //Swipe fix
            //https://github.com/nolimits4web/swiper/issues/2494#issuecomment-374008830
            /*            $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {

                            if (swiper_list.length > 0) {

                                var paneTarget = $(e.target).attr('href');
                                var $thePane = $('.tab-pane' + paneTarget);
                                var paneIndex = $thePane.index();
                                if ($thePane.find('.swiper-container').length > 0 && 0 === $thePane.find('.swiper-slide-active').length) {
                                    swiper_list[paneIndex].update();
                                    //swiperUpdate(paneIndex);
                                }
                                console.log('Slideshow updated!');
                            }

                        });*/


            /*            //Update all swiper instances or by index
                        function swiperUpdate(index) {
                            if (swiper_list.length > 0) {
                                if (index || index === 0) {
                                    //swiper_list[index].init();
                                    swiper_list[index].update();
                                    if (debug) console.log('swiperUpdate - updated swiperlist[' + index + ']');

                                } else {
                                    for (let i = 0; i < swiper_list.length; i++) {
                                        //swiper_list[i].init();
                                        swiper_list[i].update();
                                    }
                                    if (debug) console.log('swiperUpdate - updated all indexes in swiperlist.length = [' + swiper_list.length + ']');
                                }
                            }
                        }*/

            $('.hamburger-menu').click(function (e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            })


            //Signup modal for courses
            $('#signupModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                var title = button.data('title') // Extract info from data-* attributes
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                var modal = $(this)
                modal.find('.modal-title').text('New message to ' + title)
                modal.find('.modal-body input').val(title)
            })

        });
    },
};
