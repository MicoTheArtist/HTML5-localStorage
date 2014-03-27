<html>  
 <head>  
   <title>DOM Event Example</title>  
   <style type="text/css">  
     #t { border: 1px solid red }  
     #t1 { background-color: pink; }  
   </style>  
   <script type="application/javascript">  
  
   // Function to change the content of t2  
   function modifyText() {  
     var t2 = document.getElementById("t2");  
     t2.firstChild.nodeValue = "three";      
   }  
   
   // Function to add event listener to t  
   function load() {   
     var el = document.getElementById("t");   
     el.addEventListener("click", modifyText, false);   
   }   
  
   document.addEventListener("DOMContentLoaded", load, false);  
  
   </script>   
 </head>   
 <body>   
 <table id="t">   
   <tr><td id="t1">one</td></tr>   
   <tr><td id="t2">two</td></tr>   
 </table>   
 </body>   
 </html>  