from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import *
import sys
import json
import mariadb
import sys
import win32api, win32file
from imdb import IMDb, IMDbError
import os
import time

def connect_to_db():
    try:
        conn = mariadb.connect(
            user="TestUser2",
            password="helloworld",
            host="raspberrypi",
            port=3306,
            database="FilmBibWeb"

        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    # Get Cursor
    db_key = conn.cursor()
    return db_key

def create_table(name, db_key):
    try:
        db_columns = " (Name VARCHAR(100), Pfad VARCHAR(255), Filename VARCHAR(255), EnglishName VARCHAR(255), MovieID VARCHAR(255), Genre VARCHAR(255), Jahr YEAR(4), Aufnahmedatum DATE, Rating DOUBLE, CONSTRAINT nameid UNIQUE(Name))"
        db_key.execute("CREATE TABLE "+name+db_columns)
    except:
        print("New table couldn't be created!")

def delete_wrong_data(table_name, drive, db_key):
    
    db_key.execute("SELECT Pfad FROM {}".format(table_name))
    Pfade = []
    for (Pfad) in db_key:
        if Pfad not in Pfade:
            Pfade.append(Pfad)
            
    to_be_deleted = []
    
    for Pfad in Pfade:
        if os.path.exists(Pfad[0]) == False:
            path = Pfad[0].replace("\\", "_")
            db_key.execute("SELECT Name FROM {} WHERE Pfad LIKE '{}';".format(table_name, path))
            for (Name) in db_key:
                to_be_deleted.append(Name[0])

    print(to_be_deleted)
    for name in to_be_deleted:
        print("DELETED: ", name)
        try:
            db_key.execute("DELETE FROM {} WHERE Name = '{}'".format(table_name, name))
        except:
            name = name.replace("'", "_")
            try:
                db_key.execute("DELETE FROM {} WHERE Name Like '{}'".format(table_name, name))
            except Exeption as e:
                print(e)
            
    db_key.execute("SELECT Name, Filename, Pfad FROM {}".format(table_name))
    print("Selection abgeschlossen")
    to_be_deleted = []
    for (Name, Filename, Pfad) in db_key:
        data_in_path = False
        for root, dirs, files in os.walk(r"{}".format(Pfad)):
            for file in files:
                if Filename in file:
                    data_in_path = True
                    
            if data_in_path == False:
                try:
                    to_be_deleted.append(Name)
                except Exception as e:
                    print(e)
                    
    for name in to_be_deleted:
        print("DELETED: ", name)
        db_key.execute("DELETE FROM {} WHERE Name = '{}'".format(table_name, name))

def update_table(table_name, drive, db_key, change_value):
    videoformats = [".mpg", ".mpeg", ".vob", ".m2p", ".ts",".mp4",".mov",".avi",".wmv",".asf",".mkv",".webm",".flv",".3gp"]
    ia = IMDb()
    delete_wrong_data(table_name, drive, db_key)
    file_count = 0
    for root, dirs, files in os.walk(drive):
        for file in files:
            for videoformat in videoformats:
                if videoformat in file:
                    file_count += 1
            
    progress_count = 0        
    for root, dirs, files in os.walk(drive):
        for file in files:
            for videoformat in videoformats:
                if videoformat in file:
                    name = file
                    name = name.rsplit(" - ",1)[0]
                    print(name)
                    path_of_file = root+"\\"+file
                    props = os.stat(r'{}'.format(path_of_file))
                    recording_time =time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(props[8]))
                    try:
                        db_key.execute("INSERT INTO {} (Name, Pfad, Filename, Aufnahmedatum) VALUES (?, ?, ?, ?)".format(table_name), (name, root, file, recording_time))
                    except:
                        print("Eintrag already exists.")
                        progress_count += 1
                        progress_value = int(progress_count/file_count*100)
                        change_value.emit(progress_value)
                        continue
                    try:
                        movieID = ia.search_movie(name)[0].movieID
                        movie = ia.get_movie(movieID)
                        english_name =movie['title']
                        genre = ""
                        for i in movie['genres']:
                            genre +=i
                        try:
                            year = movie['year']
                        except:
                            year = 0
                        try:
                            rating = movie['rating']
                        except:
                            rating = 5.0
                        db_key.execute("UPDATE {} SET MovieID = 'tt{}', EnglishName = '{}', Genre = '{}', Jahr = {}, Rating = {} WHERE Name = '{}';".format(
                            table_name, movieID, english_name, genre, year, rating, name))
                        print("Eintrag eingefügt.")
                        progress_count += 1
                        progress_value = int(progress_count/file_count*100)
                        change_value.emit(progress_value)
                    except Exception as e:
                        progress_count += 1
                        progress_value = int(progress_count/file_count*100)
                        change_value.emit(progress_value)
                        print(e)

    
                
def update_db(db_key, possible_drives, change_value):
    db_key.execute("SHOW TABLES")
    existing_tables = db_key.fetchall()
    drives = win32api.GetLogicalDriveStrings().split(chr(0))
    for drive in drives:
        if win32file.GetDriveType(drive) ==3:
            name = win32api.GetVolumeInformation(drive)[0]
            if name in possible_drives:
                name = name.replace(" ", "")
                if existing_tables != None:
                    name_in_tables = False
                    for tables in existing_tables:
                        if name in tables:
                            print("Database already exists" + str(tables))
                            update_table(name, drive, db_key, change_value)
                            name_in_tables = True
                    if (name_in_tables == False):
                        create_table(name, db_key)
                        update_table(name, drive, db_key,change_value)                        
                else:
                    create_table(name, db_key)
                    update_table(name, drive, db_key,change_value)

