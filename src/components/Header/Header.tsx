import { GrHomeRounded } from "react-icons/gr";
import { RiUser2Fill } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import './Header.css';

interface HeaderProps {
  user: string;
  onClick: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ user, onClick }) => {
  return (
    <header>
      <nav id="navbar">
        <ul className="navbar-items flexbox-col">
          <li className="navbar-logo flexbox-left">
            <a className="navbar-item-inner flexbox" href="#">
              <svg
                fill="#000000"
                width="24"
                height="24"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.015 9.949h-.03c-1.191 0-2.24-.303-2.861.268a1.57 1.57 0 0 0-.527 1.197c0 1.852 1.483 2.08 3.389 2.08h.029c1.905 0 3.389-.229 3.389-2.08 0-.443-.156-.856-.527-1.197-.622-.571-1.671-.268-2.862-.268zM8.393 12.48c-.363 0-.656-.408-.656-.91s.293-.908.656-.908.657.406.657.908c.001.502-.293.91-.657.91zm3.213 0c-.363 0-.657-.408-.657-.91s.294-.908.657-.908c.362 0 .656.406.656.908.001.502-.293.91-.656.91zM10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6 9.6-4.298 9.6-9.6S15.302.4 10 .4zm.876 13.539c-.172 0-.514 0-.876.002-.362-.002-.704-.002-.876-.002-.76 0-3.772-.059-3.772-3.689 0-.834.286-1.445.755-1.955-.074-.184-.078-1.232.32-2.236 0 0 .916.1 2.301 1.051.289-.081.781-.122 1.272-.122s.982.041 1.273.121c1.385-.951 2.301-1.051 2.301-1.051.398 1.004.395 2.053.32 2.236.469.51.755 1.121.755 1.955-.001 3.632-3.013 3.69-3.773 3.69z" />
              </svg>
            </a>
          </li>

          <li className="navbar-item flexbox-left">
            <a className="navbar-item-inner flexbox-left" href="#">
              <div className="navbar-item-inner-icon-wrapper flexbox">
                <GrHomeRounded />
              </div>
              <span className="link-text">Home</span>
            </a>
          </li>
        </ul>

        <div className="navbar-end">
          <div className="navbar-item flexbox-left">
            <div className="navbar-item-inner flexbox-left">
              <div className="navbar-item-inner-icon-wrapper flexbox">
                <RiUser2Fill />
              </div>
              <span className="link-text">{user}</span>
            </div>
          </div>

          <div className="navbar-item flexbox-left" onClick={onClick}>
            <div className="navbar-item-inner flexbox-left" role="button">
              <div className="navbar-item-inner-icon-wrapper flexbox">
                <TbLogout />
              </div>
              <span className="link-text">Sign out</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
