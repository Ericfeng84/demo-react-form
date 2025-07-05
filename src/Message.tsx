import React, { useState } from "react";

function Message(): React.JSX.Element {
  const [count] = useState(1);

  return <h1>message {count}</h1>;
}

export default Message;
