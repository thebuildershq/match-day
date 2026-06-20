import { Routes, Route } from 'react-router'
import Landing from './pages/Landing'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'
import Pools from './pages/Pools'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import CreatePool from './pages/CreatePool'
import PoolDetail from './pages/PoolDetail'
import Predict from './pages/Predict'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route
        path="/pools"
        element={
          <ProtectedRoute>
            <Pools />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pools/new'
        element={
          <ProtectedRoute>
            <CreatePool />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/pools/:slug"
        element={
          <ProtectedRoute>
            <PoolDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pools/:slug/predict'
        element={
          <ProtectedRoute>
            <Predict />
          </ProtectedRoute>
        }
      >
      </Route>
    </Routes>
  )
}

export default App