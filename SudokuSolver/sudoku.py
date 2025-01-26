import copy
def showSudoku(sudoku):
	print('-------------')
	for i in range(len(sudoku)):
		arr = "|"
		for e in range(len(sudoku[i])):
			arr+= str(sudoku[i][e])
			if((e+1)%3==0 and e!= 8):
				arr+= '|'
		arr+='|'
		print(arr)
		if((i+1)%3==0):
			print('-------------')

def solve(startsudoku, sudoku, startrow, startcol, startnumber, counter):
	solvedSudoku = sudoku
	while True:
		restart = False
		for i in range(startrow, len(sudoku)):
			for e in range(startcol, len(sudoku[i])):
				if(startsudoku[i][e] ==0):
					for num in range((startnumber +1), 10):
						if (numFine(solvedSudoku, i, e, num)):
							solvedSudoku[i][e] = num
							startnumber = 0	
							break

					#showSudoku(solvedSudoku)
					
					if (solvedSudoku[i][e] == 0 or solvedSudoku[startrow][startcol] == startnumber):
						solvedSudoku[i][e] = 0
						startrow = startPos(startsudoku, i, e)[0]
						startcol = startPos(startsudoku, i, e)[1]
						startnumber = solvedSudoku[startrow][startcol]
						restart = True
						break

					if (sudokuCompleted(solvedSudoku)):
						print("")
						return solvedSudoku
			if restart == False:
				startcol = 0	
			if (restart	== True):
				break			
			

def startPos(sudoku, row, col):
	pos = []
	for i in range(row, -1, -1):
		for e in range(col-1, -1, -1):
			if (sudoku[i][e] == 0):
				pos.append(i)
				pos.append(e)
				return pos
		col = len(sudoku[i])
	print("hello")
	pos = [0,0]
	return pos

def sudokuCompleted(sudoku):
	for i in range(len(sudoku)):
		for e in range(len(sudoku[i])):
			if (sudoku[i][e] == 0):
				return False
	
	return True
def numInRow(sudoku, row, num):
	for i in range(len(sudoku[row])):
		if(sudoku[row][i] == num):
			return True
	return False
	
def numInCol(sudoku, col, num):
	for i in range(len(sudoku)):
		if(sudoku[i][col] == num):
			return True
	return False

def numInSquare(sudoku, row, col, num):
	if (row < 3):
		rows = [0,1,2]
	elif (row > 2 and row <6):
		rows = [3,4,5]
	elif (row >5):
		rows = [6,7,8]

	if (col < 3):
		cols = [0,1,2]
	elif (col > 2 and col <6):
		cols = [3,4,5]
	elif (col >5):
		cols = [6,7,8]

	for r in rows:
		for c in cols:
			if (sudoku[r][c] == num):
				return True
	
	return False

def numFine(sudoku, row, col, num):
	if (numInRow(sudoku, row, num) == False and numInCol(sudoku, col, num) == False and numInSquare(sudoku, row, col, num) == False):
		return True
	return False

rows = 9
cols = 9
sudoku = []
sudoku2 = [[0,0,4,0,0,5,0,7,9], [0,0,6,0,0,9,0,0,8], [0,0,0,0,4,0,0,0,0], [0,0,0,3,0,0,0,0,7], [0,1,0,0,7,0,0,5,6], [0,0,7,0,0,6,9,0,0], [2,0,0,0,0,0,0,0,5], [0,0,5,0,0,8,0,9,0], [0,4,0,5,0,0,8,0,0]]

for i in range(rows):
	sudoku.append([])
	for e in range(cols):
		sudoku[i].append(0)

showSudoku(sudoku2)
sudoku2Copy = copy.deepcopy(sudoku2)
solvedSudoku = solve(sudoku2Copy, sudoku2, 0, 0, 0, 0)
showSudoku(solvedSudoku)
