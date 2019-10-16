<?php

namespace App;
?>
<header class="banner">
    <div class="container-fluid no-padding">
        <div class="row no-gutters justify-content-center">
            <div class="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8">
                <div class="container-fluid no-padding header-overlay mx-auto">
                    <div class="row no-gutters">
                        <div class="col page-NW"></div>
                        <div class="col page-N"></div>
                        <div class="col page-NE"></div>
                    </div>
                    <div class="row equal no-gutters" style="margin-top: -1px;">
                        <div class="col-md-1 page-W"></div>
                        <div class="col col-md header-M">

                            <!-- Slider main container -->
                            <div class="swiper-container swiper-container-header">
                                <!-- Additional required wrapper -->
                                <div class="swiper-wrapper swiper-wrapper-header">
                                @php
                                    $random_order = get_field( 'random_order', 'option' );
                                    $images = get_field( 'header_gallery', 'option' );

                                    //Shuffle slideshow order
                                    if ( $random_order ) {
                                        shuffle( $images );
                                    }

                                @endphp
                                <!-- Slides -->
                                    @foreach($images as $image)
                                        <div class="swiper-slide swiper-slide-header">
                                            <img class="img-fluid swiper-lazy" src="{{$image['sizes']['large']}}" alt="{{$image['alt']}}"/>
                                            <div class="swiper-lazy-preloader swiper-lazy-preloader-header"></div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                        <div class="col-md-1 page-E"></div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col page-SW"></div>
                        <div class="col page-S"></div>
                        <div class="col page-SE"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col">

                @if(has_nav_menu('primary_navigation'))

                    @php
                        $menu_name = 'primary_navigation';
                        $locations = get_nav_menu_locations();
                        $menu_id = $locations[$menu_name];
                        $menu_object = wp_get_nav_menu_object($menu_id);
                        $menu_items = wp_get_nav_menu_items($menu_object->term_id);

                    @endphp

                    <nav class="navbar navbar-expand-lg mainmenu" role="navigation">

                        <a class="navbar-brand" href="#"></a>

                        <button class="navbar-toggler hamburger-menu" type="button"
                                data-toggle="collapse" data-target="#navbarNav"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav mx-auto">

                                @foreach($menu_items as $menu_item)
                                    <li class="nav-item top-level page_item page-item-{{$menu_item->object_id}}" data-index="{{$loop->index}}">
                                        <a href="{{$menu_item->url}}" class="menu_link" id="page_{{$menu_item->object_id}}">{{$menu_item->title}}</a>
                                    </li>
                                @endforeach

                            </ul>
                        </div>
                    </nav>
                @endif
            </div>
        </div>
    </div>
</header>
