import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { COLORS } from "../../constants/colors";
import { useAppDispatch } from "../../store";
import { clearUserProfile } from "../../store/userProfileSlice";
import { clearToken, isUserAuthenticated } from "../../utils/authUtils";
import { stopTokenRefresh } from "../../utils/tokenRefresh";
import { logoutUser } from "../../pages/LoginPage/loginRequests/loginRequests";

const NAV_LINKS = [
  { path: "/home", label: "Home" },
  { path: "/listings", label: "Listings" },
  { path: "/new-listing", label: "New listing" },
] as const;

const SidebarWrapper = styled.aside`
  box-sizing: border-box;
  width: 12rem;
  height: 100%;
  min-height: 0;
  background: ${COLORS.PRIMARY};
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 0 1rem;
  padding-top: 1rem;
`;

const Title = styled.h1`
  margin: 0 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  line-height: 1.3;
`;

const Nav = styled.nav`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  color: ${({ $active }) => ($active ? COLORS.SECONDARY : "white")};
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    color: ${COLORS.SECONDARY_LIGHT};
    background: ${COLORS.PRIMARY_LIGHT};
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: white;
  font-size: 0.9rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    color: ${COLORS.SECONDARY_LIGHT};
    background: ${COLORS.PRIMARY_LIGHT};
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const showLogout = isUserAuthenticated();

  const handleLogout = async () => {
    await logoutUser();
    stopTokenRefresh();
    clearToken();
    dispatch(clearUserProfile());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <SidebarWrapper>
      <Title>Roommate Search</Title>
      <Nav>
        {NAV_LINKS.map(({ path, label }) => (
          <NavLink key={path} to={path} $active={location.pathname === path}>
            {label}
          </NavLink>
        ))}
      </Nav>
      {showLogout && (
        <SidebarFooter>
          <LogoutButton type="button" onClick={handleLogout}>
            Log out
          </LogoutButton>
        </SidebarFooter>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;
