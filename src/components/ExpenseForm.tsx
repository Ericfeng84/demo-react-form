// 新增费用表单组件
// 负责费用数据的输入、验证和提交

import { useForm } from "react-hook-form";

interface ExpenseFormData {
  description: string;
  amount: number;
  category: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}

function ExpenseForm({ onSubmit }: ExpenseFormProps) {
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
    表单提交处理函数。
    当表单验证通过后，调用父组件传入的 onSubmit 函数，
    然后重置表单到初始状态。
  */
  const handleFormSubmit = (data: ExpenseFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <div className="container mt-4">
        {/*
          表单部分：
          - 每个字段都用 register 注册，并声明校验规则。
          - 错误信息通过 errors 对象集中管理。
          - handleSubmit 自动处理校验和数据收集。
        */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
      </div>
    </div>
  );
}

export default ExpenseForm;
