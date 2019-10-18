<?php
/*
Template Name: Contact Template
*/
namespace App;

?>
<?php  $business_address = get_field( 'business_address', 'options' ); ?>
<?php  $bank_data = get_field( 'bankaccount_data', 'options' ); ?>
<?php  $bank_address = $bank_data['bank_address']; ?>

<div class="container-fluid contact-table">
  <div class="row">
    <div class="col">
      <h2><?php echo $post->post_title ?></h2>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p><?php echo apply_filters( 'the_content', $post->post_content ); ?></p>
    </div>
  </div>
  <div class="row justify-content-md-center">
    <div class="col-sm-5">
      <div class="row border-bottom-gold">
        <div class="col-sm-5">Bedrijfsnaam:</div>
        <div class="col-sm-7"><?php the_field( 'company_name', 'options' ); ?></div>
      </div>
      <div class="row border-bottom-gold">
        <div class="col-sm-5">Kantoor adress:</div>
        <div class="col-sm-7">
			<?php
			$address = sprintf( '%s %d', trim( $business_address['street'] ), trim( $business_address['house_number'] ) );
			if ( $business_address['neighborhood'] ) {
				$address .= sprintf( ', %s', trim( $business_address['neighborhood'] ) );
			}
			echo $address;
			?><br/>
			<?php echo sprintf( '%s, %s', trim( $business_address['city_name'] ), trim( $business_address['country'] ) ); ?>
        </div>
      </div>
      <div class="row border-bottom-gold">
        <div class="col-sm-5">Tel.:</div>
        <div class="col-sm-7"><?php the_field( 'office_number', 'options' ); ?></div>
      </div>
      <div class="row border-bottom-gold">
        <div class="col-sm-5">Mobiel:</div>
        <div class="col-sm-7"><?php the_field( 'phone_number', 'options' ); ?></div>
      </div>
      <div class="row border-bottom-gold">
        <div class="col-sm-5">WhatsApp nummer:</div>
        <div class="col-sm-7"><?php the_field( 'whatsapp_number', 'options' ); ?></div>
      </div>
      <div class="row border-bottom-gold">
        <div class="col-sm-5">E-mail:</div>
        <div class="col-sm-7">
          <a href="mailto:<?php the_field( 'e-mail', 'options' );?>">
			  <?php the_field( 'e-mail', 'options' ); ?>
          </a>
        </div>
      </div>
      <div class=" row border-bottom-gold">
        <div class="col-sm-5">Kamer van Koophandel:</div>
        <div class="col-sm-7"><?php the_field( 'chamber_of_commerce_number', 'options' ); ?></div>
      </div>
    </div>
    {{--    Bank account   --}}
    <div class="col-sm-1"></div>
    <div class="col-sm-5">

      <div class="row border-bottom-gold">
        <div class="col-sm-6">Bank naam:</div>
        <div class="col-sm-6"><?php echo $bank_data['bank_name'] ?></div>
      </div>
      <div class="row border-bottom-gold">
        <div class="col-sm-6">Bank adres:</div>
        <div class="col-sm-6">
			<?php
			$address = sprintf( '%s %d', trim( $bank_address['street'] ), trim( $bank_address['house_number'] ) );
			if ( $bank_address['neighborhood'] ) {
				$address .= sprintf( ', %s', trim( $bank_address['neighborhood'] ) );
			}
			echo $address;
			?><br/>
			<?php echo sprintf( '%s, %s', trim( $bank_address['city_name'] ), trim( $bank_address['country'] ) ); ?>
        </div>
      </div>

      @if($bank_data['swift_code'])
        <div class=" row border-bottom-gold">
          <div class="col-sm-6">Swift code:</div>
          <div class="col-sm-6"><?php echo $bank_data['swift_code']; ?></div>
        </div>
      @endif

      @if($bank_data['bankaccount_srd'])
        <div class=" row border-bottom-gold">
          <div class="col-sm-6">Banknummer SRD:</div>
          <div class="col-sm-6"><?php echo $bank_data['bankaccount_srd']; ?></div>
        </div>
      @endif

      @if($bank_data['bankaccount_usd'])
        <div class=" row border-bottom-gold">
          <div class="col-sm-6">Banknummer USD:</div>
          <div class="col-sm-6"><?php echo $bank_data['bankaccount_usd']; ?></div>
        </div>
      @endif

      @if($bank_data['bankaccount_eur'])
        <div class=" row border-bottom-gold">
          <div class="col-sm-6">Banknummer EUR:</div>
          <div class="col-sm-6"><?php  echo $bank_data['bankaccount_eur']; ?></div>
        </div>
      @endif

      <div class=" row border-bottom-gold">
        <div class="col-sm-6">Onder vermelding van:</div>
        <div class="col-sm-6">mevr. L.E. Landbrug</div>
      </div>

    </div>

  </div>
</div>
<br/><br/>
@php
  $route_page = get_field('route_description_page', 'options');
echo apply_filters('the_content', get_post($route_page)->post_content);
@endphp
