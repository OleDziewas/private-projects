<?php

$servername = "raspberrypi";
$user = "Jolec2";
$pw ="1";
$db = "FilmBibWeb";
$output = "";
$con = new mysqli($servername,$user,$pw,$db);
if (isset($_POST['search'])){
  $searchq = $_POST['search'];
  if ($searchq != ""){
    $searchq = preg_replace("#[^0-9a-z -]#i", "", $searchq);
    $tables = $con->query("SHOW TABLES");
    $no_hits = true;
    while($table = mysqli_fetch_array($tables)){
      $sql = "SELECT Name FROM $table[0] ";
      $sql .= "WHERE Name LIKE '%$searchq%'";
      $query = $con->query($sql);
      $count= mysqli_num_rows($query);
      if ($count == 0 && $output == ""){
        continue;
      }elseif ($count == 0 && $output != "") {
        continue;
      }else{
        while($row = mysqli_fetch_array($query)){
          $name = $row['Name'];
          $output .= "<div class = 'data_set'><a href='film.php?name=$name&table=$table[0]' class = 'film_links'><p class= 'data_text'>".$name." - <i class='far fa-hdd'></i> ".$table[0]."</p></a></div>";
          $no_hits = false;
        }
      }
    }
    if ($no_hits){
      $output = "<div class = 'data_set'><p class= 'data_text'>Es sind keine Treffer gefunden worden.</p></div>";
    }
  }
}


?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>FilmBibWeb</title>
    <link rel="stylesheet" href="index_style.css">
    <script src="jquery-3.5.1.min.js"></script>
    <script src="https://kit.fontawesome.com/90a1fd9df4.js" crossorigin="anonymous"></script>
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
      <form class="" action="index.php" method="post">
        <div id ="searchbar" class="searchbar">
          <input class="searchtext" type="text" name="search" placeholder="Type to search..."/>
          <input class = "submit_btn" type="submit" value=""/>

        </div>
      </form>
      <div class="output">
        <?php print("$output"); ?>
      </div>

  </body>
</html>
