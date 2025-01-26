<?php
$servername = "raspberrypi";
$user = "Jolec2";
$pw ="1";
$db = "FilmBibWeb";
$output = "";
$con = new mysqli($servername,$user,$pw,$db);
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>FilmBibWeb</title>
    <link rel="stylesheet" href="ordner_style.css">
    <script src="jquery-3.5.1.min.js"></script>
    <script src="https://kit.fontawesome.com/90a1fd9df4.js" crossorigin="anonymous"></script>
    <script type="text/javascript">
      function toggle(id){
        var e = document.getElementById(id);

        if (e.style.display == "none"){
          e.style.display = "";
        } else {
          e.style.display = "none";
        }
      }
    </script>

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
      <div class="table_header">
        <nav  class = "table_links">
          <ul>
              <?php
              $sql = "SHOW TABLES";
              $tables = $con->query($sql);
              while($table = mysqli_fetch_array($tables)){
                echo "<li><a class = 'table_tabs' href ='ordner.php?selected_table=$table[0]'>$table[0]</a></li>";
              }
               ?>
          </ul>
        </nav>
      </div>
      <?php
      $folders = array();
      $output = "";
      if (isset($_GET['selected_table'])){
        $selected_table = $_GET['selected_table'];
        echo "<h1 class = 'table_headline'>$selected_table</h1>" ;
        $folders = array();
        $sql = "SELECT Pfad FROM $selected_table ORDER BY Pfad ASC";
        $query = $con->query($sql);
        while($row = mysqli_fetch_array($query)){
          $pfad = $row['Pfad'];
          if (!in_array($pfad, $folders)){
            array_push($folders, $pfad);
          }
        }
        for ($i=0; $i < count($folders); $i++) {
          $try_folder = "";
          $teil = explode("\\",$folders[$i]);
          for ($e=0; $e < count($teil); $e++) {
            if ($try_folder ==""){
              $try_folder .= $teil[$e];
            }else{
              $try_folder .= "\\";
              $try_folder .= $teil[$e];
            }
            if (!in_array($try_folder, $folders)){
              array_push($folders, $try_folder);
            }
          }
        }
        sort($folders);
        $film_output_liste = array();
        $aufklapp_liste = array();
        for ($i=0; $i < count($folders); $i++) {
          $suchfolder = str_replace("\\", "_", $folders[$i]);
          $suchfolder = str_replace("'", "_", $suchfolder);
          $sql = "SELECT Name FROM $selected_table WHERE Pfad LIKE '$suchfolder'";
          $query = $con->query($sql);
          $count= mysqli_num_rows($query);
          $film_output= "";
          if ($count !== 0){
            while($row = mysqli_fetch_array($query)){
              $film = $row['Name'];
              $film_output .= "<div class = 'film'><a class = 'film_links' href='film.php?name=$film&table=$selected_table'><p class = '$i'>$film</p></a></div>";
            }
          }
          $id_a = 'hallo_';
          $id_a .= $folders[$i];
          if ($film_output == ""){
            $output .= "<div class = 'folder'><p id = '$i'>$folders[$i]</p></div>";
          }else{
            $output .= "<div class = 'folder'><p id = '$i'>$folders[$i]</p><a class = 'aufklapp_button' id = '$id_a'><i class='fas fa-chevron-circle-down'></i></a></div>";
          }
          $output .= "<div id='$folders[$i]' style='display:none'>$film_output</div>";
        }
      }
       ?>

       <div class="output">
         <?php print("$output"); ?>
       </div>
       <?php echo
       "<script type='text/javascript'>
       $('.aufklapp_button').click(function(event){
         var id = $(this).attr('id');
         var box_id = id.replace('hallo_', '');
         javascript:toggle(box_id);
       });
       </script>";
        ?>
       <?php
         for ($i=0; $i < count($folders); $i++) {
           $deepness = substr_count($folders[$i],"\\");
           $scaling = 40;
           $margin_left = $deepness * $scaling;
           $text_teile = explode("\\",$folders[$i]);
           $text_displayed = $text_teile[count($text_teile)-1];
           //Ordner
           echo "<script>$('#$i').text('$text_displayed');</script>";
           echo "<script>$('#$i').css('margin-left', ($margin_left+'px'));</script>";
           echo "<script>$('#$i').css('background-color', 'DeepSkyBlue');</script>";
           echo "<script>$('#$i').css('padding', '10px 40px');</script>";
           echo "<script>$('#$i').css('margin-bottom', '20px');</script>";
           echo "<script>$('#$i').css('margin-top', '20px');</script>";
           echo "<script>$('#$i').css('border-radius', '50px');</script>";
           echo "<script>$('#$i').css('width', '800px');</script>";
           echo "<script>$('#$i').css('box-shadow', '17px 17px 21px 1px black');</script>";
           //Filme
           echo "<script>$('.$i').css('margin-left', (($margin_left+$scaling)+'px'));</script>";
           echo "<script>$('.$i').css('margin-bottom', '15px');</script>";
           echo "<script>$('.$i').css('margin-top', '10px');</script>";
           echo "<script>$('.$i').css('border-radius', '50px');</script>";
           echo "<script>$('.$i').css('width', '500px');</script>";
           echo "<script>$('.$i').css('background-color', '#505050');</script>";
           echo "<script>$('.$i').css('padding', '10px 40px');</script>";
           echo "<script>$('.$i').css('box-shadow', '17px 17px 21px 1px black');</script>";
        }
      ?>
  </body>
</html>
