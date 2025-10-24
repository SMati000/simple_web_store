import { useSelector } from "react-redux";
import { useMemo } from 'react';

export const useHasAccess = (allowedRoles: string[]) => {
  const pcRoles: string[] = useSelector((state: any) => state.user?.pcRoles ?? []);

  return useMemo(
    () => pcRoles.some((role) => allowedRoles.includes(role)),
    [pcRoles, allowedRoles]
  );
};
