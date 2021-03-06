
## bug描述

我们的输入法使用了一个自己自己做的中间层，转发glview的输入事件，发现当7以上的苹果机器升级到iOS13之后，用户无法使用苹果自带的拼音输入了，表现为点拼音键盘之后，选词界面刷新一下(应该是输入完成刷新界面的表现)，之后选词界面上显示默认的"我们"等联想词，游戏也没有收到插入汉字的事件。而使用cocos的editbox则正常输入

## 解决过程

初步推测是7以上机型在iOS13上输入法事件可能跟以前不一样了，目前正在查具体原因

初步查了一下是iOS13改了多语言输入法，我们的输入框为了插入游戏内自定义的表情，是自己监听系统输入事件(主要是通过eaglview继承UITextInput和UIKeyInput来监听键盘事件和文本编辑事件)，然后字符和文字显示都是自己做。而cocos的editbox是使用了UITextField，它的文字是来自系统控件，显示也没办法在业务层定制。

只能想办法改一改eaglview兼容苹果的最新输入法改动了，然而不知道苹果到底改了啥，只能先打打log看看传过来的事件跟以前有什么区别

我们实现了了UITextInput的unmarked和setMarkedText以及UIKeyInput的insertText接口来监听输入事件。在iOS13以前，系统的拼音输入法是setMarkedText传进来的是你输入的拼音字母，然后选词界面能看到你打出来的待选字，你选字之后会先执行setMarkedText传入你选的汉字再执行unmarked接口，此时我们把字输入游戏中。但是在iOS13里面，只要调用eaglview的becomeFirstResponder,拼音输入法的输入就打不出字来，两个接口倒是能正常工作，但是调用eaglview的becomeFirstResponder接口之后，你打字，待选字永远是默认的那几个，打不出别的字来，当你选字的时候，倒是会根据之前的流程setMarkedText传入你选的汉字再执行unmarked接口。但是这毫无意义。

看了下UITextField也是继承自UIView的子类UIControl，也实现了UITextInput的接口，怀疑它是在setMarkedText函数中做了一些处理比如调用系统级接口将拼音字符传回去，让系统自带的拼音输入法可以使用。然而我们并不知道它是如何实现的。反正现在应用通过实现UITextInput和UIKeyInput的接口监听输入事件来接管文本显示看来是不行了。

我们发现切到搜狗输入法倒是能正常工作并且搜狗输入法是通过UIKeyInput的insertText接口来传入它打的汉字，不会使用UITextInput的接口

>未完待续