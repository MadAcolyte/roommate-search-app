import { Link, useLocation } from "react-router-dom";
import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

const NAV_LINKS = [
  { path: "/home", label: "Home" },
  { path: "/listings", label: "Listings" },
  { path: "/new-listing", label: "New listing" },
] as const;

const SidebarWrapper = styled.aside`
  width: 12rem;
  min-height: 100dvh;
  background: ${COLORS.PRIMARY};
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Title = styled.h1`
  margin: 0 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  line-height: 1.3;
`;

const Nav = styled.nav`
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

const Sidebar = () => {
  const location = useLocation();

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
    </SidebarWrapper>
  );
};

export default Sidebar;
