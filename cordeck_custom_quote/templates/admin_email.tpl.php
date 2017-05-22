<!DOCTYPE html>
<html lang="en">
<head>
	<title>Cordeck Custom Quote Email</title>
</head>
<body style="padding:50px 0;background-color:#f2f2f2;font-family: Arial,sans-serif;" bgcolor="#f2f2f2" id="email">
	<table align="center" width="600" bgcolor="#fff" style="width:600px;margin:auto;background-color:#fff;">
		<tr style="background-color:#0C5B97 !important;">
			<td>
				<table width="100%" style="width:100%;background-color:#0C5B97;">
					<tr>
						<td style="padding:15px 20px;width:175px;" width="175">
							<img src="<?php print theme_get_setting('logo'); ?>" width="175" height="auto" style="width:175px;height:auto;max-width:100%;">
						</td>
						<td style="padding:15px 20px;width:425px;" width="425">
							<h1 style="font-size:22px;color:#fff;font-family:Arial,sans-serif;">Cordeck Custom Quote Request</h1>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<table width="500" style="width:500px;" align="center" id="main-email-table">
					<tr>
						<td style="padding:15px 20px;">
							<h2 style="color:#0C5B97;">Customer Information</h2>
							<?php 

								foreach($contact as $field_name=>$value) {
									if($field_name == 'Same Info') {
										print '<h3 style="color:#0C5B97;">Shipping Information</h3>';
										print ($value == '1') ? '<p><strong>Same as customer information</strong></p>' : '';
									} elseif ($field_name == 'General Comments') {
										print '<h3 style="color:#0C5B97;">Additional Information</h3>';
										print !empty($value) ? '<p><strong>' . $field_name . ':</strong> ' . $value . '</p>' : '';
									} else if ($field_name == 'Customer Type') {
										if($value == 1) {
											print '<p><strong>Returning Customer</strong></p>';
										} else {
											print '<p><strong>New Customer</strong></p>';
										}
									} else {
										if($field_name == 'Contact Name' && !empty($value)) {
											print '<h3 style="color:#0C5B97;">Shipping Information</h3>';
										} 
										print !empty($value) ? '<p><strong>' . $field_name . ':</strong> ' . $value . '</p>' : '';
									}
								}

							?>
							<?php if (!empty($file_link)) : ?>
								<p><strong>Attached File:</strong> <a href="<?=$file_link; ?>" target="_blank"><?=$file_link ?></a></p>
							<?php endif; ?>
						</td>
					</tr>
					<tr>
						<td style="width:600px;" width="600" valign="top">
							<h2 style="color:#0C5B97;">Quotes</h2>
							<?php foreach($quotes as $quote_number=>$quote) : ?>	
								<table width="500" align="center" border="1" cellspacing="0">
									<tr bgcolor="#f2f2f2" style="background-color: #f2f2f2;">
										<th colspan="2" style="padding:5px;">
											<h4 style="margin:0;"><?=$quote_number; ?></h3>
										</th>
									</tr>
									<?php foreach($quote as $product_number=>$product) : ?>
										<?php foreach($product as $field_name=>$field) : ?>
											<?php if($field_name == 'Product Name') : ?>
												<tr>
													<th colspan="2" style="padding:12px;text-align:left;">
														<h3 style="margin:0;padding:0;"><strong style="font-weight:bold;font-size:18px"><?=$field; ?></strong></td></h3>
													</th>
												</tr>
											<?php else : ?>
												<tr>
													<td style="padding:5px;text-align:left;"><strong><?=$field_name; ?></strong></td>
													<td style="padding:5px;text-align:left;"><?=$field; ?></td>
												</tr>
											<?php endif; ?>
										<?php endforeach; ?>
									<?php endforeach; ?>
								</table>
								<table>
									<tr><td height="25"></td></tr>
								</table>
							<?php endforeach; ?>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>