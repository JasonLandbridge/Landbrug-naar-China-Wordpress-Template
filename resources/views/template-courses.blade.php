@php
    /*
    Template Name: Courses Template
    */
    namespace App;

@endphp

<div class="container-fluid">

    {{--Add post content--}}
    @include('components.component-post-content-with-wrap')

    @php $calendar = get_field( 'course_calendar', 'options' ); @endphp
        @include('templates.part-event-table', array('calendar' => $calendar))

        {{--Add HR line--}}
        @include('components.component-hr')

    @php $children = get_pages( [ 'child_of' => $post->ID, 'hierarchical' => 1, 'sort_column' => 'menu_order' ] ); @endphp

    {{--Show the courses--}}
    @include('components.component-vertical-tab')


</div>

