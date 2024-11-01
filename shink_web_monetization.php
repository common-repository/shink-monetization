<?php
	/*
	 * Plugin Name: Shink monetization
	 * Description: This plugin allows you to configure Full Page Script, Website Entry Script.
	 * Version: 1.0.4
	 * Author: Shink
	 * Author URI: http://shink.me
	 * License: GPL2
	 */
	function shink_plugins_get_options() {
		return array(
			'enabled' => get_option('shink_plugins_option_enabled'),
			'id' => trim(get_option('shink_plugins_option_id')) ?: '-1',
			'domain' => trim(get_option('shink_plugins_option_domain')) ?: 'shon.xyz',
			'website_entry_enabled' => get_option('shink_plugins_option_website_entry_enabled'),
			'include_exclude_domains_choose' => get_option('shink_plugins_option_include_exclude_domains_choose') ?: 'exclude',
			'include_exclude_domains_value' => trim(get_option('shink_plugins_option_include_exclude_domains_value')),
			'exclude_roles' => get_option('shink_plugins_option_exclude_roles')
		);
	}
	function shink_plugins_gen_script() {
		if (get_option('shink_plugins_option_enabled')) {
			$options = shink_plugins_get_options();
			global $current_user;
			if ($options['exclude_roles']) {
				foreach ($options['exclude_roles'] as $excludeRole) {
					if (in_array($excludeRole, $current_user->roles)) {
						return false;
					}
				}
			}	
			echo '
				<script data-cfasync="false" type="text/javascript">
					var id_user= ' . json_encode($options['id']) . ';
					var domain_url = ' . json_encode($options['domain']) . ';
					' . shink_plugins_gen_include_exclude_domains_script($options) . ' 
					
					' . ($options['website_entry_enabled'] ? 'var sh_uid = ' . json_encode($options['id']) . ';' : '') . ' 
					' . ($options['website_entry_enabled'] ? 'var sh_cap = 5;' : '') . ' 
				    ' . ($options['website_entry_enabled'] ? 'var sh_delay = 5;' : '') . ' 
				    ' . ($options['website_entry_enabled'] ? 'var sh_delay = 3;' : '') . '  			
				</script>
<script data-cfasync="false" type="text/javascript" src="//shon.xyz/js/script.js"></script>
				' . ($options['website_entry_enabled'] ? '<script data-cfasync="false" src="//shon.xyz/js/sh_in.js" type="text/javascript"></script>' : '') . ' 
			';


		} else {
			return false;
		}
	}
	function shink_plugins_gen_include_exclude_domains_script($options) {
		$script = 'var ';
		if ($options['include_exclude_domains_choose'] == 'include') {
			$script .= 'domains_include = [';
		} else if ($options['include_exclude_domains_choose'] == 'exclude') {
			$script .= 'domains_exclude = [';
		}
		if (trim($options['include_exclude_domains_value'])) {
			$script .= implode(', ', array_map(function($x) {
				return json_encode(trim($x));
			}, explode(',', trim($options['include_exclude_domains_value']))));
		}
		
		$script .= '];';
		return $script;
	}
	function shink_plugins_create_admin_menu() {
		add_options_page('Shink website monetization Settings', 'Shink website monetization Settings', 'administrator', __FILE__, 'shink_plugins_admin_settings_page', plugins_url('/images/icon.png', __FILE__ ));
		add_action('admin_init', 'shink_plugins_register_options');
	}
	function shink_plugins_option_id_validate($value) {
		if (!preg_match("/^\d+$/", str_replace(" ", "", trim($value)))) {
			add_settings_error('shink_plugins_option_id', 'shink_plugins_option_id', 'User ID is required and must be a number.', 'error');
			return false;
		} else {
			return $value;
		}
	}
	function shink_plugins_domain_name_validate($value) {
		return preg_match('/^(?!\-)(?:[a-zA-Z\d\-]{0,62}[a-zA-Z\d]\.){1,126}(?!\d+)[a-zA-Z\d]{1,63}$/', $value);
	}
	function shink_plugins_option_include_exclude_domains_value_validate($value) {
		$arr = array_filter(array_map(function($x) { return trim($x); }, explode(',', trim($value))), function($x) { return $x ? true : false; });
		if (count($arr)) {
			array_map(function($x) {
				if (!shink_plugins_domain_name_validate($x)) {
					add_settings_error('shink_plugins_option_id', 'shink_plugins_option_include_exclude_domains_value', $x . ' is not valid domain name.', 'error');
				}
			}, $arr);
		} else {
			add_settings_error('shink_plugins_option_id', 'shink_plugins_option_include_exclude_domains_value', 'You must specify at least one domain name to include/exclude.', 'error');
		}
		return implode(',', $arr);
	}
	function shink_plugins_option_custom_domain_validate($value) {
		if (($value = trim($value)) && !shink_plugins_domain_name_validate($value)) {
			add_settings_error('shink_plugins_option_id', 'shink_plugins_option_custom_domain', $value . ' is not valid domain name.', 'error');
			return false;
		}
		return $value;
	}
	function shink_plugins_register_options() {
		register_setting('np-shink-settings-group', 'shink_plugins_option_enabled');
		register_setting('np-shink-settings-group', 'shink_plugins_option_id', 'shink_plugins_option_id_validate');
		register_setting('np-shink-settings-group', 'shink_plugins_option_domain');
		register_setting('np-shink-settings-group', 'shink_plugins_option_website_entry_enabled');
		register_setting('np-shink-settings-group', 'shink_plugins_option_include_exclude_domains_choose');
		register_setting('np-shink-settings-group', 'shink_plugins_option_include_exclude_domains_value', 'shink_plugins_option_include_exclude_domains_value_validate');
		register_setting('np-shink-settings-group', 'shink_plugins_option_exclude_roles');
	}
	function shink_plugins_admin_settings_page() {?>
		<div class="wrap">
			<h2>Shink website monetization</h2>
			
			<form method="post" action="options.php">
		    	<?php settings_fields('np-shink-settings-group');?>
		    	<table class="form-table">
		    		<tbody>
						<tr valign="top">
							<td scope="row">Integration Enabled</td>
							<td><input type="checkbox" <?php echo get_option('shink_plugins_option_enabled') ? 'checked="checked"' : '' ?> value="1" name="shink_plugins_option_enabled" /></td>
						</tr>
						<tr valign="top">
							<td scope="row">Shink User ID</td>
							<td>
								<input type="text" name="shink_plugins_option_id" value="<?php echo htmlspecialchars(get_option('shink_plugins_option_id'), ENT_QUOTES) ?>" />
								<p class="description">
									Simply visit <a href="https://panel.shink.me/publisher/referrals" target="_blank">https://panel.shink.me/publisher/referrals</a> page.
									There will be URL http://shink.me/r/XXX where XXX is your Shink User ID.
								</p>
							</td>
						</tr>
						<tr valign="top">
							<td scope="row">Shink Domain</td>
							<td>
								<select name="shink_plugins_option_domain">
									<option value="shon.xyz" <?php echo get_option('shink_plugins_option_domain') == 'shon.xyz' ? 'selected="selected"' : '' ?>>shon.xyz</option>
								</select>
							</td>
						</tr>
						<tr valign="top">
							<td scope="row">Include/Exclude Domains</td>
							<td>
								<div>
									<label>
										<input type="radio" name="shink_plugins_option_include_exclude_domains_choose" value="include" <?php echo get_option('shink_plugins_option_include_exclude_domains_choose') == 'include' ? 'checked="checked"' : '' ?> />
										Include
									</label>
									<label>
										<input type="radio" name="shink_plugins_option_include_exclude_domains_choose" value="exclude" <?php echo !get_option('shink_plugins_option_include_exclude_domains_choose') || get_option('shink_plugins_option_include_exclude_domains_choose') == 'exclude' ? 'checked="checked"' : '' ?> />
										Exclude
									</label>
								</div>
								<div>
									<textarea rows="4" style="width: 64%;" name="shink_plugins_option_include_exclude_domains_value"><?php echo htmlspecialchars(trim(get_option('shink_plugins_option_include_exclude_domains_value')), ENT_QUOTES) ?></textarea>
									<p class="description">Comma-separated list of domains.</p>
								</div>
							</td>
						</tr>	
						<tr valign="top">
							<td scope="row">Website Entry Script Enabled</td>
							<td>
								<input type="checkbox" <?php echo get_option('shink_plugins_option_website_entry_enabled') ? 'checked="checked"' : '' ?> value="1" name="shink_plugins_option_website_entry_enabled" />
								<p class="description">Check this option if you wish to earn money when a visitor simply enters your site.</p>
							</td>
						</tr>
						<tr valign="top">
							<td scope="row">Exclude following user roles from displaying ads</td>
							<td>
								<select name="shink_plugins_option_exclude_roles[]" multiple="multiple">
									<option <?php echo get_option('shink_plugins_option_exclude_roles') && in_array('subscriber', get_option('shink_plugins_option_exclude_roles')) ? ' selected="selected" ' : '' ?> value="subscriber">Subscriber</option>
									<option <?php echo get_option('shink_plugins_option_exclude_roles') && in_array('contributor', get_option('shink_plugins_option_exclude_roles')) ? ' selected="selected" ' : '' ?> value="contributor">Contributor</option>
									<option <?php echo get_option('shink_plugins_option_exclude_roles') && in_array('author', get_option('shink_plugins_option_exclude_roles')) ? ' selected="selected" ' : '' ?> value="author">Author</option>
									<option <?php echo get_option('shink_plugins_option_exclude_roles') && in_array('editor', get_option('shink_plugins_option_exclude_roles')) ? ' selected="selected" ' : '' ?> value="editor">Editor</option>
									<option <?php echo get_option('shink_plugins_option_exclude_roles') && in_array('administrator', get_option('shink_plugins_option_exclude_roles')) ? ' selected="selected" ' : '' ?> value="administrator">Administrator</option
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<p class="submit">
					<input type="submit" class="button-primary" value="<?php _e('Update Settings') ?>" />
				</p>				
				<p>Please contact our <a href="https://panel.shink.me/contact" target="_blank">Support Portal</a> if you have any questions and/or suggestions.</p>		
			</form>
		</div>
<?php }?>
<?php
	add_action('wp_head', 'shink_plugins_gen_script');
	add_action('admin_menu', 'shink_plugins_create_admin_menu');
?>
