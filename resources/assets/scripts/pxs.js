/**
 * jquery.LavaLamp enhances an unordered list of menu-items with a ballooning animated effect
 * similar to the Lava Lamps of the 1970s. Use the CSS provided with the demos at
 * http://nixboxdesigns.com/demos/jquery-lavalamp-demos.html or experiment with your own styles
 *
 * Requires jQuery v1.3.2
 *
 * http://nixboxdesigns.com/demos/jquery-lavalamp.php
 *
 * Copyright (c) 2008, 2009 Jolyon Terwilliger, jolyon@nixbox.com
 * Source code Copyright (c) 2007, 2008
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * credits to Guillermo Rauch and Ganeshji Marwaha (gmarwaha.com) for previous editions
 *
 * Version: 1.0 - adapted for jQuery 1.2.x series
 * Version: 1.1 - added linum parameter
 * Version: 1.2 - modified to support vertical resizing of elements
 * Version: 1.3 - enhanced automatic <li> item hi-lighting - will attempt to
 *                    lock onto li > a element with href closest to selected
 *                    window.location
 *                - click always returns 'true' by default, for standard link follow through.
 *
 * Version: 1.3.1 - verified for use with jQuery 1.3 - should still work with 1.2.x series
 *                - changed linum parameter to startItem for clarity
 *                - improved slide-in accuracy for .back elements with borders
 *                - changed .current class to .selectedLava for clarity and improved
 *                    support
 *                - appended 'Lava' to all internal class names to avoid conflicts
 *                - fixed bug applying selectedLava class to elements with matching
 *                    location.hash
 *                - now supports jquery.compat plugin for cross-library support
 *                - performance improvements
 *                - added new options:
 *                autoReturn: true - if set to false, hover will not return to last selected
 *                                    item upon list mouseout.
 *                returnDelay: 0 - if set, will delay auto-return feature specified # of
 *                                    milliseconds.
 *                setOnClick: true - if set to false, hover will return to default element
 *                                    regardless of click event.
 *                homeLeft: 0, homeTop: 0 - if either set to non zero value, absolute
 *                                    positioned li element with class .homeLava is
 *                                    prepended to list for homing feature.
 *                homeWidth: 0, homeHeight: 0 - if set, are used for creation of li.homeLava
 *                                    element.
 *                returnHome: false - if set along with homeLeft or homeTop, lavalamp hover
 *                                    will always return to li.home after click.
 *
 * Version: 1.3.2 - fixed: stray $ references inside the plugin to work with
 *                    jQuery.noConflict() properly - thanks Colin.
 *
 * Version: 1.3.3 - fixed: added closure with null passed argument for move() command in
 *                    returnDelay to fix errors some were seeing - thanks to Michel and
 *                    Richard for noticing this.
 *
 *                    fixed: changed mouseover/out events to mouseenter/leave to fix jerky
 *                    animation problem when using excessive margins instead of padding.
 *                    Thanks to Thomas for the solution and Chris for demonstrating the problem.
 *                    this fix requires jQuery 1.3.2 to work.
 *
 *                    enhanced: added 'noLava' class detection to prevent LavaLamp effect
 *                    application to LI elements with this class. This feature allows you to
 *                    create submenus - for details, see examples at
 *                    http://nixboxdesigns.com/demos/jquery-lavalamp-demos.html
 *
 *                    enhanced: modified to better automatically find default location for
 *                    relative links. Thanks to Harold for testing and finding this bug.
 *
 * Examples and usage:
 *
 * The HTML markup used to build the menu can be as simple as...
 *
 *       <ul class="lavaLamp">
 *           <li><a href="#">Phone Home</a></li>
 *           <li><a href="#">Make Contact</a></li>
 *           <li><a href="#">Board Ship</a></li>
 *           <li><a href="#">Fly to Venus</a></li>
 *       </ul>
 *
 * Once you have included the style sheet that comes with the plugin, you will have to include
 * a reference to the jQuery library, easing plugin (optional) and the LavaLamp(this) plugin.
 *
 * Use the following snippet to initialize the menu using jQuery easing library::
 * Easing Library 1.3 available here:  http://plugins.jquery.com/project/Easing
 *
 *   $(function() { $(".lavaLamp").lavaLamp({ fx: "easeOutBack", speed: 700}) });
 *
 * @param Object - You can specify all the options shown below as object variables:
 *
 * @option fx - default is "swing"
 * @example
 * $(".lavaLamp").lavaLamp({ fx: "easeOutElastic" });
 * @desc Creates a menu with "Elastic" easing effect. You need to include the easing plugin for this to work.
 *
 * @option speed - default is 500 ms
 * @example
 * $(".lavaLamp").lavaLamp({ speed: 500 });
 * @desc Creates a menu with an animation speed of 500 ms.
 *
 * @option click - no defaults
 * @example
 * $(".lavaLamp").lavaLamp({ click: function(event, menuItem) { return false; } });
 * @desc You can supply a callback to be executed when the menu item is clicked.
 * The event object and the menu-item that was clicked will be passed in as arguments.
 *
 * @option startItem - default is 'no'
 * @example
 * $(".lavaLamp").lavaLamp({ startItem: 2 });
 * @desc startItem specifies the li element to default to, beginning with 0 for the first li element
 * within the parent UL or OL used to initialize lavaLamp.  This can be used to set default
 * lavaLamp hilight on page reloads.
 */
