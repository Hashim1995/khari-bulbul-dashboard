import { Breadcrumb } from 'antd';
import { NavLink } from 'react-router-dom';

interface IParamItem {
  link: string;
  name: string;
}

interface IProps {
  param: IParamItem[];
  color: string;
  activeColor: string;
}

function AppHandlerBreadCrumb({
  param,
  color,
  activeColor,
  ...breadCrumbProps
}: IProps) {
  const data = param?.map(item => ({
    title: (
      <NavLink
        to={item?.link}
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : '',
          color: isActive ? activeColor : color
        })}
      >
        {item?.name}
      </NavLink>
    )
  }));

  return <Breadcrumb items={data} {...breadCrumbProps} />;
}

export default AppHandlerBreadCrumb;
