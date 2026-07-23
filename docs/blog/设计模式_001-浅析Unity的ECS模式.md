最近发现unity的entity package里面有unity ecs模块的所有代码，所以现在主要在看这个东西学习。
看了发现要自己实现一个可以脱离unity运行的简易版本也是有一定难度的

## 一、Unity ECS vs 自研 SOA-ECS

在研究 Unity ECS 源码的过程中，发现它的核心设计思路可以拆为三层：

1. **Archetype/Chunk 内存布局** — Unity 的做法是把相同组件组合的实体放在同一块连续内存（Chunk）里，16KB 一块，遍历时走 Chunk 而不是走 Entity
2. **System 调度** — 按依赖关系排序 System，Job System 并行执行
3. **Burst Compiler** — 把 C# 编译为本机代码，在 Chunk 遍历中获得接近 C++ 的性能

Unity 这套设计是针对通用 ECS 场景的——场景里可能有几百种不同的组件组合，每个系统的访问模式可能完全不同。但对于塔防这种特定项目，组件种类是固定的（敌人、塔、玩家、世界），Archetype 的灵活性反而带来了额外的复杂度和内存碎片。

于是我基于 Unity ECS 的思想，做了一个精简版的 SOA（Struct of Arrays）架构，专门服务于塔防性能基准测试项目 **BattleSystem-ECS**。

核心区别：

| | Unity ECS | 自研 SOA-ECS |
|---|---|---|
| 内存布局 | Archetype/Chunk 动态分配 | 5 个固定 ComponentStore（Enemy/Tower/Player/World + 核心） |
| 组件访问 | Chunk 遍历 + 迭代器 | 直接索引 parallel float[]/int[]/bool[] 数组 |
| 并行 | Job System（Burst 编译） | Parallel.For + 手动两阶段安全 |
| 性能上限 | 依赖 Burst，接近 C++ | 依赖内存布局，C# GC 边界内优化 |
| 复杂度 | 高（需要理解 Chunk/Archetype/EntityQuery） | 中（直接操作数组，无语法糖） |

## 二、5 个 ComponentStore 的设计

把组件按领域拆为 5 个 partial class，每个自包含其字段和访问方法：

```
Core/ComponentStore.cs          # 核心：常量 MAX_ENTITIES=100K、位置、实体 CRUD、活跃 ID、死亡队列
Core/ComponentStore_Enemy.cs    # 敌人：Health/Armor/CC/Bleed/BT/ActionEnum...（约 40+ 字段）
Core/ComponentStore_Tower.cs    # 塔：Damage/Range/Targeting/Projectile/Ammo/Overcharge...
Core/ComponentStore_Player.cs   # 玩家：Attack/Health/Shield/Mana/Gold/Buff/TechTree...
Core/ComponentStore_World.cs    # 世界：Weather/DayNight/Adaptive/Resource/Fog...
```

每个文件里的数据都是平行数组，比如敌人组件：

```csharp
float[]  EnemyHealth;         // 100K 个 float 连续存储
float[]  EnemyMaxHealth;
float[]  EnemyMoveSpeed;
bool[]   EnemyActive;
int[]    EnemyGoldReward;
EnemyActionType[] EnemyActionEnum;   // 预计算 enum，热路径无字符串比较
BTCachedTree[] EnemyBehaviorTree;    // 预缓存行为树，O(1) 访问
```

为什么要拆 partial class？因为 5 个文件加起来上千行，不拆的话单文件内 IDE 的 intellisense 会非常慢。而且从领域角度看，敌人系统和玩家系统的字段几乎不会交叉引用，分开维护更清晰。

## 三、从"遍历所有实体"到"活跃 ID 列表"

一个看了 Unity ECS 源码才深刻体会到的优化：不要遍历全量数组，只遍历活跃的。

最开始的设计是所有系统这样写的：

```csharp
for (int i = 0; i < store.NextEntityId; i++)  // 遍历到最大创建数
    if (store.EnemyActive[i])  // 跳过不活跃的
```

