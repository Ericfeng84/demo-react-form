# React + TypeScript + Vite 费用管理应用

这是一个使用现代 React 技术栈构建的费用管理应用，展示了组件化开发、状态管理、表单处理和 TypeScript 集成的最佳实践。

## 项目结构

```
src/
├── components/
│   ├── Form.tsx          # 主组件 - 状态管理和组件协调
│   ├── ExpenseForm.tsx   # 表单组件 - 费用数据输入和验证
│   └── ExpenseList.tsx   # 列表组件 - 费用数据展示和筛选
├── App.tsx
└── main.tsx
```

## 技术栈

- **React 18** - 现代函数式组件和 Hooks
- **TypeScript** - 类型安全和开发体验
- **React Hook Form** - 表单状态管理和验证
- **Bootstrap** - UI 组件和样式
- **Vite** - 快速构建工具

## 组件架构详解

### 1. Form.tsx - 主组件

主组件负责全局状态管理和子组件协调，体现了 React 的"状态提升"模式。

```typescript
function Form() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: Date.now(),
      ...data,
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <>
      <ExpenseForm onSubmit={handleAddExpense} />
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </>
  );
}
```

**关键特性：**

- 全局状态管理（expenses 数组）
- 数据操作方法（添加、删除）
- 组件间通信协调
- 不可变状态更新

### 2. ExpenseForm.tsx - 表单组件

专门负责费用数据的输入、验证和提交，使用 React Hook Form 简化表单处理。

```typescript
function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
    },
  });

  const handleFormSubmit = (data: ExpenseFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>{/* 表单字段 */}</form>
  );
}
```

**关键特性：**

- React Hook Form 集成
- 完整的表单验证
- 错误状态管理
- 自动表单重置

### 3. ExpenseList.tsx - 列表组件

负责费用数据的展示、筛选和删除操作，管理自己的筛选状态。

```typescript
function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [filterCategory, setFilterCategory] = useState<string>("");

  return (
    <div>
      {/* 筛选器 */}
      <select onChange={(e) => setFilterCategory(e.target.value)}>
        {/* 选项 */}
      </select>

      {/* 费用表格 */}
      <table>
        {expenses
          .filter(
            (expense) => !filterCategory || expense.category === filterCategory
          )
          .map((expense) => (
            <tr key={expense.id}>{/* 表格行 */}</tr>
          ))}
      </table>
    </div>
  );
}
```

**关键特性：**

- 条件渲染
- 数据筛选功能
- 列表渲染优化
- 本地状态管理

## 组件通信模式

```
Form (主组件)
├── 状态：expenses[]
├── 方法：handleAddExpense, handleDeleteExpense
├── ExpenseForm (子组件)
│   ├── 接收：onSubmit 回调
│   └── 职责：表单输入和验证
└── ExpenseList (子组件)
    ├── 接收：expenses 数据 + onDeleteExpense 回调
    └── 职责：数据展示和筛选
```

### 数据流

1. **向下传递数据**：通过 props 将 expenses 传递给 ExpenseList
2. **向上传递事件**：通过回调函数将表单提交和删除事件传递给主组件
3. **状态隔离**：每个组件管理自己的局部状态（如筛选条件）

## React 核心概念应用

### 1. 函数式组件和 Hooks

```typescript
// 状态管理
const [expenses, setExpenses] = useState<Expense[]>([]);
const [filterCategory, setFilterCategory] = useState<string>("");

// 表单管理
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<ExpenseFormData>();
```

### 2. 不可变状态更新

```typescript
// 添加费用
setExpenses([...expenses, newExpense]);

// 删除费用
setExpenses(expenses.filter((expense) => expense.id !== id));
```

### 3. 条件渲染

```typescript
{
  expenses.length > 0 && <div className="mt-4">{/* 费用表格 */}</div>;
}
```

### 4. 列表渲染

```typescript
{
  expenses
    .filter((expense) => !filterCategory || expense.category === filterCategory)
    .map((expense) => <tr key={expense.id}>{/* 表格行内容 */}</tr>);
}
```

## TypeScript 集成

### 接口定义

```typescript
interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseFormData {
  description: string;
  amount: number;
  category: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}
```

### 类型安全

- 组件 props 类型检查
- 表单数据验证
- 状态类型推断
- 事件处理类型安全

## React Hook Form 特性

### 字段注册

```typescript
{...register("description", {
  required: "描述不能为空",
  minLength: { value: 2, message: "描述至少需要2个字符" },
  maxLength: { value: 50, message: "描述不能超过50个字符" }
})}
```

### 错误处理

```typescript
{
  errors.description && (
    <div className="invalid-feedback">{errors.description.message}</div>
  );
}
```

### 表单提交

```typescript
<form onSubmit={handleSubmit(handleFormSubmit)}>{/* 表单内容 */}</form>
```

## StrictMode 兼容性

所有组件都完全符合 React StrictMode 的要求：

✅ **函数式组件**：使用现代 React 模式  
✅ **正确的状态管理**：使用 useState 和不可变更新  
✅ **无副作用**：组件只负责渲染和事件处理  
✅ **稳定的引用**：回调函数和 key 属性都是稳定的  
✅ **正确的数据流**：通过 props 和回调进行组件通信

## 性能优化

### 1. 组件拆分

- 单一职责原则
- 按需重新渲染
- 更好的代码组织

### 2. 列表渲染优化

- 使用稳定的 key 属性
- 避免不必要的重新渲染
- 高效的 DOM 更新

### 3. 状态管理优化

- 不可变数据更新
- 避免深层对象修改
- 合理的状态提升

## 最佳实践总结

| 实践                | 说明                 | 好处               |
| ------------------- | -------------------- | ------------------ |
| **组件拆分**        | 单一职责，模块化设计 | 可维护性、可复用性 |
| **状态提升**        | 共享状态放在父组件   | 清晰的数据流       |
| **不可变更新**      | 创建新对象/数组      | 状态更新正确性     |
| **TypeScript**      | 类型安全             | 减少运行时错误     |
| **React Hook Form** | 表单管理             | 简化表单处理       |
| **条件渲染**        | 根据状态显示内容     | 更好的用户体验     |

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 学习要点

这个项目展示了现代 React 开发的核心概念：

1. **组件化设计**：如何将复杂功能拆分为可维护的组件
2. **状态管理**：使用 Hooks 管理组件状态
3. **表单处理**：集成第三方库简化表单操作
4. **TypeScript 集成**：类型安全和开发体验
5. **性能优化**：组件拆分和渲染优化
6. **最佳实践**：符合 React 官方推荐模式

这个应用是学习现代 React 开发的优秀示例，涵盖了从基础概念到高级模式的全方位实践。
