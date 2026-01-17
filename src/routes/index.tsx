import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth';
import { HomePage } from '../features/home';
import { VennEditorPage } from '../features/venn-editor';
import { ElementsPage } from '../features/elements';
import { SegmentsPage } from '../features/segments';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/editor',
    element: (
      <ProtectedRoute>
        <VennEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/editor/:diagramId',
    element: (
      <ProtectedRoute>
        <VennEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/elements',
    element: (
      <ProtectedRoute>
        <ElementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/segments',
    element: (
      <ProtectedRoute>
        <SegmentsPage />
      </ProtectedRoute>
    ),
  },
]);
