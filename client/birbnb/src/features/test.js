import React from 'react';
import { message, Button } from 'antd';

const TestMessage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Button onClick={() => message.success('¡Mensaje visible!')}>Mostrar mensaje</Button>
    </div>
  );
};

export default TestMessage;