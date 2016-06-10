<?php

function hmpgate_admin_settings($form, &$form_state) {
  //Get all content and taxonomy
  $types = node_type_get_types(); 
  $vocabularies = taxonomy_get_vocabularies(); 

  //alphabetically sort content types
  asort($types);

  $user_roles = array(); 
  foreach(user_roles() as $key => $role){
  	if($role === 'Administrator'){
  	  continue; 
  	}else{
  	  $user_roles[$key] = $role; 
  	}
  }

  $form = array();

  //Start main message form.  Use this form to set the main message that will show 
  //in the gated popup window.
  $form['settings'] = array(
	'#type' => 'fieldset',
	'#title' => t('Settings'),
	'#collapsible' => TRUE,
  );

  $main_message = variable_get('hmpgate_message', array('value' => '', 'format' => NULL)); 
  $form['settings']['message'] = array(
	'#type' => 'text_format',
	'#title' => t('Default Gated Message. In all of the gated messages to place a user login form use [FORM] (CASE SENSITIVE)'),
	'#description' => t('The message which is displayed to unauthorized users on gated content. HTML is allowed.'),
  	'#default_value' => $main_message['value'],
  	'#format' => $main_message['format'], 
  );
  //End Main Message Form

  //Start Content Types Form.  Use this form to gate content based on content types. 
  $form['types'] = array(
	'#type' => 'fieldset',
	'#title' => t('Gate By Content Types'),
	'#tree' => TRUE,
	'#collapsible' => TRUE,
	'#description' => t('Which content types should be gated?'),
  );

  foreach($types as $name => $type) {

	$status = variable_get('hmpgate_'.$name, 0);
	$message = variable_get('hmpgate_' . $name . '_message', '');
	$message_status = variable_get('hmpgate_' . $name .'_message_status', 0);  
	$roles = hmpgate_get_roles($name, 'content_type'); 

	$form['types'][$name] = array(
	  '#type' => 'container',
	  '#attributes' => array(
		'id' => 'type_' . $name,
		'class' => array('admin-gate-type'),
	  ),
	);

	$form['types'][$name]['active'] = array(
	  '#type' => 'checkbox',
	  '#title' => $type->name, 
	  '#return_value' => $name,
	  '#ajax' => array(
		'callback' => 'hmpgate_node_type_activate',
		'wrapper' => 'type_' . $name,
	  ),
	  '#default_value' => $status === $name ? $name : 0,
	  
	);

	if((isset($form_state['values']['types'][$name]['active']) && $form_state['values']['types'][$name]['active'] !== 0) || ($status === $name && !isset($form_state['values']['types'][$name]['active']))) {
	  
	    $form['types'][$name]['num_views'] = array(
		  '#type' => 'textfield',
		  '#size' => 2,
		  '#title' => 'Number of page views before gate.  Each node will provide an instant gate feature as well if no views are allowed for that specific piece of content.',
		  '#default_value' => variable_get('hmpgate_' . $name . '_num_views', 3),
	      '#prefix' => '<div style="margin-left:40px;border:1px solid #aaa;max-width:900px;padding:10px;">',
	    );

	    $form['types'][$name]['message'] = array(
		  '#type' => 'container',
		  '#attributes' => array(
			'id' => 'type_' . $name . '_message',
			'class' => array('admin-gate-type-message'),
		  ),
		);

	    $form['types'][$name]['message']['active'] = array(
		  '#type' => 'checkbox',
		  '#title' => 'Content type specific message', 
		  '#return_value' => $name,
		  '#ajax' => array(
			'callback' => 'hmpgate_node_type_activate_message',
			'wrapper' => 'type_' . $name . '_message',
		  ),
		  '#default_value' => $message_status === 0 ? 0 : $name,
		);
 
	   if(isset($form_state['values']['types'][$name]['message']['active']) && $form_state['values']['types'][$name]['message']['active'] !== 0 || $message_status !== 0 && !isset($form_state['values']['types'][$name]['message']['active'])){  

	   	$content_message = variable_get('hmpgate_' . $name . '_message', array('value' => '', 'format' => NULL)); 
	    $form['types'][$name]['message']['message'] = array(
		  '#type' => 'text_format',
		  '#description' => t('The message which is displayed to unauthorized users on gated content. HTML is allowed.'),
	  	  '#default_value' => $content_message['value'],
	  	  '#format' => $content_message['format'], 
	    );
	   } 
 
		$form['types'][$name]['roles'] = array(
		    '#type' => 'checkboxes',
		    '#title' => 'Gate user by role ex: Paid Users', 
		    '#description' => t('Select the role(s) that can access gated content.  If any are selected only those specific roles can view this content (Use Wisely).  Don\'t check anything if using the page view counter above as the counter will not work if roles are selected.'),
		    '#options' => $user_roles,
		    '#default_value' => count($roles) > 0 ? $roles : 0,
		    '#prefix' => '<div style="margin-left:20px;margin-top:10px;">',
		    '#suffix' => '</div></div>', 
	    );
	}
  } 
  //End Content Types Form

  //Start Gate by taxonomy form.  Use this form to gate content by taxonomy terms.
  $form['taxonomy'] = array(
  	'#type' => 'fieldset',
  	'#title' => t('Gate by taxonomy'),
  	'#collapsible' => TRUE,
  	'#tree' => TRUE,
  	'#description' => t('Which taxonomy vocabularies should be gated?'),
  );

  foreach($vocabularies as $vid => $term){
  	
  	$vocabulary_status = variable_get('hmpgate_taxonomy' . $vid . '_status', 0);
  	$message_status = variable_get('hmpgate_taxonomy' . $vid . '_message', 0);
	$taxonomy_message_status = variable_get('hmpgate_taxonomy_' . $vid . '_message_status', 0);
	   
  	$form['taxonomy'][$vid] = array(
	  '#type' => 'container',
	  '#attributes' => array(
		'id' => 'type_' . $vid,
		'class' => array('admin-gate-type'),
	  ),
	);

	$form['taxonomy'][$vid]['active'] = array(
	  '#type' => 'checkbox',
	  '#title' => $term->name, 
	  '#return_value' => $vid,
	  '#ajax' => array(
		'callback' => 'hmpgate_taxonomy_activate',
		'wrapper' => 'type_' . $vid,
	  ),
	  '#default_value' => $vocabulary_status == $vid ? $vid : 0,
	);

    if(isset($form_state['values']['taxonomy'][$vid]['active']) && $form_state['values']['taxonomy'][$vid]['active'] !== 0 || $vocabulary_status !== 0 && !isset($form_state['values']['taxonomy'][$vid]['active'])) {
	  
	    $form['taxonomy'][$vid]['num_views'] = array(
		  '#type' => 'textfield',
		  '#size' => 2,
		  '#title' => 'Number of page views before gate.  Each node will provide an instant gate feature as well if no views are allowed for that specific piece of content.',
		  '#default_value' => variable_get('hmpgate_taxonomy' . $vid . '_num_views', 3),
	      '#prefix' => '<div style="margin-left:40px;border:1px solid #aaa;max-width:900px;padding:10px;">',
	    );
	    //Get all the children of the selected vocabulary
		$children = taxonomy_get_tree($vid);
		if($children){
			$tree = array();
			foreach($children as $child){
				$tree[$child->tid] = $child->name;
			}
		}
		//Get the default values to populate the select lists
		$default_values = hmpgate_get_settings(array_keys($tree), 'taxonomy');
		$roles = hmpgate_get_roles($vid, 'taxonomy'); 
		
	    $form['taxonomy'][$vid]['tree'] = array(
	    	'#type' => 'select',
	    	'#multiple' => TRUE,
	    	'#title' => t('Terms'),
	    	'#description' => t('Select all of the terms you want to gate.(Note: you must select the terms you want gated or none will be gated)'),
	    	'#options' => $tree,
	    	'#default_value' => $default_values,
	    );

	    $form['taxonomy'][$vid]['message'] = array(
		  '#type' => 'container',
		  '#attributes' => array(
			'id' => 'taxonomy_' . $vid . '_message',
			'class' => array('admin-gate-taxonomy-message'),
		  ),
		);

	    $form['taxonomy'][$vid]['message']['active'] = array(
		  '#type' => 'checkbox',
		  '#title' => 'Taxonomy specific message', 
		  '#return_value' => $vid,
		  '#ajax' => array(
			'callback' => 'hmpgate_taxonomy_message_activate',
			'wrapper' => 'taxonomy_' . $vid . '_message',
		  ),
		  '#default_value' => $taxonomy_message_status === 0 ? 0 : $vid,
		);
 
	   if(isset($form_state['values']['taxonomy'][$vid]['message']['active']) && $form_state['values']['taxonomy'][$vid]['message']['active'] !== 0 || $taxonomy_message_status !== 0 && $form_state['values']['types'][$vid]['message']['active']['#default_value'] == 0 && !isset($form_state['values']['taxonomy'][$vid]['message']['active'])){  

	   	$taxonomy_message = variable_get('hmpgate_taxonomy' . $vid . '_message', array('value' => '', 'format' => NULL)); 
	    $form['taxonomy'][$vid]['message']['message'] = array(
		  '#type' => 'text_format',
		  '#description' => t('The message which is displayed to unauthorized users on gated content. HTML is allowed.'),
	  	  '#default_value' => $taxonomy_message['value'],
	  	  '#format' => $taxonomy_message['format'], 
	    );

	   }

	   $form['taxonomy'][$vid]['roles'] = array(
		    '#type' => 'checkboxes',
		    '#title' => 'Gate user by role ex: Paid Users', 
		    '#description' => t('Select the role(s) that can access gated content.  If any are selected only those specific roles can view this content (Use Wisely).  Don\'t check anything if using the page view counter above as the counter will not work if roles are selected.'),
		    '#options' => $user_roles,
		    '#default_value' => count($roles) > 0 ? $roles : 0,
		    '#prefix' => '<div style="margin-left:20px;margin-top:10px;">',
		    '#suffix' => '</div></div>', 
	    );
	}
  }

  $form['submit'] = array(
	'#type' => 'submit',
	'#value' => t('Submit'),
  );

  return $form;
}


