// 费用列表组件
// 负责费用数据的展示、筛选和删除功能

import { useState } from "react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  // 使用 useState Hook 管理过滤类别状态
  const [filterCategory, setFilterCategory] = useState<string>("");

  return (
    <div className="container mt-4">
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
                        onClick={() => onDeleteExpense(expense.id)}
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
  );
}

export default ExpenseList;
