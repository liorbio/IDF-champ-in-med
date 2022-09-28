import { useAppSelector } from "../../hooks/hooks";

const RequireAuth = ({ children, levels }: { children: JSX.Element, levels: string[] }) => {
    const authorizationLevel = useAppSelector(state => state.auth.authorizationLevel);
    return (
        levels.includes(authorizationLevel) ? children : null
    )
};

export default RequireAuth;