<!DOCTYPE html>
<html lang="en">
<head>
	<title>Thank You for Your Interest in Cordeck Products</title>
	<style>
		#email table:hover,#email tr:hover,#email td:hover,#email th:hover{
			background-color: inherit;
		}
	</style>
</head>
<body style="padding:50px 0;background-color:#f2f2f2;font-family: Arial,sans-serif;" bgcolor="#f2f2f2" id="email">
	<table align="center" width="600" bgcolor="#fff" style="width:600px;margin:auto;background-color:#fff;">
		<tr style="background-color:#0C5B97 !important;">
			<td>
				<table width="100%" style="width:100%;background-color:#0C5B97;">
					<tr>
						<td style="padding:15px 20px;width:175px;" width="175">
							<a href="http://cordeck.com"><img src="<?php print theme_get_setting('logo'); ?>" width="175" height="auto" style="width:175px;height:auto;max-width:100%;">
						</td>
						<td style="padding:15px 20px;width:425px;" width="425">
							<h1 style="font-size:22px;color:#fff;font-family:Arial,sans-serif;">Thank You for Your Interest in Cordeck Products</h1>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<table width="500" style="width:500px;" align="center">
					<tr>
						<td style="padding:15px 20px;">
							<p>Hi <?=$first_name; ?>,</p>
							<p>Thank you for you interest in Cordeck products. We are excited to speak with you and will be in contact shortly.</p>
							<p>If you would to speak with us directly you can give us a call at 877-857-6400</p>
							<br/>
							<br/>
							<p>Sincerely,<br/>Your Friends at Cordeck</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>