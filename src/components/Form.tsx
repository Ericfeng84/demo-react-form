// 导入 React 的核心功能
// useState: 用于在函数组件中管理状态
import { useState } from "react";
// 导入 React Hook Form 库，用于简化表单处理
import { useForm } from "react-hook-form";

// 定义 TypeScript 接口，描述表单数据的结构
// 接口类似于"合同"，确保数据符合预期格式
interface ExpenseFormData {
  description: string; // 描述字段，必须是字符串类型
  amount: number; // 金额字段，必须是数字类型
  category: string; // 类别字段，必须是字符串类型
}

// 定义函数式组件 Form
// 函数式组件是 React 的现代写法，比类组件更简洁
function Form() {
  // 使用 useState Hook 管理支出列表状态
  // useState 返回一个数组：[当前状态值, 更新状态的函数]
  // 这里定义了一个复杂的数组类型，包含支出对象
  const [expenses, setExpenses] = useState<
    Array<{
      id: number; // 唯一标识符
      description: string; // 支出描述
      amount: number; // 支出金额
      category: string; // 支出类别
    }>
  >([]); // 初始值为空数组 []

  // 使用 useState Hook 管理过滤类别状态
  // 用于存储用户选择的过滤条件
  const [filterCategory, setFilterCategory] = useState<string>("");

  // 使用 React Hook Form 的 useForm Hook
  // 这个 Hook 提供了表单处理的所有功能
  const {
    register, // 用于注册表单字段，连接 HTML 元素和表单状态
    handleSubmit, // 处理表单提交，包含验证逻辑
    formState: { errors }, // 获取表单验证错误信息
    reset, // 重置表单到初始状态
    watch, // 监听表单字段变化（这里未使用）
  } = useForm<ExpenseFormData>({
    // 使用泛型指定表单数据类型
    defaultValues: {
      // 设置表单字段的默认值
      description: "",
      amount: 0,
      category: "",
    },
  });

  // 定义表单提交处理函数
  // 这个函数只有在表单验证通过后才会被调用
  const onSubmit = (data: ExpenseFormData) => {
    // 创建新的支出对象
    const newExpense = {
      id: Date.now(), // 使用当前时间戳作为唯一ID
      ...data, // 展开运算符，将表单数据的所有属性复制到新对象
    };

    // 更新支出列表状态
    // 使用展开运算符创建新数组，这是 React 的不可变更新原则
    setExpenses([...expenses, newExpense]);
    reset(); // 重置表单到初始状态，清空所有输入框
  };

  // 组件返回 JSX（JavaScript XML）
  // JSX 允许在 JavaScript 中写类似 HTML 的代码
  return (
    <>
      {/* React Fragment，用于包裹多个元素而不产生额外的 DOM 节点 */}
      <h1>Expense Tracker</h1>
      <div className="container mt-4">
        {/* 表单元素，onSubmit 事件绑定到 handleSubmit 处理函数 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 描述字段组 */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              // 动态类名：根据是否有错误添加不同的 CSS 类
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              id="description"
              placeholder="Description"
              // 使用 register 函数注册这个输入框，register 返回一个对象，包含 name、ref、onChange、onBlur 等属性，使用展开运算符将这些属性应用到 input 元素上
              {...register("description", {
                required: "描述不能为空", // 必填验证
                minLength: {
                  // 最小长度验证
                  value: 2,
                  message: "描述至少需要2个字符",
                },
                maxLength: {
                  // 最大长度验证
                  value: 50,
                  message: "描述不能超过50个字符",
                },
              })}
            />
            {/* 条件渲染：只有当存在错误时才显示错误信息 */}
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          {/* 金额字段组 */}
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className={`form-control ${errors.amount ? "is-invalid" : ""}`}
              id="amount"
              placeholder="Amount"
              step="0.01" // 允许输入小数，步长为 0.01
              min="0" // 最小值为 0
              // 注册金额字段，包含数值验证
              {...register("amount", {
                required: "金额不能为空",
                min: {
                  // 最小值验证
                  value: 0.01,
                  message: "金额必须大于0",
                },
                max: {
                  // 最大值验证
                  value: 10000,
                  message: "金额不能超过10000",
                },
              })}
            />
            {errors.amount && (
              <div className="invalid-feedback">{errors.amount.message}</div>
            )}
          </div>

          {/* 类别选择字段组 */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className={`form-control ${errors.category ? "is-invalid" : ""}`}
              id="category"
              // 注册选择框，只需要必填验证
              {...register("category", {
                required: "请选择一个类别",
              })}
            >
              <option value="">Select a category</option>
              <option value="食品">食品</option>
              <option value="交通">交通</option>
              <option value="娱乐">娱乐</option>
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category.message}</div>
            )}
          </div>

          {/* 提交按钮 */}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        {/* 条件渲染：只有当支出列表不为空时才显示表格 */}
        {expenses.length > 0 && (
          <div className="mt-4">
            <h3>Expenses</h3>

            {/* 过滤选择器 */}
            <div className="mb-3">
              <label htmlFor="filterCategory" className="form-label">
                Filter by Category
              </label>
              <select
                className="form-control"
                id="filterCategory"
                // 受控组件：通过 value 和 onChange 控制状态
                onChange={(e) => setFilterCategory(e.target.value)}
                value={filterCategory}
              >
                <option value="">All Categories</option>
                <option value="食品">食品</option>
                <option value="交通">交通</option>
                <option value="娱乐">娱乐</option>
              </select>
            </div>

            {/* 支出列表表格 */}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* 数组方法链式调用：先 filter 再 map */}
                {expenses
                  .filter(
                    (expense) =>
                      // 过滤逻辑：如果没有选择过滤类别，显示所有支出；如果选择了过滤类别，只显示匹配的支出
                      !filterCategory || expense.category === filterCategory
                  )
                  .map((expense) => (
                    // 每个表格行，key 属性是 React 列表渲染的必需属性
                    <tr key={expense.id}>
                      <td>{expense.description}</td>
                      <td>${expense.amount}</td>
                      <td>{expense.category}</td>
                      <td>
                        {/* 删除按钮，使用箭头函数处理点击事件 */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            // 删除逻辑：过滤掉当前支出，保留其他支出
                            setExpenses(
                              expenses.filter((e) => e.id !== expense.id)
                            )
                          }
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// 导出组件，使其可以在其他文件中导入使用
export default Form;
