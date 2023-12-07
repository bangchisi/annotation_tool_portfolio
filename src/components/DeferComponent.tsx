import { PropsWithChildren, useEffect, useState } from 'react';

type UseDeferredComponentProps = {
  delay?: number;
} & PropsWithChildren;

const DeferComponent = ({
  children,
  delay = 350,
}: UseDeferredComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [children, delay]);

  if (!isMounted) {
    return <></>;
  }

  return <>{children}</>;
};

export default DeferComponent;
