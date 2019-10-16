@if($calendar && count($calendar) > 0 && $calendar[0]['type'] && $calendar[0]['start'] && $calendar[0]['end'])

    @php
        //Sort the start_date chronologically
        usort( $calendar, function ( $a, $b ) {
            return new DateTime( $a['start'] ) <=> new DateTime( $b['start'] );
        } );
    @endphp

    <div class="row no-gutters ">
        <div class="col-12 event-table">

            <div class="row no-gutters align-items-center event-table-header">
                <div class="col-12 col-md">Start Datum</div>
                <div class="col-12 col-md">Eind Datum</div>
                <div class="col-12 col-md-4">Type cursus</div>
                <div class="col-12 col-md-3">Inschrijven</div>
            </div>

            @foreach($calendar as $event)
                @php
                    $event["start"] = new DateTime( $event["start"] );
                    $event["end"]   = new DateTime( $event["end"] );
                @endphp

                <div class="row no-gutters align-items-center event-table-row">
                    <div class="col-6 col-md">{{ $event["start"]->format( 'd M Y' ) }}</div>
                    <div class="col-6 col-md">{{ $event["end"]->format( 'd M Y' ) }}</div>
                    <div class="col-12 col-md-4">{{ $event["type"]->post_title }}</div>
                    <div class="col-12 col-md-3">
                        <span class="align-middle">
                        <button type="button" class="btn btn-outline-info" data-title="{{ $event["type"]->post_title }}" data-toggle="modal" data-target="#signupModal">Inschrijven</button>
                        </span>
                    </div>
                </div>

            @endforeach

        </div>
    </div>



@endif