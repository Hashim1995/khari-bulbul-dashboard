import { Card } from 'antd';

function Footer() {
  // const { useToken } = theme;
  // const { token } = useToken();
  return (
    <Card
      className="box text-center box-margin-top "
      // style={{ backgroundColor: token.colorPrimary, color: token.colorWhite }}
    >
      © Library » - 2024 Version 1.0
    </Card>
  );
}

export default Footer;
