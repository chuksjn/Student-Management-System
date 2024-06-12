import { AppContainer } from '../layout';
import {
  AddModule,
  AddModuleAssessment,
  AddStudent,
  AddTutorGroup,
  AssessmentReport,
  AttendanceReport,
  DashboardPage,
  EditModule,
  EditModuleAssessmentPage,
  EditStudent,
  EditTutorGroup,
  ErrorPage,
  Marksheet,
  ModuleAssessmentPage,
  ModuleList,
  Monitoring,
  StudentList,
  StudentReport,
  TutorGroupList,
  ViewModule,
  ViewTutorGroup,
} from '../pages';
import { AddDetails } from '../pages/modules/AddDetails';
import { EditDetailsPage } from '../pages/modules/EditDetails';
import { ModuleDeatils } from '../pages/modules/ViewDetails';

export const AppRoutes = [
  {
    path: '/',
    element: <AppContainer />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'students',
        children: [
          {
            index: true,
            element: <StudentList />,
          },
          {
            path: 'add',
            element: <AddStudent />,
          },
          {
            path: 'edit/:id',
            element: <EditStudent />,
          },
        ],
      },
      {
        path: 'modules',
        children: [
          {
            index: true,
            element: <ModuleList />,
          },
          {
            path: ':id/students',
            element: <ViewModule />,
          },
          {
            path: ':id/assessment',
            element: <ModuleAssessmentPage />,
          },
          {
            path: ':id/assessment/add',
            element: <AddModuleAssessment />,
          },
          {
            path: ':id/assessment/edit/:student',
            element: <EditModuleAssessmentPage />,
          },
          {
            path: ':id/details',
            element: <ModuleDeatils />,
          },
          {
            path: ':id/details/add',
            element: <AddDetails />,
          },
          {
            path: ':id/details/edit/:student',
            element: <EditDetailsPage />,
          },
          {
            path: 'add',
            element: <AddModule />,
          },
          {
            path: ':id/students/edit',
            element: <EditModule />,
          },
        ],
      },
      {
        path: 'tutor-groups',
        children: [
          {
            index: true,
            element: <TutorGroupList />,
          },
          {
            path: 'add',
            element: <AddTutorGroup />,
          },
          {
            path: ':id/students',
            element: <ViewTutorGroup />,
          },

          {
            path: ':id/students/edit',
            element: <EditTutorGroup />,
          },
        ],
      },

      {
        path: 'reports',
        children: [
          {
            path: 'assessment',
            element: <AssessmentReport />,
          },
          {
            path: 'attendance',
            element: <AttendanceReport />,
          },
          {
            path: 'student',
            element: <StudentReport />,
          },
          {
            path: 'marksheet',
            element: <Marksheet />,
          },
        ],
      },

      {
        path: 'monitoring',
        element: <Monitoring />,
      },
    ],
  },
];
