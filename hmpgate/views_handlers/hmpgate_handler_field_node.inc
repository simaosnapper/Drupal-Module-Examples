<?php

/**
 * @file
 * Contains the basic 'node' field handler.
 *
 * THIS STARTED AT THE REGULAR NODE TITLE FIELD HANDLER.
 * It was copied and edited so that we retain the default node options
 * to link the title, but we also add our Show Gate Status option as well.
 */

/**
 * Field handler to provide simple renderer that allows linking to a node.
 * Definition terms:
 * - link_to_node default: Should this field have the checkbox "link to node" enabled by default.
 *
 * @ingroup views_field_handlers
 */
class hmpgate_handler_field_node extends views_handler_field {

  function init(&$view, &$options) {
    parent::init($view, $options);
    // Don't add the additional fields to groupby
    if (!empty($this->options['link_to_node'])) {
      $this->additional_fields['nid'] = array('table' => 'node', 'field' => 'nid');
      if (module_exists('translation')) {
        $this->additional_fields['language'] = array('table' => 'node', 'field' => 'language');
      }
    }
  }

  function option_definition() {
    $options = parent::option_definition();
    $options['link_to_node'] = array('default' => isset($this->definition['link_to_node default']) ? $this->definition['link_to_node default'] : FALSE, 'bool' => TRUE);
    $options['gated_status'] = array('default' => isset($this->definition['gated_status default']) ? $this->definition['gated_status default'] : FALSE, 'bool' => TRUE);
    return $options;
  }

  /**
   * Provide link to node option
   */
  function options_form(&$form, &$form_state) {
    $form['link_to_node'] = array(
      '#title' => t('Link this field to the original piece of content'),
      '#description' => t("Enable to override this field's links."),
      '#type' => 'checkbox',
      '#default_value' => !empty($this->options['link_to_node']),
    );

    $form['gated_status'] = array(
      '#title' => t('Show Gate Status'),
      '#description' => t("Adds markup to denote gated nodes."),
      '#type' => 'checkbox',
      '#default_value' => !empty($this->options['gated_status']),
    );

    parent::options_form($form, $form_state);
  }


  /**
   * Render whatever the data is as a link to the node.
   *
   * Data should be made XSS safe prior to calling this function.
   */
  function render_link($data, $values) {
    if (!empty($this->options['link_to_node']) && !empty($this->additional_fields['nid'])) {
      if ($data !== NULL && $data !== '') {
        $this->options['alter']['make_link'] = TRUE;
        $this->options['alter']['path'] = "node/" . $this->get_value($values, 'nid');
        if (isset($this->aliases['language'])) {
          $languages = language_list();
          $language = $this->get_value($values, 'language');
          if (isset($languages[$language])) {
            $this->options['alter']['language'] = $languages[$language];
          }
          else {
            unset($this->options['alter']['language']);
          }
        }
      }
      else {
        $this->options['alter']['make_link'] = FALSE;
      }
    }

	if (!empty($this->options['gated_status'])) {
	  if ($data !== NULL && $data !== '') {
		$node = node_load($this->get_value($values, 'nid'));
		if((isset($node->gatestatus) && $node->gatestatus == 1)) {
		  $this->options['alter']['link_class'] = 'gated';
		} else {
		  $this->options['alter']['link_class'] = '';
		}
	  }
	}

    return $data;
  }

  function render($values) {
    $value = $this->get_value($values);
    return $this->render_link($this->sanitize_value($value), $values);
  }
}