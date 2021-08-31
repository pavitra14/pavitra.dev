---
title: "Coding Exercise: Writing a CPU Random TicTacToe Game"
date: "2021-04-01"
excerpt: "Writing a TicTacToe Console Game in C++ and Java - A Coding Exercise for beginners"
---

## TicTacToe - Coding Exercise for Beginners

Who doesn't love a litle tictactoe on the back of their notebooks during class/lectures. Using this inspiration, Last year I tried to write my own tictactoe console version when I was preparing for my interviews. In this, It'll be You versus the CPU, catch is, CPU is only random, not any AI (It's a beginners tutorial, AI one will come later)

## Steps to write a simple TicTacToe Game

We'll be using C++ but a Java version is also Available at the end of the post.

- Make a Game Board
- Write a Function to place a piece
- Make it a reusable function by adding pos and user name
- Add a gameOver=false and winner flag
- add a while loop
- add winning conditions of rows, columns, diagonals
- add all winning conditions to a single list
- Loop through that list and check for winners using containAll()
- keep a list of empty blocks as availPos
- write a function for cpu to use only availPos so as no overwriting happens
- Put all the functions together

## Let's Start

### Global Variables and Headers

```c++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

bool gameOver = false;
string WinnerName = "";
vector<vector<string>> gameBoard;

vector<int> playerPos;
vector<int> cpuPos;
vector<int> availPos;
```

### Total Functions needed

```c++
void printGameBoard();
void placePeice(int, string);
void init();
int indexOf(vector<int>&, int);
void wrongTurn();
void playerTurn();
void cpuTurn();
void checkWinner(vector<int>&, string);
```

### Make a Game Board

Everyone likes to play TicTacToe on a gameboard, consisting of a grid with 9 playable places.

Let's make that

```c++
  /*
  Shoud Look Like this when print
       | |
      -+-+-
       | |
      -+-+-
       | |
  */
void init()
{
  for(auto i = 1; i<10; i++)
  {
    availPos.push_back(i);
  }
  vector<string> row = {" ", "|", " ", "|", " "};
  vector<string> sep = {"-", "+", "-", "+", "-"};
  gameBoard.push_back(row);
  gameBoard.push_back(sep);
  gameBoard.push_back(row);
  gameBoard.push_back(sep);
  gameBoard.push_back(row);
}
void printGameBoard()
{
  for(auto i=0; i<5; i++)
  {
    for(auto j=0; j<5; j++)
    {
      cout<<gameBoard[i][j];
    }
    cout<<endl;
  }
}
```

### Write a Function to place a piece

Place a piece on the board : Put X or O in the grid

```c++
void _place(int i, int j, char symbol)
{
  if(gameBoard[i][j] != "X" && gameBoard[i][j] != "O")
  {
    gameBoard[i][j] = symbol;
    return;
  }
  wrongTurn();
}
```

### Make it a reusable function by adding pos and user name

Map the 1-9 range input to appropriate i and j values in the grid so no irregularities are there.

```c++
void placePeice(int pos, string user)
{
  char symbol = ' ';
  if(user == "Player" && pos>=1 && pos<=9)
  {
    cout<<"Player: "<<pos<<endl;
    playerPos.push_back(pos);
    symbol = 'X';
  } else if(user == "CPU" && pos>=1 && pos<=9)
  {
    cout<<"CPU: "<<pos<<endl;
    cpuPos.push_back(pos);
    symbol = 'O';
  }
  int index = indexOf(availPos, pos);
  if(index != -1)
  {
    availPos.erase(availPos.begin() + index);
  }

  switch(pos)
  {
    case 1:
      _place(0, 0, symbol);
    break;
    case 2:
      _place(0, 2, symbol);
    break;
    case 3:
      _place(0, 4, symbol);
    break;
    case 4:
      _place(2, 0, symbol);
    break;
    case 5:
      _place(2, 2, symbol);
    break;
    case 6:
      _place(2, 4, symbol);
    break;
    case 7:
      _place(4, 0, symbol);
    break;
    case 8:
      _place(4, 2, symbol);
    break;
    case 9:
      _place(4, 4, symbol);
    break;
    default:
    break;
  }
}
```

### Handling Wrong Turns

In case someone enters a no. outside the range or enters a grid block which is already taken.

```c++
void wrongTurn()
{
  cout<<"Invalid Position, Please Try Again"<<endl;
  playerTurn();
}
```

### Trigger User/Player Turns

```c++
void playerTurn()
{
  cout<<"Please Enter a Position [1-9]: ";
  int pos;
  cin>>pos;
  placePeice(pos, "Player");
}
```

### Trigger CPU Turns - Random but from available/Valid places

```c++
void cpuTurn()
{
  int r = 1 + (rand() % availPos.size());
  int pos = availPos[r];
  placePeice(pos, "CPU");
}
```

### Check for Winner and Halt the Game

We're checking the rows, columns and diagonals on each turn. Using hardcoded place values.

```c++
void checkWinner(vector<int>& v, string user)
{
  if(gameOver)
    return;
  vector<int> topRow = {1,2,3};
  vector<int> midRow = {4,5,6};
  vector<int> botRow = {7,8,9};

  vector<int> leftCol = {1,4,7};
  vector<int> midCol =  {2,5,8};
  vector<int> rightCol= {3,6,9};

  vector<int> cross1 = {1,5,9};
  vector<int> cross2 = {3,5,7};

  vector<vector<int>> winning;
  winning.push_back(topRow);
  winning.push_back(midRow);
  winning.push_back(botRow);
  winning.push_back(leftCol);
  winning.push_back(midCol);
  winning.push_back(rightCol);
  winning.push_back(cross1);
  winning.push_back(cross2);

  for(auto i = 0; i < winning.size(); i++)
  {
    int c = 0;
    vector<int> con = winning[i];
    for(auto j = 0; j < con.size(); j++)
    {
      if(std::count(v.begin(), v.end(), con[j]))
      {
        c = 1;
      } else {
        c = 0;
        break;
      }
    }
    if(c==1)
    {
      gameOver = true;
      WinnerName = user;
      return;
    }
  }
  if(playerPos.size() + cpuPos.size() == 9)
  {
    gameOver = true;
    WinnerName = "Draw";
    return;
  }
}
```

### Finally, the main() method to drive everything and indexOf() helper function to get index from Iterator value(STL)

```c++
int main() {
  init();
  cout<<"Welcome to TicTacToe in C++"<<endl;
  printGameBoard();

  while(!gameOver)
  {
    playerTurn();
    checkWinner(playerPos, "Player");
    cpuTurn();
    checkWinner(cpuPos, "CPU");
    printGameBoard();
  }
  cout<<"Game Over!"<<endl;
  cout<<"Winner: "<<WinnerName<<endl;
}
int indexOf(vector<int>& pos, int el)
{
  auto it = find(pos.begin(), pos.end(), el);
  if(it!=pos.end())
  {
    int index = distance(pos.begin(), it);
    return index;
  }
  return -1;
}
```

## You're final code should look like this:

## Main.cpp

```c++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

bool gameOver = false;
string WinnerName = "";
vector<vector<string>> gameBoard;

vector<int> playerPos;
vector<int> cpuPos;
vector<int> availPos;


void printGameBoard();
void placePeice(int, string);
void init();
int indexOf(vector<int>&, int);
void wrongTurn();
void playerTurn();
void cpuTurn();
void checkWinner(vector<int>&, string);


int main() {
  init();
  cout<<"Welcome to TicTacToe in C++"<<endl;
  printGameBoard();

  while(!gameOver)
  {
    playerTurn();
    checkWinner(playerPos, "Player");
    cpuTurn();
    checkWinner(cpuPos, "CPU");
    printGameBoard();
  }
  cout<<"Game Over!"<<endl;
  cout<<"Winner: "<<WinnerName<<endl;
}
void init()
{
  for(auto i = 1; i<10; i++)
  {
    availPos.push_back(i);
  }
  vector<string> row = {" ", "|", " ", "|", " "};
  vector<string> sep = {"-", "+", "-", "+", "-"};
  gameBoard.push_back(row);
  gameBoard.push_back(sep);
  gameBoard.push_back(row);
  gameBoard.push_back(sep);
  gameBoard.push_back(row);
}
int indexOf(vector<int>& pos, int el)
{
  auto it = find(pos.begin(), pos.end(), el);
  if(it!=pos.end())
  {
    int index = distance(pos.begin(), it);
    return index;
  }
  return -1;
}
void printGameBoard()
{
  for(auto i=0; i<5; i++)
  {
    for(auto j=0; j<5; j++)
    {
      cout<<gameBoard[i][j];
    }
    cout<<endl;
  }
}

void _place(int i, int j, char symbol)
{
  if(gameBoard[i][j] != "X" && gameBoard[i][j] != "O")
  {
    gameBoard[i][j] = symbol;
    return;
  }
  wrongTurn();
}

void placePeice(int pos, string user)
{
  char symbol = ' ';
  if(user == "Player" && pos>=1 && pos<=9)
  {
    cout<<"Player: "<<pos<<endl;
    playerPos.push_back(pos);
    symbol = 'X';
  } else if(user == "CPU" && pos>=1 && pos<=9)
  {
    cout<<"CPU: "<<pos<<endl;
    cpuPos.push_back(pos);
    symbol = 'O';
  }
  int index = indexOf(availPos, pos);
  if(index != -1)
  {
    availPos.erase(availPos.begin() + index);
  }

  switch(pos)
  {
    case 1:
      _place(0, 0, symbol);
    break;
    case 2:
      _place(0, 2, symbol);
    break;
    case 3:
      _place(0, 4, symbol);
    break;
    case 4:
      _place(2, 0, symbol);
    break;
    case 5:
      _place(2, 2, symbol);
    break;
    case 6:
      _place(2, 4, symbol);
    break;
    case 7:
      _place(4, 0, symbol);
    break;
    case 8:
      _place(4, 2, symbol);
    break;
    case 9:
      _place(4, 4, symbol);
    break;
    default:
    break;
  }
}

void wrongTurn()
{
  cout<<"Invalid Position, Please Try Again"<<endl;
  playerTurn();
}

void playerTurn()
{
  cout<<"Please Enter a Position [1-9]: ";
  int pos;
  cin>>pos;
  placePeice(pos, "Player");
}

void cpuTurn()
{
  int r = 1 + (rand() % availPos.size());
  int pos = availPos[r];
  placePeice(pos, "CPU");
}

void checkWinner(vector<int>& v, string user)
{
  if(gameOver)
    return;
  vector<int> topRow = {1,2,3};
  vector<int> midRow = {4,5,6};
  vector<int> botRow = {7,8,9};

  vector<int> leftCol = {1,4,7};
  vector<int> midCol =  {2,5,8};
  vector<int> rightCol= {3,6,9};

  vector<int> cross1 = {1,5,9};
  vector<int> cross2 = {3,5,7};

  vector<vector<int>> winning;
  winning.push_back(topRow);
  winning.push_back(midRow);
  winning.push_back(botRow);
  winning.push_back(leftCol);
  winning.push_back(midCol);
  winning.push_back(rightCol);
  winning.push_back(cross1);
  winning.push_back(cross2);

  for(auto i = 0; i < winning.size(); i++)
  {
    int c = 0;
    vector<int> con = winning[i];
    for(auto j = 0; j < con.size(); j++)
    {
      if(std::count(v.begin(), v.end(), con[j]))
      {
        c = 1;
      } else {
        c = 0;
        break;
      }
    }
    if(c==1)
    {
      gameOver = true;
      WinnerName = user;
      return;
    }
  }
  if(playerPos.size() + cpuPos.size() == 9)
  {
    gameOver = true;
    WinnerName = "Draw";
    return;
  }
}
```

## How to Compile?

Use any STL Compatiable C++ compiler. I prefer gcc/g++ 10+

```bash
g++ main.cpp -o TicTacToe
```

## Run

This is for Unix environments(Linux, AWS, MacOS), just run the exe for windows in CMD/Powershell.

```bash
./TicTacToe
```

## References:

- C++ Code: [pavitra14/TicTacToeCPP](https://github.com/pavitra14/TicTacToeCPP)
- JAVA Code (with Maven): [pavitra14/TicTacToe](https://github.com/pavitra14/TicTacToe)