class MyThread(QThread):

    change_value = pyqtSignal(int)
    update_ready = pyqtSignal(bool)
    def get_values(self, possible_drives):
        self.possible_drives = possible_drives
        
    def run(self):
        db_key = connect_to_db()
        
        try:
            update_db(db_key, self.possible_drives, self.change_value)
        except Exception as e:
            print(e)
            
        self.update_ready.emit(True)

        
class MyWindow(QMainWindow):
    def __init__(self, possible_drives):
        super(MyWindow, self).__init__()
        self.initUI()
        self.possible_drives = possible_drives
    def initUI(self):
        self.setGeometry(600,600,400, 200)
        self.setWindowTitle("FilmBibWeb Updater")
        #Layout
        self.grid = QGridLayout(self)
        #Elements
        self.festplatte_hinzufuegen_button = QtWidgets.QPushButton(self)
        self.festplatte_hinzufuegen_button.setText("Hinzufügen")
        self.festplatte_hinzufuegen_button.clicked.connect(self.festplatte_hinzufuegen)
        
        self.entry = QLineEdit(self)
        self.entry.returnPressed.connect(self.festplatte_hinzufuegen)
        
        self.festplatten_hinweis = QLabel(self)
        self.festplatten_hinweis.setText("")
        self.festplatten_hinweis.resize(400, 20)
        self.festplatten_hinweis.setStyleSheet('color: red')

        
        self.progress = QProgressBar(self)
        self.progress.setMaximum(100)
        self.progress.setValue(0)

        self.update_button = QtWidgets.QPushButton(self)
        self.update_button.setText("Update")
        self.update_button.clicked.connect(self.update_festplatte)

        self.festplatte_loeschen_button = QtWidgets.QPushButton(self)
        self.festplatte_loeschen_button.setText("Löschen")
        self.festplatte_loeschen_button.clicked.connect(self.festplatte_loeschen)
        
        self.entry_loeschen = QLineEdit(self)
        self.entry_loeschen.returnPressed.connect(self.festplatte_loeschen)
        
        self.grid.addWidget(self.entry,0,0)
        self.grid.addWidget(self.festplatte_hinzufuegen_button,0,1)
        self.grid.addWidget(self.festplatten_hinweis,3,0)
        self.grid.addWidget(self.progress,1,0)
        self.grid.addWidget(self.update_button,1,1)
        self.grid.addWidget(self.entry_loeschen,2,0)
        self.grid.addWidget(self.festplatte_loeschen_button,2,1)

        #Layout
        widget = QWidget()
        widget.setLayout(self.grid)
        self.setCentralWidget(widget)

    def festplatte_hinzufuegen(self):
        if self.entry.text() not in self.possible_drives and self.entry.text() != "":
            self.possible_drives.append(self.entry.text())
            self.entry.clear()
            drive_names = open("possible_drives.txt", "w")
            drives = json.dumps(self.possible_drives)
            drive_names.write(drives)
            drive_names.close()
            self.festplatten_hinweis.setText("")
        elif (self.entry.text() == ""):
            self.festplatten_hinweis.setStyleSheet('color: red')
            self.festplatten_hinweis.setText("HINWEIS: Sie müssen zuerst den Namen einer Festplatte eingeben.")
            self.entry.clear()
        else:
            self.festplatten_hinweis.setStyleSheet('color: red')
            self.festplatten_hinweis.setText("HINWEIS: Diese Festplatte exisitiert bereits.")
            self.entry.clear()
        
    def festplatte_loeschen(self):
        db_key = connect_to_db()
        to_delete_drive = self.entry_loeschen.text()
        to_delete_drive = to_delete_drive.replace(" ", "");
        try:
            db_key.execute("DROP TABLE {}".format(to_delete_drive))
            self.entry_loeschen.clear()
            self.festplatten_hinweis.setStyleSheet('color: green')
            self.festplatten_hinweis.setText("HINWEIS: Die zu löschende Festplatte {} wurde gelöscht.".format(to_delete_drive))
        except:
            self.festplatten_hinweis.setStyleSheet('color: red')
            self.festplatten_hinweis.setText("HINWEIS: Die zu löschende Festplatte {} existiert nicht.".format(to_delete_drive))
            self.entry_loeschen.clear()
            
    def update_festplatte(self):
        self.update_button.setEnabled(False)
        self.progress.setValue(0)
        self.thread = MyThread()
        self.thread.get_values(self.possible_drives)
        self.thread.change_value.connect(self.setProgressVal)
        self.thread.update_ready.connect(self.update_abgeschlossen)
        self.thread.start()
        self.festplatten_hinweis.setStyleSheet('color: green')
        self.festplatten_hinweis.setText("HINWEIS: Upate läuft...")
        
    def setProgressVal(self, val):
        self.progress.setValue(val)

    def update_abgeschlossen(self, val):
        self.update_button.setEnabled(True)
        self.festplatten_hinweis.setStyleSheet('color: green')
        self.festplatten_hinweis.setText("HINWEIS: Upate abgeschlossen!")
        
def get_drive_names():
    try:
        drive_names = open("possible_drives.txt", "r")
        content = drive_names.read()
        drives = json.loads(content)
        drive_names.close()
        return drives
    except:
        return []
    
def window():
    possible_drives = get_drive_names()
    print(possible_drives)
    app = QApplication(sys.argv)
    win = MyWindow(possible_drives)
    win.show()
    sys.exit(app.exec_())

window()
