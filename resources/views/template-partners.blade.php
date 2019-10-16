<?php
/**
 * Template Name: Partners Template
 */
namespace App;

?>

<?php echo apply_filters('the_content', $post->post_content); ?>


<?php

$cat_1_partners = get_field('company_courses_given_to', $post->ID);
$cat_2_partners = get_field('company_worked_for', $post->ID);


// check if the repeater field has rows of data
if ($cat_1_partners && count($cat_1_partners) > 0) {

    echo sprintf('<h2>%s</h2>', get_field('company_courses_given_to_category_title', $post->ID));
    echo '<div class="partner-logos">';
    echo '<ul>';
// loop through the rows of data
    foreach ($cat_1_partners as $partner) {
        $image = $partner['company_logo'];
        $name = $partner['company_name'];
        echo sprintf('<li><img src="%s" alt="%s"></li>', $image['sizes']['thumbnail'], $name);
    }

    echo '</ul>';
    echo '</div>';
}

if ($cat_2_partners && count($cat_2_partners) > 0) {

    echo sprintf('<h2>%s</h2>', get_field('company_worked_for_category_title', $post->ID));
    echo '<div class="partner-logos">';
    echo '<ul>';
// loop through the rows of data
    foreach ($cat_2_partners as $partner) {
        $image = $partner['company_logo'];
        $name = $partner['company_name'];
        echo sprintf('<li><img src="%s" alt="%s"></li>', $image['sizes']['thumbnail'], $name);
    }

    echo '</ul>';
    echo '</div>';
}
?>