import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text text_type_main-default ${styles.link} ${
              isActive ? '' : 'text_color_inactive'
            }`
          }
        >
          <BurgerIcon type="primary" />
          <span className="ml-2 mr-10">Конструктор</span>
        </NavLink>

        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `text text_type_main-default ${styles.link} ${
              isActive ? '' : 'text_color_inactive'
            }`
          }
        >
          <ListIcon type="primary" />
          <span className="ml-2">Лента заказов</span>
        </NavLink>
      </div>

      <NavLink to="/" className={styles.logo}>
        <Logo className="" />
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `text text_type_main-default ${styles.link} ${
            isActive ? '' : 'text_color_inactive'
          }`
        }
      >
        <ProfileIcon type="primary" />
        <span className="ml-2">{userName ?? 'Личный кабинет'}</span>
      </NavLink>
    </nav>
  </header>
);