import 'jquery.easing'

jQuery(document).ready(function ($) {

    $.fn.lavaLamp = function (o) {
        o = $.extend({
                fx: 'swing',
                speed: 500,
                click: function () {
                    return true
                },
                startItem: 0,
                autoReturn: true,
                returnDelay: 0,
                setOnClick: true,
                homeTop: 0,
                homeLeft: 0,
                homeWidth: 0,
                homeHeight: 0,
                returnHome: true,
            },
            o || {});

        var $home;
        // create homeLava element if origin dimensions set
        if (o.homeTop || o.homeLeft) {
            $home = $('<li class="homeLava selectedLava"></li>').css({
                left: o.homeLeft,
                top: o.homeTop,
                width: o.homeWidth,
                position: 'absolute',
            });
            $(this).prepend($home);
        }

        return this.each(function () {
            var path = location.pathname + location.search + location.hash;
            var $selected = {};
            var delayTimer;
            var $back;
            var ce; //current_element

            var $li = $('li:not(.noLava)', this);
            // check for complete path match, if so flag element into $selected
            if (o.startItem === 'no')
                $selected = $('li a[href$="' + path + '"]', this).parent('li');

            // if still no match, this may be a relative link match
            if ($selected.length === 0 && o.startItem === 'no')
                $selected = $('li a[href$="' + location.pathname.substring(location.pathname.lastIndexOf('/') + 1) + location.search + location.hash + '"]', this).parent('li');

            // no default selected element matches worked,
            // or the user specified an index via startItem
            if ($selected.length === 0 || o.startItem !== 'no') {
                // always default to first item, if no startItem specified.
                if (o.startItem === 'no') o.startItem = 0;
                $selected = $($li[o.startItem]);
            }
            // set up raw element - this allows user override by class .selectedLava on load
            ce = $('li.selectedLava', this)[0] || $($selected).addClass('selectedLava')[0];

            // add mouseover event for every sub element
            $li.mouseenter(function () {
                if ($(this).hasClass('homeLava')) {
                    ce = $(this)[0];
                }
                move(this);
            });

            $back = $('<li class="backLava"><div class="leftLava"></div><div class="bottomLava"></div><div class="cornerLava"></div></li>').appendTo(this);

            // after we leave the container element, move back to default/last clicked element
            $(this).mouseleave(function () {
                if (o.autoReturn) {
                    if (o.returnHome && $home) {
                        move($home[0]);
                    }
                    else if (o.returnDelay) {
                        if (delayTimer) clearTimeout(delayTimer);
                        delayTimer = setTimeout(function () {
                            move(null);
                        }, o.returnDelay + o.speed);
                    }
                    else {
                        move(null);
                    }
                }
            });

            $li.click(function (e) {
                if (o.setOnClick) {
                    $(ce).removeClass('selectedLava');
                    $(this).addClass('selectedLava');
                    ce = this;
                }
                return o.click.apply(this, [e, this]);
            });

            // set the starting position for the lavalamp hover element: .back
            if (o.homeTop || o.homeLeft)
                $back.css({left: 10, top: 0, width: o.homeWidth});
            else
                $back.css({left: 10, top: 0, width: ce.offsetWidth});


            function move(el) {
                if (!el) el = ce;
                // .backLava element border check and animation fix
                var bx = 0, by = 0;

                $back.stop()
                    .animate({
                        left: el.offsetLeft - bx,
                        top: el.offsetTop - by,
                        width: el.offsetWidth,
                    }, o.speed, o.fx);
            }
        });
    };


    var slider_auto = 0;

    var sk_px = 0;

    const debug = true;

    const $pxs_menu = $('.pxs_menu');
    const $pxs_container = $('.pxs_container');
    const $pxs_slider = $('.pxs_slider');
    const $pxs_slider_children = $pxs_slider.children();
    //the bg images
    //const $pxs_bg = $('.pxs_bg');
    const $pxs_bg1 = $('.pxs_bg1');
    const $pxs_bg2 = $('.pxs_bg2');
    const $pxs_bg3 = $('.pxs_bg3');

    const $footer = $('#page-footer');

    //the current windows width
    var w_w = $(window).width();

    /*
    * Functional script
    */
    //Init the Parralax Slider
    $(function () {
        if (debug) console.log('initParallaxSlider started');

        $.fn.parallaxSlider = function (options) {
            //Take the default options
            var opts = $.extend({}, $.fn.parallaxSlider.defaults, options);

            return $pxs_container.each(function () {

                var o = $.meta ? $.extend({}, opts, $pxs_container.data()) : opts;
                if (debug) console.log(o);
                //the main slider
                var $pxs_slider = $('.pxs_slider', $pxs_container),
                    //the thumbs
                    $menu_items = $pxs_menu.children();

                $pxs_slider.css({
                    left: sk_px + 'px',
                });

                //first preload all the images
                var loaded = 0,
                    $pages = $('.pxs_slider').find('li.page-slide');

                $pages.each(function () {
                    var $img = $(this);
                    $('.page-slide').each(function () {

                        ++loaded;

                        if (loaded === $pages.length) {
                            /*
                            need to set width of the slider,
                            of each one of its elements, and of the
                            navigation buttons
                             */
                            if (setWidths) {
                                setWidths($pxs_slider_children, $pxs_slider_children.length);
                            }

                            //make the first thumb be selected
                            if (highlight) {
                                highlight($menu_items.eq(0));
                            }

                            $(window).trigger('resize');
                            $('.pxs_slider').css('visibility', 'visible');

                        }
                    }).attr('src', $img.attr('src'));
                });

            });
        };


        var highlight = function ($elem) {
            $elem.siblings().removeClass('selected');
            $elem.addClass('selected');
        };


        $.fn.parallaxSlider.defaults = {
            auto: 0,	//how many seconds to periodically slide the content.
            //If set to 0 then autoplay is turned off.
            speed: 1600,//speed of each slide animation
            easing: 'easeInOutCubic',//easing effect for the slide animation
            easingBg: 'easeInOutCubic',//easing effect for the background animation
            circular: true,//circular slider
            thumbRotation: true, //the thumbs will be randomly rotated

            animDone: null, // ADDED PROPERTY
        };
        //easeInOutExpo,easeInBack

    });


//Custom Script


    $(function () {

        // $(".pxs_slider").css('overflow', 'visible');

        $('.menu-item').each(function () {
            var cl = $(this).attr('class');
            var matches = /menu-item-(\d+)/.exec(cl);
            $(this).children('a').attr('id', 'page_' + matches[1]);
        });

        $('.page_item, .page-item, .current_page_item').each(function () {
            var cl = $(this).attr('class');
            var matches = /page-item-(\d+)/.exec(cl);
            if (!matches) {
                return;
            }
            var e = $(this).children('a');
            if (!e.attr('id'))
                e.attr('id', 'page_' + matches[1]);
        });

        $('.pxs_thumbnails > li:first > a').each(function () {
            $(this).attr('id', 'page_0');
        });

    });

    /*
    * Slide Event
    */
    $(function () {

        /* Slider, moved initialization from slider.js, add arrow exit */

        if ($pxs_container.length) {

            $pxs_slider.children().eq(0).css('margin-left', '-10px');

            var slide_index = 0;
            var link = '';
            //Set the new location based on the url hash, e.g #go_page_34
            if (window.location.hash) {
                //Check if the hash matches the correct format
                if (window.location.hash.match(/^go_page.*$/)) {
                    //Set slide index to go to
                    slide_index = window.location.hash.replace('#go_', '');
                    //Check if page exist
                    const $page_slide = $('#for_' + slide_index);
                    if ($page_slide.length) {

                        var ind = $page_slide.attr('class');
                        //Check if there is a match
                        var matches = /li_(\d+)/.exec(ind);
                        if (matches) {
                            ind = matches[1];
                            ind = parseInt(ind);
                        }
                        else {
                            if (debug) console.log('Error No matches found in pxs.js');
                        }

                        if (ind > 0) {
                            link = slide_index;
                            slide_index = ind;
                        }

                    }
                }
            }
            $pxs_container.parallaxSlider({
                auto: slider_auto,
                slide: slide_index,
                animDone: function () {
                    $('.pxs_slider').show();
                },
            });


            if (link) {
                $('#' + link).trigger('click');
            }

        }

    });


//Resize the sliders

    function onResize() {
        //Set the sliders to the correct width based on the window
        $('.pxs_slider > li').css({
            //'overflow': 'hidden',
            'width': $(window).width() + 'px',
        });

        /*
        when resizing the window,
        we need to recalculate the widths of the
        slider elements, based on the new windows width.
        we need to slide again to the current one,
        since the left of the slider is no longer correct
         */
        w_w = $(window).width();
        if (setWidths) {
            setWidths($pxs_slider_children, $pxs_slider_children.length);
        }

        slidePage(getCurrentPage(), true);


        //Minor slide correction to center correctly in viewport
        $pxs_slider.children().eq(0).css('margin-left', '0px');

        //Set the top of the footer based on the slide above.
        setFooterTop();
    }


//When a slide has changed then update the height of the other elements
    /*    function updateHeight() {

        }*/

    $('.nav-item').click(function (e) {
        //Stop the clicking of the link change the page
        e.preventDefault();

        //Get clicked menu_item
        let $menu_item = $(this)[0];

        //Get the index to which to scroll to - <li data-index="0">
        let $index = $($menu_item).data('index');

        //Get url of link
        let $url = $($menu_item).children('a:first').prop('href');

        //Set the url with the new path
        window.history.pushState('', '', $url);

        if (debug) console.log('pxs.js - Clicked on menu_item' + $url);

        //Slide to the index of the above link
        slidePage($index);


    });

    function setBackgroundHeight() {

        //Count the header, the current slide and the footer
        let $height = $('header.banner').height();
        $height += getSlideHeight();
        $height += $('#page-footer').height();

        //Set the height of the background based on the total height of the window
        //$pxs_bg.height($height);
        $pxs_bg1.height($height);
        $pxs_bg2.height($height);
        $pxs_bg3.height($height);
        //$pxs_slider.height($slide_height);
        $pxs_container.height($height);

        if (debug) console.log('Height (pxs_bg) was set to ' + $height);
    }

    //Slide the page
    function slidePage(slideIndex, instant, callback) {

        let speed = 1600;
        let easing = 'easeInOutCubic';
        let easingBg = 'easeInOutCubic';

        //instant = true;

        var slide_to = parseInt(-w_w * slideIndex);
        //Should transition be instant
        if (instant) {
            $pxs_slider.css({
                left: (slide_to + sk_px) + 'px',
            });
            $pxs_bg3.css({
                left: slide_to / 2 + 'px',
            });
            $pxs_bg2.css({
                left: slide_to / 4 + 'px',
            });
            $pxs_bg1.css({
                left: slide_to / 8 + 'px',
            });
            setBackgroundHeight();
            if (callback) {
                callback()
            }
        }
        else {
            showFooter(false);
            setBackgroundHeight();
            $pxs_slider.stop().animate({
                left: (slide_to + sk_px) + 'px',
            }, speed, easing, function () {
                showFooter(true);
                //$(window).trigger("resize");
            });
            $pxs_bg3.stop().animate({
                left: slide_to / 2 + 'px',
            }, speed, easingBg);
            $pxs_bg2.stop().animate({
                left: slide_to / 4 + 'px',
            }, speed, easingBg);
            $pxs_bg1.stop().animate({
                left: slide_to / 8 + 'px',
            }, speed, easingBg);


        }

    }

    function setWidths($elems, total_elems) {
        /*
        the width of the slider is the windows width
        times the total number of elements in the slider
         */
        var pxs_slider_w = w_w * total_elems;
        $pxs_slider.width(pxs_slider_w + 'px');
        //each element will have a width = windows width
        $elems.width(w_w + 'px');
        /*
        we also set the width of each bg image div.
        The value is the same calculated for the pxs_slider
         */
        $pxs_bg1.width(pxs_slider_w + 'px');
        $pxs_bg2.width(pxs_slider_w + 'px');
        $pxs_bg3.width(pxs_slider_w + 'px');
    }

//Pass the path to which to init
    function initOnPage() {
        if (debug) console.log('initOnPage started');

        slidePage(getCurrentPage(), true);

        //Set the menu pointer on the correct menu_item
        $('ul.navbar-nav').lavaLamp({startItem: getCurrentPage()});


    }

    function getCurrentPage() {

        let $url_path = window.location.pathname;
        let index = 0;

        if ($url_path === '/') {
            $url_path = '/home';
            return index;
        }

        //If the last char is '/' then remove it
        if ($url_path.slice(-1) === '/') {
            $url_path = $url_path.substr(0, $url_path.length - 1);
        }


        const $pages = $pxs_slider.children();

        for (let $i = 0; $i < $pages.length; $i++) {
            let $page = $pages[$i];

            let $page_path = $($page).data('path');

            if ($url_path === $page_path) {
                index = $($page).data('index');
                if (debug) console.log('found match! SlideIndex: ' + index);
                break;
            }
        }

        return index;
    }

    function getSlideHeight(index) {
        if (index > -1) {
            return $($pxs_slider_children[index]).height();
        } else {
            //If no index is given then return the largest height
            if ($pxs_slider_children.length > 0) {
                let numbers = [];
                for (let y = 0; y < $pxs_slider_children.length; y++) {
                    numbers.push($($pxs_slider_children[y]).height());
                }
                return Math.max(...numbers)

            } else {
                return 0;
            }
        }
    }


    function showFooter(show, callback) {
        if (show) {
            $footer.fadeIn(200, callback);
        } else {
            //Fadeout while sliding down
            $footer.fadeOut(200, function () {
                // Animation complete.
                setFooterTop();
            });

            //$footer.animate({ bottom: 'toggle', opacity: 'toggle' }, 'slow', 'swing', setFooterTop());
        }
    }

    function setFooterTop(callback) {

        $footer.css('top', getSlideHeight(getCurrentPage()) + 'px');
        if (callback) {
            callback();
        }
    }

    //If al is done loading then init on correct page
    // initOnPage();

    //$(window).trigger("resize");


    //https://stackoverflow.com/a/5490021/8205497
    /*    window.onresize = function () {
            clearTimeout(doit);
            doit = setTimeout(function () {
                initOnPage();
            }, 100);
        };*/

    /*    $(window).resize(function () {
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function () {
                if (debug) console.log('Resized finished.');
                onResize();
                initOnPage();
            }, 700);
        });*/
    initOnPage();


    $(window).resize(function () {
        onResize();
    });

    setTimeout(function () {
        onResize();
    }, 500);
});