function hmpgate_admin_settings_submit($form, &$form_state) {

  if(isset($form_state['values']['message'])) {
	variable_set('hmpgate_message', $form_state['values']['message']);
  }

  //Save content types
  foreach($form_state['values']['types'] as $name => $type) {
	if(isset($type['active']) && $type['active'] !== 0) {
	  
	  //Only set a content type specific message if it isn't empty
	  if(isset($type['message']['active']) && $type['message']['active'] !== 0 && !empty($type['message']['message'])){
	  	
	  	variable_set('hmpgate_' . $name .'_message_status', 1);
	    
	    if(!empty($type['message']['message'])){
	  	  variable_set('hmpgate_' . $name . '_message', $type['message']['message']);
	    }else{
	    	variable_del('hmpgate_' . $name . '_message');
	    }

	  }else{
	  	//Delete Status For this content type if it isn't selected
	  	variable_del('hmpgate_' . $name .'_message_status');
	  }
	  variable_set('hmpgate_'.$name, $type['active']);
	  variable_set('hmpgate_'.$name . '_num_views', $type['num_views']);
	  foreach($type['roles'] as $rid => $status) {
		db_merge('hmpgate_roles')
		  ->key(
		    array(
		  	  'entity_name' => $name, 
		  	  'type' => 'content_type', 
		  	  'rid' => $rid
		    )
		  )->fields(
		    array(
		  	  'entity_name' => $name, 
		  	  'rid' => $rid, 
		  	  'type' => 'content_type', 
		  	  'status' => $status,
		  	)
		  )->execute();
	  }
	} else {
	  variable_del('hmpgate_'.$name);
	  variable_del('hmpgate_' . $name .'_message_status');
	  db_delete('hmpgate_roles')
		->condition('entity_name', $name)
		->condition('type', 'content_type')
		->execute();
	}
  }

  //Clear taxonomy from DB and resave in following foreach loop 
  //This makes sure only the selected terms are saved.  
  $query = db_delete('hmpgate')
    ->condition('type','taxonomy', '=')
    ->execute();

  //Save Taxonomy terms in hmpgate table
  foreach($form_state['values']['taxonomy'] as $vid => $type) {
  	
  	if(isset($type['message']['active']) && $type['message']['active'] !== 0 && !empty($type['message']['message'])){
  		dpm($vid); 
  		variable_set('hmpgate_taxonomy_' . $vid . '_message_status', $vid);
  		variable_set('hmpgate_taxonomy' . $vid . '_message', $type['message']['message']);
  	}else{
  		variable_del('hmpgate_taxonomy_' . $vid . '_message_status'); 
  	}

  	if(isset($type['active']) && $type['active'] !== 0){ 
  		//Save vocabulary number of allowed views
  		variable_set('hmpgate_taxonomy' . $vid . '_num_views', $type['num_views']);
  		//Save vocabulary gate status
  		variable_set('hmpgate_taxonomy' . $vid . '_status', $type['active']);

  		if(count($type['tree']) > 0){
  			foreach($type['tree'] as $tid){
			  $query = db_insert('hmpgate')
		  		->fields(array(
		  			'entity_id' => $tid,
		  			'type' => 'taxonomy',
		  			'status' => 1,
		  		))
		  		->execute(); 
  			}
  		}
  		foreach($type['roles'] as $rid => $status) {
		  db_merge('hmpgate_roles')
		    ->key(array('entity_id' => $vid, 'type' => 'taxonomy', 'rid' => $rid))
		    ->fields(
              array(
              	'entity_id' => $vid, 
              	'type' => 'taxonomy', 
              	'rid' => $rid, 
              	'status' => $status,
              )
            )->execute();
		}
  	}else{
  		//or completely delete the vocabulary from active status
  		variable_del('hmpgate_taxonomy' . $vid . '_status');
  		variable_set('hmpgate_taxonomy' . $vid . '_status', $type['active']);
  		db_delete('hmpgate_roles')
		  ->condition('entity_id', $vid)
		  ->condition('type', 'taxonomy')
		  ->execute();
  	}
  }
}

function hmpgate_node_type_activate($form, &$form_state) { 
  return $form['types'][$form_state['triggering_element']['#return_value']];
}

function hmpgate_node_type_activate_message($form, &$form_state){
  return $form['types'][$form_state['triggering_element']['#return_value']]['message']; 
}

function hmpgate_taxonomy_activate($form, &$form_state){
  return $form['taxonomy'][$form_state['triggering_element']['#return_value']];
}

function hmpgate_taxonomy_message_activate($form, &$form_state){
  return $form['taxonomy'][$form_state['triggering_element']['#return_value']]['message'];
}
