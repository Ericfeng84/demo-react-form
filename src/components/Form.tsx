// 主组件：费用管理应用
// 负责状态管理和协调子组件之间的通信

import { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

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

function Form() {
  // useState 是 React 的核心 Hook，用于在函数组件中管理本地状态。
  // 这里 expenses 保存所有支出条目。
  const [expenses, setExpenses] = useState<Expense[]>([]);

  /*
    处理新增费用的函数。
    接收表单数据，创建新的费用对象，并添加到费用列表中。
    使用不可变更新的方式修改状态。
  */
  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: Date.now(),
      ...data,
    };
    setExpenses([...expenses, newExpense]);
  };

  /*
    处理删除费用的函数。
    接收费用ID，从费用列表中过滤掉对应的费用。
    使用不可变更新的方式修改状态。
  */
  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <>
      {/* 新增费用表单组件 */}
      <ExpenseForm onSubmit={handleAddExpense} />

      {/* 费用列表组件 */}
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </>
  );
}

export default Form;
