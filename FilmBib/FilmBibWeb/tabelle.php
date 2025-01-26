<?php
$servername = "raspberrypi";
$user = "Jolec2";
$pw ="1";
$db = "FilmBibWeb";
$output = "";
$con = new mysqli($servername,$user,$pw,$db);

 ?>

<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <title>FilmBibWeb</title>
    <link rel="stylesheet" href="tabelle_style.css">
    <script src="jquery-3.5.1.min.js"></script>
  </head>
  <body>
      <header>
        <nav>
          <ul class = "nav_links">
              <li><a href="index.php" class = "logo">FilmBibWeb</a></li>
              <li><a class = "navtabs" href="ordner.php">Ordner-Struktur</a></li>
              <li><a class = "navtabs" href="tabelle.php">Tabelle</a></li>
          </ul>
        </nav>
      </header>
      <div class="filter_wahl">

      </div>
      <div class="table_div">
        <?php
        $tables = $con->query("SHOW TABLES");
        echo "<table>";
          echo "<tr>";
            echo "<th width = 600> Name </th>";
            echo "<th width = 200> Englischer Name </th>";
            echo "<th width = 150> Genre </th>";
            echo "<th width = 50> Jahr </th>";
            echo "<th width = 200> Aufnahmedatum </th>";
            echo "<th width = 80> Rating </th>";
          echo "</tr>";
        while($table = mysqli_fetch_array($tables)){
          $sql = sprintf("SELECT *FROM %s", $table[0]);
          $res = $con->query($sql);
          while ($zeile = mysqli_fetch_array( $res, MYSQLI_ASSOC))
          {
            $genre_text = preg_replace('#([^\s]{1,1})([A-ZÄÖÜ]{1,1})#', '$1 $2', $zeile['Genre']);
            $name = $zeile['Name'];
            echo "<tr>";
              echo "<td class ='name_column'><a class = 'link_tabellenreihe' href= 'film.php?name=$name&table=$table[0]'>". $zeile['Name'] . "</a></td>";
              echo "<td>". $zeile['EnglishName'] . "</td>";
              echo "<td>". $genre_text . "</td>";
              echo "<td>". $zeile['Jahr'] . "</td>";
              echo "<td>". $zeile['Aufnahmedatum'] . "</td>";
              echo "<td>". $zeile['Rating'] . "</td>";
            echo "</tr>";
          }
          mysqli_free_result( $res );
        }
        echo "</table>";
        mysqli_free_result( $tables );
        ?>
      </div>
  </body>
</html>
