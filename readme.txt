This is simply a collection of Drupal Modules that I have developed (or have had the primary hand in developing) in the past six months.  
  
 1.  Ad Block Check - Checks if the user is using an ad blocking software.  If so we block them and ask them (nicely) to turn it off.  The module also collects statistics for each user and whether or not they were using ad blocker or similar.

2.  Bookmark - Creates a bookmark icon(link) on selected node types to give them the option to bookmark the article(node) they are currently viewing.  Uses ajax to save and add the link to the block the module creates to view the bookmarks. 

3. HMP Branded Ad Regions - Gives editors capabilities to place specific ad code into regions without using blocks on branded (taxonomy) content and pages.  The site setup provides the availability of specific brands/taxonomy on each page through theme_preprocess_page(), term tags on nodes, and the brand/term in the url.  This allowed us to target specific pages without the grueling process of adding them to the blocks each time a new node/page was created.  

4.  HMP Subscribe Forms - This specific-use-case module gave the ability to create forms to send users to appropriate subscribe links based on selections within the form.  

5.  HMP XML Export - Because Views Feed pages didn't allow HTML in the XML we created a custom feed page to hit when we needed to import using <![CDATA[]]> Tags.  

6. HMP Gate - A module that counts an anonymous users node views and blocks (gates) them after a specified number of views and prompts them to login.  This module can block by user role type, taxonomy, and node type. A custome message can also be created for each.  This is especially useful to block paid content if required.  

7.  Job Import - This is a data import example of data existing in a non-Drupal database being moved into a Drupal database (nodes).  

