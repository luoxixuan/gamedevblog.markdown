import{_ as s,o as a,c as e,a2 as l}from"./chunks/framework.4hJCcvDE.js";const d=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"blog/知识点_001-C++的多线程.md","filePath":"blog/知识点_001-C++的多线程.md","lastUpdated":1784835052000}'),p={name:"blog/知识点_001-C++的多线程.md"};function t(r,n,i,c,o,b){return a(),e("div",null,[...n[0]||(n[0]=[l(`<h2 id="c-11的多线程相关" tabindex="-1">C++11的多线程相关 <a class="header-anchor" href="#c-11的多线程相关" aria-label="Permalink to &quot;C++11的多线程相关&quot;">​</a></h2><ol><li>volatile: 在c++中，这个关键字主要是表示当前值每次读取的时候都需要从内存中读取，不能使用寄存器缓存的值。有的人很容易把他的作用和atomic或者使用mutex实现的原子操作弄混，实质上他们的意义是完全不同的。volatile除了用在io映射内存之类地方之外，它主要的一个作用就是用在如下类似的代码上面</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>volatile bool ready = false; //如果不加static就整个源程序都可以访问,不过其他地方要用extern声明一下</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void initiazer(int &amp;&amp;ref)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	std::cout &lt;&lt; &quot;Inside thread: &quot; &lt;&lt; std::this_thread::get_id() &lt;&lt; &quot;	ref: &quot; &lt;&lt; ref &lt;&lt; std::endl;</span></span>
<span class="line"><span>	//std::this_thread::sleep_for(std::chrono::milliseconds(1));</span></span>
<span class="line"><span>	ready = true;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	std::thread th(initiazer, int(6));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	int counter = 0;</span></span>
<span class="line"><span>	while (!ready)</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		counter++;</span></span>
<span class="line"><span>		std::cout &lt;&lt; &quot;\\nready is false&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>		//break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	std::cout &lt;&lt; &quot;\\nready is true &quot; &lt;&lt; counter &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	th.join();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	getchar();</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><p>我在vs2015中测试了一下，当不加volatile修饰ready变量时，主线程是有可能因为编译器优化而陷入死循环，即每次都从寄存器读取ready，发现都是false。当我在循环中加上“std::cout &lt;&lt; &quot;\\nready is false&quot; &lt;&lt; std::endl;”这行代码的时候, 主线程可以正常读到ready被另一个线程修改的值。这个是由于编译器的优化规则导致的。 如果一个全局变量的2次读之间 1.没有调用任何非inline函数。 2.没有任何内嵌汇编语句。 那么编译器在第二次访问这个变量的时候，会直接使用第一次访问的值。</p><p>而为什么使用了std::out就可以了，这是因为进行了函数调用，编译器认为在进行函数调用之后所有非局部变量都需要重新从内存中取值，被取过地址或者引用的局部变量往往也需要重新被求值。</p><p>此外还有一点要注意，volatile关键字的这种内存屏障作用在多核机器上可能是不管用的</p><ol start="2"><li>atomic</li></ol><h2 id="参考文献" tabindex="-1">参考文献 <a class="header-anchor" href="#参考文献" aria-label="Permalink to &quot;参考文献&quot;">​</a></h2><ul><li><p><a href="https://fzheng.me/2016/08/11/cpp11-multi-thread/" target="_blank" rel="noreferrer">翻译：C++ 11 线程、锁和条件变量</a></p></li><li><p><a href="https://zh.cppreference.com/w/cpp/utility/functional/function" target="_blank" rel="noreferrer">C++ 参考手册--cppreference</a></p></li><li><p><a href="https://blog.csdn.net/qq_43325061/article/details/118553784" target="_blank" rel="noreferrer">永远不要用volatile保证多线程安全</a></p></li></ul><blockquote><p>未完待续</p></blockquote>`,10)])])}const m=s(p,[["render",t]]);export{d as __pageData,m as default};
