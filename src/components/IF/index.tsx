import React from 'react';

interface IFPropsType {
  condition?: boolean;
  children?: React.ReactNode | any;
}

const IF = (props: IFPropsType) => {
  const { condition, children } = props;
  if (!condition) return null;
  return children;
};

export default IF;
