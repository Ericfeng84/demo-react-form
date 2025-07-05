import { useState } from "react";
import { useForm } from "react-hook-form";

interface ExpenseFormData {
  description: string;
  amount: number;
  category: string;
}

function Form() {
  const [expenses, setExpenses] = useState<
    Array<{
      id: number;
      description: string;
      amount: number;
      category: string;
    }>
  >([]);

  const [filterCategory, setFilterCategory] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ExpenseFormData>({
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    const newExpense = {
      id: Date.now(),
      ...data,
    };

    setExpenses([...expenses, newExpense]);
    reset(); // 重置表单
  };

  return (
    <>
      <h1>Expense Tracker</h1>
      <div className="container mt-4">
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
                minLength: {
                  value: 2,
                  message: "描述至少需要2个字符",
                },
                maxLength: {
                  value: 50,
                  message: "描述不能超过50个字符",
                },
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
                min: {
                  value: 0.01,
                  message: "金额必须大于0",
                },
                max: {
                  value: 10000,
                  message: "金额不能超过10000",
                },
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

        {expenses.length > 0 && (
          <div className="mt-4">
            <h3>Expenses</h3>
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
