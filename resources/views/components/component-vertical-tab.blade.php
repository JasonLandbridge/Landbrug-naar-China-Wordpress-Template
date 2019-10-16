@php
    namespace App;
@endphp


<div class="row no-gutters ">
    <div class="col-12 col-md-3">

        <div class="nav flex-column nav-pills" id="v-pills-tab-{{$post->ID}}" role="tablist" data-pageid="{{$post->ID}}" aria-orientation="vertical">

            @foreach($children as $page)
                @php $var_id = cleanVarName( $page->post_title ); @endphp

                <a class="nav-link @if($loop->first) active @endif nav-link-ltr"
                   id="v-pills-{{$var_id}}-tab"
                   data-toggle="pill"
                   href="#v-pills-{{$var_id}}"
                   role="tab"
                   aria-controls="v-pills-{{$var_id}}"
                   aria-selected="{{$loop->first}}">{{$page->post_title}}</a>

            @endforeach


        </div>
    </div>

    <div class="col-12 col-md-9">
        <div class="tab-content" id="v-pills-tab-content-{{$post->ID}}">

            @foreach ( $children as $page )

                @php $var_id = cleanVarName( $page->post_title ); @endphp

                <div class="tab-pane @if ($loop->first) active @endif px-4 fade show"
                     id="v-pills-{{$var_id}}"
                     role="tabpanel"
                     aria-labelledby="v-pills-{{$var_id}}-tab">

                    <h2>{{$page->post_title}}</h2>

                    @include('components.component-post-content')

                    @php $course_data = get_field( 'course_data', $page->ID ); @endphp

                    @if($course_data)

                        <table class="table table-hover">
                            <tbody>

                            @if($course_data['number_of_lessons'])
                                <tr>
                                    <th>Aantal lessen:</th>
                                    <td>{{$course_data['number_of_lessons']}}</td>
                                </tr>
                            @endif

                            @if($course_data['lesson_duration'])
                                <tr>
                                    <th>Les duur:</th>
                                    <td>{{$course_data['lesson_duration']}}</td>
                                </tr>
                            @endif

                            @if($course_data['number_of_participants'])
                                <tr>
                                    <th>Aantal deelnemers:</th>
                                    <td>{{$course_data['number_of_participants']}}</td>
                                </tr>
                            @endif

                            @if($course_data['age_range_group']['age_range_min'] && $course_data['age_range_group']['age_range_max'] )
                                <tr>
                                    <th>Leeftijds catagorie:</th>
                                    <td>{{$course_data['age_range_group']['age_range_min']}}
                                        - {{$course_data['age_range_group']['age_range_max']}}</td>
                                </tr>
                            @endif

                            @if($course_data['course_material'])
                                <tr>
                                    <th>Les materiaal:</th>
                                    <td>{{$course_data['course_material']}}</td>
                                </tr>
                            @endif


                            </tbody>
                        </table>
                    @endif


                    @php $slideshow = get_field( 'slideshow', $page->ID ); @endphp

                    @if($slideshow)
                        <div class="row my-4">
                            <div class="col-12">
                                <!-- Slider main container -->
                                <div class="swiper-container swiper-container-{{$page->ID}}" data-slideshow="{{$page->ID}}">
                                    <!-- Additional required wrapper -->
                                    <div class="swiper-wrapper swiper-wrapper-{{$page->ID}}">
                                        <!-- Slides -->
                                        @foreach($slideshow as $image)
                                            <div class="swiper-slide swiper-slide-{{$page->ID}}">
                                                <img class="img-fluid swiper-lazy swiper-lazy-{{$page->ID}}"
                                                     data-src="{{$image['sizes']['large']}}"
                                                     @if($image['alt']) alt="{{ $image['alt']}}" @endif
                                                />
                                                <div class="swiper-lazy-preloader swiper-lazy-preloader-{{$page->ID}}"></div>
                                            </div>
                                        @endforeach
                                    </div>
                                    <!-- If we need pagination -->
                                {{--<div class="swiper-pagination swiper-pagination-{{$page->ID}}"></div>--}}

                                <!-- If we need navigation buttons -->
                                    <div class="swiper-button-prev swiper-button-prev-{{$page->ID}}"></div>
                                    <div class="swiper-button-next swiper-button-next-{{$page->ID}}"></div>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>

            @endforeach

        </div>
    </div>
</div>

