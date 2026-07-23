
## lua栈操作

lua 和 C++ 之间的数据交互通过堆栈进行，栈中的数据通过索引值进行定位，（栈就像是一个容器一样，放进去的东西都要有标号）
其中栈顶是-1，栈底是1，也就是第 1 个入栈的在栈底；也可以这么说：正数表示相对于栈底的位置（位移），负数表示相对于栈顶的位置（位移）；

####计算和清空栈中元素的操作：

1、函数lua_gettop()
用于返回栈中元素的个数，同时也是栈顶元素的索引，因为栈底是1，所以栈中有多少个元素，栈顶索引就是多少；

2、函数lua_settop()
函数原型：void lua_settop(lua_State *L , int index);
用于把堆栈的栈顶索引设置为指定的数值，比如说，一个栈原来有8个元素，调用函数设置index为7，就是把堆栈的元素数设置为7，也就是删掉一个元素，而且是栈顶元素；这个是用的正数，也就是相对于栈底元素设置的；如果是相对于栈顶元素，则要求用负值；也就是说如果设置索引为-2（index = -2），也相当于删除掉栈顶元素；呵呵，画个图就很方便了；为了说明方便，干脆设置一个宏：
```
#define lua_pop(L,n) lua_settop(L,-(n)-1)
```
这里的n是相对于栈顶的第几个元素，主要是为了理解；后面的lua_settop(L,-(n)-1) 用的就是相对于栈顶位移的负数表示；
>
3、lua_pushvalue()
函数原型：void lua_pushvalue (lua_State *L, int index);
英文原意：Pushes a copy of the element at the given valid index onto the stack. 
    下面是一个例子，栈的初始状态为10 20 30 40 50 *（从栈底到栈顶，“*”标识为栈顶）有：
```
    lua_pushvalue(L, 3)    --> 10 20 30 40 50 30*

```
lua_pushvalue(L,3)是取得原来栈中的第三个元素，压到栈顶；

4、lua_remove()
void lua_remove(lua_State *L, int index);
lua_remove删除给定索引的元素，并将这一索引之上的元素来填补空缺；
    下面是一个例子，栈的初始状态为10 20 30 40 50 *（从栈底到栈顶，“*”标识为栈顶，有：
    lua_settop(L, -3)      --> 10 20 30 *
    lua_settop(L,  6)      --> 10 20 30 nil nil nil *

5、lua_replace
void    lua_replace    (lua_State* L, int index);
Lua_replace将栈顶元素压入指定位置而不移动任何元素（因此指定位置的元素的值被替换）。
下面是一个例子，栈的初始状态为10 20 30 40 50 *（从栈底到栈顶，“*”标识为栈顶，有：
lua_replace(L, 2)      --> 10 50 30 40 *    //把50替换到索引的位置，同时去掉栈顶元素

#### C中加载lua时一些函数的用法

lua_getgobal ------void lua_getglobal (lua_State *L, const char *name);把全局的name的值压到栈顶。
lua_is***(lua_State *L,int index) 检查变量是不是某个类型，index指示变量的顺序，栈顶为-1。
lua_to***(lua_State *L,int index) 获取栈中的变量，然后转换为某个指定的类型，并返回。
lua_close()   销毁所有在指定的Lua State上的所有对象，同时释放所有该State使用的动态分配的空间。
>
>未完待续