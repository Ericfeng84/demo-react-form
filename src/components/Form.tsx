// 本组件演示了如何用 React + React Hook Form 实现一个带有表单校验、数据展示和筛选的支出管理功能。
// 关键知识点：函数式组件、useState 状态管理、useForm 表单管理、受控组件、条件渲染、不可变数据更新、列表渲染。

import { useState } from "react";
import { useForm } from "react-hook-form";

// ExpenseFormData 接口定义了表单数据的结构，TypeScript 用于类型检查和自动补全。
interface ExpenseFormData {
  description: string;
  amount: number;
  category: string;
}

function Form() {
  // useState 是 React 的核心 Hook，用于在函数组件中管理本地状态。
  // 这里 expenses 保存所有支出条目，filterCategory 保存当前筛选条件。
  const [expenses, setExpenses] = useState<
    Array<{
      id: number;
      description: string;
      amount: number;
      category: string;
    }>
  >([]);
  const [filterCategory, setFilterCategory] = useState<string>("");

  /*
    useForm 是 React Hook Form 提供的 Hook，极大简化了表单状态、校验和提交的管理。
    - register: 用于将 input/select 等表单元素注册到表单管理系统中。
    - handleSubmit: 用于包装提交事件，自动处理校验。
    - errors: 存储所有字段的校验错误。
    - reset: 可重置表单到初始状态。
    - defaultValues: 设置表单初始值。
  */
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

  /*
    onSubmit 是表单提交的回调函数。
    只有当所有字段校验通过时才会被调用。
    这里用不可变更新的方式将新支出添加到数组，并重置表单。
  */
  const onSubmit = (data: ExpenseFormData) => {
    const newExpense = {
      id: Date.now(),
      ...data,
    };
    setExpenses([...expenses, newExpense]); // 不可变更新
    reset();
  };

  return (
    <>
      <h1>Expense Tracker</h1>
      <div className="container mt-4">
        {/*
          表单部分：
          - 每个字段都用 register 注册，并声明校验规则。
          - 错误信息通过 errors 对象集中管理。
          - handleSubmit 自动处理校验和数据收集。
        */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              id="description"
              placeholder="Description"
              {...register("description", {
                required: "描述不能为空",
                minLength: { value: 2, message: "描述至少需要2个字符" },
                maxLength: { value: 50, message: "描述不能超过50个字符" },
              })}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className={`form-control ${errors.amount ? "is-invalid" : ""}`}
              id="amount"
              placeholder="Amount"
              step="0.01"
              min="0"
              {...register("amount", {
                required: "金额不能为空",
                min: { value: 0.01, message: "金额必须大于0" },
                max: { value: 10000, message: "金额不能超过10000" },
              })}
            />
            {errors.amount && (
              <div className="invalid-feedback">{errors.amount.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className={`form-control ${errors.category ? "is-invalid" : ""}`}
              id="category"
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

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        {/*
          条件渲染：只有有支出数据时才显示表格。
          这是 React 中常见的 UI 逻辑控制方式。
        */}
        {expenses.length > 0 && (
          <div className="mt-4">
            <h3>Expenses</h3>
            {/*
              过滤器和支出表格：
              - 通过 select 控件和 filterCategory 状态实现筛选。
              - 列表渲染用 map，删除用不可变 filter。
            */}
            <div className="mb-3">
              <label htmlFor="filterCategory" className="form-label">
                Filter by Category
              </label>
              <select
                className="form-control"
                id="filterCategory"
                onChange={(e) => setFilterCategory(e.target.value)}
                value={filterCategory}
              >
                <option value="">All Categories</option>
                <option value="食品">食品</option>
                <option value="交通">交通</option>
                <option value="娱乐">娱乐</option>
              </select>
            </div>
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
                {expenses
                  .filter(
                    (expense) =>
                      !filterCategory || expense.category === filterCategory
                  )
                  .map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.description}</td>
                      <td>${expense.amount}</td>
                      <td>{expense.category}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
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

export default Form;
