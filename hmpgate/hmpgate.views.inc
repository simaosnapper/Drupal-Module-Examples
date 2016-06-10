<?php
/**
* @file
* Views definitions for HMP Gate module.
*/



/**
* Implements hook_views_data().
*/
function hmpgate_views_data()  {

  $data['hmpgate'] = array(
    'table' => array(
      'group' => t('Gate'),
      'join' => array(
        'node' => array(
          'left_field' => 'nid',
          'field' => 'nid',
        ),
      ),
    )
  );

  $data['hmpgate']['status'] = array(
    'title' => t('Node Status'),
    'help' => t('Whether this node is gated or not.'),
    'field' => array(
      'handler' => 'views_handler_field_boolean',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort_group_by_numeric',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_boolean_operator',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_numeric',
    ),
  );

   return $data;
}


/**
 * Implements hook_views_data_alter().
 *
 * Basically we replace the default views title handler with
 * our custom made one.
 *
**/
function hmpgate_views_data_alter(&$data) {
	$data['node']['title']['field']['handler'] = 'hmpgate_handler_field_node';
}