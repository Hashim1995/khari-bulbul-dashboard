import React from 'react';
import { Button, ButtonProps } from 'antd';

interface IAppHandledButton extends ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

function AppHandledButton({
  onClick,
  children,
  ...buttonProps
}: IAppHandledButton) {
  return (
    <Button onClick={onClick} {...buttonProps}>
      {children}
    </Button>
  );
}

export default AppHandledButton;
