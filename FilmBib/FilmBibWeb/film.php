<?php
  error_reporting(0);
  if (isset($_GET['name'])){
    $name = $_GET['name'];
  }
  if (isset($_GET['table'])){
    $table = $_GET['table'];
  }

  $servername = "raspberrypi";
  $user = "Jolec2";
  $pw ="1";
  $db = "FilmBibWeb";
  $con = new mysqli($servername,$user,$pw,$db);
  $sql = "SELECT MovieID FROM $table WHERE Name = '$name'";
  $res = $con->query($sql);
  while($film = mysqli_fetch_array($res)){
    $output = $film[0];
  }
 ?>

<html>
  <head>
    <meta charset="utf-8">
    <title>FilmBibWeb</title>
    <link rel="stylesheet" href="film_style.css">
    <script src="jquery-3.5.1.min.js"></script>

  </head>
  <body>
    <header>
      <nav>
        <ul class = "nav_links">
            <li><a href="index.php" class = "logo">FilmBibWeb</a></li>
            <li><a class="navtabs" href="ordner.php">Ordner-Struktur</a></li>
            <li><a class="navtabs" href="tabelle.php">Tabelle</a></li>
        </ul>
      </nav>
    </header>

    <?php
     echo "<script>
       function apiCall(){
         $.getJSON('http://www.omdbapi.com/?apikey=53eb81c6&plot=full&i='+encodeURI('$output')).then(function(response){
           var image = response.Poster;
           var plot = response.Plot;
           var title = response.Title;
           var year = response.Year;
           var dauer = response.Runtime;
           var genre = response.Genre;
           var director = response.Director;
           var actors = response.Actors;
          try{
          $('img').attr('src', image);
          $('p.plottext').text('Handlung: '+ plot);
          $('#titel').text('Titel: '+ title);
          $('#jahr').text('Jahr: '+ year);
          $('#dauer').text('Dauer: '+ dauer);
          $('#genre').text('Genre: '+ genre);
          $('#regisseur').text('Regisseur/in: '+ director);
          $('#darsteller').text('Darsteller/innen: '+ actors);
        }catch{

        }
         });
       }
       apiCall();
     </script>";
    ?>
    <div class="poster_and_details">
      <img class ="poster" src="" alt="">
      <ul class ="details">
        <li class = "detail_item" id ="titel">Titel:</li>
        <li class = "detail_item" id ="jahr">Jahr:</li>
        <li class = "detail_item" id ="dauer">Dauer:</li>
        <li class = "detail_item" id ="genre">Genre:</li>
        <li class = "detail_item" id ="regisseur">Regisseur:</li>
        <li class = "detail_item" id ="darsteller">Darsteller:</li>

      </ul>
    </div>
    <div class="plot">
      <p class="plottext"></p>
    </div>

  </body>
</html>
