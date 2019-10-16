<?php

namespace App;

?>
<!doctype html>
<html {!! get_language_attributes() !!}>
@include('partials.head')
<body @php body_class() @endphp>


<div class="pxs_container">
    <div class="pxs_bg">
        <div class="pxs_bg1"></div>
        <div class="pxs_bg2"></div>
        <div class="pxs_bg3"></div>
    </div>


    <div class="pxs_slider_wrapper">
        @php do_action('get_header') @endphp
        @include('partials.header')
        <ul class="pxs_slider">

            @if (has_nav_menu( 'primary_navigation' ))

                @php

                    // Get Main Menu ID
                    $menu_name = 'primary_navigation';
                    $locations = get_nav_menu_locations();
                    $menu = wp_get_nav_menu_object( $locations[ $menu_name ] );
                    $menuitems = wp_get_nav_menu_items( $menu->term_id, array( 'order' => 'DESC' ) );

                    $i = 0;
                    // Loop through menu items to get page ID's

                @endphp

                @foreach ($menuitems as $item)

                    @php
                        //Setup page
                        $page_id = get_post_meta( $item->ID, '_menu_item_object_id', true );
                        $post = get_post( $page_id, OBJECT );
                        setup_postdata( $post );

                        // Get page template
                        $template_file = get_page_template_slug( $page_id );
                        $template_slug = pathinfo( $template_file, PATHINFO_FILENAME );
                        $template = str_replace( 'template-', '', $template_slug );
                        $template_path = 'partials.content-page';

                        $template_id = get_field('page_template', $page_id);


                    @endphp

                    <li id="for_page_@php echo $page_id @endphp" class="page-slide li_@php echo $i @endphp"
                        data-path="@php echo '/' . get_page_uri( $page_id ) @endphp"
                        data-index="@php echo $i @endphp">
                        <div class="page page-max-width mx-auto">
                            <div class="container-fluid no-padding page-overlay">
                                <div class="row no-gutters">
                                    <div class="col page-NW"></div>
                                    <div class="col page-N"></div>
                                    <div class="col page-NE"></div>
                                </div>
                                <div class="row equal no-gutters" style="margin-top: -1px;">
                                    <div class="col-md-1 page-W">
                                        <div class="leaves-W"></div>
                                    </div>
                                    <div class="col col-md page-M">
                                        <div class="page-content">

                                            @php
                                                $o = locate_template( 'views/partials/content-page.php' );

                                                if ( $template ) {
                                                    $o = locate_template( 'views/template-' . $template . '.php' );
                                                }

                                                include template_path( $o );

                                            @endphp

                                            {{--                                          @php
                                                                                          if ($template_id ){
                                                                                          $template_path ='templates.template-' . $template_id.'.php';
                                                                                          }
                                                                                      @endphp

                                                                                      @include($template_path)

                                                                                      @yield('content')--}}

                                        </div>
                                    </div>
                                    <div class="col-md-1 page-E">
                                        <div class="leaves-E"></div>
                                    </div>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col page-SW"></div>
                                    <div class="col page-S"></div>
                                    <div class="col page-SE"></div>
                                </div>
                            </div>
                        </div>
                    </li>

                    @php $i ++; @endphp
                @endforeach

            @endif


        </ul>
        @php do_action('get_footer') @endphp
        @include('partials.footer')
        @php wp_footer() @endphp
    </div>


</div>

</body>
</html>