当 MAX_ENTITIES 是 100K 但实际只有 2000 活跃敌人时，98% 的遍历是在检查 `bool[]` 后跳过。改为维护 `ActiveEnemyIds`（`List<int>`），系统只遍历活跃 ID：

```csharp
// 返回副本，防止外部篡改
public IReadOnlyList<int> GetAllActiveEnemyIds()
    => new List<int>(ActiveEnemyIds);
```

注意返回的是**副本**，不是内部引用。早期版本直接返回 `ActiveEnemyIds`，导致一个 P0 bug：某系统迭代列表时另一个系统修改了列表长度，触发 `InvalidOperationException`。虽然我们这个项目是单线程串行执行系统，但列表的生命周期跨越多个系统调用，副本是必要的防御。

## 四、行为树预缓存

Unity ECS 的一个痛点是在运行时动态查找组件——`EntityManager.GetComponentData<T>(entity)` 本质上是 Dictionary 查找，热路径上开销不小。

BattleSystem-ECS 的做法是：波次生成时直接把行为树 JSON 解析并缓存到 SOA 数组中：

```
WaveSpawning
  → BTCachedTreeEvaluator.Build(json)   // 构建扁平化树结构
  → store.EnemyBehaviorTree[entityId] = tree  // 存到 SOA 数组
EnemyAISystem.Update
  → tree = store.EnemyBehaviorTree[entityId]  // O(1) 数组索引，无 Dictionary 查找
  → tree.EvaluateWithEnum() → EnemyActionEnum  // 结果直接写 enum
```

整个 EnemyAISystem 的热路径上没有一次 Dictionary 查找、没有一次字符串比较，全部是数组索引和枚举判断。

## 五、和 Unity ECS 路线的一个分歧

Unity ECS 强调"无继承、纯数据"，所有逻辑在 System 里做。我们游戏里则是按领域分组保留了部分行为：比如 `BTCachedTreeEvaluator` 本身有复杂的状态机逻辑，放在 System 里会让代码变成面条。最后的做法是——数据用 SOA 存储（纯数组），但允许行为对象存在（如 Evaluator、各种 Group），只要这些对象**本身不持有可变共享状态**即可。

这种折中在实际工程中是合理的：纯数据 ECS 在理论上是完美的，但在复杂业务逻辑（比如行为树评估、技能效果链）面前，强行把几百行逻辑塞进 System 的 Update 里，可维护性反而变差。

## 六、性能

项目目前跑出的基准（2026-06）：

| 模式 | FPS | 说明 |
|------|-----|------|
| mode2（合并热路径，10K 敌 ×500 帧） | 7385 | 绕过真实系统调用链路 |
| mode4（真实系统链路，10K 敌 ×500 帧） | 3125 | 每个系统独立执行，更接近实际游戏 |
| mode5（完整一局，400 帧） | 2848 | 真实波次生成、5 关全通 |

mode2 和 mode4 的差距（7385 vs 3125）是一个很关键的教训：优化工具很容易制造"看起来很快"的假象。mode2 把几个系统的 Update 合并到一个循环里，绕过了 20+ 个 SystemGroup 的调度开销、接口分发和组件查找，FPS 翻倍——但这个路径在实际游戏里根本不存在。实际游戏一定是走 mode4 的真实链路。如果你用 mode2 的数据去说服自己做性能优化，很容易去优化一些根本不存在的"热点"。

目前 C# 单线程（未开 Burst、未用 IL2CPP），纯靠 SOA 内存布局和 `Parallel.For` 做到了 3000+ FPS。如果用 Burst 把 `Parallel.For` 里的循环编译为本机代码，预计还有 2-3x 的空间。

## 参考文献

- [浅谈《守望先锋》中的 ECS 构架--云风](https://blog.codingnow.com/2017/06/overwatch_ecs.html)
- [Unity ECS 源码](https://github.com/Unity-Technologies/EntityComponentSystemSamples)
- 本项目文档 [docs/architecture.md]
- 本项目文档 [docs/philosophy.md]

>未完待续