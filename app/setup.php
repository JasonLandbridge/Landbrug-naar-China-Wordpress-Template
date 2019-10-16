<?php

namespace App;

use Roots\Sage\Container;
use Roots\Sage\Assets\JsonManifest;
use Roots\Sage\Template\Blade;
use Roots\Sage\Template\BladeProvider;

/**
 * Theme assets
 */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'sage/main.css', asset_path( 'styles/main.css' ), false, null );

	wp_enqueue_script( 'sage/main.js', asset_path( 'scripts/main.js' ), [ 'jquery' ], null, true );

	wp_enqueue_script( 'sage/pxs.js', asset_path( 'scripts/pxs.js' ), [ 'jquery' ], 1.0, true );

	if ( is_single() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}, 100 );

/**
 * Theme setup
 */
add_action( 'after_setup_theme', function () {
	/**
	 * Enable features from Soil when plugin is activated
	 * @link https://roots.io/plugins/soil/
	 */
	add_theme_support( 'soil-clean-up' );
	add_theme_support( 'soil-nav-walker' );
	add_theme_support( 'soil-nice-search' );
	add_theme_support( 'soil-relative-urls' );

	/**
	 * Enable plugins to manage the document title
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
	 */
	add_theme_support( 'title-tag' );

	/**
	 * Register navigation menus
	 * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
	 */
	register_nav_menus( [
		'primary_navigation' => __( 'Primary Navigation', 'sage' )
	] );

	/**
	 * Enable post thumbnails
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	/**
	 * Enable HTML5 markup support
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
	 */
	add_theme_support( 'html5', [ 'caption', 'comment-form', 'comment-list', 'gallery', 'search-form' ] );

	/**
	 * Enable selective refresh for widgets in customizer
	 * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
	 */
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Use main stylesheet for visual editor
	 * @see resources/assets/styles/layouts/_tinymce.scss
	 */
	add_editor_style( asset_path( 'styles/main.css' ) );
}, 20 );

/**
 * Register sidebars
 */
add_action( 'widgets_init', function () {
	$config = [
		'before_widget' => '<section class="widget %1$s %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3>',
		'after_title'   => '</h3>'
	];
	register_sidebar( [
		                  'name' => __( 'Primary', 'sage' ),
		                  'id'   => 'sidebar-primary'
	                  ] + $config );
	register_sidebar( [
		                  'name' => __( 'Footer', 'sage' ),
		                  'id'   => 'sidebar-footer'
	                  ] + $config );
} );

/**
 * Add Advanced Custom Field Page
 */
if ( function_exists( 'acf_add_options_page' ) ) {
	acf_add_options_page( array(
		'page_title' => 'Landbrug Naar China Options',
		'menu_title' => 'Landbrug Naar China Options',
		'menu_slug'  => 'theme-general-settings',
		'capability' => 'edit_posts',
		'redirect'   => false
	) );

}


/**
 * Disable the emoji's
 */

add_action( 'init', function () {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );

	/**
	 * Filter function used to remove the tinymce emoji plugin.
	 *
	 * @param array $plugins
	 *
	 * @return array Difference betwen the two arrays
	 */

	add_filter( 'tiny_mce_plugins', function ( $plugins ) {
		if ( is_array( $plugins ) ) {
			return array_diff( $plugins, array( 'wpemoji' ) );
		} else {
			return array();
		}
	} );

	/**
	 * Remove emoji CDN hostname from DNS prefetching hints.
	 *
	 * @param array $urls URLs to print for resource hints.
	 * @param string $relation_type The relation type the URLs are printed for.
	 *
	 * @return array Difference between the two arrays.
	 */
	add_filter( 'wp_resource_hints', function ( $urls, $relation_type ) {
		if ( 'dns-prefetch' == $relation_type ) {
			/** This filter is documented in wp-includes/formatting.php */
			$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

			$urls = array_diff( $urls, array( $emoji_svg_url ) );
		}

		return $urls;
	}, 10, 2 );
} );


/*
 * Prevent the automatic redirection to the front page, as this changes the url
 * https://wordpress.stackexchange.com/questions/185169/using-add-rewrite-rule-to-redirect-to-front-page
 */
add_filter( 'redirect_canonical', function ( $redirect ) {
	if ( is_page() && $front_page = get_option( 'page_on_front' ) ) {
		if ( is_page( $front_page ) ) {
			$redirect = false;
		}
	}

	return $redirect;
} );

/*
 * This will always redirect the page without changing the URL
 * https://codex.wordpress.org/Rewrite_API/add_rewrite_rule
 * https://wordpress.stackexchange.com/questions/193479/redirect-sub-pages-to-parent-without-changing-url
 */
add_action( 'init', function () {
	add_rewrite_rule( '(.?.+?)?(:/([0-9]+))?/?$', "index.php?disable_redirect=1", 'top' );
} );

/**
 * Updates the `$post` variable on each iteration of the loop.
 * Note: updated value is only available for subsequently loaded views, such as partials
 */
add_action( 'the_post', function ( $post ) {
	sage( 'blade' )->share( 'post', $post );
} );


/*
 * Removes the Gravity Forms Nag
 * https://gpldl.com/topic/gravity-forms-requesting-key/page/2/#post-20490
 * */
add_action( 'admin_init', function() {
	update_option( 'rg_gforms_message', '' );
	remove_action( 'after_plugin_row_gravityforms/gravityforms.php', array( 'GFForms', 'plugin_row' ) );
} );

/**
 * Setup Sage options
 */
add_action( 'after_setup_theme', function () {
	/**
	 * Add JsonManifest to Sage container
	 */
	sage()->singleton( 'sage.assets', function () {
		return new JsonManifest( config( 'assets.manifest' ), config( 'assets.uri' ) );
	} );

	/**
	 * Add Blade to Sage container
	 */
	sage()->singleton( 'sage.blade', function ( Container $app ) {
		$cachePath = config( 'view.compiled' );
		if ( ! file_exists( $cachePath ) ) {
			wp_mkdir_p( $cachePath );
		}
		( new BladeProvider( $app ) )->register();

		return new Blade( $app['view'] );
	} );

	/**
	 * Create @asset() Blade directive
	 */
	sage( 'blade' )->compiler()->directive( 'asset', function ( $asset ) {
		return "<?= " . __NAMESPACE__ . "\\asset_path({$asset}); ?>";
	} );
} );
