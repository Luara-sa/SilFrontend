import { meStore } from "store/meStore";
import { _AuthService } from "../services/auth.service";

export const useMe = () => {
  const me = meStore((state) => state.me);

  const isLogged = () => (_AuthService.isLoggedIn() && me?.user ? true : false);

  const isThereIsToken = () => _AuthService.isLoggedIn();

  const isLoading = () => {
    if (Boolean(me?.info_system)) return false;
    else return true;
  };

  return {
    me: !isLoading() && isLogged() ? me?.user : null,
    role: !isLoading() && isLogged() ? me?.role : null,
    info_system: !isLoading() ? me?.info_system : null,
    loading: isLoading(),
    isLogged: isLogged(),
    isDelegate: isLogged() && me?.role?.includes("delegate"),
    isStudent: isLogged() && me?.role?.includes("student"),
    isCompany: isLogged() && me?.role?.includes("company"),
    isThereIsToken: isThereIsToken(),
  };
};
