---
title: "Linked List Implementation and All Operations"
date: "2021-04-03"
excerpt: "Linked List Data Structure Implementation and Operations in best time complexities"
---

![Linked List](https://i.imgur.com/NgbfvK9.png)

# What is a Linked List?

A Linked list is a common data structure made of chain of nodes, in which each node contains two fields, *data*  which holds the data and *next* which holds the address to next node in the chain.

The **head pointer** points to the first node, and the last element of the list points to **null**. When the list is empty, the head pointer points to **null**.

Linked lists can dynamically increase in size and it is easy to insert and delete from a linked list because unlike arrays, we only need to change the pointers of the previous element and the next element to insert or delete an element.

Linked lists are typically used to create file systems, adjacency lists, and hash tables.

### Types of Linked Lists

- Singly Linked List (Uni-directional)
- Doubly Linked List (Bi-directional)
- Circular Linked List

Linked Lists are very widely used in the industry and it is also one of the most important topics which you should positively know before appearing for a technical interview. Operations on Linked Lists are fairly easy, but optimised operations are what catches the eye. In this article, we'll take a look at most of them, in their most optimised form (Linear Time Complexity at max).

We're using C++ as our base language and will continue to do so for most DSA tutorials.

## Operations on Linked Lists

### Creating the List Data Structure

```c++
#include <bits/stdc++.h>
using namespace std;

//Objects of this class will act as nodes in our list
class Node {
  public:
  int data;
  Node* next = NULL;
  Node(int d)
  {
    this->data = d;
  }
};
```

### Creating a List

```c++
//Will create a sample Linked List of length n, where data will be (i...n)x10 (10,20,30....)
Node* createList(int n)
{
  //Can also use traditional arrays with malloc
	//	int* nodes = (int*) malloc(sizeof(int)*n);
  //Creating Nodes
  vector<Node*> nodes; //Vector to store nodes temporarily
  for(auto i=1; i<=n; ++i)
  {
    //nodes[i] = new Node(i*10); //if using traditional arrays
    nodes.push_back(new Node(i*10)); //pushing new nodes back into the vector 
  }
  //Connecting individual nodes
  for(auto i=0; i<n; ++i)
  {
    nodes[i]->next = nodes[i+1];
  }
  //Returning the head node
  return nodes[0];
}
```

### Displaying/Printing a List

```c++
void displayList(Node* list)
{
  cout<<"----------------------------------"<<endl;
  Node* temp = list;
  while(temp->next != NULL)
  {
    cout<<temp->data<<"->";
    temp = temp->next;
  }
  cout<<temp->data<<endl;
  cout<<"----------------------------------"<<endl;
}
/* Output
----------------------------------
10->20->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->230->240->250
----------------------------------
*/
```

### Getting Size/Length of Linked List (Linear Time Complexity/ O(n))

```c++
int size(Node* list)
{
  int n=0;
  Node* temp = list;
  while(temp->next != NULL)
  {
    temp = temp->next;
    n++;
  }
  cout<<"Size of List is "<<n<<endl;
  return n;
}
```

### Inserting at last of Linked List (Linear Time Complexity O(n))

```c++
void insert_at_last(Node* list, Node* node)
{
  Node* temp = list;
  while(temp->next != NULL)
  {
    temp = temp->next;
  }
  node->next = NULL;
  temp->next = node;
}
```

### Inserting at front of Linked List (Constant Time Complexity O(1))

```c++
Node* insert_at_first(Node* list, int d)
{
  Node* node = new Node(d);
  node->next = list;
  return node;
}
```

### Inserting a Node after Nth Node in Linked List (Linear Time Complexity dependent on value of N O(N))

```c++
void insert_after_n(Node* list, Node* node, int n)
{
  Node* temp = list;
  int i=0;
  while(temp->next !=NULL && i!=n)
  {
    temp = temp->next;
    i++;
  }
  if(i!=n)
  {
    throw "LinkedList Overflow: N doesn't exist";
  }

  Node* forward = temp->next;
  temp->next = node;
  node->next = forward;
}
```

### Removing a node from Last/Tail of Linked List (Linear Time Complexity O(n))

```c++
void remove_from_last(Node* list)
{
  Node* temp = list;
  while(temp->next->next!=NULL) {
    temp = temp->next;
  }
  temp->next = NULL;
}
```

### Removing Nth Node from Tail of Linked List (1 Pass + Linear Time Complexity / Two Pointer Method)

```c++
void remove_n_from_last(Node* list, int n)
{
  Node* offset = list;
  Node* node = list;
  int i=0;
  while(offset->next != NULL && i!=n)
  {
    offset = offset->next;
    ++i;
  }
  if(i!=n)
  {
    throw "LinkedList Overflow: N doesn't exist";
  }
  while(offset->next!=NULL)
  {
    offset = offset->next;
    node = node->next;
  }
  Node* forward = node->next->next;
  node->next = forward;
}
```

### Reversing a Linked List (Linear Time Complexity O(n))

```c++
Node* reverse_list(Node* list)
{
  Node* curr = list;
  Node* prev = NULL;
  while(curr != NULL)
  {
    Node* temp = curr->next;
    curr->next = prev;
    prev = curr;
    curr = temp;
  }
  return prev;
}
```

### Find the Middle Node of Linked List (1 Pass + Linear Time Complexity/ Two Pointer Double Speed Method)

```c++
void middleNode(Node* list)
{
  Node* slow = list;
  Node* fast = list;
  while(fast !=NULL)
  {
    slow = slow->next;
    fast = fast->next->next;
  }
  cout<<"Middle Node is: "<<slow->data<<endl;
}
```

### Check if the Linked List has a Cycle (1 Pass + Linear Time Complexity/ Two Pointer Double Step Method)

```c++
bool checkCycle(Node* list)
{
  Node* slow = list;
  Node* fast = list;
  while(fast!=NULL)
  {
    fast = fast->next;
    slow = slow->next;
    if(fast==NULL)
      break;
    fast = fast->next;
    if(slow == fast)
      return true;
  }
  return false;
}
```



## Let's Compile the above code in a single file and test!

### ***LinkedList.cpp***

```c++
#include <bits/stdc++.h>
using namespace std;

class Node {
  public:
  int data;
  Node* next = NULL;
  Node(int d)
  {
    this->data = d;
  }
};

Node* createList(int n)
{
  //Creating Nodes
  vector<Node*> nodes; //Vector to store nodes temporarily
  for(auto i=1; i<=n; ++i)
  {
    nodes.push_back(new Node(i*10));
  }
  //Connecting individual nodes
  for(auto i=0; i<n; ++i)
  {
    nodes[i]->next = nodes[i+1];
  }
  return nodes[0];
}

void displayList(Node* list)
{
  cout<<"----------------------------------"<<endl;
  Node* temp = list;
  while(temp->next != NULL)
  {
    cout<<temp->data<<"->";
    temp = temp->next;
  }
  cout<<temp->data<<endl;
  cout<<"----------------------------------"<<endl;
}

int size(Node* list)
{
  int n=0;
  Node* temp = list;
  while(temp->next != NULL)
  {
    temp = temp->next;
    n++;
  }
  cout<<"Size of List is "<<n<<endl;
  return n;
}
void insert_at_last(Node* list, Node* node)
{
  Node* temp = list;
  while(temp->next != NULL)
  {
    temp = temp->next;
  }
  node->next = NULL;
  temp->next = node;
}

Node* insert_at_first(Node* list, int d)
{
  Node* node = new Node(d);
  node->next = list;
  return node;
}

void insert_after_n(Node* list, Node* node, int n)
{
  Node* temp = list;
  int i=0;
  while(temp->next !=NULL && i!=n)
  {
    temp = temp->next;
    i++;
  }
  if(i!=n)
  {
    throw "LinkedList Overflow: N doesn't exist";
  }

  Node* forward = temp->next;
  temp->next = node;
  node->next = forward;
}

void remove_from_last(Node* list)
{
  Node* temp = list;
  while(temp->next->next!=NULL) {
    temp = temp->next;
  }
  temp->next = NULL;
}

void remove_n_from_last(Node* list, int n)
{
  Node* offset = list;
  Node* node = list;
  int i=0;
  while(offset->next != NULL && i!=n)
  {
    offset = offset->next;
    ++i;
  }
  if(i!=n)
  {
    throw "LinkedList Overflow: N doesn't exist";
  }
  while(offset->next!=NULL)
  {
    offset = offset->next;
    node = node->next;
  }
  Node* forward = node->next->next;
  node->next = forward;
}

Node* reverse_list(Node* list)
{
  Node* curr = list;
  Node* prev = NULL;
  while(curr != NULL)
  {
    Node* temp = curr->next;
    curr->next = prev;
    prev = curr;
    curr = temp;
  }
  return prev;
}

void middleNode(Node* list)
{
  Node* slow = list;
  Node* fast = list;
  while(fast !=NULL)
  {
    slow = slow->next;
    fast = fast->next->next;
  }
  cout<<"Middle Node is: "<<slow->data<<endl;
}

bool checkCycle(Node* list)
{
  Node* slow = list;
  Node* fast = list;
  while(fast!=NULL)
  {
    fast = fast->next;
    slow = slow->next;
    if(fast==NULL)
      break;
    fast = fast->next;
    if(slow == fast)
      return true;
  }
  return false;
}

int main() {
  // Creating a Linked List
  cout<<"Creating a LinkedList"<<endl;
  Node* LinkedList = createList(25);
  displayList(LinkedList);
  int s = size(LinkedList);

  // Inserting at end
  cout<<"Inserting at end"<<endl;
  insert_at_last(LinkedList, new Node(260));
  displayList(LinkedList);
  size(LinkedList);

  // Inserting at first
  cout<<"Inserting at first"<<endl;
  LinkedList = insert_at_first(LinkedList, 0);
  displayList(LinkedList);
  size(LinkedList);

  // Inserting after N
  cout<<"Inserting after n"<<endl;
  insert_after_n(LinkedList, new Node(99), 2);
  displayList(LinkedList);
  size(LinkedList);

  // Removing from last
  cout<<"Removing from Last"<<endl;
  remove_from_last(LinkedList);
  displayList(LinkedList);
  size(LinkedList);

  // Removing from n from last in 1Pass
  cout<<"Removing from n from last"<<endl;
  remove_n_from_last(LinkedList, 3);
  displayList(LinkedList);
  size(LinkedList);

  // Reversing a LinkedList
  cout<<"Reversing a LinkedList"<<endl;
  LinkedList = reverse_list(LinkedList);
  displayList(LinkedList);
  size(LinkedList);

  // middleNode of LinkedList in 1Pass
  cout<<"middleNode of LinkedList in 1Pass"<<endl;
  middleNode(LinkedList);
  displayList(LinkedList);
  size(LinkedList);

  // Check if List has a cycle
  Node* CyclicList = createList(25);
  Node* cTemp = CyclicList;
  while(cTemp->next != NULL)
  {
    cTemp = cTemp->next;
  }
  cTemp->next = CyclicList;
  cout<<"Cycle in List: "<<checkCycle(CyclicList)<<endl;

}
```

### Output

```bash
$ clang++-7 -pthread -std=c++17 -o main main.cpp
$ ./main
Creating a LinkedList
----------------------------------
10->20->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->230->240->250
----------------------------------
Size of List is 24
Inserting at end
----------------------------------
10->20->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->230->240->250->260
----------------------------------
Size of List is 25
Inserting at first
----------------------------------
0->10->20->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->230->240->250->260
----------------------------------
Size of List is 26
Inserting after n
----------------------------------
0->10->20->99->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->230->240->250->260
----------------------------------
Size of List is 27
Removing from Last
----------------------------------
0->10->20->99->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->230->240->250
----------------------------------
Size of List is 26
Removing from n from last
----------------------------------
0->10->20->99->30->40->50->60->70->80->90->100->110->120->130->140->150->160->170->180->190->200->210->220->240->250
----------------------------------
Size of List is 25
Reversing a LinkedList
----------------------------------
250->240->220->210->200->190->180->170->160->150->140->130->120->110->100->90->80->70->60->50->40->30->99->20->10->0
----------------------------------
Size of List is 25
middleNode of LinkedList in 1Pass
Middle Node is: 110
----------------------------------
250->240->220->210->200->190->180->170->160->150->140->130->120->110->100->90->80->70->60->50->40->30->99->20->10->0
----------------------------------
Size of List is 25
Cycle in List: 1
```



### Compile Command:

```bash
#For GCC/G++ - Unix
$ g++ LinkedList.cpp -o LinkedList
```



### Checkout the REPL here: [LinkedListCPP](https://replit.com/@PavitraBehre/LinkedListCpp)

### Github

- ####  C++: [pavitra14/LinkedListCpp](https://github.com/pavitra14/LinkedListCpp)

- #### Python 3: [pavitra14/LinkedListPy](https://github.com/pavitra14/LinkedListPy)





