import { Outlet, NavLink } from 'react-router-dom';

export const AppContainer = () => {
  return (
    <div className='w-full h-full flex flex-col'>
      <nav className='w-full flex px-6 py-4 bg-black text-white'>
        <ul className='w-full flex items-center justify-evenly text-sm font-medium'>
          <li>
            <NavLink to='/' end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to='/students'>Students</NavLink>
          </li>
          <li>
            <NavLink to='/modules'>Modules</NavLink>
          </li>
          <li>
            <NavLink to='/tutor-groups'>Tutor Groups</NavLink>
          </li>

          <li>
            <NavLink to='/reports/assessment'>Assessment Reports</NavLink>
          </li>
          <li>
            <NavLink to='/reports/attendance'>Attendance Reports</NavLink>
          </li>
          <li>
            <NavLink to='/reports/student'>Student Reports</NavLink>
          </li>

          <li>
            <NavLink to='/monitoring'>Monitoring</NavLink>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
